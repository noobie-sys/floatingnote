import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface RootPlaceholderInputProps {
  type: 'file' | 'folder'
  onCommit: (name?: string) => void
  onCancel: () => void
}

export const RootPlaceholderInput: React.FC<RootPlaceholderInputProps> = ({
  type,
  onCommit,
  onCancel
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (type === 'file') {
      // For files, automatically commit with default name
      onCommit()
    } else if (inputRef.current) {
      // For folders, focus the input
      inputRef.current.focus()
    }
  }, [type, onCommit])

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputRef.current) {
      const name = inputRef.current.value.trim()
      if (name) {
        onCommit(name)
      }
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  // Only show input for folders
  if (type === 'file') {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-1.5 p-1.5 mb-0.5"
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="New folder name"
        onKeyUp={handleKeyUp}
        onBlur={onCancel}
        className="flex-1 outline-none bg-gray-500/50 border text-sm border-gray-300 focus:border-blue-500/50 rounded p-1 ml-0.5 border-none cursor-auto text-[12px] font-bold"
      />
    </motion.div>
  )
}
