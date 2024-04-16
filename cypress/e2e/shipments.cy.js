describe('shipments', () => {
  beforeEach(() => {
    cy.visit('/admin');
    cy.get('[id="_username"]').type('sylius');
    cy.get('[id="_password"]').type('sylius');
    cy.get('.primary').click();
    cy.clickInFirst('a[href="/admin/shipments/"]');
  });

  it('ships a ready shipment', () => {
    // Type in value input to search for specify shipment
    cy.get('.ui > .sylius-filters > .sylius-filters__field > .field > #criteria_state').select('ready');
    // Click in filter blue button
    cy.get('*[class^="ui blue labeled icon button"]').click();
    // Click in Ship of the first shipment listed
    cy.clickInFirst('*[class^="ui labeled icon teal button"]');

    // Assert that shipment has been shipped
    cy.get('body').should('contain', 'Shipment has been successfully shipped.');
  });

  it('shows only shipped shipments by selecting shipped in state filter', () => {
    cy.get('#criteria_state').select('Shipped');
    cy.get('button').contains('Filter').click();

    cy.get('.item').contains('Shipped').should('be.visible');
    cy.get('.item').should('not.contain.text', 'Cancelled');
    cy.get('.item').should('not.contain.text', 'Ready');
  });

  it('shows only ready shipments by selecting ready in state filter', () => {
    cy.get('#criteria_state').select('Ready');
    cy.get('button').contains('Filter').click();

    cy.get('.item').contains('Ready').should('be.visible');
    cy.get('.item').should('not.contain.text', 'Cancelled');
    cy.get('.item').should('not.contain.text', 'Shipped');
  });

  it('should remove all filters by clicking clear filters button', () => {
    cy.get('#criteria_state').select('Ready');
    cy.get('#criteria_channel').select('Home Plus Web Store');
    cy.get('#criteria_method').select('UPS');

    cy.get('.button').contains('Clear filters').click();

    cy.get('#criteria_state').should('contain.text', 'All');
    cy.get('#criteria_channel').should('contain.text', 'All');
    cy.get('#criteria_method').should('contain.text', 'All');
  });

  // Implement the remaining test cases in a similar manner
});
