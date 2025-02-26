import LRU from 'lru-cache';

const rateLimit = (options) => {
    const tokenCache = new LRU({
        max: options.uniqueTokenPerInterval || 500,
        ttl: options.interval || 60000,
    });

    return {
        check: (limit, token) => new Promise((resolve, reject) => {
            const tokenCount = tokenCache.get(token) || 0;
            tokenCache.set(token, tokenCount + 1);

            return tokenCount < limit
                ? resolve()
                : reject(new Error('Rate limit exceeded'));
        }),
    };
};

export default rateLimit;