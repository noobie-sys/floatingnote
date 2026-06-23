import { Editor } from '@tiptap/react'
import { MAX_FILE_SIZE, handleImageUpload } from '@renderer/lib/tiptap-utils'
import { useState, useRef, useEffect } from 'react'
import BiusBasicStyleToolbar from './bius-basic-style-toolbar'
import HeadingDropDownToolbar from './heading-drop-down-toolbar'
import ListDropDownToolbar from './list-drop-down-toolbar'
import AlignmentDropDownMenu from './alignment-dropdown-toolbar'
import MediaGroupToolbar from './media-group-toolbar'
import HistoryGroupToolbar from './history-group-toolbar'
import SpecialFormattingToolbar from './special-formatting-toolbar'
import { motion } from 'framer-motion'

interface EditorToolbarProps {
  editor: Editor | null
}

const EditorToolbar = ({ editor }: EditorToolbarProps): React.JSX.Element | null => {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)
  const [showAlignMenu, setShowAlignMenu] = useState(false)
  const headingMenuRef = useRef<HTMLDivElement | null>(null)
  const listMenuRef = useRef<HTMLDivElement | null>(null)
  const alignMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (headingMenuRef.current && !headingMenuRef.current.contains(event.target as Node)) {
        setShowHeadingMenu(false)
      }
      if (listMenuRef.current && !listMenuRef.current.contains(event.target as Node)) {
        setShowListMenu(false)
      }
      if (alignMenuRef.current && !alignMenuRef.current.contains(event.target as Node)) {
        setShowAlignMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!editor) {
    return null
  }

  const addImage = async (): Promise<void> => {
    try {
      editor
        .chain()
        .focus()
        .setImageUploadNode({
          accept: 'image/*',
          maxSize: MAX_FILE_SIZE,
          limit: 1,
          upload: handleImageUpload,
          onError: (error) => console.error('Upload failed:', error)
        })
        .run()
    } catch (error) {
      console.error('Error adding image:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="  rounded  w-fit p-1 flex flex-wrap items-center gap-1 bg-[#1F2937]/90 backdrop-blur-3xl shadow-md mx-auto  "
    >
      {/* Text Style Group */}
      <div className="flex items-center gap-0.5 border-r border-gray-700 pr-1">
        <BiusBasicStyleToolbar editor={editor} />
      </div>

      {/* Headings Dropdown */}
      <HeadingDropDownToolbar
        editor={editor}
        showHeadingMenu={showHeadingMenu}
        setShowHeadingMenu={setShowHeadingMenu}
        headingMenuRef={headingMenuRef}
      />

      {/* Lists Dropdown */}
      <ListDropDownToolbar
        editor={editor}
        showListMenu={showListMenu}
        setShowListMenu={setShowListMenu}
        listMenuRef={listMenuRef}
      />

      {/* Alignment Dropdown */}
      <AlignmentDropDownMenu
        editor={editor}
        showAlignmentMenu={showAlignMenu}
        setShowAlignmentMenu={setShowAlignMenu}
        alignmentMenuRef={alignMenuRef}
      />
      {/* Special Formatting Group */}
      <SpecialFormattingToolbar editor={editor} />

      {/* Media Group */}
      <MediaGroupToolbar editor={editor} addImage={addImage} />

      {/* History Group */}
      <HistoryGroupToolbar editor={editor} />
    </motion.div>
  )
}

export default EditorToolbar
