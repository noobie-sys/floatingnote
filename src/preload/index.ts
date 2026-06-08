import { GetNotes, ReadNote, WriteNote, ElectronAPI } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

// Custom APIs for renderer
const api: ElectronAPI = {
  // Note operations
  getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
  readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
  writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
  createNote: (parentPath?: string) => ipcRenderer.invoke('createNote', parentPath),
  deleteNote: (filePath: string) => ipcRenderer.invoke('deleteNote', filePath),
  renameFile: (oldPath: string, newPath: string) =>
    ipcRenderer.invoke('renameFile', oldPath, newPath),

  // Folder operations
  createFolder: (parentPath?: string) => ipcRenderer.invoke('createFolder', parentPath),
  deleteFolder: (folderPath: string) => ipcRenderer.invoke('deleteFolder', folderPath),
  renameFolder: (oldPath: string, newName: string) =>
    ipcRenderer.invoke('renameFolder', oldPath, newName),
  getFolderInfo: (folderPath: string) => ipcRenderer.invoke('getFolderInfo', folderPath),
  readDirectoryStructure: (dirPath?: string) =>
    ipcRenderer.invoke('readDirectoryStructure', dirPath),
  getRootDir: () => ipcRenderer.invoke('getRootDir'),
  joinPaths: (...paths: string[]) => ipcRenderer.invoke('joinPaths', ...paths),

  // Image operations
  selectImage: () => ipcRenderer.invoke('selectImage'),

  // App context
  locale: navigator.language,

  // Event handlers
  onCreateNoteFromMenu: (callback: () => void) => {
    ipcRenderer.on('create-note-in-active-folder', callback)
    return () => {
      ipcRenderer.removeListener('create-note-in-active-folder', callback)
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to renderer
try {
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
