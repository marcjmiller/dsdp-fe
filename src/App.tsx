import { Box, Table, TableBody, TableContainer } from '@material-ui/core'
import axios from 'axios'
import fileDownload from 'js-file-download'
import { useEffect, useState } from 'react'
import DropZone from './components/DropZone'
import FileRow from './components/FileRow'
import TableHeader from './components/TableHeader'
import Logo from './Logo'

export type FileDataType = {
	name: string
	size: number
}

export type UserType = {
	name: string
	isAdmin: boolean
}

const getFiles = () => {
	return axios.get('/api/files/list').then((result) => result.data)
}

const getUser = () => {
	return axios.get('/api/whoami').then((result) => result.data)
}

const App = () => {
	const [fileData, setFileData] = useState<FileDataType[]>([])
	const [fileInput, setFileInput] = useState<File | null>(null)
	const [User, setUser] = useState<UserType | null>(null)
	const [percentComplete, setPercentComplete] = useState(0)

	const handleFileUpload = (newFile: File) => {
		setFileData([{ name: newFile.name, size: 0 } as FileDataType, ...fileData])

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

		axios
			.post('/api/files', formData, config)
			.then(() => getFiles().then((data) => data && setFileData(data)))
			.catch((err) => {
				console.error(err)
				getFiles().then((data) => data && setFileData(data))
			})
		setPercentComplete(0)
	}

	useEffect(() => {
		fileInput && handleFileUpload(fileInput)

		return () => {
			setFileInput(null)
		}
	}, [fileInput])

	useEffect(() => {
		getUser().then((userData) => setUser(userData))
		getFiles().then((newFileData) => newFileData && setFileData(newFileData))
	}, [])

	const handleDownload = (file: FileDataType) => {
		axios
			.get(`/api/files`, {
				params: {
					name: file.name,
				},
				responseType: 'blob',
			})
			.then((response) => fileDownload(response.data, file.name))
	}

	const handleDelete = (file: FileDataType) => {
		axios
			.delete('/api/files', {
				params: {
					name: file.name,
				},
			})
			.then(() => getFiles().then((data) => data && setFileData(data)))
	}

	return (
		<Box px={5} display="flex" flexDirection="column">
			<Logo height={210} width={297} />
			<TableContainer>
				<Table size="small">
					<TableHeader />
					<TableBody data-testid="files-list">
						{fileData &&
							fileData.map((file) => (
								<FileRow
									key={file.name}
									file={file}
									User={User}
									handleDelete={handleDelete}
									handleDownload={handleDownload}
									percentComplete={percentComplete}
								/>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			{User?.isAdmin && <DropZone setFileInput={setFileInput} />}
		</Box>
	)
}

export default App
