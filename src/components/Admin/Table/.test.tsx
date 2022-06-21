import { render, screen } from '../../../tests/utils'
import { listOfAdmins } from '../../../tests/factories'

import AdminTable from '.'
import Header from './header'

describe('AdminTable', () => {
	describe('TableHeader', () => {
		it.each(['Username:'])('Renders the `%s` header', (header) => {
			render(
				<table>
					<Header />
				</table>,
			)
			const headerElement = screen.getByText(header)
			expect(headerElement).toBeInTheDocument()
		})
	})
	it.each(listOfAdmins)('Renders the `%s` username', async (username) => {
		render(<AdminTable header={<></>} admins={listOfAdmins} />)
		expect(await screen.findByText(username)).toBeInTheDocument()
	})
})
