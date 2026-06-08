import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { FolderInfo, DirectoryNode } from '@main/lib/folder-operations'

declare global {
  interface Window {
    api: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      renameFile: (oldPath: string, newName: string) => Promise<boolean>
      createFolder: (parentPath?: string) => Promise<boolean>
      deleteFolder: (folderPath: string) => Promise<boolean>
      renameFolder: (oldPath: string, newName: string) => Promise<boolean>
      getFolderInfo: (folderPath: string) => Promise<FolderInfo>
      readDirectoryStructure: (dirPath?: string) => Promise<DirectoryNode[]>
      getRootDir: () => Promise<string>
      joinPaths: (...paths: string[]) => Promise<string>
      onCreateNoteFromMenu: (callback: () => void) => () => void
    }
  }
}
