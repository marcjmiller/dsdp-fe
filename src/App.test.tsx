import { render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import axios from 'jest-mock-axios'
import App from './App'

console.error = jest.fn()

const headers = {
	'Content-Type': 'multipart/form-data',
	accept: 'application/json',
}

describe('App', () => {
	let filename: string
	let formData: FormData = new FormData()
	let file: File
	let filesize: string
	let dropzone: HTMLElement

	beforeEach(() => {
		filename = `${randomString(6)}.json`

		const str = JSON.stringify('boo')
		const blob = new Blob([str])
		file = new File([blob], filename, { type: 'application/JSON' })
		filesize = `${file.size} Bytes`

		formData.append('files', file)

		axios.post.mockResolvedValueOnce({
			data: [
				{ _bucket_name: 'bucket', _object_name: filename, _size: file.size },
			],
		})

		axios.get.mockResolvedValue({
			data: [
				{ _bucket_name: 'bucket', _object_name: filename, _size: file.size },
			],
		})

		render(<App />)
		dropzone = screen.getByTestId(/dropzone/i)
	})

	afterEach(() => {
		axios.reset()
		file = new File([new Blob([''])], '')
		formData = new FormData()
	})

	it('should have an element that can hold a logo', async () => {
		const logoElement = screen.getByTestId('logo')

		expect(logoElement).toBeInTheDocument()
	})

	describe('Upload', () => {
		let filesElement: HTMLElement

		beforeEach(() => {
			filesElement = screen.getByTestId('files-table')
		})

		it('renders upload', () => {
			expect(dropzone).toBeInTheDocument()
		})

		it('uploads a file', async () => {
			user.upload(dropzone, file)

			await waitFor(() =>
				expect(axios.post).toHaveBeenCalledWith('/files', formData, {
					headers,
				}),
			)
		})

		it('should show the size of previously uploaded files', async () => {
			expect(filesElement).toBeInTheDocument()
			expect(filesElement.innerHTML).toBe(filename)
			screen.getByText(filesize)
		})

		it('should show all the historic files that have been uploaded', async () => {
			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled()
				expect(axios.get).toHaveBeenCalledWith('/files/list')
			})
		})
	})

	describe('Delete', () => {
		let deleteButton: HTMLElement

		beforeEach(() => {
			deleteButton = screen.getByLabelText('Delete')

			axios.delete.mockResolvedValue({})
		})

		it('should render the delete button', async () => {
			expect(deleteButton).toBeInTheDocument()
		})

		it('should call the backend when the Delete button is pressed', async () => {
			user.click(deleteButton)
			await waitFor(() => {
				expect(axios.delete).toHaveBeenCalledWith('/files', {
					params: { name: filename },
				})
			})
		})

		it('should update the list of files', async () => {
			const filesList = screen.getByTestId('files-list')

			await waitFor(() => {
				expect(axios.get).toHaveBeenCalled()
				expect(filesList).not.toContain(screen.getByText(filename))
			})
		})
	})

	describe('Download', () => {
		global.URL.createObjectURL = jest.fn()
		let downloadButton: HTMLElement

		beforeEach(() => {
			downloadButton = screen.getByLabelText('Download')
		})

		it('renders a download button', async () => {
			expect(downloadButton).toBeInTheDocument()
		})

		it('calls the backend when the Download button is clicked', async () => {
			user.click(downloadButton)
			await waitFor(() => {
				expect(axios.get).toHaveBeenCalledWith('/files/list')
				expect(axios.get).toHaveBeenCalledWith('/files', {
					params: { name: filename },
					responseType: 'blob',
				})
			})
		})
	})
})

const randomString = (length: number) => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}
