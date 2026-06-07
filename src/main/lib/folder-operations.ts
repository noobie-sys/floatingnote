import { dialog } from 'electron'
import { ensureDir, mkdir, remove, stat, readdir, rename } from 'fs-extra'
import path from 'path'
import { getRootDir } from '.'

export interface FolderInfo {
  name: string
  path: string
  lastEditTime: number
}

export interface DirectoryNode {
  id: string
  type: 'file' | 'folder'
  name: string
  path: string
  files?: DirectoryNode[]
}

export const readDirectoryStructure = async (
  dirPath: string = getRootDir()
): Promise<DirectoryNode[]> => {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true })
    const nodes: DirectoryNode[] = []

    for (const entry of entries) {
      // Skip .DS_Store files
      if (entry.name === '.DS_Store') continue

      const fullPath = path.join(dirPath, entry.name)

      const node: DirectoryNode = {
        id: `node-${Date.now()}-${entry.name}`,
        type: entry.isDirectory() ? 'folder' : 'file',
        name: entry.name,
        path: fullPath
      }

      if (entry.isDirectory()) {
        node.files = await readDirectoryStructure(fullPath)
      }

      nodes.push(node)
    }

    return nodes
  } catch (error) {
    console.error('Error reading directory structure:', error)
    return []
  }
}

export const createFolder = async (folderPath: string): Promise<boolean> => {
  try {
    // Generate a default name if none is provided
    const defaultName = `New Folder ${new Date().toISOString().split('T')[0]}`
    const folderName = path.basename(folderPath) || defaultName
    const parentDir = path.dirname(folderPath)
    const fullPath = path.join(parentDir, folderName)

    console.log('📁 Folder creation details:', {
      originalPath: folderPath,
      fullPath: fullPath,
      rootDir: getRootDir(),
      parentDir: parentDir,
      folderName: folderName,
      defaultName: defaultName
    })

    // Check if a folder with the same name exists
    const folderExists = await stat(fullPath).catch(() => false)
    if (folderExists) {
      console.log('⚠️ Folder already exists at:', fullPath)
      return false // Return false to indicate duplicate folder
    }

    // Ensure parent directory exists
    console.log('📁 Ensuring parent directory exists:', parentDir)
    await ensureDir(parentDir)

    console.info(`📁 Creating folder at: ${fullPath}`)
    await mkdir(fullPath)
    console.log('✅ Folder created successfully!')
    return true
  } catch (error: unknown) {
    console.error('❌ Error creating folder:', error)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `Failed to create folder: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    return false
  }
}

export const deleteFolder = async (folderPath: string): Promise<boolean> => {
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete folder',
    message: `Are you sure you want to delete ${path.basename(folderPath)}?`,
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Folder deletion canceled')
    return false
  }

  console.info(`Deleting folder: ${folderPath}`)
  await remove(folderPath)
  return true
}

export const renameFolder = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    console.log('Renaming folder:', {
      oldPath,
      newPath,
      rootDir: getRootDir()
    })

    // Ensure the old path exists
    const oldPathExists = await stat(oldPath).catch(() => false)
    if (!oldPathExists) {
      console.error('Old path does not exist:', oldPath)
      return false
    }

    // Ensure the new path's parent directory exists
    const parentDir = path.dirname(newPath)
    await ensureDir(parentDir)

    // Check if new path already exists
    const newPathExists = await stat(newPath).catch(() => false)
    if (newPathExists) {
      console.error('New path already exists:', newPath)
      return false
    }

    // Rename the folder using fs.rename to preserve contents
    await rename(oldPath, newPath)
    return true
  } catch (error) {
    console.error('Error renaming folder:', error)
    return false
  }
}

export const getFolderInfo = async (folderPath: string): Promise<FolderInfo> => {
  const fileStats = await stat(folderPath)
  return {
    name: path.basename(folderPath),
    path: folderPath,
    lastEditTime: fileStats.mtimeMs
  }
}
