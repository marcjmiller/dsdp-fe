import userEvent from '@testing-library/user-event'
import { cleanup, render, screen, adminUserProps, act } from '../../tests/utils'
import { listOfAdmins } from '../../tests/factories'
import Admin from '.'
import { rest } from 'msw'
import { server } from '../../tests/msw/server'

describe('Admin', () => {
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

	afterEach(() => server.resetHandlers())

	afterAll(() => {
		cleanup()
		server.close()
	})
	it('should contain an button', () => {
		render(<Admin />, {
			UserProviderProps: adminUserProps,
		})

		expect(screen.getByText(/Admin/i)).toBeInTheDocument()
	})
	it('should not contain an admin button if not an admin', () => {
		render(<Admin />)

		expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument()
	})
	it('should render an admin modal when the admin button is pressed', () => {
		render(<Admin />, {
			UserProviderProps: adminUserProps,
		})
		expect(screen.queryByText(/User Administration/i)).not.toBeInTheDocument()
		screen.getByText(/Admin$/i).click()
		expect(screen.getByText(/User Administration/i)).toBeInTheDocument()
		expect(screen.getByTestId('admins-list')).toBeInTheDocument()
	})
	it('should add an admin', async () => {
		render(<Admin />, {
			UserProviderProps: adminUserProps,
		})
		const newAdmin = 'newadmin.ctr'
		server.use(
			rest.post('/api/admins', (req, res, ctx) => {
				return res.once(ctx.status(200), ctx.json([...listOfAdmins, newAdmin]))
			}),
		)
		await act(async () => {
			userEvent.click(await screen.findByText(/Admin$/i))
		})
		const element = screen.getByLabelText('Add Admin')
		await userEvent.type(element, newAdmin)
		await act(async () => {
			userEvent.click(await screen.findByText(/^Add$/i))
		})
		expect(await screen.findByText(newAdmin)).toBeInTheDocument()
	})
})
