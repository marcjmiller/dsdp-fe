import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { randomString } from '../App.test'
import DropZone from './DropZone'

describe('DropZone tests', () => {
	const setFileInputMock = jest.fn()

	beforeEach(() => {
		render(<DropZone setFileInput={setFileInputMock} />)
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

		expect(setFileInputMock).not.toHaveBeenCalled()

		userEvent.upload(input, files)

		expect(setFileInputMock).toHaveBeenCalled()
		expect(setFileInputMock).toHaveBeenCalledTimes(1)
		expect(setFileInputMock).toHaveBeenCalledWith(file)
	})
})
