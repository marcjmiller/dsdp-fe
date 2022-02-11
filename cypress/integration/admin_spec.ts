/// <reference types="cypress" />
import jwt from 'jsonwebtoken'
import 'cypress-file-upload'

const baseUrl = Cypress.config('baseUrl')

describe('Admin user tests', () => {
	const token = jwt.sign(
		{ name: 'Ethan', 'group-full': ['/Platform One/gvsc/IL2/roles/admin'] },
		'secret key',
	)

	before(() => {
		cy.intercept('GET', '/api/whoami', (req) => {
			req.headers['Authorization'] = `Bearer ${token}`
		}).as('getUser')

		cy.visit(baseUrl)
		cy.wait('@getUser')
	})

	it('should be able to upload a file', () => {
		cy.get('[data-testid="fileupload"]').should('exist')
		cy.get('[data-testid="fileuploadbox"]').should('exist')

		cy.get('[data-testid="fileupload"]').attachFile('DEVCOM1.png')
		cy.contains('DEVCOM1.png')
	})

	it('should have the option to download a file', () => {
		cy.get('.MuiTableRow-root')
			.contains('DEVCOM1.png')
			.parent()
			.within(() => {
				cy.get('[aria-label="Download"]').should('exist')
			})
	})

	it('should be able to delete a file', () => {
		cy.get('.MuiTableRow-root')
			.contains('DEVCOM1.png')
			.parent()
			.within(() => {
				cy.get('[aria-label="Delete"]').should('exist')
				cy.get('[aria-label="Delete"]').click()
			})

		cy.get('.MuiTableRow-root').should('have.length', 1)
	})
})
