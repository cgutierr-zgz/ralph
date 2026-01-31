import * as assert from 'assert';

// We need to import the cache module functions
// Since this is a unit test, we'll test the module's behavior

describe('HTML Fragment Cache', () => {
    // Import the module
    let cacheModule: typeof import('../../webview/htmlCache.js');
    
    before(async () => {
        cacheModule = await import('../../webview/htmlCache.js');
    });
    
    beforeEach(() => {
        // Clear cache before each test to ensure isolation
        cacheModule.clearCache();
    });

    describe('CacheKey type', () => {
        it('should define all expected cache keys', () => {
            const expectedKeys = [
                'styles', 'clientScripts', 'header', 'setupSection',
                'timelineSection', 'logSection', 'footer', 'screenReaderAnnouncer',
                'toastContainer', 'skeletonTimeline', 'skeletonTask', 'skeletonLog',
                'skeletonRequirements', 'durationChartSection', 'dependencyGraphSection',
                'aggregatedStatsSection', 'allSkeletons', 'head', 'completionHistorySection',
                'sessionStatsDashboard', 'productivityReportSection'
            ];
            assert.deepStrictEqual([...cacheModule.ALL_CACHE_KEYS].sort(), expectedKeys.sort());
        });
        
        it('should have ALL_CACHE_KEYS as readonly array', () => {
            assert.ok(Array.isArray(cacheModule.ALL_CACHE_KEYS));
            assert.strictEqual(cacheModule.ALL_CACHE_KEYS.length, 21);
        });
    });

    describe('getCachedFragment', () => {
        it('should return HTML string for styles', () => {
            const result = cacheModule.getCachedFragment('styles');
            assert.ok(typeof result === 'string');
            assert.ok(result.length > 0);
            assert.ok(result.includes(':root') || result.includes('body'));
        });
        
        it('should return HTML string for clientScripts', () => {
            const result = cacheModule.getCachedFragment('clientScripts');
            assert.ok(typeof result === 'string');
            assert.ok(result.length > 0);
            assert.ok(result.includes('vscode') || result.includes('function'));
        });
        
        it('should return HTML string for header', () => {
            const result = cacheModule.getCachedFragment('header');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('header'));
            assert.ok(result.includes('Ralph'));
        });
        
        it('should return HTML string for setupSection', () => {
            const result = cacheModule.getCachedFragment('setupSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('setup'));
        });
        
        it('should return HTML string for timelineSection', () => {
            const result = cacheModule.getCachedFragment('timelineSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('timeline'));
        });
        
        it('should return HTML string for logSection', () => {
            const result = cacheModule.getCachedFragment('logSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('log'));
        });
        
        it('should return HTML string for footer', () => {
            const result = cacheModule.getCachedFragment('footer');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('footer'));
        });
        
        it('should return HTML string for screenReaderAnnouncer', () => {
            const result = cacheModule.getCachedFragment('screenReaderAnnouncer');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('aria-live') || result.includes('sr'));
        });
        
        it('should return HTML string for toastContainer', () => {
            const result = cacheModule.getCachedFragment('toastContainer');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('toast'));
        });
        
        it('should return HTML string for skeletonTimeline', () => {
            const result = cacheModule.getCachedFragment('skeletonTimeline');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('skeleton'));
        });
        
        it('should return HTML string for skeletonTask', () => {
            const result = cacheModule.getCachedFragment('skeletonTask');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('skeleton'));
        });
        
        it('should return HTML string for skeletonLog', () => {
            const result = cacheModule.getCachedFragment('skeletonLog');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('skeleton'));
        });
        
        it('should return HTML string for skeletonRequirements', () => {
            const result = cacheModule.getCachedFragment('skeletonRequirements');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('skeleton'));
        });
        
        it('should return HTML string for durationChartSection', () => {
            const result = cacheModule.getCachedFragment('durationChartSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('duration'));
        });
        
        it('should return HTML string for dependencyGraphSection', () => {
            const result = cacheModule.getCachedFragment('dependencyGraphSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('dependency'));
        });
        
        it('should return HTML string for aggregatedStatsSection', () => {
            const result = cacheModule.getCachedFragment('aggregatedStatsSection');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('aggregated'));
        });
        
        it('should return HTML string for allSkeletons', () => {
            const result = cacheModule.getCachedFragment('allSkeletons');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('skeleton'));
        });
        
        it('should return HTML string for head', () => {
            const result = cacheModule.getCachedFragment('head');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('<head>'));
            assert.ok(result.includes('</head>'));
            assert.ok(result.includes('<style>'));
        });
        
        it('should return HTML string for sessionStatsDashboard', () => {
            const result = cacheModule.getCachedFragment('sessionStatsDashboard');
            assert.ok(typeof result === 'string');
            assert.ok(result.includes('session-stats'));
        });
        
        it('should return same content on subsequent calls (caching)', () => {
            const first = cacheModule.getCachedFragment('header');
            const second = cacheModule.getCachedFragment('header');
            assert.strictEqual(first, second);
        });
    });

    describe('isCached', () => {
        it('should return false for uncached key', () => {
            cacheModule.clearCache();
            assert.strictEqual(cacheModule.isCached('header'), false);
        });
        
        it('should return true after fragment is accessed', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            assert.strictEqual(cacheModule.isCached('header'), true);
        });
        
        it('should return false after cache is cleared', () => {
            cacheModule.getCachedFragment('header');
            cacheModule.clearCache();
            assert.strictEqual(cacheModule.isCached('header'), false);
        });
    });

    describe('prewarmCache', () => {
        it('should populate all cache entries', () => {
            cacheModule.clearCache();
            assert.strictEqual(cacheModule.getCacheSize(), 0);
            
            cacheModule.prewarmCache();
            
            assert.strictEqual(cacheModule.getCacheSize(), cacheModule.ALL_CACHE_KEYS.length);
        });
        
        it('should make all fragments immediately available', () => {
            cacheModule.clearCache();
            cacheModule.prewarmCache();
            
            for (const key of cacheModule.ALL_CACHE_KEYS) {
                assert.strictEqual(cacheModule.isCached(key), true);
            }
        });
        
        it('should not regenerate already cached entries', () => {
            cacheModule.clearCache();
            // Access one fragment first
            cacheModule.getCachedFragment('header');
            const firstEntry = cacheModule.getCacheEntry('header');
            const firstCreatedAt = firstEntry?.createdAt;
            
            // Prewarm
            cacheModule.prewarmCache();
            
            // Check the header was not regenerated
            const secondEntry = cacheModule.getCacheEntry('header');
            assert.strictEqual(secondEntry?.createdAt, firstCreatedAt);
        });
    });

    describe('clearCache', () => {
        it('should remove all entries', () => {
            cacheModule.prewarmCache();
            assert.ok(cacheModule.getCacheSize() > 0);
            
            cacheModule.clearCache();
            
            assert.strictEqual(cacheModule.getCacheSize(), 0);
        });
        
        it('should reset statistics', () => {
            cacheModule.prewarmCache();
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            
            cacheModule.clearCache();
            
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(stats.totalHits, 0);
            assert.strictEqual(stats.totalMisses, 0);
        });
    });

    describe('invalidateCache', () => {
        it('should remove specific entry', () => {
            cacheModule.prewarmCache();
            assert.strictEqual(cacheModule.isCached('header'), true);
            
            const result = cacheModule.invalidateCache('header');
            
            assert.strictEqual(result, true);
            assert.strictEqual(cacheModule.isCached('header'), false);
        });
        
        it('should return false for non-existent entry', () => {
            cacheModule.clearCache();
            const result = cacheModule.invalidateCache('header');
            assert.strictEqual(result, false);
        });
        
        it('should not affect other entries', () => {
            cacheModule.prewarmCache();
            cacheModule.invalidateCache('header');
            
            assert.strictEqual(cacheModule.isCached('footer'), true);
            assert.strictEqual(cacheModule.isCached('styles'), true);
        });
    });

    describe('getCacheSize', () => {
        it('should return 0 for empty cache', () => {
            cacheModule.clearCache();
            assert.strictEqual(cacheModule.getCacheSize(), 0);
        });
        
        it('should increment as entries are added', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            assert.strictEqual(cacheModule.getCacheSize(), 1);
            
            cacheModule.getCachedFragment('footer');
            assert.strictEqual(cacheModule.getCacheSize(), 2);
        });
        
        it('should not increment for cache hits', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            assert.strictEqual(cacheModule.getCacheSize(), 1);
        });
    });

    describe('getCacheStats', () => {
        it('should return correct structure', () => {
            const stats = cacheModule.getCacheStats();
            assert.ok('entryCount' in stats);
            assert.ok('totalHits' in stats);
            assert.ok('totalMisses' in stats);
            assert.ok('totalSizeBytes' in stats);
            assert.ok('hitRate' in stats);
            assert.ok('entriesByHits' in stats);
        });
        
        it('should track hits correctly', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header'); // miss
            cacheModule.getCachedFragment('header'); // hit
            cacheModule.getCachedFragment('header'); // hit
            
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(stats.totalMisses, 1);
            assert.strictEqual(stats.totalHits, 2);
        });
        
        it('should calculate hit rate correctly', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header'); // miss
            cacheModule.getCachedFragment('header'); // hit
            cacheModule.getCachedFragment('header'); // hit
            cacheModule.getCachedFragment('header'); // hit
            
            const stats = cacheModule.getCacheStats();
            // 3 hits out of 4 total accesses = 75%
            assert.strictEqual(stats.hitRate, 75);
        });
        
        it('should sort entriesByHits by hit count descending', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('footer');
            cacheModule.getCachedFragment('footer');
            cacheModule.getCachedFragment('styles');
            
            const stats = cacheModule.getCacheStats();
            // header has 2 hits, footer has 1 hit, styles has 0 hits
            assert.strictEqual(stats.entriesByHits[0].key, 'header');
            assert.strictEqual(stats.entriesByHits[0].hitCount, 2);
            assert.strictEqual(stats.entriesByHits[1].key, 'footer');
            assert.strictEqual(stats.entriesByHits[1].hitCount, 1);
        });
        
        it('should estimate size in bytes', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            
            const stats = cacheModule.getCacheStats();
            assert.ok(stats.totalSizeBytes > 0);
        });
    });

    describe('getCacheEntry', () => {
        it('should return undefined for uncached key', () => {
            cacheModule.clearCache();
            const entry = cacheModule.getCacheEntry('header');
            assert.strictEqual(entry, undefined);
        });
        
        it('should return entry with correct structure', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            const entry = cacheModule.getCacheEntry('header');
            
            assert.ok(entry !== undefined);
            assert.ok('content' in entry);
            assert.ok('createdAt' in entry);
            assert.ok('hitCount' in entry);
        });
        
        it('should track hit count', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header'); // miss (hitCount = 0)
            cacheModule.getCachedFragment('header'); // hit (hitCount = 1)
            cacheModule.getCachedFragment('header'); // hit (hitCount = 2)
            
            const entry = cacheModule.getCacheEntry('header');
            assert.strictEqual(entry?.hitCount, 2);
        });
        
        it('should have valid createdAt timestamp', () => {
            const before = Date.now();
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            const after = Date.now();
            
            const entry = cacheModule.getCacheEntry('header');
            assert.ok(entry !== undefined);
            assert.ok(entry.createdAt >= before);
            assert.ok(entry.createdAt <= after);
        });
    });

    describe('getCachedKeys', () => {
        it('should return empty array for empty cache', () => {
            cacheModule.clearCache();
            const keys = cacheModule.getCachedKeys();
            assert.deepStrictEqual(keys, []);
        });
        
        it('should return array of cached keys', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('footer');
            
            const keys = cacheModule.getCachedKeys();
            assert.strictEqual(keys.length, 2);
            assert.ok(keys.includes('header'));
            assert.ok(keys.includes('footer'));
        });
    });

    describe('Convenience accessor functions', () => {
        it('getCachedStyles should return styles', () => {
            const result = cacheModule.getCachedStyles();
            assert.ok(typeof result === 'string');
            assert.ok(result.length > 0);
        });
        
        it('getCachedClientScripts should return scripts', () => {
            const result = cacheModule.getCachedClientScripts();
            assert.ok(typeof result === 'string');
            assert.ok(result.length > 0);
        });
        
        it('getCachedHeader should return header HTML', () => {
            const result = cacheModule.getCachedHeader();
            assert.ok(result.includes('header'));
        });
        
        it('getCachedSetupSection should return setup HTML', () => {
            const result = cacheModule.getCachedSetupSection();
            assert.ok(result.includes('setup'));
        });
        
        it('getCachedTimelineSection should return timeline HTML', () => {
            const result = cacheModule.getCachedTimelineSection();
            assert.ok(result.includes('timeline'));
        });
        
        it('getCachedLogSection should return log HTML', () => {
            const result = cacheModule.getCachedLogSection();
            assert.ok(result.includes('log'));
        });
        
        it('getCachedFooter should return footer HTML', () => {
            const result = cacheModule.getCachedFooter();
            assert.ok(result.includes('footer'));
        });
        
        it('getCachedScreenReaderAnnouncer should return announcer HTML', () => {
            const result = cacheModule.getCachedScreenReaderAnnouncer();
            assert.ok(typeof result === 'string');
        });
        
        it('getCachedToastContainer should return toast HTML', () => {
            const result = cacheModule.getCachedToastContainer();
            assert.ok(result.includes('toast'));
        });
        
        it('getCachedSkeletonTimeline should return skeleton HTML', () => {
            const result = cacheModule.getCachedSkeletonTimeline();
            assert.ok(result.includes('skeleton'));
        });
        
        it('getCachedSkeletonTask should return skeleton HTML', () => {
            const result = cacheModule.getCachedSkeletonTask();
            assert.ok(result.includes('skeleton'));
        });
        
        it('getCachedSkeletonLog should return skeleton HTML', () => {
            const result = cacheModule.getCachedSkeletonLog();
            assert.ok(result.includes('skeleton'));
        });
        
        it('getCachedSkeletonRequirements should return skeleton HTML', () => {
            const result = cacheModule.getCachedSkeletonRequirements();
            assert.ok(result.includes('skeleton'));
        });
        
        it('getCachedDurationChartSection should return duration HTML', () => {
            const result = cacheModule.getCachedDurationChartSection();
            assert.ok(result.includes('duration'));
        });
        
        it('getCachedDependencyGraphSection should return dependency HTML', () => {
            const result = cacheModule.getCachedDependencyGraphSection();
            assert.ok(result.includes('dependency'));
        });
        
        it('getCachedAllSkeletons should return all skeletons', () => {
            const result = cacheModule.getCachedAllSkeletons();
            assert.ok(result.includes('skeleton'));
            assert.ok(result.includes('skeletonTimeline') || result.includes('skeleton-timeline'));
        });
        
        it('getCachedHead should return head HTML', () => {
            const result = cacheModule.getCachedHead();
            assert.ok(result.includes('<head>'));
            assert.ok(result.includes('</head>'));
        });
    });

    describe('Cache performance characteristics', () => {
        it('should return same reference for cached content', () => {
            cacheModule.clearCache();
            const first = cacheModule.getCachedFragment('header');
            const second = cacheModule.getCachedFragment('header');
            // String references should be the same (same object)
            assert.strictEqual(first, second);
        });
        
        it('should handle rapid successive calls', () => {
            cacheModule.clearCache();
            const results: string[] = [];
            for (let i = 0; i < 100; i++) {
                results.push(cacheModule.getCachedFragment('header'));
            }
            
            // All results should be identical
            const first = results[0];
            assert.ok(results.every(r => r === first));
            
            // Should have 1 miss and 99 hits
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(stats.totalMisses, 1);
            assert.strictEqual(stats.totalHits, 99);
        });
        
        it('should handle concurrent access to different keys', () => {
            cacheModule.clearCache();
            
            // Access multiple keys
            const header = cacheModule.getCachedFragment('header');
            const footer = cacheModule.getCachedFragment('footer');
            const styles = cacheModule.getCachedFragment('styles');
            
            // All should be valid
            assert.ok(header.length > 0);
            assert.ok(footer.length > 0);
            assert.ok(styles.length > 0);
            
            // All should be cached
            assert.strictEqual(cacheModule.getCacheSize(), 3);
        });
    });

    describe('CacheEntry interface', () => {
        it('should have content as string', () => {
            cacheModule.getCachedFragment('header');
            const entry = cacheModule.getCacheEntry('header');
            assert.strictEqual(typeof entry?.content, 'string');
        });
        
        it('should have createdAt as number', () => {
            cacheModule.getCachedFragment('header');
            const entry = cacheModule.getCacheEntry('header');
            assert.strictEqual(typeof entry?.createdAt, 'number');
        });
        
        it('should have hitCount as number', () => {
            cacheModule.getCachedFragment('header');
            const entry = cacheModule.getCacheEntry('header');
            assert.strictEqual(typeof entry?.hitCount, 'number');
        });
    });

    describe('CacheStats interface', () => {
        it('should have entryCount as number', () => {
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(typeof stats.entryCount, 'number');
        });
        
        it('should have totalHits as number', () => {
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(typeof stats.totalHits, 'number');
        });
        
        it('should have totalMisses as number', () => {
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(typeof stats.totalMisses, 'number');
        });
        
        it('should have totalSizeBytes as number', () => {
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(typeof stats.totalSizeBytes, 'number');
        });
        
        it('should have hitRate as number', () => {
            const stats = cacheModule.getCacheStats();
            assert.strictEqual(typeof stats.hitRate, 'number');
        });
        
        it('should have entriesByHits as array', () => {
            const stats = cacheModule.getCacheStats();
            assert.ok(Array.isArray(stats.entriesByHits));
        });
        
        it('should have hitRate between 0 and 100', () => {
            cacheModule.clearCache();
            cacheModule.getCachedFragment('header');
            cacheModule.getCachedFragment('header');
            
            const stats = cacheModule.getCacheStats();
            assert.ok(stats.hitRate >= 0);
            assert.ok(stats.hitRate <= 100);
        });
    });

    describe('_getCacheInstance (internal)', () => {
        it('should return cache instance for testing', () => {
            const instance = cacheModule._getCacheInstance();
            assert.ok(instance !== undefined);
            assert.ok(typeof instance.get === 'function');
            assert.ok(typeof instance.has === 'function');
            assert.ok(typeof instance.prewarm === 'function');
            assert.ok(typeof instance.clear === 'function');
        });
    });
});
