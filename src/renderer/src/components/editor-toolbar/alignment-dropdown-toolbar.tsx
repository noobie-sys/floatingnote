import { Editor } from '@tiptap/react'
import { AlignJustify, AlignLeft, AlignCenter, AlignRight, ChevronDown } from 'lucide-react'
import React from 'react'

interface AlignmentDropDownMenuProps {
  editor: Editor
  showAlignmentMenu: boolean
  setShowAlignmentMenu: React.Dispatch<React.SetStateAction<boolean>>
  alignmentMenuRef: React.RefObject<HTMLDivElement | null>
}

const AlignmentDropDownMenu = ({
  editor,
  showAlignmentMenu,
  setShowAlignmentMenu,
  alignmentMenuRef
}: AlignmentDropDownMenuProps): React.JSX.Element => {
  return (
    <div className="relative border-r border-gray-700 pr-1 cursor-pointer" ref={alignmentMenuRef}>
      <button
        onClick={() => setShowAlignmentMenu(!showAlignmentMenu)}
        className={`p-1.5 rounded hover:bg-gray-700 text-gray-300 flex items-center gap-0.5 ${
          editor.isActive({ textAlign: 'left' }) ||
          editor.isActive({ textAlign: 'center' }) ||
          editor.isActive({ textAlign: 'right' }) ||
          editor.isActive({ textAlign: 'justify' })
            ? 'bg-gray-700 text-white'
            : ''
        }`}
        title="Alignment"
      >
        <AlignLeft size={14} />
        <ChevronDown size={14} />
      </button>
      {showAlignmentMenu && (
        <div className="absolute top-full left-0 mt-1 bg-[#374151] rounded-md shadow-lg p-1 pb-0.5">
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('left').run()
              setShowAlignmentMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <AlignLeft size={14} />
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('center').run()
              setShowAlignmentMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <AlignCenter size={14} />
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('right').run()
              setShowAlignmentMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <AlignRight size={14} />
          </button>
          <button
            onClick={() => {
              editor.chain().focus().setTextAlign('justify').run()
              setShowAlignmentMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <AlignJustify size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default AlignmentDropDownMenu
