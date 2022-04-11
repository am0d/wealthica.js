import { ElementHandle, Page } from 'puppeteer';

export async function findFirstElement(
    section: ElementHandle<Element>,
    selector: string,
    message: string,
): Promise<ElementHandle<Element>> {
    const element = await section.$(selector);
    if (!element) {
        throw new Error(`${message}\nSelector: ${selector}\n${await section.$eval('.', (el) => el.innerHTML)}`);
    }
    return element;
}
export async function getTabWithName(
    section: ElementHandle<Element>,
    tabName: string,
): Promise<ElementHandle<Element>> {
    const tabList = await findFirstElement(section, '[role="tablist"]', `Tab list not found for ${tabName}`);
    const tabId = await (
        await findFirstElement(tabList, `[role="tab"]:contains("${tabName}")`, `Tab control not found for ${tabName}`)
    ).$eval('.', (el) => el.getAttribute('aria-controls'));
    if (!tabId) {
        throw new Error('Could not find `aria-controls` attribute for tab named ' + tabName);
    }
    const tabPanel = await findFirstElement(section, `#${tabId}`, `Tab panel not found for ${tabName}`);
    return tabPanel;
}

export function tryOrDefault<T>(callback: () => T, defaultValue: T): T {
    try {
        return callback();
    } catch {
        return defaultValue;
    }
}
