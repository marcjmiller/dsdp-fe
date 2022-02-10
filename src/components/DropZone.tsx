import { Box, Typography } from '@material-ui/core'
import { useRef } from 'react'
import { useFiles } from '../context/useFiles'
import { useUser } from '../context/useUser'

const DropZone = () => {
	const { setFileInput } = useFiles()
	const { user } = useUser()
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
		setFileInput(files[0])
	}

	if (!user?.isAdmin) {
		return <></>
	}
	return (
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
					files && setFileInput(files[0])
				}}
			/>
		</Box>
	)
}

export default DropZone
