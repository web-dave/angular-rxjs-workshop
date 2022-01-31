describe('Todos', () => {
  before(() => {
    cy.visit('/');
  });
  it('should be visible', () => {
    cy.contains('Todos');

    cy.wait(3000);
    cy.get('dos-todo-checker').contains('Buy');
    cy.get('dos-todo-checker').should('have.length', 7);
  });

  it('should check uncheck one item', () => {
    cy.wait(3000);
    cy.get('dos-todo-checker')
      .contains('Buy')
      .should('have.class', 'todo--is-done');
    cy.get('dos-todo-checker').contains('Buy').click();
    cy.get('dos-todo-checker')
      .contains('Buy')
      .should('not.have.class', 'todo--is-done');
  });
});
