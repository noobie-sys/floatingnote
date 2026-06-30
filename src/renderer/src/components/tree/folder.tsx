import React, { useState, useEffect } from 'react'
import { FaFolderOpen } from 'react-icons/fa'
import { IoMdFolder } from 'react-icons/io'
import { HiPencil } from 'react-icons/hi2'
import { useAtom } from 'jotai'
import { treeDataAtom, TreeNode, activeNodeIdAtom } from '@renderer/store/tree/tree-atom'
import { File } from './file'
import { IoMdTrash } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'

interface FolderProps {
  id: string
  name: string
  node: TreeNode
  path: string
}

export const Folder: React.FC<FolderProps> = ({ id, name, node, path }) => {
  const [, setTreeData] = useAtom(treeDataAtom)
  const [activeNodeId, setActiveNodeId] = useAtom(activeNodeIdAtom)
  const [isOpen, setOpen] = useState(true)
  const [isEditing, setEditing] = useState(false)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    // Enable animations after initial render
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Update folder name
  const updateTreeFolderName = async (newName: string): Promise<void> => {
    try {
      // Get the parent directory path
      const parentPath = path.substring(0, path.lastIndexOf('/'))
      // Create the new path by joining parent path with new name
      const newPath = parentPath ? `${parentPath}/${newName}` : newName

      console.log('Renaming folder:', {
        oldPath: path,
        newPath,
        parentPath,
        newName
      })

      const success = await window.api.renameFolder(path, newPath)
      if (success) {
        // Refresh the tree data to ensure it's in sync with the filesystem
        const newTreeData = await window.api.readDirectoryStructure()
        setTreeData(newTreeData as TreeNode[])
      }
    } catch (error) {
      console.error('Error renaming folder:', error)
    }
    setEditing(false)
  }

  // Delete folder
  const deleteTreeFolder = async (): Promise<void> => {
    try {
      const success = await window.api.deleteFolder(path)
      if (success) {
        setTreeData((data) =>
          data
            .filter((item) => item.id !== id)
            .map((item) =>
              item.type === 'folder' && item.files
                ? { ...item, files: item.files.filter((file) => file.id !== id) }
                : item
            )
        )
      }
    } catch (error) {
      console.error('Error deleting folder:', error)
    }
  }

  return (
    <div className="relative">
      <motion.div
        className={`group flex items-center justify-between px-2 py-1 rounded-md cursor-pointer ${
          activeNodeId === id ? 'bg-white/10' : 'hover:bg-white/5'
        }`}
        onClick={() => {
          setOpen(!isOpen)
          setActiveNodeId(id)
        }}
      >
        <div className="flex items-center space-x-2">
          {isOpen ? (
            <FaFolderOpen className="text-yellow-500" />
          ) : (
            <IoMdFolder className="text-yellow-500" />
          )}
          {isEditing ? (
            <input
              defaultValue={name}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  const newName = e.currentTarget.value.trim()
                  if (newName && newName !== name) {
                    updateTreeFolderName(newName)
                  } else {
                    setEditing(false)
                  }
                }
                if (e.key === 'Escape') {
                  setEditing(false)
                }
              }}
              onBlur={(e) => {
                const newName = e.currentTarget.value.trim()
                if (newName && newName !== name) {
                  updateTreeFolderName(newName)
                } else {
                  setEditing(false)
                }
              }}
              className="flex-1 outline-none bg-gray-500/50 border text-sm border-gray-300 focus:border-blue-500/50 rounded p-1 ml-0.5 border-none cursor-auto text-[12px] font-bold"
              placeholder="Folder name"
              autoFocus
            />
          ) : (
            <span className="text-sm">{name}</span>
          )}
        </div>

        {!isEditing && (
          <div className="space-x-1.5 px-2 text-gray-400 hidden group-hover:flex transition-all duration-300">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <HiPencil
                className="hover:text-blue-500 cursor-pointer text-[14px]"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing(true)
                }}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IoMdTrash
                className="hover:text-[#ff5e5b] cursor-pointer text-[16px]"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteTreeFolder()
                }}
              />
            </motion.div>
          </div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isOpen && node.files && (
          <motion.div
            initial={shouldAnimate ? { height: 0, opacity: 0 } : false}
            animate={
              shouldAnimate
                ? {
                    height: 'auto',
                    opacity: 1
                  }
                : {}
            }
            exit={
              shouldAnimate
                ? {
                    height: 0,
                    opacity: 0
                  }
                : {}
            }
            transition={{
              height: { duration: 0.2, ease: 'easeInOut' },
              opacity: { duration: 0.15 }
            }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-3">
              {node.files.map((child) =>
                child.type === 'file' ? (
                  <File
                    key={child.id}
                    id={child.id}
                    name={child.name}
                    node={child as TreeNode & { path: string }}
                  />
                ) : (
                  <Folder
                    key={child.id}
                    id={child.id}
                    name={child.name}
                    node={child}
                    path={child.path || `${path}/${child.name}`}
                  />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
