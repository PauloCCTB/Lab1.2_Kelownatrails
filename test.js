const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chai = require('chai');
const assert = chai.assert;

let driver;

// Start browser before each test
before(async () => {
    const options = new firefox.Options();
    options.addArguments('-headless');
    options.addArguments('window-size=1200x600'); // Set window size for headless mode

    driver = await new Builder()
        .forBrowser('firefox')
        .setChromeOptions(options)
        .build();
});

after(async () => {
    await driver.quit();
});

describe('Kelowna Wine Trails and Tours - Group Discount Functionality', () => {
    const baseUrl = 'https://test-devops2lab11-phmunhoz.web.app';

    it('should open the website and check the title', async () => {
        await driver.get(baseUrl);
        const title = await driver.getTitle();
        assert.strictEqual(title, 'DevOps Bonus Project - CCTB');
    });

    it('should add a group member and update the list', async () => {
        await driver.get(baseUrl);

        const firstname = await driver.findElement(By.id('firstname'));
        const lastname = await driver.findElement(By.id('lastname'));
        const addMemberBtn = await driver.findElement(By.id('addMemberBtn'));

        await firstname.sendKeys('John');
        await lastname.sendKeys('Doe');
        await addMemberBtn.click();

        const membersList = await driver.findElement(By.id('members'));
        const options = await membersList.findElements(By.tagName('option'));
        const optionText = await options[0].getText();
        assert.include(optionText, 'Doe, John');
    });

    it('should calculate the correct discounted rate based on group size', async () => {
        await driver.get(baseUrl);

        const groupSizeInput = await driver.findElement(By.id('GroupSize'));
        const discRateInput = await driver.findElement(By.id('discRate'));

        await groupSizeInput.clear();
        await groupSizeInput.sendKeys('6'); // Group size for 10% discount

        await driver.wait(until.elementTextContains(discRateInput, '45.00'), 1000);

        const discountedRate = await discRateInput.getAttribute('value');
        assert.strictEqual(discountedRate, '45.00'); // Expect 10% discount on $50
    });

    it('should display an error if a non-numeric value is entered for group size', async () => {
        await driver.get(baseUrl);

        const groupSizeInput = await driver.findElement(By.id('GroupSize'));
        const addMemberBtn = await driver.findElement(By.id('addMemberBtn'));

        await groupSizeInput.clear();
        await groupSizeInput.sendKeys('abc'); // Invalid input

        await addMemberBtn.click();

        const alertText = await driver.switchTo().alert().getText();
        assert.include(alertText, "It's not a number");
        await driver.switchTo().alert().accept();
    });

    it('should sort group members by last name when "Sort Member List" button is clicked', async () => {
        await driver.get(baseUrl);

        const firstname = await driver.findElement(By.id('firstname'));
        const lastname = await driver.findElement(By.id('lastname'));
        const addMemberBtn = await driver.findElement(By.id('addMemberBtn'));
        const sortMemberListBtn = await driver.findElement(By.id('sortMemberListBtn'));

        await firstname.sendKeys('John');
        await lastname.sendKeys('Doe');
        await addMemberBtn.click();

        await firstname.sendKeys('Jane');
        await lastname.sendKeys('Smith');
        await addMemberBtn.click();

        await sortMemberListBtn.click();

        const membersList = await driver.findElement(By.id('members'));
        const options = await membersList.findElements(By.tagName('option'));
        const firstOptionText = await options[0].getText();
        const secondOptionText = await options[1].getText();

        assert.strictEqual(firstOptionText, 'Doe, John');
        assert.strictEqual(secondOptionText, 'Smith, Jane');
    });

    it('should show an advice message when the bee reaches its destination', async () => {
        await driver.get(baseUrl);

        const bee = await driver.findElement(By.id('bee'));
        const advice = await driver.findElement(By.id('advice'));

        const adviceStyle = await advice.getAttribute('style');
        assert.include(adviceStyle, 'display: none');

        await driver.wait(until.elementIsVisible(advice), 10000);

        const adviceText = await advice.getText();
        assert.include(adviceText, 'Like this bee, be sure to stop and smell the flowers!');
    });
});
