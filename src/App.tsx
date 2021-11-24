import { DropzoneArea } from 'material-ui-dropzone'
import { useEffect, useState } from 'react'
import './App.css'
import { API } from './config/axios'

type FileData = {
	_bucket_name: string
	_object_name: string
	_size: number
}

function App() {
	const [fileData, setFileData] = useState<FileData[]>()

	const handleFileUpload = (files: File[]) => {
		if (files.length > 0) {
			let formData = new FormData()
			files.forEach((file) => formData.append('files', file))
			API.post<FileData[]>('/files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					accept: 'application/json',
				},
			})
				.then((result) => setFileData([...result.data]))
				.catch(() => {})
		}
	} 
	useEffect(() => {
		API
		.get("/files")
		.then(result => setFileData([...result.data]))
	}, [])

	return (
		<div className="App" key="App">
			<DropzoneArea
				showFileNames
				onChange={handleFileUpload}
				inputProps={{
					//@ts-ignore
					'data-testid': 'dropzone',
				}}
			/>
			{fileData &&
				fileData.map((file) => (
					<>
					<div data-testid="files-table" key={file._object_name}>
						{file._object_name}
					</div>
					
					<div key={file._size}>
						{`${file._size} Bytes`}
					</div>
					</>
				))}
		</div>
	)
}

export default App
