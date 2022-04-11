import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import path from 'path';

import puppeteer, { ConsoleMessage } from 'puppeteer';

function consoleMsg(msg: ConsoleMessage) {
    const msgType = msg.type() as unknown as keyof Console;
    if (msgType in console) {
        (console[msgType] as typeof console.log)(msg.text());
    } else {
        return console.debug(msg.text());
    }
}

export async function getLoginPage() {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: { height: 768, width: 1024 } });
    const page = await browser.newPage();
    await page.goto('https://iac.secureweb.inalco.com/', { waitUntil: 'load' });
    page.on('console', consoleMsg);
    return page;
}

export async function submitLoginPage(url: string, fields: Map<string, string | undefined>, cookies: string[]) {
    const formData = new FormData();
    fields.forEach((v, k) => v && formData.set(k, v));
    console.log(url);
    const response = await fetch(url, {
        method: 'POST',
        body: formData as any,
        headers: { Cookies: cookies.join(';') },
        redirect: 'manual',
    });
    return response;
}

export async function getHoldingsPage(): Promise<string> {
    const html = await readFile(path.resolve('../samples/ia-composition/2022-02-06/HoldingsPage/My Client Space.htm'), {
        encoding: 'utf-8',
    });
    return html;
}
