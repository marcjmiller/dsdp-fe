import userEvent from '@testing-library/user-event'
import DropZone from '.'
import {
	createDtWithFiles,
	createFile,
	render,
	screen,
	cleanup,
	fireEvent,
	waitFor,
	act,
	defaultFileProps,
} from '../../tests/utils'

describe('DropZone tests', () => {
	let files: File[]
	const setFileInputSpy = jest.fn()

	describe('Admin Dropzone', () => {
		beforeEach(() => {
			files = [createFile('clintsmom.json', 1000, 'application/json')]
			render(<DropZone />, {
				UserProviderProps: { user: { name: 'clintIsAFairy', isAdmin: true } },
				FileProviderProps: {
					...defaultFileProps,
					setFileInput: setFileInputSpy,
				},
			})
		})

		afterEach(() => {
			cleanup()
			jest.resetAllMocks()
		})

		it('should render drop text', () => {
			const dropzoneText = screen.getByText(
				/drag 'n' drop or click to upload a file./i,
			)
			expect(dropzoneText).toBeInTheDocument()
		})

		it('should render drop text when dragging files', async () => {
			const dropzone = screen.getByTestId('dropzone')
			act(() => {
				fireEvent.dragEnter(dropzone, createDtWithFiles(files))
			})
			expect(
				await screen.findByText(/Drop the files here.../i),
			).toBeInTheDocument()
		})

		it('should respond to input changes', async () => {
			const input = (await screen.findByTestId(
				'file-upload',
			)) as HTMLInputElement

			act(() => userEvent.upload(input, files))

			await waitFor(() => {
				expect(setFileInputSpy).toHaveBeenCalledTimes(1)
				expect(input.files![0].name).toBe('clintsmom.json')
			})
		})

		it('should respond to onDrop event for files ', async () => {
			const event = createDtWithFiles(files)
			const box = screen.getByTestId('dropzone')

			act(() => {
				fireEvent.drop(box, event)
			})
			await waitFor(() => {
				expect(setFileInputSpy).toHaveBeenCalledTimes(1)
			})
		})

		it('should display the filename in a list', async () => {
			const stubFileInput = {
				file: createFile('dog.pdf', 100, 'application/pdf'),
				releaseType: '',
			}

			render(<DropZone />, {
				UserProviderProps: { user: { name: 'clintIsAFairy', isAdmin: true } },
				FileProviderProps: { ...defaultFileProps, fileInput: stubFileInput },
			})

			expect(await screen.findByText(/dog.pdf/i)).toBeInTheDocument()
		})
	})
})
