import React, { Dispatch, SetStateAction, useContext } from 'react'
import { FileData, FileInput } from './types'

export interface FileContextType {
	fileData: FileData[]
	fileInput: FileInput
	setFileInput: Dispatch<SetStateAction<FileInput>>
	percentComplete: number
	updateFiles: () => void
	handleDelete: (file: FileData) => void
	handleDownload: (file: FileData) => void
	handleFileUpload: () => void
}

const initialFileInputState = {
	file: null,
	releaseType: '',
}

const initialFileContext: FileContextType = {
	fileData: [],
	fileInput: initialFileInputState,
	setFileInput: () => null,
	percentComplete: 0,
	updateFiles: () => null,
	handleDelete: () => null,
	handleDownload: () => null,
	handleFileUpload: () => null,
}

const useFiles = (): FileContextType => useContext(FileContext)

const FileContext = React.createContext<FileContextType>(initialFileContext)
export { FileContext, initialFileInputState, useFiles }
