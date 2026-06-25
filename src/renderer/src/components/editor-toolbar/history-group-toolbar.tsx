import { Editor } from '@tiptap/react'
import { Redo, Undo } from 'lucide-react'
import React from 'react'
import ToolbarButton from '../Button/toolbar-button'

interface HistoryGroupToolbarProps {
  editor: Editor
}

const HistoryGroupToolbar = ({ editor }: HistoryGroupToolbarProps): React.JSX.Element => {
  return (
    <div className="flex items-center gap-1">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo size={16} />
      </ToolbarButton>
    </div>
  )
}

export default HistoryGroupToolbar
