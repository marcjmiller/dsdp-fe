import { fireEvent, render, screen } from '@testing-library/react'
import App from './App'
import mockAxios from 'jest-mock-axios'

afterEach(() => {
	mockAxios.reset()
})

test('renders upload', () => {
	render(<App />)
	const uploadElement = screen.getByText(/Drag and drop a file here or click/i)
	expect(uploadElement).toBeInTheDocument()
})

test('uploads a file', async () => {
	render(<App />)
	window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url')
	const uploadElement = screen.getByText(/Drag and drop a file here or click/i)
	const file = new File(['file'], 'ping.json', {
		type: 'application/json',
	})
	Object.defineProperty(uploadElement, 'files', {
		value: [file],
	})
	fireEvent.drop(uploadElement)
	fireEvent.change(uploadElement)
	expect(await screen.findByText('ping.json')).toBeInTheDocument()
	expect(mockAxios.post).toHaveBeenCalledWith(
		'http://localhost:8080/api/files',
		new FormData(),
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	)
})
