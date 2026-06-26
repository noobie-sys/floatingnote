import { Editor } from '@tiptap/react'
import { Highlighter, Code, Quote, Subscript, Superscript } from 'lucide-react'
import React from 'react'
import ToolbarButton from '../Button/toolbar-button'

interface SpecialFormattingToolbarProps {
  editor: Editor
}

const SpecialFormattingToolbar = ({ editor }: SpecialFormattingToolbarProps): React.JSX.Element => {
  return (
    <div className="flex items-center gap-1 border-r border-gray-700">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`${editor.isActive('highlight') ? 'bg-gray-700 text-white' : ''}`}
        title="Highlight"
      >
        <Highlighter size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`${editor.isActive('code') ? 'bg-gray-700 text-white' : ''}`}
        title="Code"
      >
        <Code size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${editor.isActive('blockquote') ? 'bg-gray-700 text-white' : ''}`}
        title="Block Quote"
      >
        <Quote size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`${editor.isActive('subscript') ? 'bg-gray-700 text-white' : ''}`}
        title="Subscript"
      >
        <Subscript size={14} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`${editor.isActive('superscript') ? 'bg-gray-700 text-white' : ''}`}
        title="Superscript"
      >
        <Superscript size={14} />
      </ToolbarButton>
    </div>
  )
}

export default SpecialFormattingToolbar
