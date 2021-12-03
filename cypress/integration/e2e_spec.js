import "cypress-file-upload";

describe('Sanity check', () => {
  it('Does not do much!', () => {
    expect(true).to.equal(true)
  })
})

describe('Webpage tests', () => {
  it('Visits our App', () => {
    cy.visit('localhost:3000')
  })

  it('Should upload a file', () => {
    cy.visit('localhost:3000')
    cy.screenshot()
    cy.get('[data-testid="dropzone"]').attachFile("DEVCOM1.png")
    cy.screenshot()
    cy.contains('DEVCOM1.png')
    cy.screenshot()
  })
})

//derp

