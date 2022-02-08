import { render, screen } from '@testing-library/react'
import { FileData, User } from '../App'
import FileRow from './FileRow'

console.error = jest.fn()

describe('FileRow tests', () => {
	const file: FileData = {
		name: 'hello.png',
		size: 12345,
	}

	const adminUser: User = {
		name: 'Ethan',
		isAdmin: true,
	}

	const regularUser: User = {
		name: 'Marc',
		isAdmin: false,
	}

	const handleDeleteMock = jest.fn()
	const handleDownloadMock = jest.fn()

	it('Should render options for Admins', () => {
		render(
			<FileRow
				file={file}
				User={adminUser}
				percentComplete={0}
				handleDelete={handleDeleteMock}
				handleDownload={handleDownloadMock}
			/>,
		)

		expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/delete/i)).toBeInTheDocument()
	})

	it('Should render options for non-Admins', () => {
		render(
			<FileRow
				file={file}
				User={regularUser}
				percentComplete={0}
				handleDelete={handleDeleteMock}
				handleDownload={handleDownloadMock}
			/>,
		)

		expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
		expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
		expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
	})
})
