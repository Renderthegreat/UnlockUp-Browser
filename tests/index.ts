import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
	const browser = await puppeteer.launch({
		executablePath: process.env.CHROMIUM_BIN || undefined,
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});

	const page = await browser.newPage();

	const localFilePath = `file://${path.join(__dirname, 'dist/index.html')}`;

	await page.goto(localFilePath, { waitUntil: 'networkidle2' });

	// Your automation logic here
	await page.screenshot({ path: 'screenshot.png' });

	await browser.close();
})();
