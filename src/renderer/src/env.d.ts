/// <reference types="vite/client" />

interface Window {
  api: {
    getNotes: (...args: unknown[]) => Promise<unknown>
    readNote: (...args: unknown[]) => Promise<unknown>
    writeNote: (...args: unknown[]) => Promise<unknown>
    createNote: (parentPath?: string) => Promise<string | false>
    deleteNote: (filePath: string) => Promise<unknown>
    renameFile: (oldPath: string, newPath: string) => Promise<unknown>
    createFolder: (parentPath?: string) => Promise<unknown>
    deleteFolder: (folderPath: string) => Promise<unknown>
    renameFolder: (oldPath: string, newName: string) => Promise<unknown>
    getFolderInfo: (folderPath: string) => Promise<unknown>
    readDirectoryStructure: (dirPath?: string) => Promise<unknown>
    getRootDir: () => Promise<unknown>
    joinPaths: (...paths: string[]) => Promise<unknown>
    selectImage: () => Promise<string | null>
    locale: string
    onCreateNoteFromMenu: (callback: () => void) => () => void
  }
}
