import { Box, Typography } from '@material-ui/core'
import React, { FC, useRef } from 'react'

interface DropZoneProps {
	setFileInput: React.Dispatch<React.SetStateAction<File | null>>
}

const DropZone: FC<DropZoneProps> = ({ setFileInput }) => {
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
