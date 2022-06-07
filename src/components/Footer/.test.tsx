import { render, screen } from '../../tests/utils'
import Footer from '.'

describe('Footer', () => {
	beforeEach(() => {
		render(<Footer />)
	})

	it('should contain the Army logo', () => {
		expect(screen.getByAltText(/army seal/i)).toBeInTheDocument()
	})

	it('should contain the USMC logo', () => {
		expect(screen.getByAltText(/usmc seal/i)).toBeInTheDocument()
	})

	it('should contain the JPO logo', () => {
		expect(screen.getByAltText(/peo cs css emblem/i)).toBeInTheDocument()
	})

	it('should contain the JLTV logo', () => {
		expect(screen.getByAltText(/jpo jltv logo/i)).toBeInTheDocument()
	})
})
