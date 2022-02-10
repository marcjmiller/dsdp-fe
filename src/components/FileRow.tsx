import {
	Box,
	IconButton,
	LinearProgress,
	TableCell,
	TableRow,
} from '@material-ui/core'
import Download from '@material-ui/icons/CloudDownload'
import Delete from '@material-ui/icons/Delete'
import prettyBytes from 'pretty-bytes'
import { FC } from 'react'
import { useFiles, FileData } from '../context/useFiles'
import { useUser } from '../context/useUser'

interface FileRowProps {
	file: FileData
}

const FileRow: FC<FileRowProps> = ({ file }) => {
	const { handleDelete, handleDownload, percentComplete } = useFiles()
	const { user } = useUser()

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
				{user?.isAdmin && (
					<IconButton aria-label="Delete" onClick={() => handleDelete(file)}>
						<Delete />
					</IconButton>
				)}
			</TableCell>
		</TableRow>
	)
}

export default FileRow
