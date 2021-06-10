describe('Given the user is logged in', () => {
  it('When the user views their collections, then they can create a new collection', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.contains('test').click()

    cy.get('.NewCollectionTextBox')
      .type('new collection')
      .should('have.value', 'new collection')

    cy.get('.NewCollectionButton').click()

    cy.contains('new collection')
  })
})
