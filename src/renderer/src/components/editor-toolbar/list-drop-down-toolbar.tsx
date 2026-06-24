import { Editor } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'
import { List, ListOrdered } from 'lucide-react'
import React from 'react'
import ToolbarButton from '../Button/toolbar-button'

interface ListDropDownToolbarProps {
  editor: Editor
  showListMenu: boolean
  setShowListMenu: React.Dispatch<React.SetStateAction<boolean>>
  listMenuRef: React.RefObject<HTMLDivElement | null>
}

const ListDropDownToolbar = ({
  editor,
  showListMenu,
  setShowListMenu,
  listMenuRef
}: ListDropDownToolbarProps): React.JSX.Element => {
  return (
    <div className="relative border-r border-gray-700 pr-1" ref={listMenuRef}>
      <ToolbarButton
        onClick={() => setShowListMenu(!showListMenu)}
        className={`flex items-center gap-1 ${
          editor.isActive('bulletList') || editor.isActive('orderedList')
            ? 'bg-gray-700 text-white'
            : ''
        }`}
        title="Lists"
      >
        <List size={14} />
        <ChevronDown size={14} />
      </ToolbarButton>
      {showListMenu && (
        <div className="absolute top-full left-0 mt-1 bg-[#374151] rounded-md shadow-lg p-1 ">
          <ToolbarButton
            onClick={() => {
              editor.chain().focus().toggleBulletList().run()
              setShowListMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-1 mb-0.5 ${
              editor.isActive('bulletList') ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <List size={14} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run()
              setShowListMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-1 mb-0.5 ${
              editor.isActive('orderedList') ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <ListOrdered size={14} />
          </ToolbarButton>
        </div>
      )}
    </div>
  )
}

export default ListDropDownToolbar
