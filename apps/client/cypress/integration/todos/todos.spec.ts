describe('Todos', () => {
  beforeEach(() => {
    cy.intercept('http://localhost:3333/api', { fixture: 'todos' }).as(
      'GET_TODOS'
    );

    cy.visit('/');
    cy.get('[data-test="todo-item"]').first().as('test-todo-item');
  });
  it('should be visible', () => {
    cy.contains('Todos');

    // cy.wait(3000);
    cy.get('dos-todo-checker').contains('Buy');
    cy.get('dos-todo-checker').should('have.length', 7);
  });

  it('should check uncheck one item', () => {
    cy.get('@test-todo-item').then((elem) => {
      if (elem.hasClass('todo--is-done')) {
        cy.get('@test-todo-item').click();
        cy.get('@test-todo-item').should('not.have.class', 'todo--is-done');
      } else {
        cy.get('@test-todo-item').click();
        cy.get('@test-todo-item').should('have.class', 'todo--is-done');
      }
    });
  });

  it('perform restcall', () => {
    cy.wait('@GET_TODOS').its('response.body').should('have.length', 7);
    cy.get('@GET_TODOS');
    //   cy.request('PUT', 'http://localhost:3333/api/3', {
    //     id: '3',
    //     text: 'Build 🏡️',
    //     isPinned: false,
    //     isComplete: false
    //   });
  });
});
