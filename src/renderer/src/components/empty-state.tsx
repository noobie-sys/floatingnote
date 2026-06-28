import React from 'react'
import { FaFile } from 'react-icons/fa6'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <FaFile className="text-6xl mb-4" />
      <h2 className="text-xl font-semibold mb-2">No File Open</h2>
      <p className="text-sm text-center max-w-md">
        Open an existing file from the sidebar or create a new one to get started.
      </p>
    </div>
  )
}
