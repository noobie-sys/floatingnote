/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return path.join(homedir(), 'Documents', appDirectoryName)
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('No notes found, creating a welcome note')

    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

    // create the welcome note
    await writeFile(`${rootDir}/${welcomeNoteFilename}`, content, { encoding: fileEncoding })

    notes.push(welcomeNoteFilename)
  }

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${filename}`)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()
  // If the filename already contains a path, use it directly
  const filePath = filename.includes('/') ? filename : `${rootDir}/${filename}`
  return readFile(`${filePath}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()
  // If the filename already contains a path, use it directly
  const filePath = filename.includes('/') ? filename : `${rootDir}/${filename}`
  // console.info(`Writing note ${filePath}, content: ${content}`)
  return writeFile(`${filePath}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async (filePath: string): Promise<boolean> => {
  try {
    // Check if file already exists
    const fileExists = await stat(filePath).catch(() => false)
    if (fileExists) {
      return false // Return false to indicate duplicate file
    }

    await ensureDir(path.dirname(filePath))
    console.info(`Creating note: ${filePath}`)
    await writeFile(filePath, '')
    return true
  } catch (error) {
    console.error('Error creating note:', error)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `Failed to create note: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    return false
  }
}

export const deleteNote: DeleteNote = async (filePath: string): Promise<boolean> => {
  try {
    const { response } = await dialog.showMessageBox({
      type: 'warning',
      title: 'Delete note',
      message: `Are you sure you want to delete ${path.basename(filePath)}?`,
      buttons: ['Delete', 'Cancel'], // 0 is Delete, 1 is Cancel
      defaultId: 1,
      cancelId: 1
    })

    if (response === 1) {
      console.info('Note deletion canceled')
      return false
    }

    console.info(`Deleting note: ${filePath}`)
    await remove(filePath)
    return true
  } catch (error) {
    console.error('Error deleting note:', error)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Deletion failed',
      message: `Failed to delete note: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    return false
  }
}

export const renameFile = async (oldPath: string, newPath: string): Promise<boolean> => {
  try {
    // Check if file already exists at the new path
    const fileExists = await stat(newPath).catch(() => false)
    if (fileExists) {
      return false // Return false to indicate duplicate file
    }

    // Ensure the directory exists
    await ensureDir(path.dirname(newPath))

    // Read the content of the old file
    const content = await readFile(oldPath, { encoding: fileEncoding })

    // Create the new file with the same content
    await writeFile(newPath, content, { encoding: fileEncoding })

    // Delete the old file
    await remove(oldPath)

    console.info(`Renamed file from ${oldPath} to ${newPath}`)
    return true
  } catch (error) {
    console.error('Error renaming file:', error)
    await dialog.showMessageBox({
      type: 'error',
      title: 'Rename failed',
      message: `Failed to rename file: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
    return false
  }
}
