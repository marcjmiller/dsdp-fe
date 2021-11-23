import { render, screen, waitFor } from '@testing-library/react'
import App from './App'
import axios from 'jest-mock-axios'
import user from '@testing-library/user-event'

describe('App', () => {
	afterEach(() => {
		jest.resetAllMocks()
	})

	it('renders upload', () => {
		render(<App />)
		const uploadElement = screen.getByText(
			/Drag and drop a file here or click/i,
		)
		expect(uploadElement).toBeInTheDocument()
	})

	it('uploads a file', async () => {
		const { getByTestId } = render(<App />)

		axios.post.mockResolvedValueOnce({
			data: [{ _bucket_name: 'bucket', _object_name: 'ping.json' }],
		})
		
    let formData = new FormData()
		const str = JSON.stringify('boo')
		const blob = new Blob([str])
		const file = new File([blob], 'ping.json', { type: 'application/JSON' })
		formData.append('files', file)

		user.upload(getByTestId(/dropzone/i), file)
		
		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith('/files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					accept: 'application/json',
				},
			}),
		)
	})

	it('should load the files that have previously been uploaded to minio', async () => {
		const { getByTestId } = render(<App />)
    const filename = `${randomString(6)}.json`
		axios.post.mockResolvedValueOnce({
			data: [{ _bucket_name: 'bucket', _object_name: filename }],
		})

		let formData = new FormData()
		const str = JSON.stringify('boo')
		const blob = new Blob([str])
		const file = new File([blob], filename, { type: 'application/JSON' })
		formData.append('files', file)

		user.upload(getByTestId(/dropzone/i), file)

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith('/files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					accept: 'application/json',
				},
			}),
		)

		const filesElement = screen.getByTestId('files-table')
		expect(filesElement).toBeInTheDocument()
		expect(filesElement.innerHTML).toBe(filename)
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
