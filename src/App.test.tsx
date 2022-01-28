import { cleanup, render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import App from './App'
import mockAxios from './__mocks__/axios'

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

		mockAxios.post.mockResolvedValueOnce({
			data: [
				{ _bucket_name: 'bucket', _object_name: filename, _size: file.size },
			],
		})

		mockAxios.get
			.mockResolvedValueOnce({
				data: {
					name: 'Marc Miller',
					isAdmin: true,
				},
			})
			.mockResolvedValue({
				data: [
					{
						_bucket_name: 'bucket',
						_object_name: filename,
						_size: file.size,
					},
				],
			})

		mockAxios.delete.mockResolvedValue({})

		render(<App />)
	})

	afterEach(() => {
		mockAxios.reset()
		cleanup()
		file = new File([new Blob([''])], '')
		formData = new FormData()
	})

	it('should have an element that can hold a logo', () => {
		const logoElement = screen.getByTestId('logo')

		expect(logoElement).toBeInTheDocument()
	})

	describe('Upload', () => {
		let filesElement: HTMLElement

		beforeEach(() => {
			filesElement = screen.getByTestId('files-table')
		})

		it('renders upload', async () => {
			// dropzone = screen.getByTestId(/dropzone/i)
			expect(await screen.findByTestId(/dropzone/i)).toBeInTheDocument()
		})

		it('uploads a file', async () => {
			dropzone = screen.getByTestId(/dropzone/i)

			user.upload(dropzone, file)

			await waitFor(() =>
				expect(mockAxios.post).toHaveBeenCalledWith('/api/files', formData, {
					headers,
				}),
			)

			expect(screen.getByText(filename)).toBeInTheDocument()
		})

		it('should show the size of previously uploaded files', async () => {
			expect(filesElement).toBeInTheDocument()
			expect(filesElement.innerHTML).toBe(filename)
			screen.getByText(filesize)
		})

		it('should show all the historic files that have been uploaded', async () => {
			await waitFor(() => {
				expect(mockAxios.get).toHaveBeenCalled()
				expect(mockAxios.get).toHaveBeenCalledWith('/api/files/list')
			})
		})
	})

	describe('Delete', () => {
		let deleteButton: HTMLElement

		it('should render the delete button', async () => {
			deleteButton = screen.getByLabelText('Delete')
			expect(deleteButton).toBeInTheDocument()
		})

		it('should call the backend when the Delete button is pressed', async () => {
			deleteButton = screen.getByLabelText('Delete')
			user.click(deleteButton)
			await waitFor(() => {
				expect(mockAxios.delete).toHaveBeenCalledWith('/api/files', {
					params: { name: filename },
				})
			})
		})

		it('should update the list of files', async () => {
			const filesList = screen.getByTestId('files-list')

			await waitFor(() => {
				expect(mockAxios.get).toHaveBeenCalled()
				expect(filesList).not.toContain(screen.getByText(filename))
			})
		})

		it('should not show delete or dropzone for non-admins', () => {
			mockAxios.get
				.mockResolvedValueOnce({
					data: {
						name: 'Marc Miller',
						isAdmin: false,
					},
				})
				.mockResolvedValue({
					data: [
						{
							_bucket_name: 'bucket',
							_object_name: filename,
							_size: file.size,
						},
					],
				})
		})
		const noDeleteButton = screen.queryByLabelText('Delete')
		expect(noDeleteButton).toBe(null)

		const noDropzone = screen.queryByTestId(/dropzone/i)
		expect(noDropzone).toBe(null)
	})

	describe('Download', () => {
		global.URL.createObjectURL = jest.fn()
		let downloadButton: HTMLElement

		it('renders a download button', async () => {
			downloadButton = screen.getByLabelText('Download')
			expect(downloadButton).toBeInTheDocument()
		})

		it('calls the backend when the Download button is clicked', async () => {
			downloadButton = screen.getByLabelText('Download')
			user.click(downloadButton)
			await waitFor(() => {
				expect(mockAxios.get).toHaveBeenCalledWith('/api/files/list')
				expect(mockAxios.get).toHaveBeenCalledWith('/api/files', {
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
