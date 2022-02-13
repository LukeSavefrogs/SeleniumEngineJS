import test from 'ava';
import puppeteer from 'puppeteer';

import SeleniumEngine from "../src/esm/wrapper.mjs";

// https://stackoverflow.com/a/64383997/8965861
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



test("Script tag - Check if object is defined and with correct keys", async t => {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(`file://${__dirname}/test-browser.html`);

	const remoteSeleniumEngine = await page.evaluate(() => {
		return JSON.stringify(Object.keys(SeleniumEngine));
	});
	await browser.close();
	
	t.deepEqual(JSON.parse(remoteSeleniumEngine).sort(), Object.keys(SeleniumEngine).sort());
})
