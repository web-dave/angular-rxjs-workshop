describe('Todos', () => {
  beforeEach(() => {
    cy.intercept('http://localhost:3333/api', { fixture: 'todos' });
    cy.visit('/');
  });
  it('should be visible', () => {
    cy.contains('Todos');

    // cy.wait(3000);
    cy.get('dos-todo-checker').contains('Buy');
    cy.get('dos-todo-checker').should('have.length', 7);
  });

  it('should check uncheck one item', () => {
    // cy.intercept('http://localhost:3333/api', { fixture: 'todos' });
    // cy.visit('/');
    // cy.wait(3000);
    // cy.get('dos-todo-checker')
    //   .contains('Buy')
    //   .get('input')
    //   .uncheck({ force: true });
    cy.get('[data-test="todo-item"]')
      .first()
      .then((elem) => {
        if (elem.hasClass('todo--is-done')) {
          cy.get('[data-test="todo-item"]').first().click();
          cy.get('[data-test="todo-item"]')
            .first()
            .should('not.have.class', 'todo--is-done');
        } else {
          cy.get('[data-test="todo-item"]').first().click();
          cy.get('[data-test="todo-item"]')
            .first()
            .should('have.class', 'todo--is-done');
        }
      });
  });

  // it('perform restcall', () => {
  //   cy.request('PUT', 'http://localhost:3333/api/3', {
  //     id: '3',
  //     text: 'Build 🏡️',
  //     isPinned: false,
  //     isComplete: false
  //   });
  // });
});
