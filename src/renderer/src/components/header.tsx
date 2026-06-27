import { useAtomValue } from 'jotai'
import { selectedFileAtom } from '@renderer/store/tree/tree-atom'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Header = ({ className, ...props }: ComponentProps<'header'>): React.JSX.Element => {
  const selectedFile = useAtomValue(selectedFileAtom)
  const fileName = selectedFile
    ? (selectedFile.title.split('/').pop()?.replace(/\.md$/, '') ?? '')
    : ''

  return (
    <header
      className={twMerge(
        'flex items-center px-4 py-4.5 bg-zinc-900/50 border-b border-white/20 text-sm text-gray-400',
        className
      )}
      {...props}
    >
      <div className="flex-1" /> {/* Spacer */}
      <div className="font-medium absolute left-1/2 transform -translate-x-1/2 text-lg">
        {fileName || 'Floating Notes'}
      </div>
      <div className="flex-1" /> {/* Spacer */}
    </header>
  )
}
