/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react'
import FILE_ICONS from './file-icons'
import { FaFile } from 'react-icons/fa6'

interface PlaceholderInputProps {
  type: 'file' | 'folder'
  name?: string
  onSubmit: (name: string) => void
  onCancel: () => void
  defaultValue?: string
  style?: React.CSSProperties
}

interface DirectoryNode {
  name: string
  type: 'file' | 'folder'
  files?: DirectoryNode[]
}

export const PlaceholderInput: React.FC<PlaceholderInputProps> = ({
  type,
  onSubmit,
  onCancel,
  defaultValue = '',
  style
}) => {
  const [name, setName] = useState(defaultValue)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    const checkDuplicate = async (): Promise<void> => {
      if (!name.trim()) {
        setIsDuplicate(false)
        return
      }

      try {
        const treeData = await window.api.readDirectoryStructure()
        const checkNode = (nodes: DirectoryNode[]): boolean => {
          for (const node of nodes) {
            // For files, check if the name matches without extension
            if (type === 'file') {
              const nodeNameWithoutExt = node.name.replace(/\.md$/, '')
              const inputNameWithoutExt = name.trim().replace(/\.md$/, '')
              if (nodeNameWithoutExt === inputNameWithoutExt && node.type === type) {
                return true
              }
            } else {
              // For folders, check exact name match
              if (node.name === name.trim() && node.type === type) {
                return true
              }
            }
            if (node.files && checkNode(node.files)) {
              return true
            }
          }
          return false
        }
        setIsDuplicate(checkNode(treeData))
      } catch (error) {
        console.error('Error checking duplicate:', error)
      }
    }
    checkDuplicate()
  }, [name, type])

  const handleSubmit = (): void => {
    if (name.trim() && !isDuplicate) {
      // For files, ensure .md extension
      const finalName =
        type === 'file'
          ? name.trim().endsWith('.md')
            ? name.trim()
            : `${name.trim()}`
          : name.trim()
      onSubmit(finalName)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    e.stopPropagation()
    if (e.key === 'Enter' && !isDuplicate) {
      e.preventDefault()
      handleSubmit()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setName(value)
  }

  const ExtensionIcon =
    type === 'file'
      ? FILE_ICONS[name.toLowerCase()] || (
          <FaFile className="text-[#ff5e5b]/70 group-hover:text-[#ff5e5b] transition-all duration-300 text-[14px] " />
        )
      : null

  if (type === 'file') {
    return (
      <div className="flex items-center pl-1  w-full bg-gray-500/50 rounded mb-1.5" style={style}>
        {ExtensionIcon}
        <input
          ref={inputRef}
          value={name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter file name"
          className={`ml-0.5 flex-1 outline-none  p-1  border-none cursor-auto text-[12px] font-bold ${
            isDuplicate ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
          }`}
        />
      </div>
    )
  }

  // Folder input
  return (
    <div
      className="flex items-center p-1 font-bold w-full bg-gray-500/50 rounded mb-1.5"
      style={style}
    >
      <input
        ref={inputRef}
        value={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter folder name"
        className={`ml-0.5 flex-1 outline-none bg-transparent border-none cursor-auto text-[12px] font-bold ${
          isDuplicate ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
        }`}
      />
    </div>
  )
}
