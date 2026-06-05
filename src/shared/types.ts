import { NoteContent, NoteInfo } from './models'

export type GetNotes = () => Promise<NoteInfo[]>
export type ReadNote = (title: NoteInfo['title']) => Promise<NoteContent>
export type WriteNote = (title: NoteInfo['title'], content: NoteContent) => Promise<void>
export type CreateNote = (filePath: string) => Promise<boolean>
export type DeleteNote = (title: NoteInfo['title']) => Promise<boolean>

export interface ElectronAPI {
  // Note operations
  getNotes: (...args: Parameters<GetNotes>) => Promise<unknown>
  readNote: (...args: Parameters<ReadNote>) => Promise<unknown>
  writeNote: (...args: Parameters<WriteNote>) => Promise<unknown>
  createNote: (parentPath?: string) => Promise<string | false>
  deleteNote: (filePath: string) => Promise<boolean>
  renameFile: (oldPath: string, newName: string) => Promise<boolean>

  // Folder operations
  createFolder: (parentPath?: string) => Promise<boolean>
  deleteFolder: (folderPath: string) => Promise<boolean>
  renameFolder: (oldPath: string, newName: string) => Promise<boolean>
  getFolderInfo: (folderPath: string) => Promise<unknown>
  readDirectoryStructure: (dirPath?: string) => Promise<unknown>
  getRootDir: () => Promise<string>
  joinPaths: (...paths: string[]) => Promise<string>

  // Image operations
  selectImage: () => Promise<{ fullPath: string; filename: string } | null>

  // App context
  locale: string

  // Event handlers
  onCreateNoteFromMenu: (callback: () => void) => () => void
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
