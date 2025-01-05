const timeConstants = {
    DEFAULT_GC_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
    DEFAULT_STALE_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
    DEFAULT_MEMOIZE_CACHE_TIME: 1000 * 60 * 1, // 1 minute in milliseconds
    REDIS_CACHE_TIME: 60 * 60 * 24 * 30, // 30 day in seconds
    REDIS_CACHE_SORT_TIME: 60 * 60 * 3, // 3 hours in seconds
    REDIS_CACHE_SCHEDULE: 60 * 30 // 30 minutes in seconds
}

export default timeConstants
