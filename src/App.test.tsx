import { render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import axios from 'jest-mock-axios'
import App from './App'
// import { window } from './__mocks__/window'

// jest.mock("./__mocks__/window")

// Removes the `not wrapped in act()` error messages, as well as all others (oops)
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


	beforeEach(async () => {
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
			data: [{ _bucket_name: 'bucket', _object_name: filename, _size: 10 }],
		})

		render(<App />)
		dropzone = screen.getByTestId(/dropzone/i)
	})

	afterEach(() => {
		axios.reset()
		file = new File([new Blob([''])], '')
		formData = new FormData()
	})

	it('renders upload', () => {
		const uploadElement = screen.getByText(
			/drag and drop a file here or click/i,
		)
		expect(uploadElement).toBeInTheDocument()
	})

	it('uploads a file', async () => {
		user.upload(dropzone, file)

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith('/files', formData, {
				headers
			}),
		)
	})

	it('should load the files that have previously been uploaded to minio', async () => {
		user.upload(dropzone, file)

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith('/files', formData, {
				headers
			}),
		)

		const filesElement = screen.getByTestId('files-table')
		expect(filesElement).toBeInTheDocument()
		expect(filesElement.innerHTML).toBe(filename)
	})

	it('should show the size of previously uploaded files', async () => {
		user.upload(dropzone, file)

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith('/files', formData, {
				headers
			}),
		)

		const filesElement = screen.getByTestId('files-table')
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

	it('should have an element that can hold a logo', async () => {
		const logoElement = screen.getByTestId('logo')

		await waitFor(() => {
			expect(logoElement).toBeInTheDocument()
		})
	})

	describe('download', () => {
		global.URL.createObjectURL = jest.fn()

		it('renders a download button', async () => {
			const downloadButton = screen.getByLabelText('Download')

			expect(downloadButton).toBeInTheDocument()
		})

		it('calls the backend when the Download button is clicked', async () => {
			const downloadButton = screen.getByLabelText('Download')

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
