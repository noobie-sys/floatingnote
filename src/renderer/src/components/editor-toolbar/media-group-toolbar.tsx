import { ImageIcon } from 'lucide-react'
import { Editor } from '@tiptap/react'
import React from 'react'
import ToolbarButton from '../Button/toolbar-button'

interface MediaGroupToolbarProps {
  editor: Editor
  addImage: () => void
}

const MediaGroupToolbar = ({ editor, addImage }: MediaGroupToolbarProps): React.JSX.Element => {
  return (
    <div className="flex items-center gap-1 border-r border-gray-700 pr-1">
      <ToolbarButton
        onClick={addImage}
        className={`${editor.isActive('image') ? 'bg-gray-700 text-white' : ''}`}
        title="Add Image"
      >
        <ImageIcon size={16} />
      </ToolbarButton>
    </div>
  )
}

export default MediaGroupToolbar
