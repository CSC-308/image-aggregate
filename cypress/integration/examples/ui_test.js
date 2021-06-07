describe('UI Test', () => {
  it('Visits, types, searches, and asserts', () => {
    cy.visit('http://localhost:3000')

    cy.get('.SearchTextBox')
      .type('dogs')
      .should('have.value', 'dogs')

    cy.get('.SearchButton').click()
    cy.get('.Image').get('.TagButton')
  })
})
