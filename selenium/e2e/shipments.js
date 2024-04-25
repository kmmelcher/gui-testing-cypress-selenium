const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('shipments', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();

  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
    await driver.findElement(By.linkText('Shipments')).click();
  });

  it('ship a ready shipment', async () => {
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Ready']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon teal button"]'));
    await buttons[0].click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Shipment has been successfully shipped.'));
  });

  const { Builder, By, Key, until } = require('selenium-webdriver');
  
  it('shows only ready shipments by selecting ready in state filter', async () => {
    await driver.findElement(By.id('criteria_state')).sendKeys('Ready');
    await driver.findElement(By.css('button')).then(elem => elem.click());
  
    const elem = await driver.findElement(By.css('span[class^="ui blue label"]'));
    const text = await elem.getText();
  
    assert(text.includes('Ready'), 'Texto não contém "Ready"');
    assert(!text.includes('Cancelled'), 'Texto contém "Cancelled"');
    assert(!text.includes('Shipped'), 'Texto contém "Shipped"');
  });

  it('shows only shipped shipments by selecting shipped in state filter', async () => {
      await driver.findElement(By.css('#criteria_state')).sendKeys('Shipped');;
      await driver.findElement(By.css('button')).then(elem => elem.click());
  
      let itemText = await driver.findElement(By.css('span[class^="ui green label"]')).getText();
      assert(itemText.includes('Shipped'), 'Envios enviados não estão visíveis');
      assert(!itemText.includes('Cancelled'), 'Envios cancelados estão visíveis');
      assert(!itemText.includes('Ready'), 'Envios prontos estão visíveis');
  });

it('should remove all filters by clicking clear filters button', async () => {
    await driver.findElement(By.id('criteria_state')).sendKeys('Ready');
    await driver.findElement(By.id('criteria_channel')).sendKeys('Fashion Web Store');
    await driver.findElement(By.id('criteria_method')).sendKeys('UPS');
    await driver.findElement(By.css('.button')).then(elem => elem.click());
    let stateText = await driver.findElement(By.css('#criteria_state')).getText();
    assert(stateText.includes('All'), 'State filter not cleared');
    let channelText = await driver.findElement(By.css('#criteria_channel')).getText();
    assert(channelText.includes('All'), 'Channel filter not cleared');
    let methodText = await driver.findElement(By.css('#criteria_method')).getText();
    assert(methodText.includes('All'), 'Method filter not cleared');
});

it('visits shipment details by clicking on show button', async () => {
    await driver.findElement(By.css('*[class^="ui labeled icon button "]')).then(elem => elem.click());
    let headerText = await driver.findElement(By.css('div[class^="content"]')).getText();
    assert(headerText.includes('Shipment for order #'), 'Shipment details not opened');
});

it('ships order with tracking code', async () => {
    await driver.get('http://localhost:9990/admin/shipments/?page=2');
    await driver.findElement(By.id('sylius_shipment_ship_tracking')).sendKeys('12345');
    await driver.findElement(By.css('*[class^="ui labeled icon teal button"]')).then(elem => elem.click());
    let flashMessageText = await driver.findElement(By.css('.sylius-flash-message')).getText();
    assert(flashMessageText.includes('Shipment has been successfully shipped.'), 'Shipment not successfully shipped');
});



it.only('shows more table row items by selecting higher show filter', async () => {
    let elems = await driver.findElement(By.css('div[class^="ui simple fluid dropdown item"]')).getText();
    assert(elems.includes('Show 10'), 'Initial number of table row items incorrect');
    await driver.findElement(By.css('div .dropdown')).sendKeys(25);
    elems = await driver.findElements(By.css('table .item'));
    assert(elems.length > 10, 'Number of table row items not increased after selecting higher show filter');
});

it('folds filters when clicking on title', async () => {
    let stateElement = await driver.findElement(By.css('#criteria_state'));
    assert(await stateElement.isDisplayed(), 'State filter not displayed initially');
    let channelElement = await driver.findElement(By.css('#criteria_channel'));
    assert(await channelElement.isDisplayed(), 'Channel filter not displayed initially');
    let methodElement = await driver.findElement(By.css('#criteria_method'));
    assert(await methodElement.isDisplayed(), 'Method filter not displayed initially');
    await driver.findElement(By.css('.title')).then(elem => elem.click());
    assert(!(await stateElement.isDisplayed()), 'State filter not folded after clicking on title');
    assert(!(await channelElement.isDisplayed()), 'Channel filter not folded after clicking on title');
    assert(!(await methodElement.isDisplayed()), 'Method filter not folded after clicking on title');
});

it('opens order details by clicking on order id', async () => {
  const links = await driver.findElements(By.css('a'));

  let orderDetails;
      for (let link of links) {
          let linkText = await link.getText();
          if (linkText.startsWith("#")) {
            orderDetails = link;
            break;
          }
      }

      if (orderDetails) {
          await orderDetails.click();
      } else {
          console.error("No order details found");
      }
  let headerText = await driver.findElement(By.css('div[class^="content"]')).getText();
  assert(headerText.includes('Order'), 'Order details not opened');
});


it('navigates to next page by using the pagination buttons', async () => {
  const items = await driver.findElements(By.css('*[class^="item"]'));

  let page2;
      for (let item of items) {
          let itemText = await item.getText();
          if (itemText.startsWith("2")) {
            page2 = item;
            break;
          }
      }

      if (page2) {
          await page2.click();
      } else {
          console.error("No next page found");
      }
    paginationText = await driver.findElement(By.css('.pagination div')).getText();
    assert(paginationText.includes('2'), 'Not navigated to the next page');
});

});
