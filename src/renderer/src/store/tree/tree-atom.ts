import { atom, useSetAtom } from 'jotai'
import { NoteInfo } from '@shared/models'

export interface TreeNode {
  id: string
  type: 'file' | 'folder'
  name: string
  path?: string
  files?: TreeNode[]
}

export const treeDataAtom = atom<TreeNode[]>([])

export interface SelectedFile extends NoteInfo {
  content: string
}

export const selectedFileAtom = atom<SelectedFile | null>(null)

// New: File stats global state
export interface FileStats {
  fileName: string
  wordCount: number
  charCount: number
}

export type FileStatsMap = Record<string, FileStats>

export const fileStatsAtom = atom<FileStatsMap>({})

// New atom to track active node
export const activeNodeIdAtom = atom<string | null>(null)

// Atom for storing the last opened file path
export const lastOpenedFileAtom = atom<string | null>(null)

// Function to save last opened file path to localStorage
export const saveLastOpenedFile = (filePath: string | null): void => {
  if (filePath) {
    localStorage.setItem('lastOpenedFile', filePath)
  } else {
    localStorage.removeItem('lastOpenedFile')
  }
}

// Function to load last opened file path from localStorage
export const loadLastOpenedFile = (): string | null => {
  return localStorage.getItem('lastOpenedFile')
}

// Hook to initialize tree data
export const useInitializeTreeData = (): (() => Promise<void>) => {
  const setTreeData = useSetAtom(treeDataAtom)

  const initializeTreeData = async (): Promise<void> => {
    try {
      const data = await window.api.readDirectoryStructure()
      setTreeData(data as TreeNode[])
    } catch (error) {
      console.error('Error initializing tree data:', error)
    }
  }

  return initializeTreeData
}
