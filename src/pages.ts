import fetch from "node-fetch";
import { readFile } from "fs/promises";
import path from "path";

export async function getLoginPage() {
  return await fetch("https://iac.secureweb.inalco.com/");
}

export async function getHoldingsPage(): Promise<string> {
  const html = await readFile(
    path.resolve(
      "../samples/ia-composition/2022-02-06/HoldingsPage/My Client Space.htm"
    ),
    { encoding: "utf-8" }
  );
  return html;
}
