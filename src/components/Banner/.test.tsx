import { render, screen } from '../../tests/utils'
import Banner from '.'

describe('Banner', () => {
	it('should contain the JLTV Banner', () => {
		render(<Banner />)

		expect(screen.getByAltText(/jpo jltv banner/i)).toBeInTheDocument()
	})
})
