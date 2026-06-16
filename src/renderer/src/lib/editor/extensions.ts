import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Markdown } from 'tiptap-markdown'
import { all, createLowlight } from 'lowlight'
import { Placeholder } from '@tiptap/extensions'
import { ListKit } from '@tiptap/extension-list'
import { AnyExtension } from '@tiptap/core'
import Code from '@tiptap/extension-code'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
import { ImageUploadNode } from '@renderer/components/custom-image-component /components/tiptap-node/image-upload-node/image-upload-node-extension'
import { MAX_FILE_SIZE, handleImageUpload } from '@renderer/lib/tiptap-utils'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import ImageResize from 'tiptap-extension-resize-image'

// Custom extension to handle code blocks without backticks
export const CustomCodeBlock = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    return ['pre', HTMLAttributes, ['code', { class: 'language-' + node.attrs.language }, 0]]
  }
})

// Custom extension to handle inline code without asterisks
export const CustomCode = Code.extend({
  renderHTML({ HTMLAttributes }) {
    return ['code', HTMLAttributes, 0]
  },
  parseHTML() {
    return [
      {
        tag: 'code'
      }
    ]
  }
})

// Custom extension to handle === syntax for highlighting
export const CustomHighlight = Highlight.extend({
  addInputRules() {
    return [
      {
        find: /===([^=]+)===/g,
        handler: ({ chain, range }) => {
          chain().setTextSelection(range).setHighlight({ color: '#FEF08A' }).run()
        }
      }
    ]
  }
})

// create a lowlight instance with all languages loaded
export const lowlight = createLowlight(all)

export const getEditorExtensions = (): AnyExtension[] => [
  ListKit,
  CustomCode,
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6]
    },
    codeBlock: false // Disable default code block
  }),
  Underline,
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: 'highlight'
    }
  }),
  Typography.configure({
    openDoubleQuote: '"',
    closeDoubleQuote: '"',
    openSingleQuote: "'",
    closeSingleQuote: "'",
    emDash: '—'
  }),
  Link.extend({
    renderHTML({ mark, HTMLAttributes }) {
      const href = mark.attrs.href
      const shortUrl = href ? href.replace(/^https?:\/\//, '') : ''
      return [
        'a',
        {
          ...HTMLAttributes,
          href,
          class: 'text-blue-600 underline hover:text-blue-800',
          rel: 'noopener noreferrer',
          target: '_blank',
          'data-link': shortUrl
        },
        0
      ]
    }
  }),
  Markdown.configure({
    html: true,
    tightLists: true,
    transformPastedText: true,
    transformCopiedText: true,
    breaks: true,
    linkify: true
  }),
  CustomCodeBlock.configure({
    lowlight,
    defaultLanguage: 'typescript',
    languageClassPrefix: 'language'
  }),
  Placeholder.configure({
    placeholder: 'Write something...'
  }),
  Image.configure({
    allowBase64: false,
    HTMLAttributes: {
      class: 'max-w-full rounded'
    }
  }),
  ImageUploadNode.configure({
    accept: 'image/*',
    maxSize: MAX_FILE_SIZE,
    limit: 1,
    upload: handleImageUpload,
    onError: (error) => console.error('Upload failed:', error)
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: 'border-l-4 border-gray-300 pl-4 italic'
    }
  }),
  Subscript.configure({
    HTMLAttributes: {
      class: 'subscript'
    }
  }),
  Superscript.configure({
    HTMLAttributes: {
      class: 'superscript'
    }
  }),
  ImageResize
]
