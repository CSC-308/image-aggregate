describe('Given the user is not logged in', () => {
  it('When the user clicks login with their username and password, then they are logged in', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.url().should('equal', 'http://localhost:3000/')
  })
})
