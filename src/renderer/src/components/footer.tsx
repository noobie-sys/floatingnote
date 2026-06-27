import { useAtomValue } from 'jotai'
import { selectedFileAtom, fileStatsAtom } from '@renderer/store/tree/tree-atom'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Footer = ({ className, ...props }: ComponentProps<'footer'>): React.JSX.Element => {
  const selectedFile = useAtomValue(selectedFileAtom)
  const fileStats = useAtomValue(fileStatsAtom)

  const currentFileStats = selectedFile ? fileStats[selectedFile.title] : null
  const fileName = selectedFile
    ? (selectedFile.title.split('/').pop()?.replace(/\.md$/, '') ?? '')
    : 'Floating Notes'

  return (
    <footer
      className={twMerge(
        'flex items-center justify-between p-1.5  bg-zinc-900/50 border-t border-white/20 text-sm text-gray-400',
        className
      )}
      {...props}
    >
      <div className="flex-1" /> {/* Left spacer */}
      <div className="absolute left-1/2 transform flex justify-center items-center -translate-x-1/2 font-medium text-sm ">
        {fileName}
      </div>
      <div className="flex items-center gap-4 ml-auto text-xs px-1">
        <div>{currentFileStats?.charCount} characters</div>
        <div>{currentFileStats?.wordCount} words</div>
      </div>
    </footer>
  )
}
