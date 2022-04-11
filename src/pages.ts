import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { FormData } from 'formdata-node';
import path from 'path';

export async function getLoginPage() {
    const response = await fetch('https://iac.secureweb.inalco.com/', { redirect: 'follow' });
    return response;
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
