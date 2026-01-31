/**
 * HTML Fragment Cache for Webview
 * 
 * This module provides caching for static HTML fragments to improve
 * webview rendering performance. Static fragments (those that don't
 * change based on application state) are computed once and cached.
 * 
 * Benefits:
 * - Reduces redundant string concatenation
 * - Minimizes function call overhead
 * - Improves panel load time
 * - Reduces memory churn from repeated string allocations
 */

import {
    getStyles,
    getClientScripts,
    getHeader,
    getSetupSection,
    getTimelineSection,
    getLogSection,
    getFooter,
    getScreenReaderAnnouncer,
    getToastContainer,
    getSkeletonTimeline,
    getSkeletonTask,
    getSkeletonLog,
    getSkeletonRequirements,
    getDurationChartSection,
    getDependencyGraphSection,
    getAggregatedStatsSection,
    getCompletionHistorySection,
    getSessionStatsDashboard,
    getProductivityReportSection
} from './index';

/**
 * Cache keys for static HTML fragments.
 */
export type CacheKey =
    | 'styles'
    | 'clientScripts'
    | 'header'
    | 'setupSection'
    | 'timelineSection'
    | 'logSection'
    | 'footer'
    | 'screenReaderAnnouncer'
    | 'toastContainer'
    | 'skeletonTimeline'
    | 'skeletonTask'
    | 'skeletonLog'
    | 'skeletonRequirements'
    | 'durationChartSection'
    | 'dependencyGraphSection'
    | 'aggregatedStatsSection'
    | 'completionHistorySection'
    | 'sessionStatsDashboard'
    | 'productivityReportSection'
    | 'allSkeletons'
    | 'head';

/**
 * Cache entry with metadata for debugging and monitoring.
 */
export interface CacheEntry {
    /** The cached HTML content */
    content: string;
    /** Timestamp when the entry was created */
    createdAt: number;
    /** Number of times this entry has been accessed */
    hitCount: number;
}

/**
 * Cache statistics for monitoring performance.
 */
export interface CacheStats {
    /** Total number of entries in the cache */
    entryCount: number;
    /** Total cache hits */
    totalHits: number;
    /** Total cache misses (initial population) */
    totalMisses: number;
    /** Total size of cached content in bytes (approximate) */
    totalSizeBytes: number;
    /** Cache hit rate as a percentage */
    hitRate: number;
    /** Entries sorted by hit count (most accessed first) */
    entriesByHits: Array<{ key: CacheKey; hitCount: number }>;
}

/**
 * Static HTML fragment generators mapped to cache keys.
 * These functions return HTML that never changes during runtime.
 */
const STATIC_GENERATORS: Record<CacheKey, () => string> = {
    styles: getStyles,
    clientScripts: getClientScripts,
    header: getHeader,
    setupSection: getSetupSection,
    timelineSection: getTimelineSection,
    logSection: getLogSection,
    footer: getFooter,
    screenReaderAnnouncer: getScreenReaderAnnouncer,
    toastContainer: getToastContainer,
    skeletonTimeline: getSkeletonTimeline,
    skeletonTask: getSkeletonTask,
    skeletonLog: getSkeletonLog,
    skeletonRequirements: getSkeletonRequirements,
    durationChartSection: getDurationChartSection,
    dependencyGraphSection: getDependencyGraphSection,
    aggregatedStatsSection: getAggregatedStatsSection,
    completionHistorySection: getCompletionHistorySection,
    sessionStatsDashboard: getSessionStatsDashboard,
    productivityReportSection: getProductivityReportSection,
    allSkeletons: () => {
        return [
            getSkeletonTimeline(),
            getSkeletonRequirements(),
            getSkeletonTask(),
            getSkeletonLog()
        ].join('\n');
    },
    head: () => {
        return `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ralph</title>
    <style>${getStyles()}</style>
</head>`;
    }
};

/**
 * All available cache keys for static fragments.
 */
export const ALL_CACHE_KEYS: readonly CacheKey[] = Object.keys(STATIC_GENERATORS) as CacheKey[];

/**
 * HTML Cache for storing static fragments.
 * Uses a Map for O(1) lookup performance.
 */
class HtmlFragmentCache {
    private cache: Map<CacheKey, CacheEntry> = new Map();
    private totalHits: number = 0;
    private totalMisses: number = 0;

    /**
     * Gets a cached HTML fragment, generating and caching it if not present.
     * @param key - The cache key for the fragment
     * @returns The cached or newly generated HTML content
     */
    get(key: CacheKey): string {
        const entry = this.cache.get(key);
        
        if (entry) {
            // Cache hit
            entry.hitCount++;
            this.totalHits++;
            return entry.content;
        }
        
        // Cache miss - generate and cache
        this.totalMisses++;
        const generator = STATIC_GENERATORS[key];
        if (!generator) {
            throw new Error(`Unknown cache key: ${key}`);
        }
        
        const content = generator();
        this.cache.set(key, {
            content,
            createdAt: Date.now(),
            hitCount: 0
        });
        
        return content;
    }

    /**
     * Checks if a fragment is already cached.
     * @param key - The cache key to check
     * @returns True if the fragment is cached
     */
    has(key: CacheKey): boolean {
        return this.cache.has(key);
    }

    /**
     * Prewarms the cache with all static fragments.
     * Call this during extension activation for optimal performance.
     */
    prewarm(): void {
        for (const key of ALL_CACHE_KEYS) {
            if (!this.cache.has(key)) {
                const generator = STATIC_GENERATORS[key];
                if (generator) {
                    this.cache.set(key, {
                        content: generator(),
                        createdAt: Date.now(),
                        hitCount: 0
                    });
                }
            }
        }
    }

    /**
     * Clears all cached fragments.
     * Useful for testing or if templates change during development.
     */
    clear(): void {
        this.cache.clear();
        this.totalHits = 0;
        this.totalMisses = 0;
    }

    /**
     * Invalidates a specific cache entry.
     * @param key - The cache key to invalidate
     * @returns True if the entry was found and removed
     */
    invalidate(key: CacheKey): boolean {
        return this.cache.delete(key);
    }

    /**
     * Gets the current size of the cache.
     * @returns Number of cached entries
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Gets cache statistics for monitoring and debugging.
     * @returns Cache statistics object
     */
    getStats(): CacheStats {
        let totalSizeBytes = 0;
        const entriesByHits: Array<{ key: CacheKey; hitCount: number }> = [];
        
        for (const [key, entry] of this.cache.entries()) {
            // Approximate size using UTF-16 encoding (2 bytes per char)
            totalSizeBytes += entry.content.length * 2;
            entriesByHits.push({ key, hitCount: entry.hitCount });
        }
        
        entriesByHits.sort((a, b) => b.hitCount - a.hitCount);
        
        const totalAccesses = this.totalHits + this.totalMisses;
        const hitRate = totalAccesses > 0 ? (this.totalHits / totalAccesses) * 100 : 0;
        
        return {
            entryCount: this.cache.size,
            totalHits: this.totalHits,
            totalMisses: this.totalMisses,
            totalSizeBytes,
            hitRate,
            entriesByHits
        };
    }

    /**
     * Gets a specific cache entry with metadata.
     * @param key - The cache key
     * @returns The cache entry or undefined if not cached
     */
    getEntry(key: CacheKey): Readonly<CacheEntry> | undefined {
        return this.cache.get(key);
    }

    /**
     * Gets all cached keys.
     * @returns Array of cached keys
     */
    getCachedKeys(): CacheKey[] {
        return Array.from(this.cache.keys());
    }
}

/**
 * Singleton instance of the HTML fragment cache.
 */
const htmlCache = new HtmlFragmentCache();

/**
 * Gets a cached static HTML fragment.
 * @param key - The cache key for the fragment
 * @returns The cached HTML content
 */
export function getCachedFragment(key: CacheKey): string {
    return htmlCache.get(key);
}

/**
 * Checks if a fragment is already cached.
 * @param key - The cache key to check
 * @returns True if the fragment is cached
 */
export function isCached(key: CacheKey): boolean {
    return htmlCache.has(key);
}

/**
 * Prewarms the cache with all static fragments.
 * Call this during extension activation for optimal performance.
 */
export function prewarmCache(): void {
    htmlCache.prewarm();
}

/**
 * Clears all cached fragments.
 */
export function clearCache(): void {
    htmlCache.clear();
}

/**
 * Invalidates a specific cache entry.
 * @param key - The cache key to invalidate
 * @returns True if the entry was found and removed
 */
export function invalidateCache(key: CacheKey): boolean {
    return htmlCache.invalidate(key);
}

/**
 * Gets the current cache size.
 * @returns Number of cached entries
 */
export function getCacheSize(): number {
    return htmlCache.size();
}

/**
 * Gets cache statistics for monitoring.
 * @returns Cache statistics object
 */
export function getCacheStats(): CacheStats {
    return htmlCache.getStats();
}

/**
 * Gets a specific cache entry with metadata.
 * @param key - The cache key
 * @returns The cache entry or undefined if not cached
 */
export function getCacheEntry(key: CacheKey): Readonly<CacheEntry> | undefined {
    return htmlCache.getEntry(key);
}

/**
 * Gets all currently cached keys.
 * @returns Array of cached keys
 */
export function getCachedKeys(): CacheKey[] {
    return htmlCache.getCachedKeys();
}

// ============================================================================
// Cached accessors for common use cases
// ============================================================================

/**
 * Gets the cached styles.
 */
export function getCachedStyles(): string {
    return htmlCache.get('styles');
}

/**
 * Gets the cached client scripts.
 */
export function getCachedClientScripts(): string {
    return htmlCache.get('clientScripts');
}

/**
 * Gets the cached header HTML.
 */
export function getCachedHeader(): string {
    return htmlCache.get('header');
}

/**
 * Gets the cached setup section HTML.
 */
export function getCachedSetupSection(): string {
    return htmlCache.get('setupSection');
}

/**
 * Gets the cached timeline section HTML.
 */
export function getCachedTimelineSection(): string {
    return htmlCache.get('timelineSection');
}

/**
 * Gets the cached log section HTML.
 */
export function getCachedLogSection(): string {
    return htmlCache.get('logSection');
}

/**
 * Gets the cached footer HTML.
 */
export function getCachedFooter(): string {
    return htmlCache.get('footer');
}

/**
 * Gets the cached screen reader announcer HTML.
 */
export function getCachedScreenReaderAnnouncer(): string {
    return htmlCache.get('screenReaderAnnouncer');
}

/**
 * Gets the cached toast container HTML.
 */
export function getCachedToastContainer(): string {
    return htmlCache.get('toastContainer');
}

/**
 * Gets the cached skeleton timeline HTML.
 */
export function getCachedSkeletonTimeline(): string {
    return htmlCache.get('skeletonTimeline');
}

/**
 * Gets the cached skeleton task HTML.
 */
export function getCachedSkeletonTask(): string {
    return htmlCache.get('skeletonTask');
}

/**
 * Gets the cached skeleton log HTML.
 */
export function getCachedSkeletonLog(): string {
    return htmlCache.get('skeletonLog');
}

/**
 * Gets the cached skeleton requirements HTML.
 */
export function getCachedSkeletonRequirements(): string {
    return htmlCache.get('skeletonRequirements');
}

/**
 * Gets the cached duration chart section HTML.
 */
export function getCachedDurationChartSection(): string {
    return htmlCache.get('durationChartSection');
}

/**
 * Gets the cached dependency graph section HTML.
 */
export function getCachedDependencyGraphSection(): string {
    return htmlCache.get('dependencyGraphSection');
}

/**
 * Gets the cached aggregated stats section HTML.
 */
export function getCachedAggregatedStatsSection(): string {
    return htmlCache.get('aggregatedStatsSection');
}

/**
 * Gets the cached completion history section HTML.
 */
export function getCachedCompletionHistorySection(): string {
    return htmlCache.get('completionHistorySection');
}

/**
 * Gets the cached session stats dashboard HTML.
 */
export function getCachedSessionStatsDashboard(): string {
    return htmlCache.get('sessionStatsDashboard');
}

/**
 * Gets the cached productivity report section HTML.
 */
export function getCachedProductivityReportSection(): string {
    return htmlCache.get('productivityReportSection');
}

/**
 * Gets all cached skeleton loaders combined.
 */
export function getCachedAllSkeletons(): string {
    return htmlCache.get('allSkeletons');
}

/**
 * Gets the cached document head HTML.
 */
export function getCachedHead(): string {
    return htmlCache.get('head');
}

/**
 * Exports the singleton cache instance for testing.
 * @internal
 */
export function _getCacheInstance(): HtmlFragmentCache {
    return htmlCache;
}
