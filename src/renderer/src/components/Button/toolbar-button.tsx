import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const ToolbarButton = ({
  className,
  children,
  ...props
}: ComponentProps<'button'>): React.JSX.Element => {
  return (
    <button
      className={twMerge('p-1.5 rounded hover:bg-gray-700 text-gray-300 cursor-pointer', className)}
      {...props}
    >
      {children}
    </button>
  )
}

export default ToolbarButton
