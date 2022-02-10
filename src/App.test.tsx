import { render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import user from '@testing-library/user-event'
import App from './App'
import { FileProvider } from './context/useFiles'
import { UserProvider } from './context/useUser'

export const randomString = (length: number) => {
	let result = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	var charactersLength = characters.length
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

console.error = jest.fn()

let mock: MockAdapter

let filename: string
let formData: FormData = new FormData()
let file: File

filename = `${randomString(6)}.json`

const str = JSON.stringify('boo')
const blob = new Blob([str])
file = new File([blob], filename, { type: 'application/JSON' })
formData.append('file', file)

const renderWithFileProvider = () => {
	mock = new MockAdapter(axios)

	mock.onGet('/api/files/list').reply(200, [
		{
			name: filename,
			size: file.size,
		},
	])
	mock.onGet('/api/whoami').reply(200, {
		name: 'Marc',
		isAdmin: true,
	})
	mock.onGet('/api/files').reply(200, {})

	mock.onDelete('/api/files').reply(200, {})
	render(
		<UserProvider>
			<FileProvider>
				<App />
			</FileProvider>
		</UserProvider>,
	)
}

describe('FileProvider tests', () => {
	afterEach(() => {
		mock.reset()
	})
	it('Should get files list', async () => {
		renderWithFileProvider()

		expect(mock.history.get[0].url).toEqual('/api/files/list')
	})
	it('Should call axios delete when delete is clicked', async () => {
		renderWithFileProvider()
		await waitFor(() => {
			expect(screen.getByText(filename)).toBeInTheDocument()
			const deleteButton = screen.getByLabelText('Delete')
			deleteButton.click()
		})
		expect(mock.history.get[1].url).toEqual('/api/whoami')
		expect(mock.history.delete[0].url).toEqual('/api/files')
	})

	it('Should upload a file when file is inserted into the dropzone', async () => {
		renderWithFileProvider()
		await waitFor(() => {
			let fileupload = screen.getByTestId(/fileupload$/i)
			expect(screen.getByText(filename)).toBeInTheDocument()
			user.upload(fileupload, file)
		})
		expect(mock.history.post[0].url).toEqual('/api/files')
		expect(mock.history.post[0].data).toEqual(formData)
	})

	it('Should download a file when the download button is clicked', async () => {
		global.URL.createObjectURL = jest.fn()
		renderWithFileProvider()
		await waitFor(() => {
			expect(screen.getByText(filename)).toBeInTheDocument()
			const downloadButton = screen.getByLabelText('Download')
			expect(screen.getByText(filename)).toBeInTheDocument()
			downloadButton.click()
		})
		expect(mock.history.get[4].url).toEqual('/api/files')
	})
})
