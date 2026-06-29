import { useAtom } from 'jotai'
import { isSidebarCollapsedAtom } from '@renderer/store/sidebar/sidebar-atom'
import { TbLayoutSidebarFilled } from 'react-icons/tb'

export const SidebarToggle = (): React.JSX.Element => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useAtom(isSidebarCollapsedAtom)

  return (
    <div className="absolute left-2 top-1.5 z-[99992]">
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="bg-zinc-800/80 cursor-pointer p-1 rounded-full  transition-all delay-75 duration-500 [&:not(:disabled)]:cursor-pointer [&:not(:disabled)]:active:scale-95 select-none [-webkit-app-region:no-drag]"
      >
        {isSidebarCollapsed ? (
          <TbLayoutSidebarFilled className="text-white/80 hover:text-white text-[16px]" />
        ) : (
          <TbLayoutSidebarFilled className="text-white/80 hover:text-white text-[16px] rotate-180" />
        )}
      </button>
    </div>
  )
}
