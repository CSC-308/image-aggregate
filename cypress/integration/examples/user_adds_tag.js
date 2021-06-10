describe('Given the user visits the web page', () => {
  it('When they search for something, then they can add a new tag to an image', () => {
    cy.visit('http://localhost:3000')

    cy.get('.LoginButton').click()

    cy.url().should('include', '/login')

    cy.contains('Username').type('test')
    cy.contains('Password').type('password')

    cy.get('.SubmitButton').click()

    cy.url().should('equal', 'http://localhost:3000/')

    cy.get('.SearchTextBox').type('dog').should('have.value', 'dog')
    cy.get('.SearchButton').click()

    cy.get('.AddTag').first().click()
    cy.get('.PostTextBox').type('new tag')
    cy.get('.PostTagButton').click()
  })
})
