import { render, screen } from '@testing-library/react'
import TableHeader from './TableHeader'

describe('TableHeader', () => {
	it.each(['Name:', 'Size:', 'Actions:'])(
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
