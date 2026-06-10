/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Content, MarkdownEditor, RootLayout, Footer, ResizableSidebar } from '@renderer/components'
import { TreeRoot } from '@renderer/components/tree/tree'
import { useRef } from 'react'
import { useAtom } from 'jotai'
import { activeNodeIdAtom } from '@renderer/store/tree/tree-atom'

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const [, setActiveNodeId] = useAtom(activeNodeIdAtom)

  const handleRootDirClick = () => {
    setActiveNodeId(null)
  }

  return (
    <div className="relative flex flex-col h-screen">
      <RootLayout className="flex-1">
        <ResizableSidebar className="h-screen overflow-hidden">
          <div className="h-full " onClick={handleRootDirClick}>
            <div onClick={(e) => e.stopPropagation()}>
              <TreeRoot />
            </div>
          </div>
        </ResizableSidebar>

        <Content
          ref={contentContainerRef}
          className="border-l bg-zinc-900/50 border-l-white/20 flex flex-col"
        >
          <div className="flex-1 overflow-auto ">
            <MarkdownEditor />
          </div>
          <Footer />
        </Content>
      </RootLayout>
    </div>
  )
}

export default App
