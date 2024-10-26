import Summary from '../models/summaryModel.js';
import ScraperService from '../services/scraperService.js';
import SummarizerService from '../services/summarizerService.js';
import logger from '../utils/logger.js';

class SummaryController {
    static async createJob(req, res) {
        try {
            const { url } = req.body;
            
            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            // Validate URL format
            try {
                new URL(url);
            } catch (error) {
                logger.error('Error Invalid URL:', error);
                return res.status(400).json({ error: 'Invalid URL format or Invalid URL' });
            }

            const summary = new Summary({ url });
            await summary.save();

            // Start async processing
            SummaryController.processJob(summary._id, url);

            return res.status(201).json({
                id: summary._id,
                url,
                status: 'pending'
            });
        } catch (error) {
            logger.error('Error creating job:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getJob(req, res) {
        try {
            const { id } = req.params;
            const summary = await Summary.findById(id);

            if (!summary) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.json({
                id: summary._id,
                url: summary.url,
                status: summary.status,
                summary: summary.summary,
                error_message: summary.error_message
            });
        } catch (error) {
            logger.error('Error fetching job:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async processJob(jobId, url) {
        const scraperService = new ScraperService();
        const summarizerService = new SummarizerService();

        try {
            // Step 1: Scrape content
            const content = await scraperService.scrapeUrl(url);

            try {
                // Step 2: Generate summary
                const summary = await summarizerService.summarize(content);

                // Step 3: Update database with success
                await Summary.findByIdAndUpdate(jobId, {
                    status: 'completed',
                    summary
                });
            } catch (summaryError) {
                // Handle summarization failure
                logger.error('Summarization failed:', summaryError);
                await Summary.findByIdAndUpdate(jobId, {
                    status: 'failed',
                    error_message: summaryError.message
                });
            }
        } catch (scrapeError) {
            // Handle scraping failure
            logger.error('Scraping failed:', scrapeError);
            await Summary.findByIdAndUpdate(jobId, {
                status: 'failed',
                error_message: scrapeError.message
            });
        }
    }
}

export default SummaryController;