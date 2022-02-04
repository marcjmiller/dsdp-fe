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
import Logo from './Logo'

type FileData = {
	name: string
	size: number
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
	const [file, setFile] = useState<File | null>(null)
	const [User, setUser] = useState<User>()
	const [percentComplete, setPercentComplete] = useState(0)

	const handleFileUpload = (newFile: File) => {
		if (fileData) {
			setFileData([...fileData, { name: newFile.name, size: 0 } as FileData])
		} else {
			setFileData([{ name: newFile.name, size: 0 } as FileData])
		}

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
		file && handleFileUpload(file)

		return () => {
			setFile(null)
		}
	}, [file])

	useEffect(() => {
		getUser().then((userData) => setUser(userData))
		getFiles().then((newFileData) => newFileData && setFileData(newFileData))
	}, [])

	const handleDownload = (file: FileData) => {
		axios
			.get(`/api/files`, {
				params: {
					name: file.name,
				},
				responseType: 'blob',
			})
			.then((response) => fileDownload(response.data, file.name))
	}

	const handleDelete = (file: FileData) => {
		axios
			.delete('/api/files', {
				params: {
					name: file.name,
				},
			})
			.then(() => getFiles().then((data) => data && setFileData(data)))
	}

	const ref = useRef()
	const fileInputClicked = () => {
		//@ts-ignore
		ref.current?.click()
	}

	// istanbul ignore next
	const preventDefault = (e: any) => {
		e.preventDefault()
	}

	// istanbul ignore next
	const fileDrop = (e: any) => {
		e.preventDefault()
		const files = e.dataTransfer.files
		setFile(files[0])
	}

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box px={5} display="flex" flexDirection="column">
				<Logo height={210} width={297} />
				<TableContainer>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>
									<Typography color="secondary">Name:</Typography>
								</TableCell>
								<TableCell>
									<Typography color="secondary">Size:</Typography>
								</TableCell>
								<TableCell>
									<Typography color="secondary">Actions:</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody data-testid="files-list">
							{fileData &&
								fileData.map((file) => (
									<TableRow key={file.name}>
										<TableCell data-testid="files-table">
											{decodeURI(file.name)}
										</TableCell>
										<TableCell>
											{file.size > 0 ? (
												<>{prettyBytes(file.size)}</>
											) : (
												<Box maxWidth={400}>
													Uploading... {percentComplete}%
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
						data-testid="fileuploadbox"
						marginY={'32px'}
						display={'flex'}
						flexDirection={'column'}
						justifyContent={'space-around'}
						alignItems={'center'}
						padding={16}
						color={'gray'}
						width={'100%'}
						onClick={fileInputClicked}
						sx={{ border: '2px dashed #E7E247' }}
						borderRadius={'8px'}
						onDrop={fileDrop}
						onDragOver={preventDefault}
						onDragEnter={preventDefault}
						onDragLeave={preventDefault}
					>
						<Typography variant={'h4'} color="secondary">
							Drag and drop a file here or click to upload a file.
						</Typography>
						<input
							data-testid="fileupload"
							//@ts-ignore
							ref={ref}
							type="file"
							hidden
							onChange={({ target: { files } }) => {
								files && setFile(files[0])
							}}
						/>
					</Box>
				)}
			</Box>
		</ThemeProvider>
	)
}

export default App
