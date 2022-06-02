import FileTable from '.'
import TableHeader from './header'
import prettyBytes from 'pretty-bytes'
import {
	createFileDataStub,
	defaultFileProps,
	render,
	screen,
} from '../../tests/utils'
jest.mock('pretty-bytes')

const prettyMock = prettyBytes as jest.MockedFunction<typeof prettyBytes>

describe('Table', () => {
	const downloadSpy = jest.fn()
	const deleteSpy = jest.fn()
	const filesWithSize = [createFileDataStub('hello.png')]
	const filesWithZeroSize = [createFileDataStub('hello.png', 0)]
	describe('TableHeader', () => {
		it.each(['Name:', 'Release Type:', 'Size:', 'Actions:'])(
			'Renders the `%s` header',
			(header) => {
				render(
					<table>
						<TableHeader />
					</table>,
				)

				const headerElement = screen.getByText(header)
				expect(headerElement).toBeInTheDocument()
			},
		)
	})
	describe('As a Non-Admin', () => {
		beforeEach(() => {
			prettyMock.mockImplementation(() => '12.3 kB')
			render(<FileTable header={<></>} />, {
				FileProviderProps: {
					...defaultFileProps,
					handleDownload: downloadSpy,
					handleDelete: deleteSpy,
					fileData: filesWithSize,
				},
			})
		})
		it('Should render files table items and download button', () => {
			expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
			expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
			expect(screen.getByText(/out of cycle/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
		})
		it('should should not render the delete button', () => {
			expect(screen.queryByLabelText(/delete/i)).not.toBeInTheDocument()
		})
	})
	describe('As a Admin', () => {
		beforeEach(() => {
			prettyMock.mockImplementation(() => '12.3 kB')
			render(<FileTable header={<></>} />, {
				UserProviderProps: { user: { name: 'Admin', isAdmin: true } },
				FileProviderProps: {
					...defaultFileProps,
					handleDownload: downloadSpy,
					handleDelete: deleteSpy,
					fileData: filesWithSize,
				},
			})
		})
		it('should call pretty bytes when file size is gt zero', () => {
			expect(prettyMock).toHaveBeenCalled()
		})

		it('should display loading bar when file size is zero', () => {
			render(<FileTable header={<></>} />, {
				FileProviderProps: {
					...defaultFileProps,
					handleDownload: downloadSpy,
					handleDelete: deleteSpy,
					fileData: filesWithZeroSize,
				},
			})
			expect(screen.getByText(/uploading... 0%/i)).toBeInTheDocument()
		})

		it('Should render options for Admins', async () => {
			const deleteButton = screen.getByLabelText(/delete/i)

			expect(screen.getByText(/hello.png/i)).toBeInTheDocument()
			expect(screen.getByText(/12.3 kB/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/download/i)).toBeInTheDocument()
			expect(deleteButton).toBeInTheDocument()
		})
		it('Should call handleDownload when download button is clicked', () => {
			const downloadButton = screen.getByLabelText(/download/i)
			downloadButton.click()
			expect(downloadSpy).toHaveBeenCalled()
		})
		it('Should call handleDelete when delete button is clicked', () => {
			const deleteButton = screen.getByLabelText(/delete/i)
			deleteButton.click()
			expect(deleteSpy).toHaveBeenCalled()
		})
	})
})
