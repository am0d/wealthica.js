import type { Cheerio, Element, Node } from "cheerio";

export function findFirstElement(
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
export function getTabWithName(
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

export function tryOrDefault<T>(callback: () => T, defaultValue: T): T {
  try {
    return callback();
  } catch {
    return defaultValue;
  }
}
