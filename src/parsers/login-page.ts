import { ElementHandle, Page } from 'puppeteer';

/**
 * Fill a login form and return the serialized form fields
 * @param page Login page html
 * @returns Serialized string of form fields to submit
 */
export async function getLoginElements(page: Page): Promise<{
    submitButton: ElementHandle<HTMLButtonElement>;
    username: ElementHandle<HTMLInputElement>;
    password: ElementHandle<HTMLInputElement>;
}> {
    console.debug('Waiting for #loginForm to appear');
    await page.waitForSelector('.primary-auth-form');
    console.debug(' -> Promise resolved');
    const formSection = await page.mainFrame().$('.primary-auth-form');
    if (!formSection) {
        throw new Error("Couldn't find login form");
    }

    const usernameElement = await formSection.$('[name="username"]');
    if (!usernameElement) {
        throw new Error("Couldn't find username field");
    }

    const passwordElement = await formSection.$('[name="password"]');
    if (!passwordElement) {
        throw new Error("Couldn't find password field");
    }

    const submitButton = await formSection.$('[type="submit"]');
    if (!submitButton) {
        throw new Error("Couldn't find submit button");
    }

    return {
        submitButton: submitButton,
        username: usernameElement,
        password: passwordElement,
    };
}
