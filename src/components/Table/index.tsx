import { Delete, Download } from '@mui/icons-material'
import {
	Box,
	IconButton,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
} from '@mui/material'
import prettyBytes from 'pretty-bytes'
import { FC, ReactElement } from 'react'
import { useFiles } from '../../context/Files/context'
import { useUser } from '../../context/User/context'

interface FilesTableProps {
	header: ReactElement
}

const FilesTable: FC<FilesTableProps> = ({ header }) => {
	const { user } = useUser()
	const { fileData, percentComplete, handleDownload, handleDelete } = useFiles()

	return (
		<TableContainer sx={{ height: '100%' }}>
			<Table size="small">
				{header}
				<TableBody data-testid="files-list">
					{fileData &&
						fileData.map((file) => (
							<TableRow key={file.name}>
								<TableCell data-testid="files-table">
									{decodeURI(file.name)}
								</TableCell>
								{file.metadata && file.metadata.release_type ? (
									<TableCell>{file.metadata.release_type}</TableCell>
								) : (
									<TableCell></TableCell>
								)}
								<TableCell>
									{file.size > 0 ? (
										<>{prettyBytes(file.size)}</>
									) : (
										<Box maxWidth={400}>
											Uploading... {percentComplete}%
											<LinearProgress
												variant="determinate"
												value={percentComplete}
											/>
										</Box>
									)}
								</TableCell>
								<TableCell>
									<IconButton
										aria-label="Download"
										onClick={() => handleDownload(file)}
										size="large"
									>
										<Download />
									</IconButton>
									{user?.isAdmin && (
										<IconButton
											aria-label="Delete"
											onClick={() => handleDelete(file)}
											size="large"
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
	)
}

export default FilesTable
