import axios from 'axios'
import fileDownload from 'js-file-download'
import { FC, useEffect, useState } from 'react'
import { FileContext, initialFileInputState } from './context'
import { FileData, FileInput } from './types'

const FilesProvider: FC = ({ children }) => {
	const [fileData, setFileData] = useState<FileData[]>([])
	const [fileInput, setFileInput] = useState<FileInput>(initialFileInputState)
	const [percentComplete, setPercentComplete] = useState(0)

	useEffect(() => {
		updateFiles()
	}, [])

	const handleFileUpload = () => {
		let formData = new FormData()

		if (fileInput.file) {
			const { file, releaseType } = fileInput
			setFileData([
				{
					name: file.name,
					size: file.size,
					metadata: { release_type: releaseType },
				} as FileData,
				...fileData,
			])
			formData.append('file', fileInput.file)
			formData.append('release_type', fileInput.releaseType)
		}

		/* istanbul ignore next */
		var config = {
			onUploadProgress: function (progressEvent: any) {
				var percentCompleted = Math.round(
					(progressEvent.loaded * 100) / progressEvent.total,
				)
				setPercentComplete(percentCompleted)
			},
		}

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

	const updateFiles = async () => {
		const { data } = await axios.get<FileData[]>('/api/files/list')
		setFileData(data)
	}

	return (
		<FileContext.Provider
			value={{
				fileInput,
				fileData,
				setFileInput,
				percentComplete,
				updateFiles,
				handleDelete,
				handleDownload,
				handleFileUpload,
			}}
		>
			{children}
		</FileContext.Provider>
	)
}

export default FilesProvider
