import { useRef, useEffect, useState } from 'react'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useAtom } from 'jotai'
import { isSidebarCollapsedAtom } from '@renderer/store/sidebar/sidebar-atom'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

interface ResizableSidebarProps extends ComponentProps<'div'> {
  minWidth?: number
  maxWidth?: number
  defaultWidth?: number
}

export const ResizableSidebar = ({
  children,
  className,
  minWidth = 200,
  maxWidth = 280,
  defaultWidth = 250
}: ResizableSidebarProps): React.JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useAtom(isSidebarCollapsedAtom)
  const [isVisuallyCollapsed, setIsVisuallyCollapsed] = useState(isCollapsed)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // Motion values for smooth animations
  const width = useMotionValue(isCollapsed ? 0 : defaultWidth)
  const springWidth = useSpring(width, {
    stiffness: 400,
    damping: 30
  })

  // Transform motion value to opacity for the resize handle
  const handleOpacity = useTransform(width, [0, minWidth], [0, 1])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (!isDraggingRef.current || !sidebarRef.current) return

      const deltaX = e.clientX - startXRef.current
      const newWidth = Math.max(0, Math.min(maxWidth, startWidthRef.current + deltaX))

      // If dragged close to zero width, prepare to collapse
      if (newWidth < 50) {
        width.set(0)
      } else {
        width.set(newWidth)
      }
    }

    const handleMouseUp = (): void => {
      if (!isDraggingRef.current) return

      isDraggingRef.current = false
      document.body.style.cursor = 'default'

      // Only collapse if width is very small
      if (width.get() < 50) {
        setIsCollapsed(true)
        setIsVisuallyCollapsed(true)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [maxWidth, setIsCollapsed, width])

  const handleMouseDown = (e: React.MouseEvent): void => {
    e.preventDefault()
    isDraggingRef.current = true
    startXRef.current = e.clientX
    startWidthRef.current = width.get()
    document.body.style.cursor = 'col-resize'
  }

  // Update width and visual state when collapse state changes
  useEffect(() => {
    width.set(isCollapsed ? 0 : defaultWidth)
    setIsVisuallyCollapsed(isCollapsed)
  }, [isCollapsed, defaultWidth, width])

  return (
    <motion.div
      ref={sidebarRef}
      className={twMerge('relative flex', className)}
      style={{ width: springWidth }}
    >
      <motion.div
        className="w-full h-full overflow-auto"
        animate={{ opacity: isVisuallyCollapsed ? 0 : 1 }}
        transition={{ duration: 0.05 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-500/50 transition-colors"
        style={{ opacity: handleOpacity }}
        onMouseDown={handleMouseDown}
        whileHover={{ scaleX: 2, backgroundColor: 'rgba(59, 130, 246, 0.5)' }}
        transition={{ duration: 0.05 }}
      />
    </motion.div>
  )
}
