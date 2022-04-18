import axios from 'axios'
import fileDownload from 'js-file-download'
import React, { useContext, useEffect, useState } from 'react'

export type FileData = {
	name: string
	size: number
}

export interface FileContextType {
	fileData: FileData[]
	handleDelete: (file: FileData) => void
	handleDownload: (file: FileData) => void
	percentComplete: number
	setFileInput: (file: File | null) => void
}

// istanbul ignore next
export const FileContext = React.createContext<FileContextType>({
	fileData: [],
	handleDelete: () => null,
	handleDownload: () => null,
	percentComplete: 0,
	setFileInput: () => null,
})

export const useFiles = (): FileContextType => useContext(FileContext)

export const FileProvider: React.FC = ({ children }) => {
	const [fileData, setFileData] = useState<FileData[]>([])
	const [fileInput, setFileInput] = useState<File | null>(null)
	const [percentComplete, setPercentComplete] = useState(0)

	useEffect(() => {
		updateFiles()
	}, [])

	useEffect(() => {
		fileInput && handleFileUpload(fileInput)

		return () => {
			setFileInput(null)
		}
		// eslint-disable-next-line
	}, [fileInput])

	const handleFileUpload = (newFile: File) => {
		setFileData([{ name: newFile.name, size: 0 } as FileData, ...fileData])

		let formData = new FormData()
		formData.append('file', newFile, newFile.name)

		// istanbul ignore next
		var config = {
			onUploadProgress: function (progressEvent: any) {
				var percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total,
				)
				setPercentComplete(percentCompleted)
			},
		}

		// istanbul ignore next
		axios
			.post('/api/files', formData, config)
			.then(() => updateFiles())
			.catch((_) => {
				updateFiles()
			})

		setPercentComplete(0)
	}

	const handleDelete = (file: FileData) => {
		axios
			.delete('/api/files', {
				params: {
					name: file.name,
				},
			})
			.then(() => {
				updateFiles()
			})
	}

	const handleDownload = (file: FileData) => {
		axios
			.get(`/api/files`, {
				params: {
					name: file.name,
				},
				responseType: 'blob',
			})
			.then(({ data }) => fileDownload(data, file.name))
	}

	const updateFiles = () => {
		axios.get('/api/files/list').then(({ data }) => {
			setFileData(data)
		})
	}

	return (
		<FileContext.Provider
			value={{
				fileData,
				handleDelete,
				handleDownload,
				percentComplete,
				setFileInput,
			}}
		>
			{children}
		</FileContext.Provider>
	)
}
