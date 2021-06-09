describe('Given the user visits the web page', () => {
  it('When they search for something, then are shown image results', () => {
    cy.visit('http://localhost:3000')

    cy.get('.SearchTextBox').type('dog').should('have.value', 'dog')
    cy.get('.SearchButton').click()

    cy.get('.Image')
  })
})
