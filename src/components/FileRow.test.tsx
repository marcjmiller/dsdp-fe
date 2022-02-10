import { render, screen } from '@testing-library/react'
import { UserContext, User } from '../context/useUser'
import { FileContext, FileData } from '../context/useFiles'
import FileRow from './FileRow'

console.error = jest.fn()

const handleDelete = jest.fn()
const handleDownload = jest.fn()
const percentComplete = 0
const setFileInput = jest.fn()
const fileData: FileData[] = []
const file: FileData = {
	name: 'hello.png',
	size: 12345,
}

const renderFileRow = (isAdmin: boolean = true) => {
	let user: User = { name: 'none', isAdmin }

	render(
		<UserContext.Provider value={{ user }}>
			<FileContext.Provider
				value={{
					handleDelete,
					handleDownload,
					percentComplete,
					setFileInput,
					fileData,
				}}
			>
				<FileRow file={file} />
			</FileContext.Provider>
		</UserContext.Provider>,
	)
}

describe('FileRow tests', () => {
	it('Should render options for Admins', async () => {
		renderFileRow()
		const deleteButton = screen.getByLabelText(/delete/i)

		expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
		expect(deleteButton).toBeInTheDocument()
	})

	it('Should call handleDownload when download button is clicked', () => {
		renderFileRow()
		const downloadButton = screen.getByLabelText(/download/i)
		downloadButton.click()
		expect(handleDownload).toHaveBeenCalled()
	})

	it('Should call handleDelete when delete button is clicked', () => {
		renderFileRow()
		const deleteButton = screen.getByLabelText(/delete/i)
		deleteButton.click()
		expect(handleDelete).toHaveBeenCalled()
	})

	it('Should render options for non-Admins', () => {
		renderFileRow(false)

		expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
		expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
	})
})
