import { AnimatePresence, motion } from 'framer-motion'
import { TreeRoot } from '../tree/tree'
import { useAtomValue } from 'jotai'
import { isSidebarCollapsedAtom } from '@renderer/store/sidebar/sidebar-atom'

const SidebarCollapsable = (): React.ReactElement => {
  const isSidebarCollapsed = useAtomValue(isSidebarCollapsedAtom)

  return (
    <div className="relative root-dir">
      <AnimatePresence>
        <motion.div
          initial={{ width: 300 }}
          animate={{ width: isSidebarCollapsed ? 0 : 300 }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="mt-10 root-sub-dir border-r border-white/20 bg-zinc-900/50 overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="p-2"
            style={{ visibility: isSidebarCollapsed ? 'hidden' : 'visible' }}
          >
            <TreeRoot />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default SidebarCollapsable
