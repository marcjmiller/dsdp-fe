import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { randomString } from '../App.test'
import { UserContext, User } from '../context/useUser'
import { FileContext, FileData } from '../context/useFiles'

import DropZone from './DropZone'

const handleDelete = jest.fn()
const handleDownload = jest.fn()
const percentComplete = 0
const setFileInput = jest.fn()
const fileData: FileData[] = []

const renderDropzone = (isAdmin: boolean = true) => {
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
				<DropZone />
			</FileContext.Provider>
		</UserContext.Provider>,
	)
}

describe('DropZone tests', () => {
	describe('Admin Dropzone', () => {
		beforeEach(() => {
			renderDropzone()
		})

		afterEach(() => {
			jest.resetAllMocks()
		})

		it('should render drop text', () => {
			const dropzoneText = screen.getByText(
				/drag and drop a file here or click to upload a file./i,
			)
			expect(dropzoneText).toBeInTheDocument()
		})

		it('should render the dropzone box', () => {
			const boxElement = screen.getByTestId('fileuploadbox')
			expect(boxElement).toBeInTheDocument()
		})

		it('should respond to input changes', () => {
			let file: File
			let filename = `${randomString(6)}.json`

			const str = JSON.stringify('boo')
			const blob = new Blob([str])
			file = new File([blob], filename, { type: 'application/JSON' })
			const files = [file]

			const input = screen.getByTestId('fileupload')

			expect(setFileInput).not.toHaveBeenCalled()

			userEvent.upload(input, files)

			expect(setFileInput).toHaveBeenCalled()
			expect(setFileInput).toHaveBeenCalledTimes(1)
			expect(setFileInput).toHaveBeenCalledWith(file)
		})
	})

	describe('Non-Admin Dropzone', () => {
		beforeEach(() => {
			renderDropzone(false)
		})

		it('should not render the dropzone when user is not an admin', () => {
			const dropzoneText = screen.queryByText(
				/drag and drop a file here or click to upload a file./i,
			)
			expect(dropzoneText).toBeNull()
		})
	})
})
