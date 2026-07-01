import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  treeDataAtom,
  TreeNode,
  activeNodeIdAtom,
  selectedFileAtom,
  SelectedFile
} from '@renderer/store/tree/tree-atom'
import { Folder } from './folder'
import { File } from './file'
import { CreateMenu } from './create-menu'
import { RootPlaceholderInput } from './root-placeholder-input'
import { AnimatePresence } from 'framer-motion'

export const TreeRoot: React.FC = () => {
  const [treeData, setTreeData] = useAtom(treeDataAtom)
  const [activeNodeId, setActiveNodeId] = useAtom(activeNodeIdAtom)
  const [, setSelectedFile] = useAtom(selectedFileAtom)
  const [rootAddingType, setRootAddingType] = useState<'file' | 'folder' | null>(null)

  useEffect(() => {
    const initializeTree = async (): Promise<void> => {
      try {
        const data = await window.api.readDirectoryStructure()
        setTreeData(data as TreeNode[])
      } catch (error) {
        console.error('Error initializing tree data:', error)
      }
    }

    initializeTree()
  }, [setTreeData])

  // Add listener for menu bar new note creation
  useEffect(() => {
    const handleCreateNoteFromMenu = async (): Promise<void> => {
      setRootAddingType('file')
      await handleCreateCommit()
    }

    const cleanup = window.api.onCreateNoteFromMenu(handleCreateNoteFromMenu)
    return cleanup
  }, [])

  // Find the active folder node
  const findActiveFolder = (nodes: TreeNode[]): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === activeNodeId && node.type === 'folder') {
        return node
      }
      if (node.type === 'folder' && node.files) {
        const found = findActiveFolder(node.files)
        if (found) return found
      }
    }
    return null
  }

  // Find the parent folder of an active file
  const findParentFolder = (nodes: TreeNode[], targetId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.type === 'folder' && node.files) {
        if (node.files.some((file) => file.id === targetId)) {
          return node
        }
        const found = findParentFolder(node.files, targetId)
        if (found) return found
      }
    }
    return null
  }

  // Get the target directory for new items
  const getTargetDirectory = async (): Promise<string> => {
    if (!activeNodeId) {
      // If nothing is active, use root directory
      return (await window.api.getRootDir()) as string
    }

    const activeFolder = findActiveFolder(treeData)
    if (activeFolder && activeFolder.path) {
      // If a folder is active, use that folder
      return activeFolder.path
    }

    const parentFolder = findParentFolder(treeData, activeNodeId)
    if (parentFolder && parentFolder.path) {
      // If a file is active, use its parent folder
      return parentFolder.path
    }

    // Default to root directory
    return (await window.api.getRootDir()) as string
  }

  const handleCreate = async (type: 'file' | 'folder'): Promise<void> => {
    setRootAddingType(type)
  }

  const handleCreateCommit = async (name?: string): Promise<void> => {
    try {
      const targetDir = await getTargetDirectory()
      console.log('🔍 Create commit details:', {
        targetDir,
        rootAddingType,
        name
      })

      if (rootAddingType === 'folder') {
        const folderName = name || `New Folder ${new Date().toISOString().split('T')[0]}`
        const folderPath = (await window.api.joinPaths(targetDir, folderName)) as string

        console.log('📁 Creating folder:', {
          path: folderPath,
          targetDir,
          name: folderName
        })

        try {
          console.log('📁 Calling createFolder API with path:', folderPath)
          const success = await window.api.createFolder(folderPath)
          console.log(success ? '✅ Folder created successfully!' : '❌ Folder creation failed')

          if (success) {
            // Wait a moment to ensure the filesystem has updated
            await new Promise((resolve) => setTimeout(resolve, 100))

            // Refresh the tree data to ensure it's in sync with the filesystem
            console.log('🔄 Refreshing tree data...')
            const newTreeData = await window.api.readDirectoryStructure()
            console.log('🔄 Updated tree data:', newTreeData)
            setTreeData(newTreeData as TreeNode[])

            // Find the newly created folder's node ID
            const findNewFolderNodeId = (nodes: TreeNode[]): string | null => {
              for (const node of nodes) {
                if (node.path === folderPath) {
                  return node.id
                }
                if (node.type === 'folder' && node.files) {
                  const foundId = findNewFolderNodeId(node.files)
                  if (foundId) return foundId
                }
              }
              return null
            }
            const newFolderNodeId = findNewFolderNodeId(newTreeData as TreeNode[])
            if (newFolderNodeId) {
              setActiveNodeId(newFolderNodeId)
            }
          } else {
            console.error('❌ Folder creation failed: API returned false')
          }
        } catch (error) {
          console.error('❌ Error during folder creation:', error)
          throw error
        }
      } else {
        // Handle file creation
        const getNextFileNumber = (nodes: TreeNode[]): number => {
          let maxNumber = 0
          const findMaxNumber = (items: TreeNode[]): void => {
            for (const item of items) {
              if (item.type === 'file') {
                const match = item.name.match(/^note-(\d+)/)
                if (match) {
                  const num = parseInt(match[1], 10)
                  maxNumber = Math.max(maxNumber, num)
                }
              }
              if (item.type === 'folder' && item.files) {
                findMaxNumber(item.files)
              }
            }
          }
          findMaxNumber(nodes)
          return maxNumber + 1
        }

        const nextNumber = getNextFileNumber(treeData)
        const defaultFileName = `note-${nextNumber}`
        const fileName = name || defaultFileName
        const filePath = (await window.api.joinPaths(targetDir, `${fileName}.md`)) as string

        console.log('📄 Creating file:', {
          path: filePath,
          targetDir,
          name: fileName
        })

        try {
          console.log('📄 Calling createNote API with path:', filePath)
          const success = await window.api.createNote(filePath)
          console.log(success ? '✅ File created successfully!' : '❌ File creation failed')

          if (success) {
            // Create an empty file with initial content
            await window.api.writeNote(filePath.replace(/\.md$/, ''), '')

            // Wait a moment to ensure the filesystem has updated
            await new Promise((resolve) => setTimeout(resolve, 100))

            // Update only the specific folder's contents
            const updateFolderContents = (nodes: TreeNode[]): TreeNode[] => {
              // Handle files within folders
              return nodes.map((node) => {
                if (node.type === 'folder' && node.path === targetDir) {
                  // Check if file already exists in this folder
                  const fileExists = node.files?.some((file) => file.path === filePath)
                  if (fileExists) {
                    return node
                  }

                  // Generate a unique ID using timestamp and random string
                  const uniqueId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

                  // Read the contents of this specific folder
                  return {
                    ...node,
                    files: node.files
                      ? [
                          ...node.files,
                          {
                            id: uniqueId,
                            name: `${fileName}.md`,
                            type: 'file',
                            path: filePath
                          }
                        ]
                      : [
                          {
                            id: uniqueId,
                            name: `${fileName}.md`,
                            type: 'file',
                            path: filePath
                          }
                        ]
                  }
                }
                if (node.type === 'folder' && node.files) {
                  return {
                    ...node,
                    files: updateFolderContents(node.files)
                  }
                }
                return node
              })
            }

            // Update the tree data with the new file
            const updateTreeData = async (): Promise<void> => {
              const rootDir = await window.api.getRootDir()
              const currentData = treeData

              // If targetDir is the root directory, handle root-level file creation
              if (targetDir === rootDir) {
                // Check if file already exists at root
                const fileExists = currentData.some((node) => node.path === filePath)
                if (!fileExists) {
                  // Generate a unique ID using timestamp and random string
                  const uniqueId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

                  // Add the new file to the root level
                  const updatedData: TreeNode[] = [
                    ...currentData,
                    {
                      id: uniqueId,
                      name: `${fileName}.md`,
                      type: 'file' as const,
                      path: filePath
                    }
                  ]

                  // Verify the file was added only once
                  const fileCount = updatedData.reduce((count, node) => {
                    if (node.type === 'folder' && 'files' in node && node.files) {
                      return count + node.files.filter((file) => file.path === filePath).length
                    }
                    return count
                  }, 0)

                  if (fileCount <= 1) {
                    setTreeData(updatedData)
                    // Set the new file as active
                    setActiveNodeId(uniqueId)
                    // Set the new file as selected
                    const selectedFile: SelectedFile = {
                      title: filePath.replace(/\.md$/, ''),
                      lastEditTime: Date.now(),
                      content: ''
                    }
                    setSelectedFile(selectedFile)
                  } else {
                    console.error('❌ Multiple files detected, reverting to original data')
                    setTreeData(currentData)
                  }
                }
              } else {
                // Handle files within folders
                const updatedData = updateFolderContents(currentData)

                // Verify the file was added only once
                const fileCount = updatedData.reduce((count, node) => {
                  if (node.type === 'folder' && 'files' in node && node.files) {
                    return count + node.files.filter((file) => file.path === filePath).length
                  }
                  return count
                }, 0)

                if (fileCount <= 1) {
                  setTreeData(updatedData)
                  // Find the newly created file's node ID
                  const findNewFileNodeId = (nodes: TreeNode[]): string | null => {
                    for (const node of nodes) {
                      if (node.path === filePath) {
                        return node.id
                      }
                      if (node.type === 'folder' && 'files' in node && node.files) {
                        const foundId = findNewFileNodeId(node.files)
                        if (foundId) return foundId
                      }
                    }
                    return null
                  }
                  const newFileNodeId = findNewFileNodeId(updatedData)
                  if (newFileNodeId) {
                    setActiveNodeId(newFileNodeId)
                    // Set the new file as selected
                    const selectedFile: SelectedFile = {
                      title: filePath.replace(/\.md$/, ''),
                      lastEditTime: Date.now(),
                      content: ''
                    }
                    setSelectedFile(selectedFile)
                  }
                } else {
                  console.error('❌ Multiple files detected, reverting to original data')
                  setTreeData(currentData)
                }
              }
            }

            // Call the update function
            updateTreeData()
          } else {
            console.error('❌ File creation failed: API returned false')
          }
        } catch (error) {
          console.error('❌ Error during file creation:', error)
          throw error
        }
      }
    } catch (error) {
      console.error('❌ Error in handleCreateCommit:', error)
    } finally {
      setRootAddingType(null)
    }
  }

  return (
    <div className="p-4 rounded max-w-lg mx-auto cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <CreateMenu
          onCreateFile={() => handleCreate('file')}
          onCreateFolder={() => handleCreate('folder')}
        />
      </div>

      <AnimatePresence mode="wait">
        {rootAddingType && (
          <RootPlaceholderInput
            type={rootAddingType}
            onCommit={handleCreateCommit}
            onCancel={() => setRootAddingType(null)}
          />
        )}
      </AnimatePresence>

      {treeData.length === 0 ? (
        <p className="text-gray-500">No files or folders</p>
      ) : (
        treeData.map((node: TreeNode) =>
          node.type === 'file' ? (
            <File
              key={node.id}
              id={node.id}
              name={node.name}
              node={node as TreeNode & { path: string }}
            />
          ) : (
            <Folder
              key={node.id}
              id={node.id}
              name={node.name}
              node={node}
              path={node.path || node.name}
            />
          )
        )
      )}
    </div>
  )
}
