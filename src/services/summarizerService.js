import { HfInference } from '@huggingface/inference';
import config from '../config/config.js';
import logger from '../utils/logger.js';

class SummarizerService {
    constructor() {
        this.client = new HfInference(config.HUGGINGFACE_TOKEN);
    }

    async summarize(content) {
        try {
            if (!content || content.trim().length === 0) {
                throw new Error('No content provided for summarization');
            }

            // Truncate content if it's too long (adjust limit as needed)
            const truncatedContent = content.slice(0, 5000);

            const chatCompletion = await this.client.chatCompletion({
                model: "meta-llama/Llama-3.2-3B-Instruct",
                messages: [
                    { role: "system", content: "summarize the following text concisely" },
                    { role: "user", content: truncatedContent },
                ],
                temperature: 0.5,
                max_tokens: 100,
                top_p: 0.7
            });

            if (!chatCompletion || !chatCompletion.choices || !chatCompletion.choices[0]) {
                throw new Error('Failed to generate summary from the llama model');
            }

            const summary = chatCompletion.choices[0].message.content;
            if (!summary || summary.trim().length === 0) {
                throw new Error('Generated summary is empty');
            }

            return summary;
        } catch (error) {
            logger.error('Error in summarization:', error);
            
            // Categorize different types of errors
            if (error.message.includes('Failed to generate summary')) {
                throw new Error('Failed to generate summary from the llama model');
            } else if (error.message.includes('No content provided')) {
                throw new Error('No content available for summarization');
            } else if (error.name === 'TypeError') {
                throw new Error('Unexpected response format from the llama model');
            }
            
            throw new Error(`Summarization failed: ${error.message}`);
        }
    }
}

export default SummarizerService;