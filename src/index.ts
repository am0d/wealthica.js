import { getHoldingsPage, getLoginPage, submitLoginPage } from './pages.js';
import dotenv from 'dotenv';
import { parseHoldings } from './parsers/holdings-page.js';
import { fillLogin } from './parsers/login-page.js';

async function main() {
    dotenv.config();
    console.log(process.env);
    const loginPage = await getLoginPage();
    const loginHtml = await loginPage.text();
    const cookies = loginPage.headers.raw()['set-cookie'];
    const [formUrl, formData] = fillLogin(loginHtml);
    formData.set('USER', process.env.IA_USERNAME);
    formData.set('password', process.env.IA_PASSWORD);
    const loginResponse = await submitLoginPage(
        new URL(formUrl, 'https://iac.secureweb.inalco.com/').toString(),
        formData,
        cookies ?? [],
    );
    console.log(loginResponse);
    console.log(await loginResponse.text());

    // const holdings = await getHoldingsPage().then((page) => parseHoldings(page));
    // console.log(JSON.stringify(holdings));
}

main().catch((err) => console.error(err));
