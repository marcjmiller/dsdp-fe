import { FileData, Metadata } from '../../context/Files/types'

export const newAdminUser = (name = 'Admin', isAdmin = false) => ({
	name,
	isAdmin,
})

export const newFileData = (
	name = 'test.txt',
	size = 12345,
	metadata?: Metadata,
): FileData => {
	if (!metadata) {
		return { name, size }
	}
	return { name, size, metadata }
}

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
