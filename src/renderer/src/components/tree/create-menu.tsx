import React from 'react'
import { motion } from 'framer-motion'
import { RiFileEditFill } from 'react-icons/ri'
import { HiFolderPlus } from 'react-icons/hi2'

interface CreateMenuProps {
  onCreateFile: () => void
  onCreateFolder: () => void
}

export const CreateMenu: React.FC<CreateMenuProps> = ({ onCreateFile, onCreateFolder }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center w-full gap-1 cursor-pointer bg-zinc-200/40 rounded-md p-1 "
        onClick={onCreateFile}
      >
        <RiFileEditFill className=" cursor-pointer text-[16px]" title="New File" />
        <p className="text-[12px] font-semibolds">New File</p>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center w-full gap-1 cursor-pointer bg-zinc-200/40 rounded-md p-1 "
        onClick={onCreateFolder}
      >
        <HiFolderPlus className="cursor-pointer text-[16px]" title="New Folder" />
        <p className="text-[12px] font-semibold">New Folder</p>
      </motion.div>
    </div>
  )
}
