import { Box, List, ListItem, ListItemText, Typography } from '@mui/material'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useFiles } from '../../context/Files/context'

const DropZone = () => {
	const { setFileInput, fileInput } = useFiles()
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setFileInput({
				releaseType: fileInput.releaseType,
				file: acceptedFiles[0],
			})
		},
		[setFileInput, fileInput],
	)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

	return (
		<>
			<Box
				data-testid={'dropzone'}
				marginY={'32px'}
				display={'flex'}
				flexDirection={'column'}
				justifyContent={'space-around'}
				alignItems={'center'}
				padding={16}
				width={'100%'}
				sx={{ border: '2px dashed #E7E247' }}
				borderRadius="8px"
				{...getRootProps()}
			>
				<input {...getInputProps()} data-testid="file-upload" />
				{isDragActive ? (
					<Typography variant={'h4'} color="secondary">
						Drop the files here...
					</Typography>
				) : (
					<Typography variant={'h4'} color="secondary">
						Drag 'n' drop or click to upload a file.
					</Typography>
				)}
			</Box>
			<List>
				{fileInput.file && (
					<ListItem key={fileInput.file.name}>
						<ListItemText primary={fileInput.file.name} />
					</ListItem>
				)}
			</List>
		</>
	)
}

export default DropZone
