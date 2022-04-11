import { getHoldingsPage, getLoginPage, submitLoginPage } from './pages.js';
import dotenv from 'dotenv';
// import { parseHoldings } from './parsers/holdings-page.js';
import { getLoginElements as getLoginElements } from './parsers/login-page.js';

async function main() {
    dotenv.config();
    const loginPage = await getLoginPage();
    const { submitButton, username, password } = await getLoginElements(loginPage);
    await loginPage.screenshot({ path: './screenshots/loginPage.png', fullPage: true });
    await username.type(process.env.IA_USERNAME);
    await password.type(process.env.IA_PASSWORD);
    await submitButton.click();
    // const loginResponse = await submitLoginPage(
    //     new URL(formUrl, 'https://iac.secureweb.inalco.com/').toString(),
    // );
    // console.log(loginResponse);
    // console.log(await loginResponse.text());

    // const holdings = await getHoldingsPage().then((page) => parseHoldings(page));
    // console.log(JSON.stringify(holdings));
}

main().catch((err) => console.error(err));
