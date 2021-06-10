describe('Given the user is logged in', () => {
  it('When they visit the web page, then their name is shown in the header', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.url().should('equal', 'http://localhost:3000/')

    cy.contains('test')
  })
})
