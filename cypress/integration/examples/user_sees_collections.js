describe('Given the user is logged in', () => {
  it('When they click their name, then their are shown their collections', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.url().should('equal', 'http://localhost:3000/')

    cy.contains('test').click()
  })
})
