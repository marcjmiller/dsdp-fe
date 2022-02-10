import { render, screen } from '@testing-library/react'
import { UserContext, User } from '../context/useUser'
import { FileContext, FileData } from '../context/useFiles'
import FileTable from './FileTable'

console.error = jest.fn()

const handleDelete = jest.fn()
const handleDownload = jest.fn()
const percentComplete = 0
const setFileInput = jest.fn()
const fileData: FileData[] = [
	{
		name: 'hello1.png',
		size: 12345,
	},
	{
		name: 'hello2.png',
		size: 123456,
	},
]

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
				<FileTable />
			</FileContext.Provider>
		</UserContext.Provider>,
	)
}

describe('FileTable tests', () => {
	it('Should render multiple rows for multiple files', async () => {
		renderFileRow()
		const deleteButtons = screen.getAllByLabelText(/delete/i)
		const downloadButtons = screen.getAllByLabelText(/download/i)

		expect(screen.getByText(/hello1.png/i)).toBeInTheDocument()
		expect(screen.getByText(/hello2.png/i)).toBeInTheDocument()

		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getByText(/123 kB/i)).toBeInTheDocument()

		downloadButtons.forEach((button) => {
			expect(button).toBeInTheDocument()
		})
		expect(downloadButtons.length).toBe(2)

		expect(deleteButtons.length).toBe(2)

		deleteButtons.forEach((button) => {
			expect(button).toBeInTheDocument()
		})
	})

	it('Should render options for non-Admins', () => {
		renderFileRow(false)

		expect(screen.getByText(/hello1.png/i)).toBeInTheDocument()
		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getAllByLabelText(/download/i).length).toBe(2)
		expect(screen.queryByLabelText(/delete/i)).toBeNull()
	})
})
