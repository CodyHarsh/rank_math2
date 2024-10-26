# Web Page Summarizer Service

This project is a web service that scrapes web pages and generates summaries using the Llama language model through HuggingFace's API. It provides an asynchronous API interface for submitting URLs and retrieving their summaries.

## Project Structure

```
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ node_modules/ (ignored)
├─ src/
│  ├─ config/
│  │  └─ config.js          # Configuration management
│  ├─ controllers/
│  │  └─ summaryController.js # Request handling logic
│  ├─ database/
│  │  └─ connection.js      # MongoDB connection setup
│  ├─ models/
│  │  └─ summaryModel.js    # Database schema definitions
│  ├─ routes/
│  │  └─ summaryRoutes.js   # API route definitions
│  ├─ services/
│  │  ├─ scraperService.js  # Web scraping functionality
│  │  └─ summarizerService.js # Text summarization logic
│  └─ utils/
│     └─ logger.js          # Logging configuration
├─ .env (ignored)           # Environment variables
├─ .env.example            # Example environment variables
├─ .gitignore
├─ combined.log (ignored)   # Application logs
├─ error.log (ignored)      # Error logs
├─ eslint.config.js        # ESLint configuration
├─ Explanation.md          # Project documentation
├─ index.js               # Application entry point
├─ package-lock.json      # Dependency lock file
├─ package.json           # Project configuration
└─ Readme.md              # Project readme
```

## Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/CodyHarsh/rank_math2.git
   cd rank_math2
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your credentials:
     ```
     MONGODB_URI=your_mongodb_connection_string
     HUGGINGFACE_TOKEN=your_huggingface_api_token
     PORT=3001
     ```

4. **Start the Application**
   ```bash
   # Development mode with nodemon
   nodemon index.js
   
   # Or production mode
   node index.js
   ```

## Architecture Design

### Overview
The application follows a modular architecture with clear separation of concerns. It's built using Node.js and Express.js, utilizing MongoDB for persistence and integrating with external services for web scraping and text summarization.

### Key Components

1. **API Layer**
   - RESTful API endpoints for creating and retrieving summaries
   - Asynchronous job processing to handle long-running tasks
   - Request validation and error handling

2. **Controllers**
   - `SummaryController`: Manages the business logic for summary creation and retrieval
   - Handles job creation, status updates, and error management
   - Orchestrates communication between services

3. **Services**
   - `ScraperService`: Handles web page content extraction
     - Uses Puppeteer for reliable web scraping
     - Implements timeout and error handling
     - Validates URL format and content availability
   
   - `SummarizerService`: Manages text summarization
     - Integrates with HuggingFace's API
     - Uses Llama model for text summarization
     - Handles content truncation and validation

4. **Data Layer**
   - MongoDB for persistent storage
   - Mongoose schemas for data modeling
   - Stores job status, URLs, and generated summaries

5. **Utilities**
   - Winston logger for comprehensive logging
   - Configuration management using environment variables
   - Error handling and monitoring

### Process Flow

1. **Summary Creation**
   ```
   Client → API → Controller → Create Job → Start Async Process
                                       ↓
                              Scrape Web Content
                                       ↓
                              Generate Summary
                                       ↓
                              Update Database
   ```

2. **Summary Retrieval**
   ```
   Client → API → Controller → Check Database → Return Results
   ```

### Error Handling

- Comprehensive error handling at each layer
- Detailed error logging and monitoring
- User-friendly error messages
- Proper HTTP status codes for different error scenarios

### Scalability Considerations

- Asynchronous processing for long-running tasks
- Modular architecture for easy maintenance and updates
- Database indexes for efficient queries
- Configurable timeouts and limits
- Environment-based configuration

## API Documentation

### Endpoints

1. **Create Summary Job**
   ```
   POST /api/summary
   Body: { "url": "https://example.com" }
   ```
   
   curl:
   ```
   curl --location 'http://localhost:3000/api/summary' \
   --header 'Content-Type: application/json' \
   --data '{
      "url": "https://stackoverflow.com/"
   }'
   ```

2. **Get Summary Status**
   ```
   GET /api/summary/:id
   ```
   curl:
   ```
   curl --location 'http://localhost:3000/api/summary/671c895d760ec7e0c60de0b5' \
   --header 'Content-Type: application/json' \
   --data ''
   ```

### Response Formats

1. **Job Creation Response**
   ```json
   {
     "id": "job_id",
     "url": "submitted_url",
     "status": "pending"
   }
   ```

2. **Job Status Response**
   ```json
   {
     "id": "job_id",
     "url": "submitted_url",
     "status": "completed|failed",
     "summary": "generated_summary",
     "error_message": "error_if_any"
   }
   ```

## Technologies Used

### Core Technologies
1. **Node.js & Express.js**
   - Platform: Node.js for server-side JavaScript execution
   - Framework: Express.js for RESTful API development
   - Benefits: 
     - Non-blocking I/O for handling concurrent requests
     - Rich ecosystem of packages
     - Easy to scale horizontally
     - Great for handling asynchronous operations

2. **MongoDB**
   - NoSQL database for flexible data storage
   - Mongoose ODM for schema validation and management
   - Advantages:
     - Schema-less design for flexible data structures
     - Horizontal scaling capabilities
     - Efficient for read-heavy operations

### External Services & Tools
1. **HuggingFace Integration**
   - Used for accessing Llama language model
   - Features:
     - Advanced text summarization capabilities
     - API-based access to state-of-the-art AI models
     - Configurable parameters for summary generation

2. **Puppeteer**
   - Headless Chrome browser for web scraping
   - Capabilities:
     - JavaScript execution for dynamic content
     - Configurable timeouts and browser settings
     - Resource management and optimization

### Development & Quality Tools
1. **ESLint**
   - Static code analysis
   - Code style enforcement
   - Error prevention
   - Configuration for modern JavaScript features

2. **GitHub CI**
   - Automated Eslint process
   - Continuous Integration workflow

## Production Readiness Considerations

### Current Limitations and Scaling Solutions

1. **Rate Limiting and Queue Management**
   - Current Limitation: No request rate limiting
   - Solution:
     ```javascript
     // Implement Redis-based rate limiting
     const rateLimit = require('express-rate-limit');
     const RedisStore = require('rate-limit-redis');
     
     app.use(rateLimit({
       store: new RedisStore({
         redis: redisClient
       }),
       windowMs: 15 * 60 * 1000,
       max: 100
     }));
     ```

2. **Job Queue Processing**
   - Current Limitation: Synchronous job processing
   - Solution: Implement Bull queue with Redis
     - Horizontal scaling of workers
     - Job prioritization
     - Retry mechanisms
     - Monitoring and analytics

3. **Caching Layer**
   - Current Limitation: No caching mechanism
   - Solution:
     - Implement Redis caching for frequently accessed URLs
     - Cache summarization results
     - Implement cache invalidation strategies

4. **Database Optimization**
   - Current Limitation: Basic MongoDB setup
   - Solutions:
     - Implement database sharding
     - Add read replicas
     - Implement proper indexing
     - Archive old data

### Production Enhancement Roadmap

1. **Monitoring and Observability**
   ```javascript
   // Example: Prometheus metrics integration
   const prometheus = require('prom-client');
   const jobProcessingDuration = new prometheus.Histogram({
     name: 'job_processing_duration_seconds',
     help: 'Duration of job processing'
   });
   ```

2. **Security Enhancements**
   - API authentication
   - Request validation
   - Rate limiting per user
   - Input sanitization

3. **High Availability Setup**
   - Load balancer configuration
   - Multiple server regions
   - Failover strategies
   - Database replication

### Why This Architecture?

1. **Asynchronous Processing**
   - Chose asynchronous architecture because:
     - Web scraping can be time-consuming
     - Users shouldn't wait for processing
     - Better resource utilization
     - Improved error handling capabilities

2. **Service Separation**
   - Separate services for scraping and summarization because:
     - Independent scaling of components
     - Better error isolation
     - Easier maintenance and updates
     - Potential for service reuse

3. **MongoDB Selection**
   - Chose MongoDB over relational databases because:
     - Flexible schema for varying summary lengths
     - Good performance for read-heavy operations
     - Easy horizontal scaling
     - Native JSON support

### Alternative Approaches Considered

1. **Synchronous Processing**
   - Pros:
     - Simpler implementation
     - Immediate results
   - Cons:
     - Poor user experience for long jobs
     - Resource intensive
     - Less scalable

2. **Serverless Architecture**
   - Pros:
     - Auto-scaling
     - Pay-per-use
   - Cons:
     - Cold starts
     - Complex state management
     - Potentially higher costs at scale

### Future Improvements

1. **Scalability Enhancements**
   ```javascript
   // Example: Worker Pool Implementation
   const workerpool = require('workerpool');
   const pool = workerpool.pool('./worker.js', {
     minWorkers: 2,
     maxWorkers: 8
   });
   ```

2. **Performance Optimizations**
   - Content-based caching
   - Smart queuing strategies
   - Resource pooling 
   - Webhook's or Long Streaming (Better than pooling)
   - Request batching

3. **Feature Additions**
   - Custom summarization parameters
   - Multiple summary formats
   - Batch processing
   - Analytics dashboard



This architecture and implementation provide a solid foundation for a production-ready application while maintaining flexibility for future enhancements and scaling needs.