import { FileData } from '../../context/Files/types'

export const newAdminUser = (name = 'Admin', isAdmin = false) => ({
	name,
	isAdmin,
})

export const newFileData = (
	name = 'test.txt',
	size = 12345,
	metadata = { release_type: 'Out of Cycle' },
): FileData => ({ name, size, metadata })

export const newFileDataList = (
	extraFiles?: FileData[],
	initialFiles: FileData[] = [newFileData()],
): FileData[] => {
	if (!extraFiles) {
		return [...initialFiles]
	}
	return [...initialFiles, ...extraFiles]
}

export const emptyFileDataList = (): FileData[] => []
