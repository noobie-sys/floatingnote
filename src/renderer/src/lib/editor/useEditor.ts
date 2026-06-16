import { useEditor as useTiptapEditor } from '@tiptap/react'
import { getEditorExtensions } from './extensions'
import { countStats } from './utils'
import { useSetAtom } from 'jotai'
import { fileStatsAtom } from '@renderer/store/tree/tree-atom'
import { useEffect } from 'react'

interface UseEditorOptions {
  content?: string
  onSave?: (content: string) => Promise<void>
  selectedFile?: {
    title: string
    content?: string
  }
}

interface UseEditorReturn {
  editor: ReturnType<typeof useTiptapEditor>
  handleBlur: () => Promise<void>
}

export const useEditor = ({
  content,
  onSave,
  selectedFile
}: UseEditorOptions = {}): UseEditorReturn => {
  const setFileStats = useSetAtom(fileStatsAtom)

  const editor = useTiptapEditor({
    extensions: getEditorExtensions(),
    content: content ?? selectedFile?.content ?? '',
    autofocus: true,
    editorProps: {
      handlePaste: (view, event) => {
        const clipboardData = event.clipboardData
        if (!clipboardData) return false

        const text = clipboardData.getData('text/plain')
        if (!text) return false

        // Check if the pasted content looks like markdown or has YAML frontmatter
        const hasYamlFrontmatter = text.trim().startsWith('---')
        const isMarkdown = hasYamlFrontmatter || /^[#*`>]|\[.*\]\(.*\)/.test(text)

        if (isMarkdown) {
          event.preventDefault()

          // Get the current selection
          const { state } = view
          const { tr } = state
          const { from, to } = state.selection

          // Replace the selection with the markdown text
          tr.replaceWith(from, to, state.schema.text(text))
          view.dispatch(tr)

          // Force the markdown extension to process the content
          if (editor) {
            // Set the new content
            editor.commands.setContent(text)

            // If there's YAML frontmatter, ensure it's preserved
            if (hasYamlFrontmatter) {
              const markdown = editor.storage.markdown.getMarkdown()
              editor.commands.setContent(markdown)
            }
          }

          return true
        }

        // For non-markdown content, convert to plain text and insert as markdown
        event.preventDefault()
        const plainText = text.replace(/<[^>]*>/g, '') // Strip any HTML tags
        const { state } = view
        const { tr } = state
        const { from, to } = state.selection

        tr.replaceWith(from, to, state.schema.text(plainText))
        view.dispatch(tr)

        if (editor) {
          editor.commands.setContent(plainText)
        }

        return true
      }
    },
    onUpdate: async ({ editor }): Promise<void> => {
      // Get the current content as Markdown
      const mdxString = editor.storage.markdown.getMarkdown()

      // Update stats if we have a selected file
      if (selectedFile) {
        const newStats = countStats(mdxString)
        setFileStats((prev) => ({
          ...prev,
          [selectedFile.title]: {
            fileName: selectedFile.title,
            ...newStats
          }
        }))
      }

      try {
        // Save the content if we have a save handler or a selected file
        if (onSave) {
          await onSave(mdxString)
        } else if (selectedFile) {
          await window.api.writeNote(selectedFile.title, mdxString)
        }
      } catch (err) {
        console.error('Error saving content:', err)
      }
    }
  })

  // Update editor content when selectedFile or content changes
  useEffect(() => {
    if (editor) {
      const newContent = content ?? selectedFile?.content ?? ''
      if (editor.getHTML() !== newContent) {
        editor.commands.setContent(newContent)
      }
    }
  }, [editor, content, selectedFile?.content])

  const handleBlur = async (): Promise<void> => {
    if (!editor) return

    const mdxString = editor.storage.markdown.getMarkdown()

    // Update stats if we have a selected file
    if (selectedFile) {
      const finalStats = countStats(mdxString)
      setFileStats((prev) => ({
        ...prev,
        [selectedFile.title]: {
          fileName: selectedFile.title,
          ...finalStats
        }
      }))
    }

    try {
      // Save the content if we have a save handler or a selected file
      if (onSave) {
        await onSave(mdxString)
      } else if (selectedFile) {
        await window.api.writeNote(selectedFile.title, mdxString)
      }
    } catch (err) {
      console.error('Error saving on blur:', err)
    }
  }

  return {
    editor,
    handleBlur
  }
}
