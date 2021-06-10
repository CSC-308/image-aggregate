describe('Given the user is not logged in', () => {
  it('When the user clicks login, then they can sign in or sign up', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.get('.SignUpButton').click()
    cy.get('.SignInButton').click()
  })
})
