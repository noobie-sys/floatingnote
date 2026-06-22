interface DirectoryNode {
  id: string
  type: 'file' | 'folder'
  name: string
  path: string
  files?: DirectoryNode[]
}

interface Window {
  api: {
    // Note operations
    getNotes: (...args: unknown[]) => Promise<unknown>
    readNote: (...args: unknown[]) => Promise<unknown>
    writeNote: (...args: unknown[]) => Promise<unknown>
    createNote: (parentPath?: string) => Promise<string | false>
    deleteNote: (...args: unknown[]) => Promise<unknown>
    renameFile: (oldPath: string, newPath: string) => Promise<boolean>

    // Folder operations
    createFolder: (parentPath?: string) => Promise<string | false>
    deleteFolder: (folderPath: string) => Promise<boolean>
    renameFolder: (oldPath: string, newName: string) => Promise<boolean>
    getFolderInfo: (
      folderPath: string
    ) => Promise<{ name: string; path: string; lastEditTime: number }>
    readDirectoryStructure: (dirPath?: string) => Promise<DirectoryNode[]>
    getRootDir: () => Promise<string>
    joinPaths: (...paths: string[]) => Promise<string>

    // App context
    locale: string
  }
}
