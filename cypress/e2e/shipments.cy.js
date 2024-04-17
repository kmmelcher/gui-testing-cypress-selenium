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
    cy.get('#criteria_channel').select('Fashion Web Store');
    cy.get('#criteria_method').select('UPS');

    cy.get('.button').contains('Clear filters').click();

    cy.get('#criteria_state').should('contain.text', 'All');
    cy.get('#criteria_channel').should('contain.text', 'All');
    cy.get('#criteria_method').should('contain.text', 'All');
  });

  it('visits shipment details by clicking on show button', () => {
    cy.get('.button').contains('Show').click();

    cy.get('.header').should('contain.text', 'Shipment for order #');
  });

  it('ships order with tracking code', () => {
    cy.get('#sylius_shipment_ship_tracking:first').type('12345');
    cy.get('button').contains('Ship').click();

    cy.get('.sylius-flash-message').should('contain', 'Shipment has been successfully shipped.');
  });

  it('shows more table row items by selecting higher show filter', () => {
    cy.get('table .item').should('have.length', 10);

    cy.get('div .dropdown').contains('Show 10').click();
    cy.get('.item').contains('25').click();

    cy.get('table .item').should('have.length.greaterThan', 10);
  });

  it('folds filters when clicking on title', () => {
    cy.get('#criteria_state').should('be.visible');
    cy.get('#criteria_channel').should('be.visible');
    cy.get('#criteria_method').should('be.visible');

    cy.get('.title').contains('Filters').click();

    cy.get('#criteria_state').should('be.hidden');
    cy.get('#criteria_channel').should('be.hidden');
    cy.get('#criteria_method').should('be.hidden');
  });

  it('opens order details by clicking on order id', () => {
    cy.get('table td a:first').click();

    cy.get('.header').should('contain', 'Order');
  });

  it('navigates to next page by using the pagination buttons', () => {
    cy.get('.pagination div').contains('1').should('have.class', 'active');

    cy.get('.pagination a').contains('Next').click();

    cy.get('.pagination div').contains('2').should('have.class', 'active');
  });
});
