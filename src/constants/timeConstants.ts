const timeConstants = {
    DEFAULT_GC_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
    DEFAULT_STALE_TIME: 1000 * 60 * 10, // 10 minutes in milliseconds
    DEFAULT_MEMOIZE_CACHE_TIME: 1000 * 60 * 1, // 1 minute in milliseconds
    REDIS_CACHE_TIME: 60 * 60 * 24 * 30, // 30 day in seconds
    REDIS_CACHE_SORT_TIME: 60 * 60 * 1, // 1 hours in seconds
    REDIS_TEACHER_CACHE_TIME: 30 * 24 * 60 * 60, // 30 days in seconds
    REDIS_ROOM_CACHE_TIME: 60 * 60 * 24 * 30, // 30 days in seconds
    REDIS_CACHE_SCHEDULE: 60 * 5 // 5 minutes in seconds
}

export default timeConstants
