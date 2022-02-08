import {
	Box,
	IconButton,
	LinearProgress,
	TableCell,
	TableRow,
} from '@material-ui/core'
import prettyBytes from 'pretty-bytes'
import { FileDataType, UserType } from '../App'
import Download from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import { FC } from 'react'

interface FileRowProps {
	file: FileDataType
	User: UserType | null
	percentComplete: number
	handleDownload: (file: FileDataType) => void
	handleDelete: (file: FileDataType) => void
}

const FileRow: FC<FileRowProps> = ({
	file,
	User,
	percentComplete,
	handleDelete,
	handleDownload,
}) => {
	return (
		<TableRow key={file.name}>
			<TableCell data-testid="files-table">{decodeURI(file.name)}</TableCell>
			<TableCell>
				{file.size > 0 ? (
					<>{prettyBytes(file.size)}</>
				) : (
					<Box maxWidth={400}>
						Uploading... {percentComplete}%
						<LinearProgress variant="determinate" value={percentComplete} />
					</Box>
				)}
			</TableCell>
			<TableCell>
				<IconButton aria-label="Download" onClick={() => handleDownload(file)}>
					<Download />
				</IconButton>
				{User?.isAdmin && (
					<IconButton aria-label="Delete" onClick={() => handleDelete(file)}>
						<Delete />
					</IconButton>
				)}
			</TableCell>
		</TableRow>
	)
}

export default FileRow
