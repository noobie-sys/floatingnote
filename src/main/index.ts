import {
  createNote,
  deleteNote,
  getNotes,
  readNote,
  writeNote,
  getRootDir,
  renameFile
} from '@/lib'
import {
  createFolder,
  deleteFolder,
  renameFolder,
  getFolderInfo,
  readDirectoryStructure
} from './lib/folder-operations'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { BrowserWindow, app, ipcMain, shell, dialog, globalShortcut } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { createMenuBar } from './menu'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    center: true,
    title: 'Floating Notes',
    // frame: false,
    vibrancy: 'under-window',
    visualEffectState: 'active',
    // titleBarStyle: 'hidden',
    trafficLightPosition: { x: 15, y: 10 },
    resizable: false,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true
    }
  })

  // Create the menu bar
  createMenuBar(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Register global shortcut for toggling window visibility
  globalShortcut.register('CommandOrControl+Shift+X', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    } else {
      createWindow()
    }
  })

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Note operations
  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))
  ipcMain.handle('renameFile', async (_, oldPath: string, newPath: string) => {
    console.log('Renaming file:', { oldPath, newPath })
    return renameFile(oldPath, newPath)
  })

  // Folder operations
  ipcMain.handle('createFolder', async (_, parentPath?: string) =>
    createFolder(parentPath || getRootDir())
  )
  ipcMain.handle('deleteFolder', async (_, folderPath: string) => deleteFolder(folderPath))
  ipcMain.handle('renameFolder', async (_, oldPath: string, newName: string) =>
    renameFolder(oldPath, newName)
  )
  ipcMain.handle('getFolderInfo', async (_, folderPath: string) => getFolderInfo(folderPath))
  ipcMain.handle('readDirectoryStructure', async (_, dirPath?: string) =>
    readDirectoryStructure(dirPath)
  )
  ipcMain.handle('getRootDir', () => getRootDir())
  ipcMain.handle('joinPaths', (_, ...paths: string[]) => join(...paths))

  // Image operations
  ipcMain.handle('selectImage', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }]
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const fullPath = result.filePaths[0]
      const filename = fullPath.split('/').pop()
      console.log('filename 📁', filename)
      return { fullPath, filename }
    }
    return null
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
