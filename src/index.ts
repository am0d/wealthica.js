import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI, Element, Node } from "cheerio";
import { readFile } from "fs/promises";
import path from "path";
import _ from "lodash";
import { Text } from "domhandler";

interface ISecurity {
  symbol: string;
  currency: string;
  name: string;
  type: string;
}
interface IHolding {
  security: ISecurity;
  quantity: number;
  book_value: number;
  market_value: number;
}

async function getHoldingsPage(): Promise<string> {
  const html = await readFile(
    path.resolve("../samples/ia-composition/2022-02-06/My Client Space.htm"),
    { encoding: "utf-8" }
  );
  return html;
}

function findFirstElement(
  section: Cheerio<Node>,
  selector: string,
  message: string
): Cheerio<Element> {
  const element = section.find(selector).first();
  if (!element?.length) {
    throw new Error(`${message}\nSelector: ${selector}\n${section.html()}`);
  }
  return element;
}

function getTabWithName(
  section: Cheerio<Element>,
  tabName: string
): Cheerio<Element> {
  const tabList = findFirstElement(
    section,
    '[role="tablist"]',
    `Tab list not found for ${tabName}`
  );
  const tabId = findFirstElement(
    tabList,
    `[role="tab"]:contains("${tabName}")`,
    `Tab control not found for ${tabName}`
  ).attr("aria-controls");
  const tabPanel = findFirstElement(
    section,
    `#${tabId}`,
    `Tab panel not found for ${tabName}`
  );
  return tabPanel;
}

function getHoldingsFromTable(
  $: CheerioAPI,
  section: Cheerio<Element>
): IHolding[] {
  const tableCategory = _.trim(
    findFirstElement(section, "th p", "Couldn't find section header").text()
  );
  const tableRows = section.find("tbody tr");
  return _.flatten(
    tableRows.map((_i, el) => {
      const row = $(el);
      const fundNameAnchor = findFirstElement(
        row,
        "td p:first-child a:first-child *",
        "Couldn't find fund name"
      );
      const fundName = _.trim(
        (fundNameAnchor[0]?.nextSibling as Text).nodeValue
      );
      const tabContents = findFirstElement(
        row,
        ".tab-content",
        "Couldn't find tab content"
      );
      const fundUnits = parseFloat(
        findFirstElement(
          tabContents,
          'li:contains("Number of units")',
          "Couldn't find number of units"
        )
          .text()
          .replace("Number of units: ", "")
      );
      const securitySymbol = (
        findFirstElement(
          tabContents,
          'a:contains("More information")',
          "Couldn't find more information link"
        ).attr("href") ?? ""
      )
        .split("/")
        .slice(-1)[0];
      const marketValue = parseFloat(
        findFirstElement(
          row,
          "td:last-child .js-money-switch-1",
          "Couldn't find market value"
        )
          .text()
          .replace(/[,\$]/g, "")
      );
      return {
        security: {
          type: tableCategory,
          name: fundName,
          symbol: securitySymbol,
        },
        quantity: fundUnits,
        market_value: marketValue,
      } as IHolding;
    })
  );
}

async function parseHoldings(page: string): Promise<IHolding[]> {
  const $ = cheerio.load(page);
  const holdingsSection = findFirstElement(
    $.root(),
    "h2:contains('Details by contribution type')",
    "Couldn't find holdings section"
  ).next();
  // I have 3 tabs in this section - Regular, Voluntary, Employer
  const currentHoldingsTab = getTabWithName(holdingsSection, "Regular");
  const currentAllocationsTab = getTabWithName(
    currentHoldingsTab,
    "Current allocation"
  );
  const tables = currentAllocationsTab.find(".tableListBlock");
  const holdings = _.flatten(
    tables.map((_i, el) => getHoldingsFromTable($, $(el)))
  );
  console.log(JSON.stringify(holdings));
  //   console.log(
  //     // currentHoldingsTab.map(function () {
  //     //   return cheerio.load(this).html();
  //     // })
  //     currentAllocationsTab.html()
  //   );
  return [];
}

function main() {
  getHoldingsPage().then((page) => parseHoldings(page));
}

main();
