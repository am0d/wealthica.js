export {};
/* import * as cheerio from 'cheerio';
import type { Cheerio, CheerioAPI, Element } from 'cheerio';
import _ from 'lodash';
import type { Text } from 'domhandler';
import type { IHolding } from '../types';
import { findFirstElement, tryOrDefault, getTabWithName } from '../utils.js';

function getHoldingsFromTable($: CheerioAPI, section: Cheerio<Element>): IHolding[] {
    const tableCategory = _.trim(findFirstElement(section, 'th p', "Couldn't find section header").text());
    const tableRows = section.find('tbody tr');
    return _.compact(
        _.flatten(
            tableRows.map((_i, el) => {
                // try {
                const row = $(el);
                const fundNameAnchor = findFirstElement(
                    row,
                    'td p:first-child a:first-child *',
                    "Couldn't find fund name",
                );
                const fundName = _.trim((fundNameAnchor[0]?.nextSibling as unknown as Text).nodeValue);
                const tabContents = findFirstElement(row, '.tab-content', "Couldn't find tab content");
                const fundUnits = tryOrDefault(
                    () =>
                        parseFloat(
                            findFirstElement(
                                tabContents,
                                'li:contains("Number of units")',
                                "Couldn't find number of units",
                            )
                                .text()
                                .replace('Number of units: ', ''),
                        ),
                    0,
                );
                const securitySymbol = (
                    findFirstElement(
                        tabContents,
                        'a:contains("More information")',
                        "Couldn't find more information link",
                    ).attr('href') ?? ''
                )
                    .split('/')
                    .slice(-1)[0];
                const marketValue = parseFloat(
                    findFirstElement(row, 'td:last-child span[class|="js-money-switch"]', "Couldn't find market value")
                        .text()
                        .replace(/[,$]/g, ''),
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
                // } catch {
                //   return null;
                // }
            }),
        ),
    );
}

export function parseHoldings(page: string): IHolding[] {
    const $ = cheerio.load(page);
    const holdingsSection = findFirstElement(
        $.root(),
        "h2:contains('Details by contribution type')",
        "Couldn't find holdings section",
    ).next();
    const topLevelTabs = findFirstElement(holdingsSection, '.tabList', "Couldn't find top level tabs");
    // I have 3 tabs in this section - Regular, Voluntary, Employer
    const allHoldings = topLevelTabs.find('li[role="tab"]').map(function () {
        const tabName = _.trim($(this).text());
        // const tabName = "Employer";
        const holdingsTab = getTabWithName(holdingsSection, tabName);
        const currentAllocationsTab = getTabWithName(holdingsTab, 'Current allocation');
        const tables = currentAllocationsTab.find('.tableListBlock');
        const holdings = _.flatten(tables.map((_i, el) => getHoldingsFromTable($, $(el))));
        // console.log(JSON.stringify({ tabName, holdings }));
        return holdings;
    });
    //   console.log(
    //     // currentHoldingsTab.map(function () {
    //     //   return cheerio.load(this).html();
    //     // })
    //     currentAllocationsTab.html()
    //   );
    // const allHoldings = holdings;
    return _.flatten(allHoldings);
}
 */
