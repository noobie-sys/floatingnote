import React from 'react'
import ToolbarButton from '../Button/toolbar-button'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'

interface BiusBasicStyleToolbarProps {
  editor: Editor
}

const BiusBasicStyleToolbar = ({ editor }: BiusBasicStyleToolbarProps): React.JSX.Element => {
  return (
    <div className="flex items-center gap-0.5 cursor-pointer">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={` ${editor.isActive('bold') ? 'bg-gray-700 text-white' : ''}`}
        title="Bold"
      >
        <BoldIcon size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={` ${editor.isActive('italic') ? 'bg-gray-700 text-white' : ''}`}
        title="Italic"
      >
        <ItalicIcon size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={` ${editor.isActive('underline') ? 'bg-gray-700 text-white' : ''}`}
        title="Underline"
      >
        <UnderlineIcon size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={` ${editor.isActive('strike') ? 'bg-gray-700 text-white' : ''}`}
        title="Strike Through"
      >
        <StrikethroughIcon size={14} />
      </ToolbarButton>
    </div>
  )
}

export default BiusBasicStyleToolbar
