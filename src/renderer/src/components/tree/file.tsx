import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useAtom } from 'jotai'
import {
  treeDataAtom,
  TreeNode,
  selectedFileAtom,
  SelectedFile,
  activeNodeIdAtom,
  saveLastOpenedFile,
  loadLastOpenedFile
} from '@renderer/store/tree/tree-atom'
import { FaFile } from 'react-icons/fa6'
import { HiPencil } from 'react-icons/hi2'
import { IoMdTrash } from 'react-icons/io'

interface FileProps {
  id: string
  name: string
  node: TreeNode & { path: string }
}

export const File: React.FC<FileProps> = ({ id, name, node }) => {
  const [treeData, setTreeData] = useAtom(treeDataAtom)
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom)
  const [activeNodeId, setActiveNodeId] = useAtom(activeNodeIdAtom)
  const [isEditing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = async (): Promise<void> => {
    try {
      // Get the filename without extension and path
      const filename = node.path.replace(/\.md$/, '')
      // Use the full path to read the file
      const content = (await window.api.readNote(filename)) as string

      // Create a SelectedFile object
      const selectedFile: SelectedFile = {
        title: filename,
        lastEditTime: Date.now(),
        content
      }

      setSelectedFile(selectedFile)
      setActiveNodeId(id)
      // Save the last opened file path
      saveLastOpenedFile(node.path)
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  const updateTreeFileName = useCallback(
    (nodes: TreeNode[], filePath: string, newName: string): TreeNode[] => {
      return nodes.map((item) => {
        if (item.path === filePath) {
          return { ...item, name: newName }
        } else if (item.type === 'folder' && item.files) {
          return { ...item, files: updateTreeFileName(item.files, filePath, newName) }
        }
        return item
      })
    },
    []
  )

  const deleteTreeFile = (nodes: TreeNode[], filePath: string): TreeNode[] => {
    return nodes
      .filter((item) => item.path !== filePath)
      .map((item) =>
        item.type === 'folder' && item.files
          ? { ...item, files: deleteTreeFile(item.files, filePath) }
          : item
      )
  }

  const commitFileEdit = useCallback(
    async (newName: string): Promise<void> => {
      try {
        if (!newName.trim()) {
          setEditing(false)
          return
        }

        // Ensure the new name has .md extension
        const finalName = newName.endsWith('.md') ? newName : `${newName}.md`
        // Compute the new path
        const newPath = node.path.replace(/[^/]+$/, finalName)
        // Call the backend API to rename the file
        const success = await window.api.renameFile(node.path, newPath)

        if (success) {
          // Update the UI only if the backend operation was successful
          setTreeData((data) => {
            const updatedData = updateTreeFileName(data, node.path, finalName)
            // Update the path in the tree data
            return updatedData.map((item) => {
              if (item.path === node.path) {
                return { ...item, name: finalName }
              } else if (item.type === 'folder' && item.files) {
                return {
                  ...item,
                  files: item.files.map((file) =>
                    file.path === node.path ? { ...file, name: finalName } : file
                  )
                }
              }
              return item
            })
          })
        }
      } catch (error) {
        console.error('Error renaming file:', error)
      }
      setEditing(false)
    },
    [node.path, setTreeData, updateTreeFileName]
  )

  const commitFileDelete = async (): Promise<void> => {
    try {
      const success = await window.api.deleteNote(node.path)
      if (success) {
        // Check if the deleted file is the currently open file
        const isCurrentFile = selectedFile?.title === node.path.replace(/\.md$/, '')

        // Update the tree data
        setTreeData((data) => deleteTreeFile(data, node.path))

        if (isCurrentFile) {
          // Clear the current file selection
          setSelectedFile(null)
          setActiveNodeId(null)

          // Try to load the last opened file
          const lastFilePath = loadLastOpenedFile()
          if (lastFilePath && lastFilePath !== node.path) {
            try {
              const content = await window.api.readNote(lastFilePath.replace(/\.md$/, ''))
              if (content) {
                const newSelectedFile: SelectedFile = {
                  title: lastFilePath.replace(/\.md$/, ''),
                  lastEditTime: Date.now(),
                  content: content as string
                }
                setSelectedFile(newSelectedFile)
                // Find the node ID for the last opened file
                const findNodeId = (nodes: TreeNode[]): string | null => {
                  for (const node of nodes) {
                    if (node.path === lastFilePath) {
                      return node.id
                    }
                    if (node.type === 'folder' && node.files) {
                      const foundId = findNodeId(node.files)
                      if (foundId) return foundId
                    }
                  }
                  return null
                }
                const lastFileNodeId = findNodeId(treeData)
                if (lastFileNodeId) {
                  setActiveNodeId(lastFileNodeId)
                }
              }
            } catch (error) {
              console.error('Error loading last opened file:', error)
              // If there's an error loading the last file, show empty state
              setSelectedFile(null)
              setActiveNodeId(null)
            }
          } else {
            // If no last file or it's the same as the deleted file, show empty state
            setSelectedFile(null)
            setActiveNodeId(null)
          }
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const onKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter' && inputRef.current) {
        commitFileEdit(inputRef.current.value.trim())
      }
      if (e.key === 'Escape') {
        setEditing(false)
      }
    },
    [commitFileEdit, setEditing]
  )

  console.log(node, 'node')
  console.log(id, 'id')
  console.log(name, 'name')
  console.log(isEditing, 'isEditing')
  console.log(inputRef.current, 'inputRef')
  console.log(setTreeData, 'setTreeData')
  console.log(setEditing, 'setEditing')
  console.log(treeDataAtom, 'treeDataAtom')
  console.log(treeData, 'treeData')
  return (
    <div
      className={`flex items-center space-x-1.5 p-1.5 hover:bg-gray-500/60 rounded cursor-pointer group transition-all duration-300 mb-0.5 ${
        activeNodeId === id ? 'bg-gray-500/60' : ''
      }`}
      onClick={(e): void => {
        e.stopPropagation()
        handleFileClick()
      }}
    >
      <FaFile
        className={`text-[#ff5e5b]/70 group-hover:text-[#ff5e5b] transition-all duration-300 text-[14px] ${
          activeNodeId === id ? 'text-[#ff5e5b]' : ''
        }`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          defaultValue={name.replace(/\.md$/, '')}
          onKeyUp={onKeyUp}
          onBlur={() => setEditing(false)}
          className="flex-1 outline-none bg-gray-500/50 border text-sm border-gray-300 focus:border-blue-500/50 rounded p-1 ml-0.5 border-none cursor-auto text-[12px] font-bold"
          placeholder="File name"
        />
      ) : (
        <span
          className={`flex-1 font-sans text-[13px] font-bold group-hover:text-[#ff5e5b] transition-all duration-300 ${
            activeNodeId === id ? 'text-[#ff5e5b]' : ''
          }`}
        >
          {name.replace(/\.md$/, '')}
        </span>
      )}

      {!isEditing && (
        <div className="space-x-1 px-2 text-gray-400 hidden group-hover:flex transition-all duration-300">
          <HiPencil
            className="hover:text-blue-500 cursor-pointer text-[16px]"
            onClick={(e) => {
              e.stopPropagation()
              setEditing(true)
            }}
          />
          <IoMdTrash
            className="hover:text-[#ff5e5b] cursor-pointer text-[16px]"
            onClick={(e) => {
              e.stopPropagation()
              commitFileDelete()
            }}
          />
        </div>
      )}
    </div>
  )
}
