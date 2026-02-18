import Puppeteer, { ConsoleMessage, Page, } from 'puppeteer';
import Path from 'path';
import { fileURLToPath, pathToFileURL, } from 'url'; // Added pathToFileURL
import FS from 'fs';

const __filename = fileURLToPath(import.meta.url);
// Convert the directory to a valid file:// URL
const localPath = Path.join(Path.dirname(__filename), '../');
const localBaseUrl = pathToFileURL(localPath).href; 

(async () => {
	const browser = await Puppeteer.launch({
		executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files',],
		headless: true,
		// pipe: true,
	});

	const page: Page = await browser.newPage();

	// Log events before triggering the load.
	page.on('console', (msg: ConsoleMessage) => {
		console[msg.type()](' > ', msg.text());
	});
	page.on('pageerror', (err: Error) => {
		console.error(' > ', err.message);
	});
	page.on('request', request => {
		console.log(' >> ', request.method(), request.url());
	});

	await page.goto(Path.join(localBaseUrl, './index.html'), { waitUntil: 'networkidle0' });
	await page.waitForSelector('#app');

	// Press the 'launch' button.
	await page.click('#launch-button');

	await page.waitForFrame('#launch-frame');

	await page.screenshot({ path: 'screenshot.png', fullPage: true });

	await browser.close();
})();