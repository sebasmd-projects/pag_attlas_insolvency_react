import { LRUCache } from 'lru-cache';

/**
 * Rate limiter using LRU cache
 * @param {Object} options - Configuration options
 * @param {number} options.interval - Time window in milliseconds
 * @param {number} options.uniqueTokenPerInterval - Max unique tokens to track
 * @returns {Object} Rate limiter with check method
 */
const rateLimit = (options) => {
    const tokenCache = new LRUCache({
        max: options.uniqueTokenPerInterval || 500,
        ttl: options.interval || 60000,
    });

    return {
        /**
         * Check if the rate limit has been exceeded
         * @param {number} limit - Max requests per interval
         * @param {string} token - Unique identifier (e.g., IP address)
         * @returns {Promise<void>}
         */
        check: (limit, token) => new Promise((resolve, reject) => {
            const tokenCount = tokenCache.get(token) || 0;
            
            if (tokenCount >= limit) {
                reject(new Error('Rate limit exceeded'));
                return;
            }
            
            tokenCache.set(token, tokenCount + 1);
            resolve();
        }),
        
        /**
         * Get remaining attempts for a token
         * @param {number} limit - Max requests per interval
         * @param {string} token - Unique identifier
         * @returns {number} Remaining attempts
         */
        remaining: (limit, token) => {
            const tokenCount = tokenCache.get(token) || 0;
            return Math.max(0, limit - tokenCount);
        },
        
        /**
         * Reset the rate limit for a token
         * @param {string} token - Unique identifier
         */
        reset: (token) => {
            tokenCache.delete(token);
        },
    };
};

export default rateLimit;
