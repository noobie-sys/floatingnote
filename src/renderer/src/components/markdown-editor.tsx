import React, { useEffect, useRef, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { selectedFileAtom, loadLastOpenedFile } from '@renderer/store/tree/tree-atom'
import { EditorContent, BubbleMenu } from '@tiptap/react'
import { editorStyles } from '@renderer/lib/editor/styles'
import '@renderer/lib/editor/styles.css'
import { EmptyState } from './empty-state'
import { useEditor } from '@renderer/lib/editor/useEditor'
import EditorToolbar from './editor-toolbar/editor-toolbar'
import {
  RiBold,
  RiItalic,
  RiStrikethrough,
  RiUnderline,
  RiCodeSSlashLine,
  RiLink,
  RiMarkPenLine
} from 'react-icons/ri'
import { Settings2 } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { SidebarToggle } from './sidebar/sidebar-toggle'

// Update the highlightColors array
const highlightColors = [
  { color: '#FEF08A' },
  { color: '#BBF7D0' },
  { color: '#BFDBFE' },
  { color: '#FBCFE8' },
  { color: '#E9D5FF' }
]

export const MarkdownEditor = (): React.JSX.Element | null => {
  const selectedFile = useAtomValue(selectedFileAtom)
  const setSelectedFile = useSetAtom(selectedFileAtom)
  const editorContentRef = useRef<HTMLDivElement>(null)
  const linkInputRef = useRef<HTMLDivElement>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showHighlightMenu, setShowHighlightMenu] = useState(false)
  const [currentHighlightColor, setCurrentHighlightColor] = useState<string | null>(null)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (linkInputRef.current && !linkInputRef.current.contains(event.target as Node)) {
        setShowLinkInput(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Load last opened file on component mount
  useEffect(() => {
    const loadLastFile = async (): Promise<void> => {
      const lastFilePath = loadLastOpenedFile()
      if (lastFilePath) {
        try {
          const content = await window.api.readNote(lastFilePath.replace(/\.md$/, ''))
          if (content) {
            setSelectedFile({
              title: lastFilePath.replace(/\.md$/, ''),
              content: content as string,
              lastEditTime: Date.now()
            })
          }
        } catch (error) {
          console.error('Error loading last file:', error)
        }
      }
    }

    loadLastFile()
  }, [setSelectedFile])

  const { editor, handleBlur } = useEditor({
    selectedFile: selectedFile
      ? {
          title: selectedFile.title,
          content: selectedFile.content
        }
      : undefined
  })

  const addLink = (): void => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const removeLink = (): void => {
    editor?.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }

  // Add this function to handle highlight toggling
  const toggleHighlight = (color: string): void => {
    if (!editor) return

    if (editor.isActive('highlight')) {
      // Remove highlight regardless of the color
      editor.chain().focus().unsetHighlight().run()
      setCurrentHighlightColor(null)
    } else {
      // Apply new highlight color
      editor.chain().focus().setHighlight({ color }).run()
      setCurrentHighlightColor(color)
    }
    setShowHighlightMenu(false)
  }

  // Add a function to remove highlight
  const removeHighlight = (): void => {
    if (!editor) return
    editor.chain().focus().unsetHighlight().run()
    setCurrentHighlightColor(null)
    setShowHighlightMenu(false)
  }

  if (!selectedFile) {
    return <EmptyState />
  }

  return (
    <div className="h-full flex flex-col relative">
      <div
        className="absolute top-1.5 right-2.5 p-1 cursor-pointer hover:scale-110 transition-all duration-200 ease-in-out bg-zinc-800/80 rounded-full z-[101000] w-fit h-fit"
        onClick={() => setShowSettingsMenu(!showSettingsMenu)}
      >
        <Settings2 className="w-4 h-4" />
      </div>
      <SidebarToggle />

      <div className="flex-1  focus:border-none flex-wrap  focus:outline-none overflow-y-auto ">
        <AnimatePresence mode="wait">
          {editor && !showSettingsMenu && (
            <div className="w-full sticky top-0 z-[11000]">
              <EditorToolbar editor={editor} />
            </div>
          )}
        </AnimatePresence>
        <EditorContent
          ref={editorContentRef}
          editor={editor}
          onBlur={handleBlur}
          className={`${editorStyles}  transition-all duration-200 ease-in-out`}
          style={{
            outline: 'none',
            border: 'none',
            boxShadow: 'none'
          }}
        />
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ placement: 'bottom', offset: [0, 8] }}>
            <div className="bubble-menu bg-[#374151] rounded-md shadow flex p-2 gap-2 w-full ">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  editor.isActive('bold')
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'hover:bg-gray-200 hover:text-black text-white'
                }`}
                title="Bold"
              >
                <RiBold className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  editor.isActive('italic')
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'hover:bg-gray-200 hover:text-black text-white'
                }`}
                title="Italic"
              >
                <RiItalic className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  editor.isActive('strike')
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'hover:bg-gray-200 hover:text-black text-white'
                }`}
                title="Strike Through"
              >
                <RiStrikethrough className="w-4 h-4" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  editor.isActive('underline')
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'hover:bg-gray-200 hover:text-black text-white'
                }`}
                title="Underline"
              >
                <RiUnderline className="w-4 h-4" />
              </button>
              <div className="w-px bg-gray-600 mx-1" />
              <div className="relative">
                <button
                  onClick={() => {
                    if (editor.isActive('highlight')) {
                      removeHighlight()
                    } else {
                      setShowHighlightMenu(!showHighlightMenu)
                    }
                  }}
                  className={`p-2 rounded transition-colors cursor-pointer ${
                    editor.isActive('highlight')
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'hover:bg-gray-200 hover:text-black text-white'
                  }`}
                  title={editor.isActive('highlight') ? 'Remove Highlight' : 'Highlight'}
                >
                  <RiMarkPenLine className="w-4 h-4" />
                </button>
                {showHighlightMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-[#374151] rounded-md shadow-lg p-2 flex gap-2">
                    {highlightColors.map(({ color }) => (
                      <button
                        key={color}
                        onClick={() => toggleHighlight(color)}
                        className={`w-6 h-6 rounded-full hover:ring-2 hover:ring-white transition-all ${
                          currentHighlightColor === color ? 'ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Highlight with ${color}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  editor.isActive('code')
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'hover:bg-gray-200 hover:text-black text-white'
                }`}
                title="Inline Code"
              >
                <RiCodeSSlashLine className="w-4 h-4" />
              </button>

              <div className="relative" ref={linkInputRef}>
                <button
                  onClick={() => {
                    if (editor.isActive('link')) {
                      removeLink()
                    } else {
                      setShowLinkInput(true)
                    }
                  }}
                  className={`p-2 rounded transition-colors cursor-pointer ${
                    editor.isActive('link')
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'hover:bg-gray-200 hover:text-black text-white '
                  }`}
                  title={editor.isActive('link') ? 'Remove Link' : 'Add Link'}
                >
                  <RiLink className="w-4 h-4" />
                </button>
                {showLinkInput && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-52">
                    <div className="flex items-center gap-2 bg-[#374151] p-2 rounded-md shadow">
                      <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="Enter URL..."
                        className="px-2 py-1 rounded bg-gray-700 text-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addLink()
                          } else if (e.key === 'Escape') {
                            setShowLinkInput(false)
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </BubbleMenu>
        )}
      </div>
    </div>
  )
}
