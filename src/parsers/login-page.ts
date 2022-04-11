import * as cheerio from 'cheerio';
import { findFirstElement } from '../utils.js';

/**
 * Fill a login form and return the serialized form fields
 * @param page Login page html
 * @returns Serialized string of form fields to submit
 */
export function fillLogin(page: string): [string, Map<string, string | undefined>] {
    const $ = cheerio.load(page);
    const formSection = findFirstElement($.root(), '#loginForm', "Couldn't find login form");

    const formData = new Map<string, string | undefined>();
    formSection.find('input').each((_i, el) => {
        if (el.attribs['name']) {
            formData.set(el.attribs['name'], el.attribs['value']);
        }
    });
    console.log(formData);
    const submitUrl = formSection.attr('action');
    return [submitUrl as string, formData];
}
