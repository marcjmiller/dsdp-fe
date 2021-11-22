import axios from 'axios'
import { DropzoneArea } from 'material-ui-dropzone'
import './App.css'

function App() {
	const handleFileUpload = async (files: File[]) => {
		let formData = new FormData()
		files.forEach((file) => formData.append('files', file))
		axios.post('http://localhost:8080/api/files', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}
	return (
		<div className='App'>
			<DropzoneArea showFileNames onChange={handleFileUpload} />
		</div>
	)
}

export default App
