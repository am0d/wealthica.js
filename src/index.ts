import { getHoldingsPage } from "./pages.js";
import { parseHoldings } from "./parsers/holdings-page.js";

async function main() {
  // const loginPage = await getLoginPage();

  const holdings = await getHoldingsPage().then((page) => parseHoldings(page));
  console.log(JSON.stringify(holdings));
}

main();
