import {
	Box,
	CssBaseline,
	IconButton,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ThemeProvider,
	Typography,
} from '@material-ui/core'
import Download from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import fileDownload from 'js-file-download'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import theme from './config/theme'
import prettyBytes from 'pretty-bytes'

type FileData = {
	_bucket_name: string
	_object_name: string
	_size: number
}

type User = {
	name: string
	isAdmin: boolean
}

const getFiles = () => {
	return axios.get('/api/files/list').then((result) => result.data)
}

const getUser = () => {
	return axios.get('/api/whoami').then((result) => result.data)
}

function App() {
	const [fileData, setFileData] = useState<FileData[]>([])
	const [User, setUser] = useState<User>()
	const [percentComplete, setPercentComplete] = useState(0)

	const handleFileUpload = (files: FileList) => {
		if (files.length > 0) {
			setFileData([
				...fileData,
				{ _bucket_name: '', _object_name: files[0].name, _size: 0 } as FileData,
			])
			let formData = new FormData()
			formData.append('files', files[0])

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
				.then(() => getFiles().then((data) => setFileData(data)))
				.catch((err) => {
					console.log(err)
					getFiles().then((data) => setFileData(data))
				})
			setPercentComplete(0)
		}
	}

	useEffect(() => {
		getUser().then((userData) => setUser(userData))
		getFiles().then((fileData) => setFileData(fileData))
	}, [])

	const handleDownload = (file: FileData) => {
		axios
			.get(`/api/files`, {
				params: {
					name: file._object_name,
				},
				responseType: 'blob',
			})
			.then((response) => fileDownload(response.data, file._object_name))
	}

	const handleDelete = (file: FileData) => {
		axios
			.delete('/api/files', {
				params: {
					name: file._object_name,
				},
			})
			.then(() => getFiles().then((data) => setFileData(data)))
	}

	const ref = useRef()
	const fileInputClicked = () => {
		//@ts-ignore
		ref.current?.click()
	}

	const dragOver = (e: any) => {
		e.preventDefault()
	}

	const dragEnter = (e: any) => {
		e.preventDefault()
	}

	const dragLeave = (e: any) => {
		e.preventDefault()
	}

	const fileDrop = (e: any) => {
		e.preventDefault()
		const files = e.dataTransfer.files
		handleFileUpload(files)
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box px={5} display="flex" flexDirection="column">
				<img
					alt="DEVCOM Logo"
					src="DEVCOM.png"
					data-testid="logo"
					height={100}
					width={100}
				/>
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Name: </TableCell>
								<TableCell>Size: </TableCell>
								<TableCell>Actions: </TableCell>
							</TableRow>
						</TableHead>
						<TableBody data-testid="files-list">
							{fileData &&
								fileData.map((file) => (
									<TableRow>
										<TableCell data-testid="files-table">
											{decodeURI(file._object_name)}
										</TableCell>
										<TableCell >
											{file._size > 0 ? (
												<>{prettyBytes(file._size)}</>
											) : (
												<Box maxWidth={400}>
													Uploading... {percentComplete}%{' '}
													<LinearProgress
														variant="determinate"
														value={percentComplete}
													/>
												</Box>
											)}
										</TableCell>
										<TableCell>
											<IconButton
												aria-label="Download"
												onClick={() => handleDownload(file)}
											>
												<Download />
											</IconButton>
											{User?.isAdmin && (
												<IconButton
													aria-label="Delete"
													onClick={() => handleDelete(file)}
												>
													<Delete />
												</IconButton>
											)}
										</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</TableContainer>
				{User?.isAdmin && (
					<Box
						marginY={'32px'}
						padding={16}
						height={64}
						width={'100%'}
						onClick={fileInputClicked}
						sx={{ border: '2px dashed gray' }}
						borderRadius={'8px'}
						onDrop={fileDrop}
						onDragOver={dragOver}
						onDragEnter={dragEnter}
						onDragLeave={dragLeave}
					>
						<Typography>
							Drag and drop a file here or click to upload a file.
						</Typography>
						<input
							//@ts-ignore
							ref={ref}
							type="file"
							hidden
							onChange={({ target: { files } }) => {
								files !== null && handleFileUpload(files)
							}}
						/>
					</Box>
				)}
			</Box>
		</ThemeProvider>
	)
}

export default App
