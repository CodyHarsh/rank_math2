import puppeteer from 'puppeteer';
import logger from '../utils/logger.js';

class ScraperService {
    async scrapeUrl(url) {
        let browser = null;
        try {
            // Validate URL format
            try {
                new URL(url);
            } catch (error) {
                logger.error('Invalid Url Format', error);
                throw new Error('Invalid URL format');
            }

            browser = await puppeteer.launch({
                headless: 'new'
            });
            const page = await browser.newPage();
            
            // Set timeout for navigation
            const response = await page.goto(url, { 
                waitUntil: 'networkidle0',
                timeout: 30000 // 30 seconds timeout
            });

            // Check if page load was successful
            if (!response.ok()) {
                throw new Error(`${response.status()} ${response.statusText()} (Error Code On The URL)`);
            }

            const content = await page.evaluate(() => {
                const text = document.body.innerText;
                if (!text || text.trim().length === 0) {
                    throw new Error('No text content found on page');
                }
                return text;
            });

            if (!content || content.trim().length === 0) {
                throw new Error('No content found on the webpage');
            }

            return content;
        } catch (error) {
            logger.error('Error in web scraping:', error);
            
            // Categorize different types of errors
            if (error.name === 'TimeoutError') {
                throw new Error('URL took too long to respond');
            } else if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
                throw new Error('URL does not exist');
            } else if (error.message.includes('net::ERR_CONNECTION_REFUSED')) {
                throw new Error('Connection to URL was refused');
            } else if (error.message.includes('Invalid URL')) {
                throw new Error('Invalid URL format');
            } else if (error.message.includes('No content found')) {
                throw new Error('No readable content found on the webpage');
            }
            
            throw new Error(`Failed to scrape URL: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

export default ScraperService;
