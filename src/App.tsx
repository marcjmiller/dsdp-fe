import React from 'react'
import { DropzoneArea } from 'material-ui-dropzone'
import { useEffect, useState } from 'react'
import './App.css'
import API from './config/axios'
import fileDownload from 'js-file-download'

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
				.catch(() => { })
		}
	}
	useEffect(() => {
		API
			.get("/files/list")
			.then(result => setFileData([...result.data])).catch((err) => {console.log(err)})
	}, [])

	const handleDownload = (file: FileData) => {
		API
			.get(`/files`, {
				params: {
					name: file._object_name
				},
				responseType: 'blob'
			})
			.then(response => fileDownload(response.data, file._object_name))
	}

	return (
		<div className="App" key="App">
      <img alt="DEVCOM Logo" src="DEVCOM.png" data-testid="logo" />
			<DropzoneArea
				showFileNames
				onChange={handleFileUpload}
				inputProps={{
					//@ts-ignore
					'data-testid': 'dropzone',
				}}
			/>
			{fileData &&
				fileData.map((file, index) => (
					<React.Fragment key={index}>
						<div data-testid="files-table" key={file._object_name}>
							{file._object_name}
						</div>

						<div key={file._size}>
							{`${file._size} Bytes`}
						</div>
						<button aria-label="Download" onClick={() => handleDownload(file)}>Download</button>

					</React.Fragment>
				))}
		</div>
	)
}

export default App
