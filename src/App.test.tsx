import App from './App'
import {
	render,
	screen,
	createFile,
	act,
	fireEvent,
	cleanup,
	waitFor,
} from './tests/utils'
import userEvent from '@testing-library/user-event'
import { server } from './tests/msw/server'
import { rest } from 'msw'
import {
	emptyFileDataList,
	newFileData,
	newFileDataList,
} from './tests/msw/factories'
import fileDownload from 'js-file-download'
jest.mock('js-file-download', () => jest.fn())

describe('User Journey', () => {
	beforeAll(() => {
		server.listen()
		/*
      Useful Debugging tooling see which url is being called
      and what the mocked response was for it

      More Information here: https://mswjs.io/docs/extensions/life-cycle-events
      server.events.on("response:mocked", (res, resId) => {
        console.log("Mocked Responsed for: ", res, resId)
      })
      server.events.on("request:start", (req) => {
        console.log("Requested:", req.url.pathname, "With: ", req)
      })
		*/
	})

	beforeEach(() => {
		render(<App />)
	})

	afterEach(() => server.resetHandlers())

	afterAll(() => {
		cleanup()
		server.close()
	})

	it('Should get files list and user info on load', async () => {
		await screen.findByText(/test.txt/i)
		//TODO: Display the User somewhere
	})

	it('should Upload a file with metadata', async () => {
		userEvent.click(await screen.findByText(/upload file/i))
		await act(async () => {
			fireEvent.change(await screen.findByTestId(/release-type/i), {
				target: { value: 'Safety Related' },
			})
			userEvent.upload(
				await screen.findByTestId('file-upload'),
				createFile('test.jpg', 100, 'image/jpg'),
			)
		})
		expect(await screen.findByText(/test.jpg/i)).toBeInTheDocument()
		expect(await screen.findByText(/safety related/i)).toBeInTheDocument()

		/*
      We reset the mock return for the list endpoint
      here to simulate the new return from the backend
		*/
		server.use(
			rest.get('/api/files/list', (req, res, ctx) => {
				return res(
					ctx.json(
						newFileDataList([
							newFileData('test.jpg', 100, { release_type: 'Safety Related' }),
						]),
					),
				)
			}),
		)

		await act(async () => {
			userEvent.click(await screen.findByText(/submit/i))
		})
		expect(await screen.findByText(/safety related/i)).toBeInstanceOf(
			HTMLTableCellElement,
		)
		expect(await screen.findByText(/test.jpg/i)).toBeInstanceOf(
			HTMLTableCellElement,
		)
	})

	it('should delete a file', async () => {
		await waitFor(() => {
			expect(screen.queryByText(/test.txt/i)).toBeTruthy()
		})
		server.use(
			rest.get('/api/files/list', (req, res, ctx) => {
				return res.once(ctx.status(200), ctx.json(emptyFileDataList()))
			}),
		)
		await act(async () => {
			userEvent.click(await screen.findByLabelText(/delete/i))
		})
		await waitFor(() => {
			expect(screen.queryByText(/test.txt/i)).toBeFalsy()
		})
	})

	it('should download a file', async () => {
		await waitFor(() => {
			expect(screen.queryByText(/test.txt/i)).toBeTruthy()
		})
		await act(async () => {
			userEvent.click(screen.getByLabelText(/download/i))
		})
		await waitFor(() => {
			expect(fileDownload).toHaveBeenCalled()
		})
	})
})
