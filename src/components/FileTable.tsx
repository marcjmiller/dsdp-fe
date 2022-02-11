import { TableBody } from '@material-ui/core'
import { useFiles } from '../context/useFiles'
import FileRow from './FileRow'

const FileTable = () => {
	const { fileData } = useFiles()

	return (
		<TableBody data-testid="files-list">
			{fileData.length > 0 &&
				fileData.map((file) => <FileRow key={file.name} file={file} />)}
		</TableBody>
	)
}

export default FileTable
