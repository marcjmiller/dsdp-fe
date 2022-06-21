import userEvent from '@testing-library/user-event'
import FileInput from '.'
import {
	defaultFileProps,
	render,
	screen,
	fireEvent,
	cleanup,
	adminUserProps,
} from '../../tests/utils'

describe('FileInputModal', () => {
	afterEach(cleanup)
	describe('As a Non-Admin', () => {
		beforeEach(() => {
			render(<FileInput />)
		})
		it('should not display a button to reveal modal', () => {
			expect(screen.queryByText(/upload file/i)).not.toBeInTheDocument()
		})
	})
	describe('As a Admin', () => {
		const uploadSpy = jest.fn()
		const setFileInputSpy = jest.fn()
		beforeEach(() => {
			render(<FileInput />, {
				UserProviderProps: adminUserProps,
				FileProviderProps: {
					...defaultFileProps,
					handleFileUpload: uploadSpy,
					setFileInput: setFileInputSpy,
				},
			})
		})

		it('should display a button to reveal the modal', () => {
			expect(screen.queryByText(/upload file/i)).toBeInTheDocument()
		})

		it('should not display dialogue by default', async () => {
			expect(screen.queryByTestId('dropzone')).toBeFalsy()
		})

		it('should not have a Release Type dropdown by default', () => {
			expect(screen.queryByTestId(/release-type/i)).toBeFalsy()
		})

		describe('Dialog opened', () => {
			beforeEach(() => {
				userEvent.click(screen.getByTestId(/upload-file/i))
			})

			it('should display dropzone', () => {
				expect(screen.queryByTestId('dropzone')).toBeTruthy()
			})

			it('should call setFileInput when select is changed', () => {
				const select = screen.getByTestId('release-type')
				fireEvent.change(select, { target: { value: 'Out of Cycle' } })
				expect(setFileInputSpy).toHaveBeenCalled()
			})

			it('should display Release Type dropdown', () => {
				expect(screen.queryByTestId(/release-type/i)).toBeTruthy()
			})

			it('Should call handle upload and setFileInput when submit is clicked', async () => {
				userEvent.click(screen.getByText(/submit/i))
				expect(uploadSpy).toHaveBeenCalled()
				expect(setFileInputSpy).toHaveBeenCalled()
			})
		})
	})
})
