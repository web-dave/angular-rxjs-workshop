describe('Todos', () => {
  it('should be visible', () => {
    cy.visit('/');
    cy.contains('Todos');
    // cy.contains('sandbox app is running!');
    cy.wait(3000);
    cy.get('dos-todo-checker').contains('Buy');
    cy.get('dos-todo-checker').should('have.length', 7);
  });
});
