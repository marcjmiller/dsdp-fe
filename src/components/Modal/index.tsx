import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from '@mui/material'
import { ChangeEvent, FC, useState } from 'react'
import { useFiles } from '../../context/Files/context'
import { releaseTypes } from '../../context/Files/types'
import { useUser } from '../../context/User/context'
import DropZone from '../Dropzone'

interface FileInputProps {}
const FileInputModal: FC<FileInputProps> = () => {
	const { user } = useUser()
	const { handleFileUpload, setFileInput, fileInput } = useFiles()
	const [open, setOpen] = useState(false)

	const handleClickOpen = () => setOpen(true)

	const handleClose = () => setOpen(false)

	const handleSubmit = () => {
		handleClose()
		handleFileUpload()
		setFileInput({ file: null, releaseType: '' })
	}

	const handleChange = ({
		target: { value },
	}: ChangeEvent<HTMLInputElement>) => {
		setFileInput({ ...fileInput, releaseType: value })
	}
	if (!user?.isAdmin) {
		return <></>
	}
	return (
		<>
			<Button data-testid="upload-file" onClick={handleClickOpen}>
				Upload File
			</Button>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Upload a New File</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						label="Release Type"
						select
						SelectProps={{
							inputProps: {
								'data-testid': 'release-type',
							},
						}}
						value={fileInput.releaseType}
						onChange={handleChange}
					>
						{releaseTypes.map((type) => (
							<MenuItem key={type} value={type}>
								{type}
							</MenuItem>
						))}
					</TextField>
					<DropZone />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleSubmit}>Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default FileInputModal
