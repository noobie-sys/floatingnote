import ToolbarButton from '../Button/toolbar-button'
import { Heading1Icon, Heading2Icon, Heading3Icon, ChevronDown, Heading } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface HeadingDropDownToolbarProps {
  editor: Editor
  showHeadingMenu: boolean
  setShowHeadingMenu: React.Dispatch<React.SetStateAction<boolean>>
  headingMenuRef: React.RefObject<HTMLDivElement | null>
}

const HeadingDropDownToolbar = ({
  editor,
  showHeadingMenu,
  setShowHeadingMenu,
  headingMenuRef
}: HeadingDropDownToolbarProps): React.JSX.Element => {
  return (
    <div className="relative border-r border-gray-700 pr-1" ref={headingMenuRef}>
      <ToolbarButton
        onClick={() => setShowHeadingMenu(!showHeadingMenu)}
        className={`flex items-center justify-center gap-0.5 ${
          editor.isActive('heading') ? 'bg-gray-700 text-white' : ''
        }`}
        title="Headings"
      >
        <Heading size={12} />
        <ChevronDown size={12} />
      </ToolbarButton>
      {showHeadingMenu && (
        <div className="absolute top-full left-0 mt-1 bg-[#374151] rounded-md shadow-lg p-1 space-y-0.5 ">
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 1 }).run()
              setShowHeadingMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive('heading', { level: 1 }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <Heading1Icon size={16} />
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
              setShowHeadingMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <Heading2Icon size={16} />
          </button>
          <button
            onClick={() => {
              editor.chain().focus().toggleHeading({ level: 3 }).run()
              setShowHeadingMenu(false)
            }}
            className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-600 flex items-center gap-2 ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-600 text-white' : 'text-gray-300'
            }`}
          >
            <Heading3Icon size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default HeadingDropDownToolbar
