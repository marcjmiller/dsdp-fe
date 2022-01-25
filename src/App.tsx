import {
	Box,
	CssBaseline,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	ThemeProvider,
} from '@material-ui/core'
import Download from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import fileDownload from 'js-file-download'
import { DropzoneArea } from 'material-ui-dropzone'
import { useEffect, useState } from 'react'
import axios from 'axios'
import theme from './config/theme'

type FileData = {
	_bucket_name: string
	_object_name: string
	_size: number
}

type User = {
	name: string
	is_admin: boolean
}

function App() {
	const [fileData, setFileData] = useState<FileData[]>()
	const [User, setUser] = useState<User>({} as User)

	const getFiles = () => {
		axios.get('/api/files/list').then((result) => setFileData(result.data))
	}

	const getUser = () => {
		axios.get('/api/whoami').then((result) => setUser(result.data))
	}

	const handleFileUpload = (files: File[]) => {
		if (files.length > 0) {
			let formData = new FormData()
			files.forEach((file) => formData.append('files', file))
			axios
				.post<FileData[]>('/api/files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						accept: 'application/json',
					},
				})
				.then(() => getFiles())
		}
	}

	useEffect(() => {
		getUser()
		getFiles()
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
			.then(() => getFiles())
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
										<TableCell>{file._size} Bytes</TableCell>
										<TableCell>
											<IconButton
												aria-label="Download"
												onClick={() => handleDownload(file)}
											>
												<Download />
											</IconButton>
											{User?.is_admin && (
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
				{User?.is_admin && (
					<Box marginY={'32px'}>
						<DropzoneArea
							showPreviewsInDropzone={false}
							filesLimit={-1}
							onChange={handleFileUpload}
							inputProps={{
								//@ts-ignore
								'data-testid': 'dropzone',
							}}
						/>
					</Box>
				)}
			</Box>
		</ThemeProvider>
	)
}

export default App
