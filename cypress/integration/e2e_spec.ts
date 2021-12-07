/// <reference types="cypress" />

import 'cypress-file-upload'

describe('Sanity check', () => {
	it('Does not do much!', () => {
		expect(true).to.equal(true)
	})
})

describe('Webpage tests', () => {
	before(() => {
		cy.visit('localhost:3000')
	})

	it('Should upload a file', () => {
		cy.get('[data-testid="dropzone"]').attachFile('DEVCOM1.png')
		cy.screenshot()
		cy.contains('DEVCOM1.png')
	})

	it('should download a file', () => {
    // TODO: Delete files in ../downloads folder to ensure it is empty
    
		cy.get('.MuiTableRow-root')
			.contains('DEVCOM1.png')
			.parent()
			.within(() => {
				cy.get('[aria-label="Download"]').click()
			})

      // TODO: Check ../downloads for a file (DEVCOM1.png)
	})

	it('should delete a file', () => {
		cy.get('.MuiTableRow-root')
			.contains('DEVCOM1.png')
			.parent()
			.within(() => {
				cy.get('[aria-label="Delete"]').click()
			})
		cy.get('.MuiTableRow-root').should('have.length', 2)
	})
})
