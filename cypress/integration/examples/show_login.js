describe('Given the user is not logged in', () => {
  it('Then the user is shown a login button', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').contains('Login')
  })
})
