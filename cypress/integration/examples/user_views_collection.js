describe('Given the user is logged in', () => {
  it('When the user views their collections, then they can view a single collection', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.contains('test').click()

    cy.get('.CollectionNameButton').click()

    cy.url().should('include', 'collections/')
  })
})
