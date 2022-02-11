/// <reference types="cypress" />
import jwt from 'jsonwebtoken'
import 'cypress-file-upload'

const baseUrl = Cypress.config('baseUrl')

describe('Non-admin user tests', () => {
	const token = jwt.sign(
		{ name: 'PlebMarc', 'group-full': ['/Platform One/gvsc/IL2/roles/users'] },
		'secret key',
	)

	before(() => {
		cy.intercept('GET', 'api/whoami', (req) => {
			req.headers['Authorization'] = `Bearer ${token}`
		}).as('getUser')

		cy.intercept('GET', 'api/files/list', {
			statusCode: 200,
			body: [{ name: 'DEVCOM1.png', size: 3986 }],
		}).as('getFiles')

		cy.visit(baseUrl)
		cy.wait('@getUser')
		cy.wait('@getFiles')
	})

	it('should not contain the upload or delete options', () => {
		cy.get('[data-testid="fileupload"]').should('not.exist')
		cy.get('[data-testid="fileuploadbox"]').should('not.exist')

		cy.get('.MuiTableRow-root').should('have.length', 2)
		cy.get('.MuiTableRow-root').contains('DEVCOM1.png')
		cy.get('[data-testid="Delete"]').should('not.exist')
	})

	it('should have option to download a file', () => {
		cy.get('.MuiTableRow-root')
			.contains('DEVCOM1.png')
			.parent()
			.within(() => {
				cy.get('[aria-label="Download"]').should('be.visible')
			})
	})
})
