import { REVIEW_COUNTDOWN_SECONDS } from '../types';
import { PRD_INPUT_MIN_LENGTH, PRD_INPUT_MAX_LENGTH } from './templates';

const CLOCK_CIRCUMFERENCE = 69.115;

export function getClientScripts(): string {

    const totalCountdown = REVIEW_COUNTDOWN_SECONDS;
    const circumference = CLOCK_CIRCUMFERENCE;
    const minLength = PRD_INPUT_MIN_LENGTH;
    const maxLength = PRD_INPUT_MAX_LENGTH;

    return `
        const vscode = acquireVsCodeApi();

        // ====================================================================
        // Error Boundary - Catches and reports all script errors
        // ====================================================================

        function reportError(message, source, lineno, colno, error) {
            const errorInfo = {
                command: 'webviewError',
                error: {
                    message: message || 'Unknown error',
                    source: source || 'unknown',
                    lineno: lineno || 0,
                    colno: colno || 0,
                    stack: error && error.stack ? error.stack : ''
                }
            };
            try {
                vscode.postMessage(errorInfo);
            } catch (e) {
                console.error('Failed to report error to extension:', e);
            }
        }

        window.onerror = function(message, source, lineno, colno, error) {
            reportError(message, source, lineno, colno, error);
            // Return false to allow default error handling (console logging)
            return false;
        };

        window.onunhandledrejection = function(event) {
            const reason = event.reason;
            const message = reason instanceof Error ? reason.message : String(reason);
            const stack = reason instanceof Error ? reason.stack : '';
            reportError('Unhandled Promise rejection: ' + message, 'promise', 0, 0, { stack: stack });
        };

        /**
         * Wraps a function with error boundary protection.
         * If the wrapped function throws, the error is reported and a fallback value is returned.
         */
        function safeExecute(fn, fallbackValue, context) {
            return function() {
                try {
                    return fn.apply(this, arguments);
                } catch (error) {
                    const fnName = context || fn.name || 'anonymous';
                    reportError('Error in ' + fnName + ': ' + (error.message || error), 'safeExecute', 0, 0, error);
                    return fallbackValue;
                }
            };
        }

        /**
         * Displays an error message in the UI when a critical error occurs.
         */
        function showErrorInUI(message) {
            const logArea = document.getElementById('logArea');
            if (logArea) {
                const entry = document.createElement('div');
                entry.className = 'log-entry error';
                entry.setAttribute('role', 'listitem');
                entry.setAttribute('aria-label', 'Error: ' + message);
                const time = new Date().toLocaleTimeString('en-US', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                });
                entry.innerHTML = '<span class="log-time" aria-label="Time: ' + time + '">' + time + '</span>' +
                                  '<span class="log-msg"><span aria-hidden="true">⚠️</span> ' + escapeHtml(message) + '</span>';
                logArea.appendChild(entry);
                // Use scrollLogIfEnabled if available, otherwise scroll directly for error visibility
                if (typeof scrollLogIfEnabled === 'function') {
                    scrollLogIfEnabled(logArea);
                } else {
                    logArea.scrollTop = logArea.scrollHeight;
                }
            }
        }

        // ====================================================================
        // Constants (injected from TypeScript)
        // ====================================================================

        const TOTAL_COUNTDOWN = ${totalCountdown};
        const CLOCK_CIRCUMFERENCE = ${circumference};
        const PRD_INPUT_MIN_LENGTH = ${minLength};
        const PRD_INPUT_MAX_LENGTH = ${maxLength};

        // ====================================================================
        // Debounce and Throttle Utilities
        // ====================================================================

        /**
         * Debounce delay constants (in milliseconds)
         */
        const DEBOUNCE_DELAYS = {
            UI_UPDATE: 50,        // General UI updates
            TIMELINE: 100,        // Timeline visualization updates
            STATS: 75,            // Stats display updates
            DURATION_CHART: 150,  // Duration chart updates (more expensive)
            LOG_FILTER: 100,      // Log filtering operations
            DEPENDENCY_GRAPH: 200 // Dependency graph rendering (expensive)
        };

        /**
         * Throttle delay constants (in milliseconds)
         */
        const THROTTLE_DELAYS = {
            COUNTDOWN: 100,       // Countdown updates (need responsiveness)
            SCROLL: 16,           // Scroll updates (~60fps)
            RESIZE: 100           // Resize handler
        };

        /**
         * Creates a debounced version of a function.
         * The debounced function will only be called after the specified delay
         * has passed since the last invocation.
         * 
         * @param {Function} fn - The function to debounce
         * @param {number} delay - The delay in milliseconds
         * @returns {Function} A debounced version of the function with flush and cancel methods
         */
        function createDebounce(fn, delay) {
            var timeoutId = null;
            var lastArgs = null;
            var lastThis = null;

            function debounced() {
                lastArgs = Array.prototype.slice.call(arguments);
                lastThis = this;

                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                }

                timeoutId = setTimeout(function() {
                    timeoutId = null;
                    if (lastArgs !== null) {
                        fn.apply(lastThis, lastArgs);
                        lastArgs = null;
                        lastThis = null;
                    }
                }, delay);
            }

            debounced.flush = function() {
                if (timeoutId !== null && lastArgs !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                    lastThis = null;
                }
            };

            debounced.cancel = function() {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                    lastArgs = null;
                    lastThis = null;
                }
            };

            debounced.pending = function() {
                return timeoutId !== null;
            };

            return debounced;
        }

        /**
         * Creates a throttled version of a function.
         * The throttled function will only be called at most once per delay period.
         * 
         * @param {Function} fn - The function to throttle
         * @param {number} delay - The minimum delay between calls in milliseconds
         * @returns {Function} A throttled version of the function
         */
        function createThrottle(fn, delay) {
            var lastTime = 0;
            var timeoutId = null;
            var lastArgs = null;
            var lastThis = null;

            function throttled() {
                var now = Date.now();
                var remaining = delay - (now - lastTime);

                lastArgs = Array.prototype.slice.call(arguments);
                lastThis = this;

                if (remaining <= 0 || remaining > delay) {
                    if (timeoutId !== null) {
                        clearTimeout(timeoutId);
                        timeoutId = null;
                    }
                    lastTime = now;
                    fn.apply(lastThis, lastArgs);
                    lastArgs = null;
                    lastThis = null;
                } else if (timeoutId === null) {
                    timeoutId = setTimeout(function() {
                        lastTime = Date.now();
                        timeoutId = null;
                        if (lastArgs !== null) {
                            fn.apply(lastThis, lastArgs);
                            lastArgs = null;
                            lastThis = null;
                        }
                    }, remaining);
                }
            }

            throttled.cancel = function() {
                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                lastArgs = null;
                lastThis = null;
                lastTime = 0;
            };

            return throttled;
        }

        /**
         * Creates a function that uses requestAnimationFrame for smooth visual updates.
         * Batches multiple calls into a single animation frame.
         * 
         * @param {Function} fn - The function to batch
         * @returns {Function} A batched version of the function
         */
        function createAnimationFrameBatch(fn) {
            var rafId = null;
            var lastArgs = null;
            var lastThis = null;

            function batched() {
                lastArgs = Array.prototype.slice.call(arguments);
                lastThis = this;

                if (rafId === null) {
                    rafId = requestAnimationFrame(function() {
                        rafId = null;
                        if (lastArgs !== null) {
                            fn.apply(lastThis, lastArgs);
                            lastArgs = null;
                            lastThis = null;
                        }
                    });
                }
            }

            batched.cancel = function() {
                if (rafId !== null) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                    lastArgs = null;
                    lastThis = null;
                }
            };

            batched.pending = function() {
                return rafId !== null;
            };

            return batched;
        }

        // ====================================================================
        // requestAnimationFrame Animation Utilities
        // ====================================================================

        /**
         * Animation frame IDs for tracking active animations.
         * Used to cancel animations when needed.
         */
        var activeAnimations = {};

        /**
         * Easing functions for smooth animations.
         * @type {Object.<string, function(number): number>}
         */
        var EASING_FUNCTIONS = {
            linear: function(t) { return t; },
            easeInQuad: function(t) { return t * t; },
            easeOutQuad: function(t) { return t * (2 - t); },
            easeInOutQuad: function(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
            easeOutCubic: function(t) { return (--t) * t * t + 1; },
            easeInOutCubic: function(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
            easeOutElastic: function(t) {
                var c4 = (2 * Math.PI) / 3;
                return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
            },
            easeOutBounce: function(t) {
                var n1 = 7.5625;
                var d1 = 2.75;
                if (t < 1 / d1) { return n1 * t * t; }
                if (t < 2 / d1) { return n1 * (t -= 1.5 / d1) * t + 0.75; }
                if (t < 2.5 / d1) { return n1 * (t -= 2.25 / d1) * t + 0.9375; }
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        };

        /**
         * Default animation duration in milliseconds.
         */
        var DEFAULT_ANIMATION_DURATION = 300;

        /**
         * Animates a numeric value over time using requestAnimationFrame.
         * Provides smooth interpolation for visual updates.
         * 
         * @param {Object} options - Animation options
         * @param {string} options.id - Unique identifier for the animation (for cancellation)
         * @param {number} options.from - Start value
         * @param {number} options.to - End value
         * @param {number} options.duration - Animation duration in ms (default: 300)
         * @param {string} options.easing - Easing function name (default: 'easeOutQuad')
         * @param {function(number): void} options.onUpdate - Called with interpolated value each frame
         * @param {function(): void} options.onComplete - Called when animation completes
         * @returns {function(): void} Cancel function to stop the animation
         */
        function animateValue(options) {
            var id = options.id || 'anim-' + Date.now();
            var from = options.from;
            var to = options.to;
            var duration = options.duration || DEFAULT_ANIMATION_DURATION;
            var easingName = options.easing || 'easeOutQuad';
            var onUpdate = options.onUpdate;
            var onComplete = options.onComplete;
            
            var easing = EASING_FUNCTIONS[easingName] || EASING_FUNCTIONS.easeOutQuad;
            var startTime = null;
            
            // Cancel any existing animation with same id
            cancelAnimation(id);
            
            function frame(timestamp) {
                if (startTime === null) {
                    startTime = timestamp;
                }
                
                var elapsed = timestamp - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var easedProgress = easing(progress);
                var currentValue = from + (to - from) * easedProgress;
                
                if (onUpdate) {
                    onUpdate(currentValue);
                }
                
                if (progress < 1) {
                    activeAnimations[id] = requestAnimationFrame(frame);
                } else {
                    delete activeAnimations[id];
                    if (onComplete) {
                        onComplete();
                    }
                }
            }
            
            activeAnimations[id] = requestAnimationFrame(frame);
            
            return function cancel() {
                cancelAnimation(id);
            };
        }

        /**
         * Cancels an active animation by its ID.
         * @param {string} id - The animation ID
         */
        function cancelAnimation(id) {
            if (activeAnimations[id]) {
                cancelAnimationFrame(activeAnimations[id]);
                delete activeAnimations[id];
            }
        }

        /**
         * Cancels all active animations.
         */
        function cancelAllAnimations() {
            Object.keys(activeAnimations).forEach(function(id) {
                cancelAnimation(id);
            });
        }

        /**
         * Checks if an animation is currently active.
         * @param {string} id - The animation ID
         * @returns {boolean} True if the animation is active
         */
        function isAnimationActive(id) {
            return !!activeAnimations[id];
        }

        /**
         * Gets the count of currently active animations.
         * @returns {number} Number of active animations
         */
        function getActiveAnimationCount() {
            return Object.keys(activeAnimations).length;
        }

        /**
         * Animates an element's CSS property using requestAnimationFrame.
         * Supports numeric properties with units (e.g., 'px', '%', 'em').
         * 
         * @param {HTMLElement} element - The element to animate
         * @param {string} property - CSS property name (e.g., 'width', 'height', 'opacity')
         * @param {number} from - Start value
         * @param {number} to - End value
         * @param {Object} options - Additional options
         * @param {string} options.unit - CSS unit (default: '' for unitless, 'px', '%', etc.)
         * @param {number} options.duration - Animation duration in ms
         * @param {string} options.easing - Easing function name
         * @param {function(): void} options.onComplete - Called when animation completes
         * @returns {function(): void} Cancel function
         */
        function animateStyle(element, property, from, to, options) {
            if (!element) return function() {};
            
            options = options || {};
            var unit = options.unit || '';
            var id = 'style-' + (element.id || 'el') + '-' + property + '-' + Date.now();
            
            return animateValue({
                id: id,
                from: from,
                to: to,
                duration: options.duration,
                easing: options.easing,
                onUpdate: function(value) {
                    element.style[property] = value + unit;
                },
                onComplete: options.onComplete
            });
        }

        /**
         * Animates an element's transform property using requestAnimationFrame.
         * Optimized for GPU-accelerated animations.
         * 
         * @param {HTMLElement} element - The element to animate
         * @param {Object} transforms - Transform values to animate
         * @param {number} transforms.translateX - Translate X value
         * @param {number} transforms.translateY - Translate Y value
         * @param {number} transforms.scale - Scale value
         * @param {number} transforms.rotate - Rotation in degrees
         * @param {Object} options - Animation options
         * @returns {function(): void} Cancel function
         */
        function animateTransform(element, transforms, options) {
            if (!element) return function() {};
            
            options = options || {};
            var id = 'transform-' + (element.id || 'el') + '-' + Date.now();
            
            // Parse current transform values
            var current = {
                translateX: transforms.translateX !== undefined ? 0 : undefined,
                translateY: transforms.translateY !== undefined ? 0 : undefined,
                scale: transforms.scale !== undefined ? 1 : undefined,
                rotate: transforms.rotate !== undefined ? 0 : undefined
            };
            
            return animateValue({
                id: id,
                from: 0,
                to: 1,
                duration: options.duration,
                easing: options.easing,
                onUpdate: function(progress) {
                    var parts = [];
                    
                    if (transforms.translateX !== undefined) {
                        var tx = current.translateX + (transforms.translateX - current.translateX) * progress;
                        parts.push('translateX(' + tx + 'px)');
                    }
                    if (transforms.translateY !== undefined) {
                        var ty = current.translateY + (transforms.translateY - current.translateY) * progress;
                        parts.push('translateY(' + ty + 'px)');
                    }
                    if (transforms.scale !== undefined) {
                        var s = current.scale + (transforms.scale - current.scale) * progress;
                        parts.push('scale(' + s + ')');
                    }
                    if (transforms.rotate !== undefined) {
                        var r = current.rotate + (transforms.rotate - current.rotate) * progress;
                        parts.push('rotate(' + r + 'deg)');
                    }
                    
                    element.style.transform = parts.join(' ');
                },
                onComplete: options.onComplete
            });
        }

        /**
         * Smoothly scrolls an element to a target scroll position using requestAnimationFrame.
         * 
         * @param {HTMLElement} element - The scrollable element
         * @param {number} to - Target scrollTop value
         * @param {Object} options - Animation options
         * @param {number} options.duration - Animation duration (default: 300)
         * @param {string} options.easing - Easing function (default: 'easeOutQuad')
         * @returns {function(): void} Cancel function
         */
        function animateScroll(element, to, options) {
            if (!element) return function() {};
            
            options = options || {};
            var from = element.scrollTop;
            var id = 'scroll-' + (element.id || 'el') + '-' + Date.now();
            
            return animateValue({
                id: id,
                from: from,
                to: to,
                duration: options.duration || 300,
                easing: options.easing || 'easeOutQuad',
                onUpdate: function(value) {
                    element.scrollTop = value;
                },
                onComplete: options.onComplete
            });
        }

        /**
         * Performs a visual fade animation on an element.
         * Uses opacity for smooth visual transitions.
         * 
         * @param {HTMLElement} element - The element to fade
         * @param {string} direction - 'in' or 'out'
         * @param {Object} options - Animation options
         * @returns {function(): void} Cancel function
         */
        function animateFade(element, direction, options) {
            if (!element) return function() {};
            
            options = options || {};
            var isIn = direction === 'in';
            
            return animateStyle(element, 'opacity', isIn ? 0 : 1, isIn ? 1 : 0, {
                duration: options.duration || 200,
                easing: options.easing || 'easeOutQuad',
                onComplete: function() {
                    if (!isIn) {
                        element.style.display = 'none';
                    }
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }
            });
        }

        /**
         * Batched RAF updates for multiple DOM changes.
         * Collects changes and applies them in a single animation frame.
         */
        var rafBatchQueue = [];
        var rafBatchScheduled = false;

        /**
         * Schedules a DOM update to be batched in the next animation frame.
         * Useful for collecting multiple small updates and applying them together.
         * 
         * @param {function(): void} updateFn - The update function to queue
         */
        function scheduleRAFUpdate(updateFn) {
            rafBatchQueue.push(updateFn);
            
            if (!rafBatchScheduled) {
                rafBatchScheduled = true;
                requestAnimationFrame(flushRAFBatch);
            }
        }

        /**
         * Flushes all queued RAF updates.
         */
        function flushRAFBatch() {
            var updates = rafBatchQueue.slice();
            rafBatchQueue = [];
            rafBatchScheduled = false;
            
            updates.forEach(function(fn) {
                try {
                    fn();
                } catch (e) {
                    console.error('RAF batch update error:', e);
                }
            });
        }

        /**
         * Creates a RAF-optimized setter for an element's style property.
         * Batches rapid updates to prevent layout thrashing.
         * 
         * @param {HTMLElement} element - The element
         * @param {string} property - CSS property name
         * @returns {function(string): void} Batched setter function
         */
        function createRAFStyleSetter(element, property) {
            var pendingValue = null;
            var rafId = null;
            
            return function(value) {
                pendingValue = value;
                
                if (rafId === null) {
                    rafId = requestAnimationFrame(function() {
                        rafId = null;
                        if (pendingValue !== null && element) {
                            element.style[property] = pendingValue;
                            pendingValue = null;
                        }
                    });
                }
            };
        }

        /**
         * Creates a RAF-optimized class toggle function.
         * Batches class changes for better performance.
         * 
         * @param {HTMLElement} element - The element
         * @returns {function(string, boolean): void} Batched class toggle function
         */
        function createRAFClassToggle(element) {
            var pendingChanges = {};
            var rafId = null;
            
            return function(className, add) {
                pendingChanges[className] = add;
                
                if (rafId === null) {
                    rafId = requestAnimationFrame(function() {
                        rafId = null;
                        if (element) {
                            Object.keys(pendingChanges).forEach(function(cls) {
                                element.classList.toggle(cls, pendingChanges[cls]);
                            });
                            pendingChanges = {};
                        }
                    });
                }
            };
        }

        /**
         * Runs a function on the next animation frame.
         * Simpler version for one-off RAF scheduling.
         * 
         * @param {function(): void} fn - Function to run
         * @returns {number} RAF ID for cancellation
         */
        function runOnNextFrame(fn) {
            return requestAnimationFrame(fn);
        }

        /**
         * Runs a function after the browser has painted.
         * Uses double-RAF technique for post-paint timing.
         * 
         * @param {function(): void} fn - Function to run after paint
         * @returns {number} RAF ID for cancellation
         */
        function runAfterPaint(fn) {
            return requestAnimationFrame(function() {
                requestAnimationFrame(fn);
            });
        }

        // ====================================================================
        // Debounced UI Update Functions
        // ====================================================================

        /**
         * Internal (non-debounced) versions of update functions.
         * These are wrapped by their debounced counterparts.
         */
        var _updateUIInternal = null;
        var _updateTimelineInternal = null;
        var _updateDurationChartInternal = null;
        var _updateStatsDisplayInternal = null;
        var _renderDependencyGraphInternal = null;

        /**
         * Debounced update functions - initialized after their internal counterparts are defined.
         */
        var debouncedUpdateUI = null;
        var debouncedUpdateTimeline = null;
        var debouncedUpdateDurationChart = null;
        var debouncedUpdateStatsDisplay = null;
        var debouncedRenderDependencyGraph = null;
        var throttledShowCountdown = null;
        var rafUpdateTimeline = null;

        /**
         * Initializes all debounced/throttled update functions.
         * Called after the internal functions are defined.
         */
        function initDebouncedFunctions() {
            if (_updateUIInternal) {
                debouncedUpdateUI = createDebounce(_updateUIInternal, DEBOUNCE_DELAYS.UI_UPDATE);
            }
            if (_updateTimelineInternal) {
                debouncedUpdateTimeline = createDebounce(_updateTimelineInternal, DEBOUNCE_DELAYS.TIMELINE);
                rafUpdateTimeline = createAnimationFrameBatch(_updateTimelineInternal);
            }
            if (_updateDurationChartInternal) {
                debouncedUpdateDurationChart = createDebounce(_updateDurationChartInternal, DEBOUNCE_DELAYS.DURATION_CHART);
            }
            if (_updateStatsDisplayInternal) {
                debouncedUpdateStatsDisplay = createDebounce(_updateStatsDisplayInternal, DEBOUNCE_DELAYS.STATS);
            }
            if (_renderDependencyGraphInternal) {
                debouncedRenderDependencyGraph = createDebounce(_renderDependencyGraphInternal, DEBOUNCE_DELAYS.DEPENDENCY_GRAPH);
            }
        }

        /**
         * Flushes all pending debounced updates immediately.
         * Useful when switching views or performing critical operations.
         */
        function flushAllDebouncedUpdates() {
            if (debouncedUpdateUI && debouncedUpdateUI.pending()) {
                debouncedUpdateUI.flush();
            }
            if (debouncedUpdateTimeline && debouncedUpdateTimeline.pending()) {
                debouncedUpdateTimeline.flush();
            }
            if (debouncedUpdateDurationChart && debouncedUpdateDurationChart.pending()) {
                debouncedUpdateDurationChart.flush();
            }
            if (debouncedUpdateStatsDisplay && debouncedUpdateStatsDisplay.pending()) {
                debouncedUpdateStatsDisplay.flush();
            }
            if (debouncedRenderDependencyGraph && debouncedRenderDependencyGraph.pending()) {
                debouncedRenderDependencyGraph.flush();
            }
        }

        /**
         * Cancels all pending debounced updates.
         * Useful when the panel is being disposed.
         */
        function cancelAllDebouncedUpdates() {
            if (debouncedUpdateUI) debouncedUpdateUI.cancel();
            if (debouncedUpdateTimeline) debouncedUpdateTimeline.cancel();
            if (debouncedUpdateDurationChart) debouncedUpdateDurationChart.cancel();
            if (debouncedUpdateStatsDisplay) debouncedUpdateStatsDisplay.cancel();
            if (debouncedRenderDependencyGraph) debouncedRenderDependencyGraph.cancel();
            if (throttledShowCountdown) throttledShowCountdown.cancel();
            if (rafUpdateTimeline) rafUpdateTimeline.cancel();
        }

        /**
         * Checks if any debounced updates are pending.
         * @returns {boolean} True if any updates are pending
         */
        function hasPendingUpdates() {
            return (
                (debouncedUpdateUI && debouncedUpdateUI.pending()) ||
                (debouncedUpdateTimeline && debouncedUpdateTimeline.pending()) ||
                (debouncedUpdateDurationChart && debouncedUpdateDurationChart.pending()) ||
                (debouncedUpdateStatsDisplay && debouncedUpdateStatsDisplay.pending()) ||
                (debouncedRenderDependencyGraph && debouncedRenderDependencyGraph.pending())
            );
        }

        // ====================================================================
        // PRD Input Validation
        // ====================================================================

        /**
         * Validation error messages
         */
        const VALIDATION_MESSAGES = {
            empty: 'Please describe what you want to build',
            tooShort: 'Description must be at least ' + ${minLength} + ' characters',
            tooLong: 'Description cannot exceed ' + ${maxLength} + ' characters',
            valid: 'Ready to generate PRD'
        };

        /**
         * Validation error icon SVG
         */
        const VALIDATION_ICONS = {
            error: '<svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
            success: '<svg class="validation-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
        };

        /**
         * Validates the PRD input and returns a validation result.
         * @param {string} value - The input value to validate
         * @returns {{ isValid: boolean, message: string, type: 'error' | 'success' | null }}
         */
        function validatePrdInput(value) {
            const trimmed = value.trim();
            const length = trimmed.length;
            
            if (length === 0) {
                return { isValid: false, message: VALIDATION_MESSAGES.empty, type: 'error' };
            }
            if (length < PRD_INPUT_MIN_LENGTH) {
                return { isValid: false, message: VALIDATION_MESSAGES.tooShort + ' (' + length + '/' + PRD_INPUT_MIN_LENGTH + ')', type: 'error' };
            }
            if (length > PRD_INPUT_MAX_LENGTH) {
                return { isValid: false, message: VALIDATION_MESSAGES.tooLong, type: 'error' };
            }
            return { isValid: true, message: VALIDATION_MESSAGES.valid, type: 'success' };
        }

        /**
         * Shows a validation message below the textarea.
         * @param {string} message - The message to show
         * @param {'error' | 'success'} type - The message type
         */
        function showValidationMessage(message, type) {
            const errorEl = document.getElementById('taskInputError');
            const textarea = document.getElementById('taskInput');
            
            if (!errorEl || !textarea) return;
            
            // Update textarea classes
            textarea.classList.remove('validation-error', 'validation-success');
            if (type) {
                textarea.classList.add('validation-' + type);
            }
            
            // Update aria-invalid
            textarea.setAttribute('aria-invalid', type === 'error' ? 'true' : 'false');
            
            // Update error message
            if (message && type) {
                errorEl.innerHTML = (type === 'error' ? VALIDATION_ICONS.error : VALIDATION_ICONS.success) + 
                                    '<span>' + escapeHtml(message) + '</span>';
                errorEl.className = 'validation-message visible ' + type;
            } else {
                errorEl.innerHTML = '';
                errorEl.className = 'validation-message';
            }
        }

        /**
         * Clears the validation state.
         */
        function clearValidation() {
            showValidationMessage('', null);
        }

        /**
         * Updates the character count display.
         * @param {number} count - Current character count
         */
        function updateCharCount(count) {
            const charCountEl = document.getElementById('taskInputCharCount');
            const charValueEl = document.getElementById('charCountValue');
            
            if (!charCountEl || !charValueEl) return;
            
            charValueEl.textContent = count;
            
            // Update styling based on character count
            charCountEl.classList.remove('warning', 'error');
            if (count > PRD_INPUT_MAX_LENGTH) {
                charCountEl.classList.add('error');
            } else if (count > PRD_INPUT_MAX_LENGTH * 0.9) {
                charCountEl.classList.add('warning');
            }
        }

        /**
         * Handles input event on the PRD textarea for real-time validation.
         */
        function handlePrdInputChange() {
            const textarea = document.getElementById('taskInput');
            if (!textarea) return;
            
            const value = textarea.value;
            const trimmedLength = value.trim().length;
            
            // Update character count
            updateCharCount(trimmedLength);
            
            // Real-time validation - only show error if field has been interacted with
            if (trimmedLength > 0) {
                const result = validatePrdInput(value);
                if (!result.isValid) {
                    showValidationMessage(result.message, result.type);
                } else {
                    // Show success briefly then hide
                    showValidationMessage(result.message, result.type);
                }
            } else {
                // Clear validation when field is empty (user cleared it)
                clearValidation();
            }
        }

        /**
         * Sets up the PRD input validation listeners.
         */
        function setupPrdInputValidation() {
            const textarea = document.getElementById('taskInput');
            if (!textarea) return;
            
            // Initial character count
            updateCharCount(textarea.value.trim().length);
            
            // Real-time validation on input
            textarea.addEventListener('input', handlePrdInputChange);
            
            // Validate on blur to catch empty state after focus
            textarea.addEventListener('blur', function() {
                const value = this.value.trim();
                if (value.length > 0 && value.length < PRD_INPUT_MIN_LENGTH) {
                    const result = validatePrdInput(this.value);
                    showValidationMessage(result.message, result.type);
                }
            });
        }

        // ====================================================================
        // Panel State Persistence
        // ====================================================================

        // Collapsible section IDs that can be persisted
        // Includes requirements, timeline, task, and log sections for mobile-friendly collapsing
        const COLLAPSIBLE_SECTIONS = ['reqContent', 'timelineContent', 'taskContent', 'logContent', 'durationContent'];
        
        // Mapping of content IDs to their toggle element IDs
        const SECTION_TOGGLE_MAP = {
            'reqContent': 'reqToggle',
            'timelineContent': 'timelineToggle',
            'taskContent': 'taskToggle',
            'logContent': 'logToggle',
            'durationContent': 'durationToggle'
        };
        
        // Breakpoint for auto-collapsing sections (narrow mobile view)
        const MOBILE_COLLAPSE_BREAKPOINT = 320;
        
        // ====================================================================
        // Responsive Breakpoint System
        // ====================================================================
        
        /**
         * Named breakpoint thresholds (in pixels) for different panel sizes.
         * These match the CSS container query breakpoints.
         */
        const BREAKPOINT_THRESHOLDS = {
            xs: 250,   // Extra small: very narrow panels
            sm: 320,   // Small: narrow panels, mobile-like
            md: 400,   // Medium: moderate panels
            lg: 600    // Large: wide panels, full desktop
        };
        
        /**
         * Current breakpoint name
         * @type {'xs' | 'sm' | 'md' | 'lg'}
         */
        let currentBreakpoint = 'lg';
        
        /**
         * Previous breakpoint for change detection
         * @type {'xs' | 'sm' | 'md' | 'lg' | null}
         */
        let previousBreakpoint = null;
        
        /**
         * ResizeObserver instance for monitoring panel size
         * @type {ResizeObserver | null}
         */
        let panelResizeObserver = null;
        
        /**
         * Breakpoint change listeners
         * @type {Array<function(string, string): void>}
         */
        const breakpointListeners = [];
        
        /**
         * Calculates the current breakpoint based on panel width.
         * @param {number} width - The panel width in pixels
         * @returns {'xs' | 'sm' | 'md' | 'lg'} The breakpoint name
         */
        function calculateBreakpoint(width) {
            if (width <= BREAKPOINT_THRESHOLDS.xs) {
                return 'xs';
            } else if (width <= BREAKPOINT_THRESHOLDS.sm) {
                return 'sm';
            } else if (width <= BREAKPOINT_THRESHOLDS.md) {
                return 'md';
            } else {
                return 'lg';
            }
        }
        
        /**
         * Gets the current breakpoint name.
         * @returns {'xs' | 'sm' | 'md' | 'lg'} The current breakpoint
         */
        function getCurrentBreakpoint() {
            return currentBreakpoint;
        }
        
        /**
         * Checks if the current breakpoint is at or below a threshold.
         * @param {'xs' | 'sm' | 'md' | 'lg'} breakpoint - Breakpoint to check against
         * @returns {boolean} True if current breakpoint is at or below the given one
         */
        function isBreakpointAtMost(breakpoint) {
            const order = ['xs', 'sm', 'md', 'lg'];
            const currentIndex = order.indexOf(currentBreakpoint);
            const checkIndex = order.indexOf(breakpoint);
            return currentIndex <= checkIndex;
        }
        
        /**
         * Checks if the current breakpoint is at or above a threshold.
         * @param {'xs' | 'sm' | 'md' | 'lg'} breakpoint - Breakpoint to check against
         * @returns {boolean} True if current breakpoint is at or above the given one
         */
        function isBreakpointAtLeast(breakpoint) {
            const order = ['xs', 'sm', 'md', 'lg'];
            const currentIndex = order.indexOf(currentBreakpoint);
            const checkIndex = order.indexOf(breakpoint);
            return currentIndex >= checkIndex;
        }
        
        /**
         * Adds a listener for breakpoint changes.
         * @param {function(string, string): void} listener - Callback receiving (newBreakpoint, oldBreakpoint)
         * @returns {function(): void} Cleanup function to remove the listener
         */
        function onBreakpointChange(listener) {
            breakpointListeners.push(listener);
            return function() {
                const index = breakpointListeners.indexOf(listener);
                if (index > -1) {
                    breakpointListeners.splice(index, 1);
                }
            };
        }
        
        /**
         * Notifies all breakpoint listeners of a change.
         * @param {string} newBp - New breakpoint name
         * @param {string} oldBp - Previous breakpoint name
         */
        function notifyBreakpointListeners(newBp, oldBp) {
            breakpointListeners.forEach(function(listener) {
                try {
                    listener(newBp, oldBp);
                } catch (e) {
                    reportError('Error in breakpoint listener: ' + e.message, 'onBreakpointChange', 0, 0, e);
                }
            });
        }
        
        /**
         * Updates the body element with breakpoint-specific CSS classes.
         * Adds classes: breakpoint-{name}, breakpoint-below-{name}, breakpoint-above-{name}
         * @param {string} breakpoint - The current breakpoint name
         */
        function updateBreakpointClasses(breakpoint) {
            const body = document.body;
            const order = ['xs', 'sm', 'md', 'lg'];
            const currentIndex = order.indexOf(breakpoint);
            
            // Remove all existing breakpoint classes
            order.forEach(function(bp) {
                body.classList.remove('breakpoint-' + bp);
                body.classList.remove('breakpoint-below-' + bp);
                body.classList.remove('breakpoint-above-' + bp);
            });
            
            // Add current breakpoint class
            body.classList.add('breakpoint-' + breakpoint);
            
            // Add below-X classes for breakpoints above current
            order.forEach(function(bp, index) {
                if (index > currentIndex) {
                    body.classList.add('breakpoint-below-' + bp);
                }
            });
            
            // Add above-X classes for breakpoints below current
            order.forEach(function(bp, index) {
                if (index < currentIndex) {
                    body.classList.add('breakpoint-above-' + bp);
                }
            });
            
            // Set data attribute for CSS selectors and debugging
            body.setAttribute('data-breakpoint', breakpoint);
        }
        
        /**
         * Updates visibility of elements based on their data-show-at and data-hide-at attributes.
         * data-show-at="xs,sm" - Only show at these breakpoints
         * data-hide-at="xs" - Hide at these breakpoints
         */
        function updateConditionalVisibility() {
            // Handle data-show-at elements
            const showAtElements = document.querySelectorAll('[data-show-at]');
            showAtElements.forEach(function(el) {
                const showAt = el.getAttribute('data-show-at').split(',').map(function(s) { return s.trim(); });
                if (showAt.indexOf(currentBreakpoint) > -1) {
                    el.removeAttribute('hidden');
                    el.style.display = '';
                } else {
                    el.setAttribute('hidden', '');
                    el.style.display = 'none';
                }
            });
            
            // Handle data-hide-at elements
            const hideAtElements = document.querySelectorAll('[data-hide-at]');
            hideAtElements.forEach(function(el) {
                const hideAt = el.getAttribute('data-hide-at').split(',').map(function(s) { return s.trim(); });
                if (hideAt.indexOf(currentBreakpoint) > -1) {
                    el.setAttribute('hidden', '');
                    el.style.display = 'none';
                } else {
                    el.removeAttribute('hidden');
                    el.style.display = '';
                }
            });
        }
        
        /**
         * Handles a breakpoint change by updating classes and notifying listeners.
         * @param {string} newBreakpoint - The new breakpoint name
         */
        function handleBreakpointChange(newBreakpoint) {
            if (newBreakpoint === currentBreakpoint) {
                return; // No change
            }
            
            previousBreakpoint = currentBreakpoint;
            currentBreakpoint = newBreakpoint;
            
            // Update CSS classes on body
            updateBreakpointClasses(newBreakpoint);
            
            // Update conditional element visibility
            updateConditionalVisibility();
            
            // Announce to screen readers
            announceToScreenReader('Panel resized to ' + getBreakpointLabel(newBreakpoint) + ' view');
            
            // Notify listeners
            notifyBreakpointListeners(newBreakpoint, previousBreakpoint);
        }
        
        /**
         * Gets a human-readable label for a breakpoint.
         * @param {string} breakpoint - The breakpoint name
         * @returns {string} Human-readable label
         */
        function getBreakpointLabel(breakpoint) {
            const labels = {
                'xs': 'extra small',
                'sm': 'small',
                'md': 'medium',
                'lg': 'large'
            };
            return labels[breakpoint] || breakpoint;
        }
        
        /**
         * Initializes the ResizeObserver for panel size monitoring.
         * Falls back to window resize event if ResizeObserver is not available.
         */
        function initResizeObserver() {
            // Get the panel element to observe (body or main content)
            const observeTarget = document.body;
            
            if (typeof ResizeObserver !== 'undefined') {
                // Use ResizeObserver for accurate panel size detection
                panelResizeObserver = new ResizeObserver(function(entries) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        var width = entry.contentRect.width;
                        var newBreakpoint = calculateBreakpoint(width);
                        handleBreakpointChange(newBreakpoint);
                    }
                });
                panelResizeObserver.observe(observeTarget);
            } else {
                // Fallback to window resize for older browsers
                var resizeTimeout = null;
                window.addEventListener('resize', function() {
                    if (resizeTimeout) {
                        clearTimeout(resizeTimeout);
                    }
                    resizeTimeout = setTimeout(function() {
                        var width = observeTarget.clientWidth;
                        var newBreakpoint = calculateBreakpoint(width);
                        handleBreakpointChange(newBreakpoint);
                        resizeTimeout = null;
                    }, 100);
                });
            }
            
            // Initial breakpoint calculation
            var initialWidth = observeTarget.clientWidth || window.innerWidth;
            var initialBreakpoint = calculateBreakpoint(initialWidth);
            currentBreakpoint = initialBreakpoint;
            updateBreakpointClasses(initialBreakpoint);
            updateConditionalVisibility();
        }
        
        /**
         * Cleans up the ResizeObserver when no longer needed.
         */
        function destroyResizeObserver() {
            if (panelResizeObserver) {
                panelResizeObserver.disconnect();
                panelResizeObserver = null;
            }
        }
        
        /**
         * Gets detailed breakpoint information for debugging.
         * @returns {{ breakpoint: string, width: number, thresholds: object }}
         */
        function getBreakpointInfo() {
            return {
                breakpoint: currentBreakpoint,
                width: document.body.clientWidth || window.innerWidth,
                thresholds: BREAKPOINT_THRESHOLDS,
                previous: previousBreakpoint
            };
        }
        
        // Debounce timer for scroll position saving
        let scrollSaveTimeout = null;
        
        /**
         * Gets the current collapsed sections state.
         */
        function getCollapsedSections() {
            const collapsed = [];
            COLLAPSIBLE_SECTIONS.forEach(function(id) {
                const el = document.getElementById(id);
                if (el && el.classList.contains('collapsed')) {
                    collapsed.push(id);
                }
            });
            return collapsed;
        }
        
        /**
         * Gets the current scroll position of the main content area.
         */
        function getScrollPosition() {
            const content = document.getElementById('mainContent');
            return content ? content.scrollTop : 0;
        }
        
        /**
         * Saves the current panel state to the extension.
         */
        function savePanelState() {
            const state = {
                collapsedSections: getCollapsedSections(),
                scrollPosition: getScrollPosition()
            };
            
            // Save to VS Code webview state for cross-session persistence
            // This is used by WebviewPanelSerializer to restore state after VS Code restart
            vscode.setState(state);
            
            // Also notify the extension to persist in workspaceState
            vscode.postMessage({
                command: 'panelStateChanged',
                collapsedSections: state.collapsedSections,
                scrollPosition: state.scrollPosition
            });
        }
        
        /**
         * Restores the panel state from various sources.
         * Priority: 1. vscode.getState() (for VS Code restart), 2. window.__RALPH_PANEL_STATE__ (injected)
         */
        function restorePanelState() {
            // First try vscode.getState() for state persisted across VS Code restarts
            let state = vscode.getState();
            
            // Fall back to injected state from extension
            if (!state) {
                state = window.__RALPH_PANEL_STATE__;
            }
            
            if (!state) return;
            
            // Restore collapsed sections
            if (state.collapsedSections && Array.isArray(state.collapsedSections)) {
                state.collapsedSections.forEach(function(sectionId) {
                    const content = document.getElementById(sectionId);
                    if (content) {
                        content.classList.add('collapsed');
                    }
                    // Update the toggle indicator using the section toggle map
                    const toggleId = SECTION_TOGGLE_MAP[sectionId];
                    if (toggleId) {
                        const toggle = document.getElementById(toggleId);
                        if (toggle) {
                            toggle.classList.remove('expanded');
                        }
                    }
                    // Update ARIA expanded state on the header
                    const header = content ? content.previousElementSibling : null;
                    if (header && header.hasAttribute('aria-expanded')) {
                        header.setAttribute('aria-expanded', 'false');
                    }
                    // Special case for requirements section (uses different header query)
                    if (sectionId === 'reqContent') {
                        const reqHeader = document.querySelector('.requirements-header');
                        if (reqHeader) {
                            reqHeader.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }
            
            // Restore scroll position
            if (typeof state.scrollPosition === 'number' && state.scrollPosition > 0) {
                const content = document.getElementById('mainContent');
                if (content) {
                    // Use requestAnimationFrame to ensure DOM is ready
                    requestAnimationFrame(function() {
                        content.scrollTop = state.scrollPosition;
                    });
                }
            }
        }
        
        /**
         * Saves scroll position with debouncing to avoid excessive saves.
         */
        function saveScrollPosition() {
            if (scrollSaveTimeout) {
                clearTimeout(scrollSaveTimeout);
            }
            scrollSaveTimeout = setTimeout(function() {
                savePanelState();
            }, 250);
        }
        
        /**
         * Sets up scroll position tracking on the main content area.
         */
        function setupScrollTracking() {
            const content = document.getElementById('mainContent');
            if (content) {
                content.addEventListener('scroll', saveScrollPosition);
            }
        }

        // ====================================================================
        // Message Handlers
        // ====================================================================

        function send(command) {
            const btnStart = document.getElementById('btnStart');
            const btnPause = document.getElementById('btnPause');
            const btnStop = document.getElementById('btnStop');
            const btnNext = document.getElementById('btnNext');

            // Show loading spinners for async operations
            if (command === 'start') {
                showControlButtonLoading('btnStart', 'Starting...');
            } else if (command === 'pause') {
                showControlButtonLoading('btnPause', 'Pausing...');
            } else if (command === 'resume') {
                showControlButtonLoading('btnResume', 'Resuming...');
            } else if (command === 'stop') {
                showControlButtonLoading('btnStop', 'Stopping...');
            } else if (command === 'next') {
                showControlButtonLoading('btnNext', 'Stepping...');
            } else if (command === 'skipTask') {
                showControlButtonLoading('btnSkip', 'Skipping...');
            } else if (command === 'retryTask') {
                showControlButtonLoading('btnRetry', 'Retrying...');
            } else if (command === 'completeAllTasks') {
                showControlButtonLoading('btnCompleteAll', 'Completing...');
            } else if (command === 'resetAllTasks') {
                showControlButtonLoading('btnResetAll', 'Resetting...');
            } else if (command === 'refresh') {
                showRefreshLoading();
            }

            // Optimistic UI updates for immediate feedback
            if (command === 'start' && btnStart && btnPause && btnStop) {
                btnStart.disabled = true;
                btnPause.disabled = false;
                btnStop.disabled = false;
            } else if (command === 'pause' && btnStart && btnPause && btnStop) {
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnStop.disabled = false;
            } else if (command === 'stop' && btnStart && btnPause && btnStop) {
                btnStart.disabled = false;
                btnPause.disabled = true;
                btnStop.disabled = true;
            }
            vscode.postMessage({ command });
        }

        // ====================================================================
        // Requirements & Settings
        // ====================================================================

        /**
         * Generic toggle function for collapsible sections.
         * @param {string} contentId - The ID of the content element to toggle
         * @param {string} toggleId - The ID of the toggle indicator element
         * @param {HTMLElement} headerElement - The header element that was clicked (for ARIA)
         */
        function toggleSection(contentId, toggleId, headerElement) {
            const content = document.getElementById(contentId);
            const toggle = document.getElementById(toggleId);
            if (content && toggle) {
                const isCollapsed = content.classList.toggle('collapsed');
                toggle.classList.toggle('expanded');
                // Update ARIA expanded state for accessibility
                if (headerElement) {
                    headerElement.setAttribute('aria-expanded', String(!isCollapsed));
                }
                // Announce state change to screen readers
                const sectionName = getSectionName(contentId);
                if (sectionName) {
                    announceToScreenReader(sectionName + (isCollapsed ? ' collapsed' : ' expanded'));
                }
                // Save panel state after toggling
                savePanelState();
            }
        }

        // ====================================================================
        // Task Details Panel
        // ====================================================================

        /**
         * Tracks whether task details panel is visible.
         */
        let taskDetailsVisible = false;

        /**
         * Toggles the visibility of the task details panel.
         * Shows or hides detailed task metadata before execution.
         */
        function toggleTaskDetails() {
            const panel = document.getElementById('taskDetailsPanel');
            const button = document.getElementById('btnTaskDetails');
            
            if (!panel || !button) {
                return;
            }
            
            taskDetailsVisible = !taskDetailsVisible;
            
            if (taskDetailsVisible) {
                showTaskDetails();
            } else {
                hideTaskDetails();
            }
        }

        /**
         * Shows the task details panel with animation.
         */
        function showTaskDetails() {
            const panel = document.getElementById('taskDetailsPanel');
            const button = document.getElementById('btnTaskDetails');
            
            if (!panel) {
                return;
            }
            
            panel.style.display = 'block';
            panel.setAttribute('aria-hidden', 'false');
            
            if (button) {
                button.setAttribute('aria-expanded', 'true');
                button.setAttribute('title', 'Hide task details');
            }
            
            taskDetailsVisible = true;
            
            // Announce to screen readers
            announceToScreenReader('Task details panel expanded');
            
            // Save preference
            saveTaskDetailsPreference(true);
        }

        /**
         * Hides the task details panel.
         */
        function hideTaskDetails() {
            const panel = document.getElementById('taskDetailsPanel');
            const button = document.getElementById('btnTaskDetails');
            
            if (!panel) {
                return;
            }
            
            panel.style.display = 'none';
            panel.setAttribute('aria-hidden', 'true');
            
            if (button) {
                button.setAttribute('aria-expanded', 'false');
                button.setAttribute('title', 'Show task details');
            }
            
            taskDetailsVisible = false;
            
            // Announce to screen readers
            announceToScreenReader('Task details panel collapsed');
            
            // Save preference
            saveTaskDetailsPreference(false);
        }

        /**
         * Checks if task details panel is currently visible.
         * @returns {boolean} True if panel is visible
         */
        function isTaskDetailsVisible() {
            return taskDetailsVisible;
        }

        /**
         * Saves the task details visibility preference.
         * @param {boolean} visible - Whether the panel is visible
         */
        function saveTaskDetailsPreference(visible) {
            try {
                const state = vscode.getState() || {};
                state.taskDetailsVisible = visible;
                vscode.setState(state);
            } catch (e) {
                console.warn('Failed to save task details preference:', e);
            }
        }

        /**
         * Restores the task details visibility preference.
         */
        function restoreTaskDetailsPreference() {
            try {
                const state = vscode.getState();
                if (state && state.taskDetailsVisible === true) {
                    showTaskDetails();
                }
            } catch (e) {
                console.warn('Failed to restore task details preference:', e);
            }
        }

        /**
         * Updates the task details panel with new task data.
         * Called when the current task changes.
         * @param {object} task - The new task data
         */
        function updateTaskDetails(task) {
            if (!task) {
                // Hide panel if no task
                hideTaskDetails();
                return;
            }
            
            // Update task ID
            const idEl = document.querySelector('.task-detail-id');
            if (idEl) {
                idEl.textContent = task.id || '';
            }
            
            // Update status
            const statusEl = document.querySelector('.task-detail-status');
            if (statusEl) {
                const statusLabels = {
                    'PENDING': 'Pending',
                    'IN_PROGRESS': 'In Progress',
                    'COMPLETE': 'Complete',
                    'BLOCKED': 'Blocked',
                    'SKIPPED': 'Skipped'
                };
                const statusClasses = {
                    'PENDING': 'pending',
                    'IN_PROGRESS': 'in-progress',
                    'COMPLETE': 'complete',
                    'BLOCKED': 'blocked',
                    'SKIPPED': 'skipped'
                };
                statusEl.textContent = statusLabels[task.status] || task.status;
                statusEl.className = 'task-detail-value task-detail-status ' + (statusClasses[task.status] || 'pending');
            }
            
            // Update line number
            const lineEl = document.querySelector('.task-detail-line');
            if (lineEl) {
                lineEl.textContent = task.lineNumber || '';
            }
            
            // Update dependencies
            const depsEl = document.querySelector('.task-detail-dependencies');
            if (depsEl) {
                if (task.dependencies && task.dependencies.length > 0) {
                    depsEl.innerHTML = task.dependencies.map(function(dep) {
                        return '<span class="task-detail-dependency">' + escapeHtml(dep) + '</span>';
                    }).join('');
                } else {
                    depsEl.innerHTML = '<span class="task-detail-none">No dependencies</span>';
                }
            }
            
            // Update acceptance criteria
            updateAcceptanceCriteria(task.acceptanceCriteria);
            
            // Update related files
            updateRelatedFiles(task.description || '');
            
            // Update estimated time based on historical data
            updateEstimatedTime();
        }

        /**
         * Updates the acceptance criteria display in the task details panel.
         * @param {string[]|undefined} criteria - Array of acceptance criteria
         */
        function updateAcceptanceCriteria(criteria) {
            const criteriaEl = document.getElementById('taskAcceptanceCriteria');
            if (!criteriaEl) {
                return;
            }
            
            if (criteria && criteria.length > 0) {
                const listItems = criteria.map(function(criterion) {
                    return '<li class="task-detail-criterion" role="listitem"><span class="criterion-bullet" aria-hidden="true">✓</span>' + escapeHtml(criterion) + '</li>';
                }).join('');
                criteriaEl.innerHTML = '<ul class="task-detail-criteria-list" role="list">' + listItems + '</ul>';
                announceToScreenReader('Task has ' + criteria.length + ' acceptance criteri' + (criteria.length === 1 ? 'on' : 'a'));
            } else {
                criteriaEl.innerHTML = '<span class="task-detail-none">No acceptance criteria defined</span>';
            }
        }

        /**
         * Gets the current acceptance criteria from the task details panel.
         * @returns {string[]} Array of acceptance criteria text
         */
        function getAcceptanceCriteria() {
            const items = document.querySelectorAll('.task-detail-criterion');
            const criteria = [];
            items.forEach(function(item) {
                // Get text content excluding the bullet
                const text = item.textContent.replace(/^✓\s*/, '').trim();
                if (text) {
                    criteria.push(text);
                }
            });
            return criteria;
        }

        /**
         * Checks if the task has acceptance criteria defined.
         * @returns {boolean} True if acceptance criteria exist
         */
        function hasAcceptanceCriteria() {
            return getAcceptanceCriteria().length > 0;
        }

        // ====================================================================
        // Related Files Extraction and Display
        // ====================================================================

        /**
         * Common file extensions used in software projects.
         */
        const FILE_EXTENSIONS = [
            'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs',
            'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs',
            'go', 'rs', 'rb', 'php', 'swift', 'kt', 'scala',
            'html', 'css', 'scss', 'sass', 'less',
            'json', 'yaml', 'yml', 'xml', 'toml', 'ini', 'env',
            'md', 'txt', 'rst', 'mdx',
            'sql', 'graphql', 'gql',
            'sh', 'bash', 'zsh', 'ps1', 'bat', 'cmd',
            'dockerfile', 'makefile', 'gitignore'
        ];

        /**
         * Extracts related file paths and patterns from a task description.
         * @param {string} description - The task description to analyze
         * @returns {string[]} Array of related file paths/patterns found
         */
        function extractRelatedFilesFromDescription(description) {
            const files = new Set();
            
            // Pattern 1: Files with extensions
            const extPattern = new RegExp(
                '(?:^|[\\\\s\\'"\`\\(])([a-zA-Z0-9_.\\\\-\\/]+\\\\.(' + FILE_EXTENSIONS.join('|') + '))(?:[\\\\s\\'"\`\\)]|$)',
                'gi'
            );
            let match;
            while ((match = extPattern.exec(description)) !== null) {
                const file = match[1].trim();
                if (file) {
                    files.add(file);
                }
            }
            
            // Pattern 2: Backtick-quoted file paths
            const backtickPattern = /\`([a-zA-Z0-9_.\\/\\-]+\\.[a-zA-Z0-9]+)\`/g;
            while ((match = backtickPattern.exec(description)) !== null) {
                const file = match[1].trim();
                if (file && FILE_EXTENSIONS.some(function(ext) { return file.toLowerCase().endsWith('.' + ext); })) {
                    files.add(file);
                }
            }
            
            // Pattern 3: Common file keywords
            const keywordPattern = /(?:in|the|file|update|modify|edit|create|add to|change)\\s+([a-zA-Z0-9_.\\/\\-]+\\.[a-zA-Z0-9]+)/gi;
            while ((match = keywordPattern.exec(description)) !== null) {
                const file = match[1].trim();
                if (file && FILE_EXTENSIONS.some(function(ext) { return file.toLowerCase().endsWith('.' + ext); })) {
                    files.add(file);
                }
            }
            
            // Pattern 4: Directory paths
            const dirPattern = /(?:^|[\\s'"\`])([a-zA-Z0-9_.\\-]+(?:\\/[a-zA-Z0-9_.\\-]+)+)\\/?(?:[\\s'"\`]|$)/g;
            while ((match = dirPattern.exec(description)) !== null) {
                const dir = match[1].trim();
                if (dir && dir.includes('/') && !FILE_EXTENSIONS.some(function(ext) { return dir.toLowerCase().endsWith('.' + ext); })) {
                    files.add(dir + '/');
                }
            }
            
            // Pattern 5: Glob patterns
            const globPattern = /(?:^|[\\s'"\`])(\\*\\*?\\/[a-zA-Z0-9_.*\\-\\/]+|\\*\\.[a-zA-Z0-9]+)(?:[\\s'"\`]|$)/g;
            while ((match = globPattern.exec(description)) !== null) {
                const glob = match[1].trim();
                if (glob) {
                    files.add(glob);
                }
            }
            
            return Array.from(files).slice(0, 10);
        }

        /**
         * Determines the file type class based on the file path.
         * @param {string} filePath - The file path to check
         * @returns {string} CSS class for the file type
         */
        function getFileTypeClass(filePath) {
            if (filePath.endsWith('/')) {
                return 'is-directory';
            }
            if (filePath.includes('*')) {
                return 'is-glob';
            }
            return '';
        }

        /**
         * Updates the related files display in the task details panel.
         * @param {string} description - The task description
         */
        function updateRelatedFiles(description) {
            const filesEl = document.getElementById('taskRelatedFiles');
            if (!filesEl) {
                return;
            }
            
            const relatedFiles = extractRelatedFilesFromDescription(description);
            
            if (relatedFiles.length > 0) {
                filesEl.innerHTML = relatedFiles.map(function(file) {
                    const typeClass = getFileTypeClass(file);
                    const className = 'task-detail-related-file' + (typeClass ? ' ' + typeClass : '');
                    return '<span class="' + className + '" title="' + escapeHtml(file) + '">' + escapeHtml(file) + '</span>';
                }).join('');
            } else {
                filesEl.innerHTML = '<span class="task-detail-none">No files detected</span>';
            }
        }

        /**
         * Gets the current list of related files from the display.
         * @returns {string[]} Array of related file paths
         */
        function getRelatedFiles() {
            const filesEl = document.getElementById('taskRelatedFiles');
            if (!filesEl) {
                return [];
            }
            const fileEls = filesEl.querySelectorAll('.task-detail-related-file');
            return Array.from(fileEls).map(function(el) {
                return el.getAttribute('title') || el.textContent || '';
            });
        }

        // ====================================================================
        // Estimated Time Based on Historical Data
        // ====================================================================

        /**
         * Calculates estimated time for the current task based on historical task completion data.
         * Uses the average duration of completed tasks as the estimate.
         * @returns {{ estimate: number|null, source: string, sampleSize: number }} The estimate in milliseconds, source description, and sample size
         */
        function calculateEstimatedTime() {
            // Check if we have task history
            if (!currentTaskHistory || currentTaskHistory.length === 0) {
                return { estimate: null, source: '', sampleSize: 0 };
            }
            
            // Calculate average duration from completed tasks
            const totalDuration = currentTaskHistory.reduce(function(sum, h) { 
                return sum + h.duration; 
            }, 0);
            const avgDuration = totalDuration / currentTaskHistory.length;
            
            return { 
                estimate: avgDuration, 
                source: 'avg of ' + currentTaskHistory.length + ' tasks',
                sampleSize: currentTaskHistory.length 
            };
        }

        /**
         * Formats a duration in milliseconds to a human-readable string.
         * @param {number} ms - Duration in milliseconds
         * @returns {string} Formatted duration string (e.g., "2m 30s", "1h 15m")
         */
        function formatEstimatedDuration(ms) {
            if (!ms || ms <= 0) {
                return '--';
            }
            
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            
            if (hours > 0) {
                const remainingMins = minutes % 60;
                return hours + 'h ' + remainingMins + 'm';
            } else if (minutes > 0) {
                const remainingSecs = seconds % 60;
                return minutes + 'm ' + remainingSecs + 's';
            } else {
                return seconds + 's';
            }
        }

        /**
         * Updates the estimated time display in the task details panel.
         * Should be called whenever task history changes or when the panel is shown.
         */
        function updateEstimatedTime() {
            const valueEl = document.getElementById('estimatedTimeValue');
            const sourceEl = document.getElementById('estimatedTimeSource');
            
            if (!valueEl) {
                return;
            }
            
            const { estimate, source, sampleSize } = calculateEstimatedTime();
            
            if (estimate !== null && sampleSize > 0) {
                const formatted = formatEstimatedDuration(estimate);
                valueEl.textContent = formatted;
                valueEl.classList.remove('no-data', 'loading');
                
                if (sourceEl) {
                    sourceEl.textContent = source;
                }
                
                // Announce to screen readers when estimate is updated
                if (isTaskDetailsVisible()) {
                    announceToScreenReader('Estimated time: ' + formatted + ', based on ' + source);
                }
            } else {
                valueEl.textContent = '--';
                valueEl.classList.add('no-data');
                valueEl.classList.remove('loading');
                
                if (sourceEl) {
                    sourceEl.textContent = 'no history';
                }
            }
        }

        /**
         * Shows a loading state for the estimated time display.
         */
        function showEstimatedTimeLoading() {
            const valueEl = document.getElementById('estimatedTimeValue');
            if (valueEl) {
                valueEl.textContent = '...';
                valueEl.classList.add('loading');
                valueEl.classList.remove('no-data');
            }
        }

        /**
         * Gets the current estimated time value.
         * @returns {{ estimate: number|null, formatted: string, source: string }} The current estimate
         */
        function getEstimatedTime() {
            const { estimate, source, sampleSize } = calculateEstimatedTime();
            return {
                estimate: estimate,
                formatted: estimate !== null ? formatEstimatedDuration(estimate) : '--',
                source: source,
                sampleSize: sampleSize
            };
        }

        /**
         * Gets the current task from the page data or window state.
         * @returns {object|null} The current task or null
         */
        function getCurrentTaskData() {
            if (window.__RALPH_INITIAL_TASKS__ && window.__RALPH_INITIAL_TASKS__.length > 0) {
                // Find the first pending or in-progress task
                return window.__RALPH_INITIAL_TASKS__.find(function(t) {
                    return t.status === 'PENDING' || t.status === 'IN_PROGRESS';
                }) || null;
            }
            return null;
        }

        /**
         * Gets a human-readable section name for screen reader announcements.
         * @param {string} contentId - The content element ID
         * @returns {string} The section name
         */
        function getSectionName(contentId) {
            const names = {
                'reqContent': 'Acceptance criteria',
                'timelineContent': 'Timeline',
                'taskContent': 'Current task',
                'logContent': 'Activity log',
                'durationContent': 'Duration breakdown'
            };
            return names[contentId] || 'Section';
        }

        /**
         * Collapses a section by its content ID.
         * @param {string} contentId - The ID of the content element to collapse
         */
        function collapseSection(contentId) {
            const content = document.getElementById(contentId);
            const toggleId = SECTION_TOGGLE_MAP[contentId];
            const toggle = toggleId ? document.getElementById(toggleId) : null;
            if (content && !content.classList.contains('collapsed')) {
                content.classList.add('collapsed');
                if (toggle) {
                    toggle.classList.remove('expanded');
                }
                // Update ARIA state on the header
                const header = content.previousElementSibling;
                if (header && header.hasAttribute('aria-expanded')) {
                    header.setAttribute('aria-expanded', 'false');
                }
            }
        }

        /**
         * Expands a section by its content ID.
         * @param {string} contentId - The ID of the content element to expand
         */
        function expandSection(contentId) {
            const content = document.getElementById(contentId);
            const toggleId = SECTION_TOGGLE_MAP[contentId];
            const toggle = toggleId ? document.getElementById(toggleId) : null;
            if (content && content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                if (toggle) {
                    toggle.classList.add('expanded');
                }
                // Update ARIA state on the header
                const header = content.previousElementSibling;
                if (header && header.hasAttribute('aria-expanded')) {
                    header.setAttribute('aria-expanded', 'true');
                }
            }
        }

        /**
         * Checks if the viewport is at mobile breakpoint and auto-collapses sections.
         * Called on load and resize to provide mobile-friendly view.
         */
        function checkMobileBreakpoint() {
            const isMobile = window.innerWidth <= MOBILE_COLLAPSE_BREAKPOINT;
            const body = document.body;
            
            if (isMobile) {
                body.classList.add('mobile-view');
                // Auto-collapse non-essential sections on mobile for cleaner view
                // Keep current task expanded as it's most important
                COLLAPSIBLE_SECTIONS.forEach(function(sectionId) {
                    // Don't auto-collapse taskContent as it shows the current work
                    if (sectionId !== 'taskContent') {
                        collapseSection(sectionId);
                    }
                });
            } else {
                body.classList.remove('mobile-view');
            }
        }

        /**
         * Initializes mobile breakpoint handling.
         * Sets up resize listener for responsive behavior.
         */
        function initMobileCollapsible() {
            // Check on initial load
            checkMobileBreakpoint();
            
            // Debounce resize events
            let resizeTimeout = null;
            window.addEventListener('resize', function() {
                if (resizeTimeout) {
                    clearTimeout(resizeTimeout);
                }
                resizeTimeout = setTimeout(function() {
                    checkMobileBreakpoint();
                    resizeTimeout = null;
                }, 150);
            });
        }

        function toggleRequirements() {
            const content = document.getElementById('reqContent');
            const toggle = document.getElementById('reqToggle');
            const header = document.querySelector('.requirements-header');
            if (content && toggle) {
                const isCollapsed = content.classList.toggle('collapsed');
                toggle.classList.toggle('expanded');
                // Update ARIA expanded state for accessibility
                if (header) {
                    header.setAttribute('aria-expanded', String(!isCollapsed));
                }
                // Save panel state after toggling
                savePanelState();
            }
        }

        function updateRequirements() {
            const requirements = {
                writeTests: document.getElementById('reqWriteTests')?.checked ?? false,
                runTests: document.getElementById('reqRunTests')?.checked ?? false,
                runTypeCheck: document.getElementById('reqTypeCheck')?.checked ?? false,
                runLinting: document.getElementById('reqLinting')?.checked ?? false,
                updateDocs: document.getElementById('reqDocs')?.checked ?? false,
                commitChanges: document.getElementById('reqCommit')?.checked ?? false
            };
            vscode.postMessage({ command: 'requirementsChanged', requirements });
        }

        function openSettings() {
            const overlay = document.getElementById('settingsOverlay');
            if (overlay) {
                overlay.classList.add('visible');
            }
        }

        function closeSettings() {
            const overlay = document.getElementById('settingsOverlay');
            if (overlay) {
                overlay.classList.remove('visible');
            }
        }

        function updateSettings() {
            const maxIterEl = document.getElementById('settingMaxIterations');
            const settings = {
                maxIterations: parseInt(maxIterEl?.value ?? '50') || 50
            };
            vscode.postMessage({ command: 'settingsChanged', settings });
        }

        // ====================================================================
        // Toast Notifications
        // ====================================================================

        // Toast icons embedded as strings for each type
        const TOAST_ICONS = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
            dismiss: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        };

        // Default duration for auto-dismissing toasts (in milliseconds)
        const TOAST_DEFAULT_DURATION = 5000;

        // Maximum number of visible toasts
        const TOAST_MAX_VISIBLE = 5;

        // Counter for generating unique toast IDs
        let toastIdCounter = 0;

        /**
         * Shows a toast notification.
         * @param {Object} options - Toast configuration options
         * @param {string} options.type - Toast type: 'success', 'error', 'warning', or 'info'
         * @param {string} options.title - Toast title (optional)
         * @param {string} options.message - Toast message content
         * @param {number} options.duration - Duration in ms before auto-dismiss (0 = no auto-dismiss)
         * @param {boolean} options.dismissible - Whether the toast can be manually dismissed
         * @returns {string} The unique ID of the created toast
         */
        function showToast(options) {
            const container = document.getElementById('toastContainer');
            if (!container) return null;

            const type = options.type || 'info';
            const title = options.title || '';
            const message = options.message || '';
            const duration = typeof options.duration === 'number' ? options.duration : TOAST_DEFAULT_DURATION;
            const dismissible = options.dismissible !== false;

            // Generate unique ID for this toast
            const toastId = 'toast-' + (++toastIdCounter);

            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'toast ' + type;
            toast.id = toastId;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'assertive');
            toast.setAttribute('aria-atomic', 'true');

            // Build toast HTML
            let html = '';
            html += '<div class="toast-icon">' + (TOAST_ICONS[type] || TOAST_ICONS.info) + '</div>';
            html += '<div class="toast-content">';
            if (title) {
                html += '<div class="toast-title">' + escapeHtml(title) + '</div>';
            }
            html += '<div class="toast-message">' + escapeHtml(message) + '</div>';
            html += '</div>';
            if (dismissible) {
                html += '<button class="toast-dismiss" onclick="dismissToast(\\'' + toastId + '\\')" aria-label="Dismiss notification">' + TOAST_ICONS.dismiss + '</button>';
            }
            if (duration > 0) {
                html += '<div class="toast-progress animate" style="animation-duration: ' + duration + 'ms;"></div>';
            }

            toast.innerHTML = html;

            // Limit visible toasts
            const existingToasts = container.querySelectorAll('.toast:not(.dismissing)');
            if (existingToasts.length >= TOAST_MAX_VISIBLE) {
                // Dismiss the oldest toast
                const oldest = existingToasts[0];
                if (oldest && oldest.id) {
                    dismissToast(oldest.id);
                }
            }

            // Use requestAnimationFrame for smooth insertion
            runOnNextFrame(function() {
                // Add toast to container
                container.appendChild(toast);
            });

            // Announce to screen reader (already done via aria-live on toast)

            // Auto-dismiss after duration
            if (duration > 0) {
                setTimeout(function() {
                    dismissToast(toastId);
                }, duration);
            }

            return toastId;
        }

        /**
         * Dismisses a toast notification by ID using requestAnimationFrame.
         * Uses RAF for smooth slide-out animation coordination.
         * @param {string} toastId - The ID of the toast to dismiss
         */
        function dismissToast(toastId) {
            const toast = document.getElementById(toastId);
            if (!toast) return;

            // Prevent double-dismissal
            if (toast.classList.contains('dismissing')) return;

            // Use RAF for smooth animation start
            runOnNextFrame(function() {
                // Add dismissing class for slide-out animation
                toast.classList.add('dismissing');
            });

            // Remove after animation completes
            setTimeout(function() {
                runOnNextFrame(function() {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                });
            }, 300);
        }

        /**
         * Dismisses all visible toast notifications.
         */
        function dismissAllToasts() {
            const container = document.getElementById('toastContainer');
            if (!container) return;

            const toasts = container.querySelectorAll('.toast:not(.dismissing)');
            toasts.forEach(function(toast) {
                if (toast.id) {
                    dismissToast(toast.id);
                }
            });
        }

        /**
         * Shows a success toast notification.
         * @param {string} message - The message to display
         * @param {string} title - Optional title
         */
        function showSuccessToast(message, title) {
            return showToast({
                type: 'success',
                title: title || '',
                message: message
            });
        }

        /**
         * Shows an error toast notification.
         * @param {string} message - The message to display
         * @param {string} title - Optional title
         */
        function showErrorToast(message, title) {
            return showToast({
                type: 'error',
                title: title || 'Error',
                message: message,
                duration: 8000 // Errors stay longer
            });
        }

        /**
         * Shows a warning toast notification.
         * @param {string} message - The message to display
         * @param {string} title - Optional title
         */
        function showWarningToast(message, title) {
            return showToast({
                type: 'warning',
                title: title || 'Warning',
                message: message,
                duration: 6000
            });
        }

        /**
         * Shows an info toast notification.
         * @param {string} message - The message to display
         * @param {string} title - Optional title
         */
        function showInfoToast(message, title) {
            return showToast({
                type: 'info',
                title: title || '',
                message: message
            });
        }

        // ====================================================================
        // Screen Reader Announcements
        // ====================================================================

        // Track the previous status to detect changes
        let previousStatus = 'idle';

        /**
         * Announces a message to screen readers via the live region.
         * The message is read aloud by assistive technologies.
         * @param {string} message - The message to announce
         */
        function announceToScreenReader(message) {
            const announcer = document.getElementById('srAnnouncer');
            if (!announcer) return;

            // Clear previous content first to ensure the new message is announced
            // even if it's the same as the previous one
            announcer.textContent = '';

            // Use requestAnimationFrame to ensure the DOM update is processed
            requestAnimationFrame(function() {
                announcer.textContent = message;
            });
        }

        /**
         * Gets a human-readable announcement message for a status change.
         * @param {string} oldStatus - The previous status
         * @param {string} newStatus - The new status
         * @param {string} taskInfo - Optional task information
         * @returns {string} The announcement message
         */
        function getStatusAnnouncement(oldStatus, newStatus, taskInfo) {
            const announcements = {
                'idle': 'Ralph automation is ready.',
                'running': taskInfo ? 'Ralph is now working on: ' + taskInfo : 'Ralph automation started.',
                'waiting': taskInfo ? 'Working on: ' + taskInfo + '. Waiting for next action.' : 'Waiting for next task.',
                'paused': 'Ralph automation is paused.'
            };

            // Special cases for transitions
            if (oldStatus === 'paused' && newStatus === 'running') {
                return taskInfo ? 'Ralph automation resumed. Working on: ' + taskInfo : 'Ralph automation resumed.';
            }
            if (oldStatus === 'running' && newStatus === 'idle') {
                return 'Ralph automation stopped.';
            }
            if (oldStatus === 'paused' && newStatus === 'idle') {
                return 'Ralph automation stopped.';
            }
            if (oldStatus === 'waiting' && newStatus === 'idle') {
                return 'Ralph automation completed.';
            }

            return announcements[newStatus] || 'Status changed to ' + newStatus;
        }

        // ====================================================================
        // UI Updates
        // ====================================================================

        // Track the previous UI status for toast notifications
        let previousUIStatus = 'idle';

        /**
         * Internal updateUI function - updates the main UI elements.
         * This is the actual implementation, called by the debounced wrapper.
         */
        function updateUIInternal(status, iteration, taskInfo) {
            const wasRunning = window.isRunning || window.isWaiting;
            window.isRunning = status === 'running';
            window.isWaiting = status === 'waiting';
            const isNowRunning = window.isRunning || window.isWaiting;

            const header = document.getElementById('header');
            const statusText = document.getElementById('statusText');
            const btnStart = document.getElementById('btnStart');
            const btnPause = document.getElementById('btnPause');
            const btnResume = document.getElementById('btnResume');
            const btnStop = document.getElementById('btnStop');
            const taskText = document.getElementById('taskText');
            const reqSection = document.getElementById('requirementsSection');

            // Announce status change to screen readers
            if (status !== previousStatus) {
                const announcement = getStatusAnnouncement(previousStatus, status, taskInfo);
                announceToScreenReader(announcement);
                previousStatus = status;
            }

            // Show toast for important status transitions
            if (status !== previousUIStatus) {
                showStatusToast(previousUIStatus, status, taskInfo);
                
                // Trigger task execution animations based on status changes
                if (previousUIStatus === 'idle' && (status === 'running' || status === 'waiting')) {
                    // Started running - start execution animation
                    startTaskExecution();
                } else if ((previousUIStatus === 'running' || previousUIStatus === 'waiting') && status === 'idle') {
                    // Stopped - stop execution animation
                    stopTaskExecution();
                } else if (previousUIStatus === 'paused' && (status === 'running' || status === 'waiting')) {
                    // Resumed - restart execution animation
                    startTaskExecution();
                } else if ((previousUIStatus === 'running' || previousUIStatus === 'waiting') && status === 'paused') {
                    // Paused - pause animation (but keep state)
                    const taskSection = document.getElementById('taskSection');
                    if (taskSection) {
                        taskSection.classList.remove('executing');
                    }
                }
                
                previousUIStatus = status;
            }

            if (header) {
                header.className = 'header ' + status;
            }

            const statusLabels = {
                'idle': 'Ready',
                'running': 'Working',
                'waiting': 'Working',
                'paused': 'Paused'
            };
            if (statusText) {
                statusText.textContent = statusLabels[status] || status;
            }

            if (reqSection) {
                reqSection.style.display = status === 'idle' ? 'block' : 'none';
            }

            if (taskText && taskInfo) {
                taskText.textContent = taskInfo;
            }

            const isRunning = status === 'running' || status === 'waiting';
            const isPaused = status === 'paused';

            if (btnStart) btnStart.disabled = isRunning || isPaused;
            if (btnPause) {
                btnPause.disabled = !isRunning;
                btnPause.style.display = isPaused ? 'none' : 'inline-flex';
            }
            if (btnResume) {
                btnResume.disabled = !isPaused;
                btnResume.style.display = isPaused ? 'inline-flex' : 'none';
            }
            if (btnStop) btnStop.disabled = !isRunning && !isPaused;

            if (isNowRunning !== wasRunning) {
                updateTimeline(currentTaskHistory);
            }
        }

        // Store reference to internal function for debouncing
        _updateUIInternal = updateUIInternal;

        /**
         * Updates the UI with the current status, iteration, and task info.
         * Uses debouncing to batch rapid updates and improve performance.
         * 
         * @param {string} status - The current status ('idle', 'running', 'waiting', 'paused')
         * @param {number} iteration - The current iteration number
         * @param {string} taskInfo - Description of the current task
         * @param {boolean} immediate - If true, bypasses debouncing (for critical updates)
         */
        function updateUI(status, iteration, taskInfo, immediate) {
            // Status changes should be immediate to ensure UI responsiveness
            if (immediate || status !== previousUIStatus) {
                // Flush any pending updates first
                if (debouncedUpdateUI && debouncedUpdateUI.pending()) {
                    debouncedUpdateUI.cancel();
                }
                updateUIInternal(status, iteration, taskInfo);
            } else if (debouncedUpdateUI) {
                debouncedUpdateUI(status, iteration, taskInfo);
            } else {
                // Fallback if debouncing not yet initialized
                updateUIInternal(status, iteration, taskInfo);
            }
        }

        /**
         * Shows a toast notification for status transitions.
         * Only shows toasts for meaningful transitions to avoid notification fatigue.
         * @param {string} oldStatus - The previous status
         * @param {string} newStatus - The new status
         * @param {string} taskInfo - Optional task information
         */
        function showStatusToast(oldStatus, newStatus, taskInfo) {
            // Don't show toast on initial load (idle -> idle or first transition from idle with no task)
            if (oldStatus === newStatus) return;
            
            // Start automation: idle -> running
            if (oldStatus === 'idle' && (newStatus === 'running' || newStatus === 'waiting')) {
                const msg = taskInfo ? 'Working on: ' + taskInfo : 'Automation started';
                showInfoToast(msg, 'Started');
                return;
            }

            // Pause automation: running/waiting -> paused
            if ((oldStatus === 'running' || oldStatus === 'waiting') && newStatus === 'paused') {
                showWarningToast('Automation has been paused', 'Paused');
                return;
            }

            // Resume automation: paused -> running/waiting
            if (oldStatus === 'paused' && (newStatus === 'running' || newStatus === 'waiting')) {
                const msg = taskInfo ? 'Working on: ' + taskInfo : 'Automation resumed';
                showInfoToast(msg, 'Resumed');
                return;
            }

            // Stop automation: running/waiting/paused -> idle
            if ((oldStatus === 'running' || oldStatus === 'waiting' || oldStatus === 'paused') && newStatus === 'idle') {
                showInfoToast('Automation has stopped', 'Stopped');
                return;
            }
        }

        // ====================================================================
        // Countdown Display
        // ====================================================================

        // Track last countdown offset for smooth animations
        var lastCountdownOffset = CLOCK_CIRCUMFERENCE;

        /**
         * Internal countdown update function using requestAnimationFrame.
         * This is the actual implementation, throttled for performance.
         * Uses RAF for smooth stroke-dashoffset transitions.
         */
        function showCountdownInternal(seconds) {
            const countdown = document.getElementById('countdown');
            const clockFill = document.getElementById('clockFill');

            if (!countdown || !clockFill) return;

            if (seconds > 0) {
                // Use RAF for smooth visibility transition
                runOnNextFrame(function() {
                    countdown.classList.add('visible');
                });
                
                const progress = 1 - (seconds / TOTAL_COUNTDOWN);
                const targetOffset = CLOCK_CIRCUMFERENCE * (1 - progress);
                
                // Animate the stroke-dashoffset smoothly
                animateValue({
                    id: 'countdownOffset',
                    from: lastCountdownOffset,
                    to: targetOffset,
                    duration: 150,
                    easing: 'linear',
                    onUpdate: function(value) {
                        if (clockFill) {
                            clockFill.style.strokeDashoffset = String(value);
                        }
                    }
                });
                
                lastCountdownOffset = targetOffset;
            } else {
                // Cancel any running animation
                cancelAnimation('countdownOffset');
                
                runOnNextFrame(function() {
                    countdown.classList.remove('visible');
                    clockFill.style.strokeDashoffset = String(CLOCK_CIRCUMFERENCE);
                });
                
                lastCountdownOffset = CLOCK_CIRCUMFERENCE;
            }
        }

        // Initialize throttled countdown
        throttledShowCountdown = createThrottle(showCountdownInternal, THROTTLE_DELAYS.COUNTDOWN);

        /**
         * Updates the countdown display.
         * Uses throttling to prevent excessive DOM updates during rapid countdown changes.
         * 
         * @param {number} seconds - The number of seconds remaining
         * @param {boolean} immediate - If true, bypasses throttling (for 0 seconds or first display)
         */
        function showCountdown(seconds, immediate) {
            // Critical updates bypass throttling (0 = hide, first display)
            if (immediate || seconds === 0 || seconds === TOTAL_COUNTDOWN) {
                if (throttledShowCountdown) {
                    throttledShowCountdown.cancel();
                }
                showCountdownInternal(seconds);
            } else if (throttledShowCountdown) {
                throttledShowCountdown(seconds);
            } else {
                // Fallback if throttling not yet initialized
                showCountdownInternal(seconds);
            }
        }

        // ====================================================================
        // Activity Log - Virtual Scrolling System
        // ====================================================================

        /** Current active log filter level */
        let currentLogFilter = 'all';

        /** Log level constants for filtering */
        const LOG_LEVELS = ['all', 'info', 'warning', 'error', 'success'];

        // ====================================================================
        // Virtual Scrolling Configuration & State
        // ====================================================================

        /** Virtual scrolling constants */
        const VIRTUAL_SCROLL_ITEM_HEIGHT = 28; // Estimated height per log entry in pixels
        const VIRTUAL_SCROLL_OVERSCAN = 5; // Extra items to render above/below viewport
        const VIRTUAL_SCROLL_THRESHOLD = 100; // Minimum entries before enabling virtual scroll
        const VIRTUAL_SCROLL_DEBOUNCE_MS = 16; // ~60fps scroll debounce

        /** Data store for all log entries (used by virtual scrolling) */
        let virtualLogData = [];

        /** Virtual scrolling state */
        let virtualScrollState = {
            enabled: false,
            startIndex: 0,
            endIndex: 0,
            scrollTop: 0,
            containerHeight: 0,
            totalHeight: 0,
            scrollDebounceTimer: null
        };

        /**
         * Log entry data structure for virtual scrolling
         * @typedef {Object} VirtualLogEntry
         * @property {number} id - Unique entry ID
         * @property {string} message - Log message content
         * @property {string} type - Log type (info, warning, error, success)
         * @property {string} time - Formatted timestamp
         * @property {boolean} matchesFilter - Whether entry matches current filter
         * @property {boolean} matchesSearch - Whether entry matches current search
         */

        /** Entry ID counter for unique identification */
        let virtualLogEntryId = 0;

        /**
         * Initializes virtual scrolling for the log area.
         * Sets up scroll event listener and calculates initial visible range.
         */
        function initVirtualScroll() {
            const logContent = document.getElementById('logContent');
            const logArea = document.getElementById('logArea');
            
            if (!logContent || !logArea) return;

            // Set up scroll handler with debounce
            logContent.addEventListener('scroll', handleVirtualScroll, { passive: true });
            
            // Set up resize observer for container height changes
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(function(entries) {
                    for (const entry of entries) {
                        virtualScrollState.containerHeight = entry.contentRect.height;
                        if (virtualScrollState.enabled) {
                            renderVirtualLogEntries();
                        }
                    }
                });
                resizeObserver.observe(logContent);
            }
            
            virtualScrollState.containerHeight = logContent.clientHeight;
        }

        /**
         * Handles scroll events for virtual scrolling with debounce.
         * @param {Event} event - Scroll event
         */
        function handleVirtualScroll(event) {
            if (!virtualScrollState.enabled) return;
            
            const scrollTop = event.target.scrollTop;
            
            // Clear existing debounce timer
            if (virtualScrollState.scrollDebounceTimer) {
                cancelAnimationFrame(virtualScrollState.scrollDebounceTimer);
            }
            
            // Use requestAnimationFrame for smooth scroll handling
            virtualScrollState.scrollDebounceTimer = requestAnimationFrame(function() {
                virtualScrollState.scrollTop = scrollTop;
                renderVirtualLogEntries();
            });
        }

        /**
         * Calculates which log entries should be visible based on scroll position.
         * @returns {{ startIndex: number, endIndex: number }} Visible range
         */
        function calculateVisibleRange() {
            const filteredData = getFilteredLogData();
            const totalItems = filteredData.length;
            
            if (totalItems === 0) {
                return { startIndex: 0, endIndex: 0 };
            }
            
            const scrollTop = virtualScrollState.scrollTop;
            const containerHeight = virtualScrollState.containerHeight || 180; // Default log height
            
            // Calculate visible range with overscan
            const startIndex = Math.max(0, Math.floor(scrollTop / VIRTUAL_SCROLL_ITEM_HEIGHT) - VIRTUAL_SCROLL_OVERSCAN);
            const visibleCount = Math.ceil(containerHeight / VIRTUAL_SCROLL_ITEM_HEIGHT);
            const endIndex = Math.min(totalItems, startIndex + visibleCount + (VIRTUAL_SCROLL_OVERSCAN * 2));
            
            return { startIndex, endIndex };
        }

        /**
         * Gets log entries filtered by current filter and search.
         * @returns {VirtualLogEntry[]} Filtered log entries
         */
        function getFilteredLogData() {
            return virtualLogData.filter(function(entry) {
                // Apply filter
                if (currentLogFilter !== 'all' && entry.type !== currentLogFilter) {
                    return false;
                }
                // Apply search
                if (currentLogSearch && !logMatchesSearch(entry.message)) {
                    return false;
                }
                return true;
            });
        }

        /**
         * Renders only the visible log entries using virtual scrolling.
         * Uses spacer elements to maintain correct scroll position.
         */
        function renderVirtualLogEntries() {
            const logArea = document.getElementById('logArea');
            if (!logArea) return;
            
            const filteredData = getFilteredLogData();
            const totalItems = filteredData.length;
            
            // Calculate total height for scrollbar
            virtualScrollState.totalHeight = totalItems * VIRTUAL_SCROLL_ITEM_HEIGHT;
            
            // Calculate visible range
            const { startIndex, endIndex } = calculateVisibleRange();
            virtualScrollState.startIndex = startIndex;
            virtualScrollState.endIndex = endIndex;
            
            // Build HTML for visible entries
            let html = '';
            
            // Top spacer (creates space for items above viewport)
            const topSpacerHeight = startIndex * VIRTUAL_SCROLL_ITEM_HEIGHT;
            html += '<div class="virtual-scroll-spacer" style="height: ' + topSpacerHeight + 'px;" aria-hidden="true"></div>';
            
            // Render visible entries
            for (let i = startIndex; i < endIndex && i < totalItems; i++) {
                const entry = filteredData[i];
                html += createLogEntryHtml(entry, i);
            }
            
            // Bottom spacer (creates space for items below viewport)
            const bottomSpacerHeight = Math.max(0, (totalItems - endIndex) * VIRTUAL_SCROLL_ITEM_HEIGHT);
            html += '<div class="virtual-scroll-spacer" style="height: ' + bottomSpacerHeight + 'px;" aria-hidden="true"></div>';
            
            logArea.innerHTML = html;
            
            // Update ARIA for screen readers
            logArea.setAttribute('aria-setsize', String(totalItems));
        }

        /**
         * Creates HTML for a single log entry.
         * @param {VirtualLogEntry} entry - Log entry data
         * @param {number} index - Entry index in filtered list
         * @returns {string} HTML string for the entry
         */
        function createLogEntryHtml(entry, index) {
            let className = 'log-entry ' + entry.type;
            if (currentLogSearch && logMatchesSearch(entry.message)) {
                className += ' search-match';
            }
            
            // Apply search highlight if needed
            let messageHtml = escapeHtml(entry.message);
            if (currentLogSearch && logMatchesSearch(entry.message)) {
                messageHtml = highlightSearchMatch(entry.message, currentLogSearch);
            }
            
            return '<div class="' + className + '" role="listitem" data-level="' + entry.type + '" ' +
                   'data-entry-id="' + entry.id + '" aria-posinset="' + (index + 1) + '" ' +
                   'style="height: ' + VIRTUAL_SCROLL_ITEM_HEIGHT + 'px;">' +
                   '<span class="log-time" aria-label="Time: ' + entry.time + '">' + entry.time + '</span>' +
                   '<span class="log-msg" data-original-text="' + escapeHtml(entry.message) + '">' + messageHtml + '</span>' +
                   '</div>';
        }

        /**
         * Checks if virtual scrolling should be enabled based on entry count.
         * @returns {boolean} True if virtual scrolling should be enabled
         */
        function shouldEnableVirtualScroll() {
            return virtualLogData.length >= VIRTUAL_SCROLL_THRESHOLD;
        }

        /**
         * Enables virtual scrolling mode.
         */
        function enableVirtualScroll() {
            if (virtualScrollState.enabled) return;
            
            virtualScrollState.enabled = true;
            const logArea = document.getElementById('logArea');
            if (logArea) {
                logArea.classList.add('virtual-scroll-enabled');
            }
            
            // Re-render with virtual scrolling
            renderVirtualLogEntries();
        }

        /**
         * Disables virtual scrolling mode.
         */
        function disableVirtualScroll() {
            if (!virtualScrollState.enabled) return;
            
            virtualScrollState.enabled = false;
            const logArea = document.getElementById('logArea');
            if (logArea) {
                logArea.classList.remove('virtual-scroll-enabled');
            }
            
            // Re-render all entries in traditional mode
            renderAllLogEntriesTraditional();
        }

        /**
         * Renders all log entries in traditional (non-virtual) mode.
         */
        function renderAllLogEntriesTraditional() {
            const logArea = document.getElementById('logArea');
            if (!logArea) return;
            
            let html = '';
            virtualLogData.forEach(function(entry, index) {
                const matchesFilter = currentLogFilter === 'all' || entry.type === currentLogFilter;
                const matchesSearch = !currentLogSearch || logMatchesSearch(entry.message);
                
                let className = 'log-entry ' + entry.type;
                if (!matchesFilter) className += ' filtered-out';
                if (currentLogSearch && matchesSearch) className += ' search-match';
                if (currentLogSearch && !matchesSearch) className += ' search-hidden';
                
                let messageHtml = escapeHtml(entry.message);
                if (currentLogSearch && matchesSearch) {
                    messageHtml = highlightSearchMatch(entry.message, currentLogSearch);
                }
                
                html += '<div class="' + className + '" role="listitem" data-level="' + entry.type + '" data-entry-id="' + entry.id + '">' +
                        '<span class="log-time" aria-label="Time: ' + entry.time + '">' + entry.time + '</span>' +
                        '<span class="log-msg" data-original-text="' + escapeHtml(entry.message) + '">' + messageHtml + '</span>' +
                        '</div>';
            });
            
            logArea.innerHTML = html;
        }

        /**
         * Gets the current virtual scroll state.
         * @returns {Object} Virtual scroll state
         */
        function getVirtualScrollState() {
            return {
                enabled: virtualScrollState.enabled,
                totalEntries: virtualLogData.length,
                visibleStart: virtualScrollState.startIndex,
                visibleEnd: virtualScrollState.endIndex,
                threshold: VIRTUAL_SCROLL_THRESHOLD
            };
        }

        /**
         * Gets all log data entries.
         * @returns {VirtualLogEntry[]} All log entries
         */
        function getAllLogData() {
            return virtualLogData.slice();
        }

        /**
         * Clears all virtual log data and resets state.
         */
        function clearVirtualLogData() {
            virtualLogData = [];
            virtualLogEntryId = 0;
            virtualScrollState.enabled = false;
            virtualScrollState.startIndex = 0;
            virtualScrollState.endIndex = 0;
            virtualScrollState.scrollTop = 0;
            
            const logArea = document.getElementById('logArea');
            if (logArea) {
                logArea.classList.remove('virtual-scroll-enabled');
                logArea.innerHTML = '';
            }
        }

        /**
         * Scrolls to a specific log entry by index.
         * @param {number} index - Entry index to scroll to
         */
        function scrollToLogEntry(index) {
            const logContent = document.getElementById('logContent');
            if (!logContent) return;
            
            const filteredData = getFilteredLogData();
            if (index < 0 || index >= filteredData.length) return;
            
            const scrollTop = index * VIRTUAL_SCROLL_ITEM_HEIGHT;
            logContent.scrollTop = scrollTop;
            virtualScrollState.scrollTop = scrollTop;
            
            if (virtualScrollState.enabled) {
                renderVirtualLogEntries();
            }
        }

        /**
         * Scrolls to the bottom of the log (latest entries).
         */
        function scrollToLogBottom() {
            const logContent = document.getElementById('logContent');
            if (!logContent) return;
            
            const filteredData = getFilteredLogData();
            const scrollTop = Math.max(0, filteredData.length * VIRTUAL_SCROLL_ITEM_HEIGHT - virtualScrollState.containerHeight);
            logContent.scrollTop = scrollTop;
            virtualScrollState.scrollTop = scrollTop;
            
            if (virtualScrollState.enabled) {
                renderVirtualLogEntries();
            }
        }

        /**
         * Adds a log entry to the activity log with virtual scroll support.
         * @param {string} message - The log message
         * @param {string} type - Log type: 'info', 'warning', 'error', or 'success'
         */
        function addLog(message, type) {
            type = type || 'info';
            
            const time = new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Create entry data
            const entry = {
                id: virtualLogEntryId++,
                message: message,
                type: type,
                time: time
            };
            
            // Add to data store
            virtualLogData.push(entry);
            
            // Check if we should enable virtual scrolling
            if (!virtualScrollState.enabled && shouldEnableVirtualScroll()) {
                enableVirtualScroll();
                announceToScreenReader('Virtual scrolling enabled for ' + virtualLogData.length + ' log entries.');
            }
            
            // Render based on mode
            if (virtualScrollState.enabled) {
                // In virtual scroll mode, re-render visible entries
                if (autoScrollEnabled) {
                    scrollToLogBottom();
                } else {
                    renderVirtualLogEntries();
                }
            } else {
                // Traditional DOM append
                const logArea = document.getElementById('logArea');
                if (!logArea) return;
                
                const entryEl = document.createElement('div');
                entryEl.className = 'log-entry ' + type;
                entryEl.setAttribute('role', 'listitem');
                entryEl.setAttribute('data-level', type);
                entryEl.setAttribute('data-entry-id', String(entry.id));
                
                // Store original message and apply search highlight if needed
                const msgEl = document.createElement('span');
                msgEl.className = 'log-msg';
                msgEl.setAttribute('data-original-text', message);
                
                if (currentLogSearch && logMatchesSearch(message)) {
                    msgEl.innerHTML = highlightSearchMatch(message, currentLogSearch);
                    entryEl.classList.add('search-match');
                } else if (currentLogSearch && !logMatchesSearch(message)) {
                    msgEl.innerHTML = escapeHtml(message);
                    entryEl.classList.add('search-hidden');
                } else {
                    msgEl.innerHTML = escapeHtml(message);
                }
                
                entryEl.innerHTML = '<span class="log-time" aria-label="Time: ' + time + '">' + time + '</span>';
                entryEl.appendChild(msgEl);
                
                // Apply current filter visibility
                if (currentLogFilter !== 'all' && type !== currentLogFilter) {
                    entryEl.classList.add('filtered-out');
                }
                
                logArea.appendChild(entryEl);
                scrollLogIfEnabled(logArea);
            }
            
            // Update filter count and search count
            updateLogFilterCount();
            if (currentLogSearch) {
                const filteredData = getFilteredLogData();
                const matchCount = filteredData.filter(function(e) { return logMatchesSearch(e.message); }).length;
                updateLogSearchCount(matchCount, virtualLogData.length);
            }
        }

        /**
         * Filters log entries by level.
         * @param {string} level - The log level to filter by: 'all', 'info', 'warning', 'error', 'success'
         */
        function filterLogs(level) {
            currentLogFilter = level;
            
            // Update active button state
            const filterButtons = document.querySelectorAll('.log-filter-btn');
            filterButtons.forEach(function(btn) {
                const btnLevel = btn.getAttribute('data-level');
                const isActive = btnLevel === level;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            });
            
            // Handle filtering based on mode
            if (virtualScrollState.enabled) {
                // In virtual scroll mode, re-render with new filter
                virtualScrollState.scrollTop = 0;
                const logContent = document.getElementById('logContent');
                if (logContent) logContent.scrollTop = 0;
                renderVirtualLogEntries();
            } else {
                // Traditional DOM-based filtering
                const logArea = document.getElementById('logArea');
                if (logArea) {
                    const entries = logArea.querySelectorAll('.log-entry');
                    entries.forEach(function(entry) {
                        const entryLevel = entry.getAttribute('data-level');
                        const shouldShow = level === 'all' || entryLevel === level;
                        entry.classList.toggle('filtered-out', !shouldShow);
                    });
                }
            }
            
            // Update filter count display
            updateLogFilterCount();
            
            // Announce filter change to screen readers
            const filteredData = getFilteredLogData();
            const filterName = level === 'all' ? 'all levels' : level + ' only';
            announceToScreenReader('Showing ' + filterName + '. ' + filteredData.length + ' entries visible.');
        }

        /**
         * Gets the current log filter level.
         * @returns {string} The current filter level
         */
        function getLogFilter() {
            return currentLogFilter;
        }

        /**
         * Updates the log filter count display.
         */
        function updateLogFilterCount() {
            const countEl = document.getElementById('logFilterCount');
            if (!countEl) return;
            
            // Use virtual log data for accurate counts
            const total = virtualLogData.length;
            const filteredData = getFilteredLogData();
            const visible = filteredData.length;
            
            if (currentLogFilter === 'all' && !currentLogSearch) {
                countEl.textContent = total + ' entries';
            } else {
                countEl.textContent = visible + ' of ' + total;
            }
        }

        /**
         * Clears all log entries.
         */
        function clearLogs() {
            // Clear virtual data
            clearVirtualLogData();
            
            // Update UI
            updateLogFilterCount();
            
            announceToScreenReader('Activity log cleared');
        }

        /**
         * Gets the count of log entries by level.
         * @returns {Object} Counts by level: { info, warning, error, success, total }
         */
        function getLogCounts() {
            const counts = { info: 0, warning: 0, error: 0, success: 0, total: virtualLogData.length };
            
            virtualLogData.forEach(function(entry) {
                if (counts.hasOwnProperty(entry.type)) {
                    counts[entry.type]++;
                }
            });
            
            return counts;
        }

        // ====================================================================
        // Timestamp Toggle Functionality
        // ====================================================================

        /** Current timestamp visibility state - default to visible */
        let timestampsVisible = true;

        /** Storage key for timestamp preference persistence */
        const TIMESTAMP_STORAGE_KEY = 'ralph.logTimestampsVisible';

        /**
         * Toggles the visibility of timestamps in log entries.
         */
        function toggleTimestamps() {
            timestampsVisible = !timestampsVisible;
            updateTimestampVisibility();
            saveTimestampPreference();
            announceTimestampChange();
        }

        /**
         * Updates the DOM to reflect current timestamp visibility state.
         */
        function updateTimestampVisibility() {
            const logArea = document.getElementById('logArea');
            const toggleBtn = document.getElementById('btnToggleTimestamp');
            
            if (logArea) {
                if (timestampsVisible) {
                    logArea.classList.remove('log-area-hide-timestamps');
                } else {
                    logArea.classList.add('log-area-hide-timestamps');
                }
            }
            
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-pressed', timestampsVisible ? 'true' : 'false');
                toggleBtn.setAttribute('title', timestampsVisible ? 'Hide timestamps' : 'Show timestamps');
            }
        }

        /**
         * Saves the timestamp visibility preference to VS Code state.
         */
        function saveTimestampPreference() {
            try {
                if (typeof vscode !== 'undefined' && vscode.setState && vscode.getState) {
                    const currentState = vscode.getState() || {};
                    currentState.timestampsVisible = timestampsVisible;
                    vscode.setState(currentState);
                }
            } catch (e) {
                console.warn('Failed to save timestamp preference:', e);
            }
        }

        /**
         * Restores the timestamp visibility preference from VS Code state.
         */
        function restoreTimestampPreference() {
            try {
                if (typeof vscode !== 'undefined' && vscode.getState) {
                    const savedState = vscode.getState();
                    if (savedState && typeof savedState.timestampsVisible === 'boolean') {
                        timestampsVisible = savedState.timestampsVisible;
                        updateTimestampVisibility();
                    }
                }
            } catch (e) {
                console.warn('Failed to restore timestamp preference:', e);
            }
        }

        /**
         * Announces the timestamp visibility change to screen readers.
         */
        function announceTimestampChange() {
            const message = timestampsVisible ? 'Timestamps shown' : 'Timestamps hidden';
            announceToScreenReader(message);
        }

        /**
         * Gets the current timestamp visibility state.
         * @returns {boolean} True if timestamps are visible
         */
        function areTimestampsVisible() {
            return timestampsVisible;
        }

        /**
         * Sets the timestamp visibility state programmatically.
         * @param {boolean} visible - Whether timestamps should be visible
         */
        function setTimestampsVisible(visible) {
            timestampsVisible = visible;
            updateTimestampVisibility();
            saveTimestampPreference();
        }

        // ====================================================================
        // Auto-Scroll Toggle
        // ====================================================================

        /** Current auto-scroll state (enabled by default) */
        let autoScrollEnabled = true;

        /** Storage key for auto-scroll preference persistence */
        const AUTOSCROLL_STORAGE_KEY = 'ralph.logAutoScrollEnabled';

        /**
         * Toggles the auto-scroll behavior for log entries.
         */
        function toggleAutoScroll() {
            autoScrollEnabled = !autoScrollEnabled;
            updateAutoScrollVisibility();
            saveAutoScrollPreference();
            announceAutoScrollChange();
        }

        /**
         * Updates the DOM to reflect current auto-scroll state.
         */
        function updateAutoScrollVisibility() {
            const toggleBtn = document.getElementById('btnToggleAutoScroll');
            
            if (toggleBtn) {
                toggleBtn.setAttribute('aria-pressed', autoScrollEnabled ? 'true' : 'false');
                toggleBtn.setAttribute('title', autoScrollEnabled ? 'Auto-scroll enabled (click to disable)' : 'Auto-scroll disabled (click to enable)');
            }
        }

        /**
         * Saves the auto-scroll preference to VS Code state.
         */
        function saveAutoScrollPreference() {
            try {
                if (typeof vscode !== 'undefined' && vscode.setState && vscode.getState) {
                    const currentState = vscode.getState() || {};
                    currentState.autoScrollEnabled = autoScrollEnabled;
                    vscode.setState(currentState);
                }
            } catch (e) {
                console.warn('Failed to save auto-scroll preference:', e);
            }
        }

        /**
         * Restores the auto-scroll preference from VS Code state.
         */
        function restoreAutoScrollPreference() {
            try {
                if (typeof vscode !== 'undefined' && vscode.getState) {
                    const savedState = vscode.getState();
                    if (savedState && typeof savedState.autoScrollEnabled === 'boolean') {
                        autoScrollEnabled = savedState.autoScrollEnabled;
                        updateAutoScrollVisibility();
                    }
                }
            } catch (e) {
                console.warn('Failed to restore auto-scroll preference:', e);
            }
        }

        /**
         * Announces the auto-scroll state change to screen readers.
         */
        function announceAutoScrollChange() {
            const message = autoScrollEnabled ? 'Auto-scroll enabled' : 'Auto-scroll disabled';
            announceToScreenReader(message);
        }

        /**
         * Gets the current auto-scroll state.
         * @returns {boolean} True if auto-scroll is enabled
         */
        function isAutoScrollEnabled() {
            return autoScrollEnabled;
        }

        /**
         * Sets the auto-scroll state programmatically.
         * @param {boolean} enabled - Whether auto-scroll should be enabled
         */
        function setAutoScrollEnabled(enabled) {
            autoScrollEnabled = enabled;
            updateAutoScrollVisibility();
            saveAutoScrollPreference();
        }

        /**
         * Scrolls the log area to the bottom if auto-scroll is enabled.
         * @param {HTMLElement} logArea - The log area element
         */
        function scrollLogIfEnabled(logArea) {
            if (autoScrollEnabled && logArea) {
                logArea.scrollTop = logArea.scrollHeight;
            }
        }

        // ====================================================================
        // Copy Log Functionality
        // ====================================================================

        /**
         * Copies all log entries to the clipboard.
         * Formats entries as "[TIME] [LEVEL] MESSAGE" per line.
         */
        function copyLog() {
            const copyBtn = document.getElementById('btnCopyLog');
            
            if (virtualLogData.length === 0) {
                showInfoToast('No log entries to copy');
                return;
            }
            
            const logText = formatLogDataForClipboard(virtualLogData);
            
            // Use modern Clipboard API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(logText)
                    .then(function() {
                        onCopySuccess(copyBtn);
                    })
                    .catch(function(err) {
                        onCopyError(err);
                    });
            } else {
                // Fallback for older browsers or restricted contexts
                fallbackCopyToClipboard(logText, copyBtn);
            }
        }

        /**
         * Formats log data for clipboard as plain text.
         * @param {VirtualLogEntry[]} entries - The log entry data
         * @returns {string} Formatted log text
         */
        function formatLogDataForClipboard(entries) {
            return entries.map(function(entry) {
                // Format: [TIME] [LEVEL] MESSAGE
                return '[' + entry.time + '] [' + entry.type.toUpperCase() + '] ' + entry.message;
            }).join('\\n');
        }

        /**
         * Formats log entries for clipboard as plain text (DOM-based fallback).
         * @param {NodeList} entries - The log entry elements
         * @returns {string} Formatted log text
         */
        function formatLogForClipboard(entries) {
            const lines = [];
            entries.forEach(function(entry) {
                const timeEl = entry.querySelector('.log-time');
                const msgEl = entry.querySelector('.log-msg');
                const level = entry.getAttribute('data-level') || 'info';
                
                const time = timeEl ? timeEl.textContent.trim() : '--:--';
                const msg = msgEl ? (msgEl.getAttribute('data-original-text') || msgEl.textContent || '').trim() : '';
                
                // Format: [TIME] [LEVEL] MESSAGE
                lines.push('[' + time + '] [' + level.toUpperCase() + '] ' + msg);
            });
            return lines.join('\\n');
        }

        /**
         * Handles successful copy operation.
         * @param {HTMLElement} copyBtn - The copy button element
         */
        function onCopySuccess(copyBtn) {
            // Show visual feedback
            if (copyBtn) {
                const originalLabel = copyBtn.querySelector('.log-action-label');
                if (originalLabel) {
                    const originalText = originalLabel.textContent;
                    originalLabel.textContent = 'Copied!';
                    copyBtn.classList.add('copied');
                    
                    setTimeout(function() {
                        originalLabel.textContent = originalText;
                        copyBtn.classList.remove('copied');
                    }, 2000);
                }
            }
            
            // Show toast notification
            showSuccessToast('Log copied to clipboard');
            
            // Announce to screen readers
            announceToScreenReader('Log entries copied to clipboard');
        }

        /**
         * Handles copy error.
         * @param {Error} err - The error that occurred
         */
        function onCopyError(err) {
            console.error('Failed to copy log:', err);
            showErrorToast('Failed to copy log to clipboard');
            announceToScreenReader('Failed to copy log entries');
        }

        /**
         * Fallback copy method using a temporary textarea.
         * @param {string} text - The text to copy
         * @param {HTMLElement} copyBtn - The copy button element
         */
        function fallbackCopyToClipboard(text, copyBtn) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '0';
            textarea.setAttribute('readonly', '');
            document.body.appendChild(textarea);
            
            try {
                textarea.select();
                const success = document.execCommand('copy');
                if (success) {
                    onCopySuccess(copyBtn);
                } else {
                    onCopyError(new Error('execCommand copy failed'));
                }
            } catch (err) {
                onCopyError(err);
            } finally {
                document.body.removeChild(textarea);
            }
        }

        /**
         * Gets the log content as formatted text.
         * @returns {string} The formatted log text
         */
        function getLogAsText() {
            if (virtualLogData.length === 0) return '';
            return formatLogDataForClipboard(virtualLogData);
        }

        // ====================================================================
        // Log Export Functionality
        // ====================================================================

        /**
         * Exports log entries to a file via the extension.
         * Opens a save dialog and saves as JSON or TXT.
         */
        function exportLog() {
            const exportBtn = document.getElementById('btnExportLog');
            
            if (virtualLogData.length === 0) {
                showInfoToast('No log entries to export');
                return;
            }
            
            // Collect log entries as structured data
            const logEntries = virtualLogData.map(function(entry) {
                return {
                    time: entry.time,
                    level: entry.type,
                    message: entry.message
                };
            });
            
            // Show loading state on export button
            if (exportBtn) {
                const label = exportBtn.querySelector('.log-action-label');
                if (label) {
                    label.textContent = 'Exporting...';
                    exportBtn.disabled = true;
                }
            }
            
            // Send to extension for file save dialog
            vscode.postMessage({
                command: 'exportLog',
                entries: logEntries
            });
            
            // Reset button state after a short delay (extension will handle save dialog)
            setTimeout(function() {
                if (exportBtn) {
                    const label = exportBtn.querySelector('.log-action-label');
                    if (label) {
                        label.textContent = 'Export';
                    }
                    exportBtn.disabled = false;
                }
            }, 500);
        }

        /**
         * Converts log entry elements to an array of structured data.
         * @param {NodeList} entries - The log entry elements
         * @returns {Array} Array of log entry objects
         */
        function getLogEntriesAsArray(entries) {
            const result = [];
            entries.forEach(function(entry) {
                const timeEl = entry.querySelector('.log-time');
                const msgEl = entry.querySelector('.log-msg');
                const level = entry.getAttribute('data-level') || 'info';
                
                const time = timeEl ? timeEl.textContent.trim() : '--:--';
                const msg = msgEl ? (msgEl.getAttribute('data-original-text') || msgEl.textContent || '').trim() : '';
                
                result.push({
                    time: time,
                    level: level,
                    message: msg
                });
            });
            return result;
        }

        /**
         * Shows feedback after successful log export.
         */
        function onExportSuccess() {
            const exportBtn = document.getElementById('btnExportLog');
            if (exportBtn) {
                const label = exportBtn.querySelector('.log-action-label');
                if (label) {
                    const originalText = label.textContent;
                    label.textContent = 'Exported!';
                    exportBtn.classList.add('exported');
                    
                    setTimeout(function() {
                        label.textContent = originalText;
                        exportBtn.classList.remove('exported');
                    }, 2000);
                }
            }
            
            showSuccessToast('Log exported to file');
            announceToScreenReader('Log entries exported to file');
        }

        // ====================================================================
        // Log Search Functionality
        // ====================================================================

        let currentLogSearch = '';

        /**
         * Searches log entries by text content.
         * @param {string} query - The search query
         */
        function searchLogs(query) {
            currentLogSearch = query.toLowerCase().trim();
            
            const clearBtn = document.getElementById('logSearchClear');
            
            // Show/hide clear button
            if (clearBtn) {
                clearBtn.style.display = currentLogSearch ? 'flex' : 'none';
            }
            
            // Handle search based on mode
            if (virtualScrollState.enabled) {
                // In virtual scroll mode, re-render with search applied
                virtualScrollState.scrollTop = 0;
                const logContent = document.getElementById('logContent');
                if (logContent) logContent.scrollTop = 0;
                renderVirtualLogEntries();
            } else {
                // Traditional DOM-based search
                const logArea = document.getElementById('logArea');
                if (logArea) {
                    const entries = logArea.querySelectorAll('.log-entry');
                    
                    entries.forEach(function(entry) {
                        const msgEl = entry.querySelector('.log-msg');
                        if (!msgEl) return;
                        
                        // Restore original text if it was highlighted
                        const originalText = msgEl.getAttribute('data-original-text') || msgEl.textContent;
                        if (!msgEl.hasAttribute('data-original-text')) {
                            msgEl.setAttribute('data-original-text', originalText);
                        }
                        
                        if (!currentLogSearch) {
                            // No search - restore original text and show all
                            msgEl.innerHTML = escapeHtml(originalText);
                            entry.classList.remove('search-match', 'search-hidden');
                        } else {
                            // Search active - check for match
                            const lowerText = originalText.toLowerCase();
                            const matchIndex = lowerText.indexOf(currentLogSearch);
                            
                            if (matchIndex >= 0) {
                                // Found match - highlight it
                                entry.classList.add('search-match');
                                entry.classList.remove('search-hidden');
                                msgEl.innerHTML = highlightSearchMatch(originalText, currentLogSearch);
                            } else {
                                // No match - hide entry
                                entry.classList.remove('search-match');
                                entry.classList.add('search-hidden');
                                msgEl.innerHTML = escapeHtml(originalText);
                            }
                        }
                    });
                }
            }
            
            // Calculate and update search count
            const filteredData = getFilteredLogData();
            const matchCount = currentLogSearch ? filteredData.filter(function(e) {
                return logMatchesSearch(e.message);
            }).length : 0;
            
            updateLogSearchCount(matchCount, virtualLogData.length);
            updateLogFilterCount();
            
            // Announce to screen readers
            if (currentLogSearch) {
                if (matchCount === 0) {
                    announceToScreenReader('No matches found for "' + currentLogSearch + '"');
                } else {
                    announceToScreenReader(matchCount + ' match' + (matchCount !== 1 ? 'es' : '') + ' found');
                }
            }
        }

        /**
         * Highlights search matches in text.
         * @param {string} text - The original text
         * @param {string} query - The search query (lowercase)
         * @returns {string} HTML with highlighted matches
         */
        function highlightSearchMatch(text, query) {
            if (!query) return escapeHtml(text);
            
            const lowerText = text.toLowerCase();
            let result = '';
            let lastIndex = 0;
            let matchIndex = lowerText.indexOf(query, lastIndex);
            
            while (matchIndex >= 0) {
                // Add text before match
                result += escapeHtml(text.slice(lastIndex, matchIndex));
                // Add highlighted match (preserving original case)
                result += '<span class="search-highlight">' + escapeHtml(text.slice(matchIndex, matchIndex + query.length)) + '</span>';
                lastIndex = matchIndex + query.length;
                matchIndex = lowerText.indexOf(query, lastIndex);
            }
            
            // Add remaining text
            result += escapeHtml(text.slice(lastIndex));
            
            return result;
        }

        /**
         * Clears the log search.
         */
        function clearLogSearch() {
            const searchInput = document.getElementById('logSearchInput');
            if (searchInput) {
                searchInput.value = '';
            }
            searchLogs('');
        }

        /**
         * Gets the current log search query.
         * @returns {string} The current search query
         */
        function getLogSearch() {
            return currentLogSearch;
        }

        /**
         * Updates the log search count display.
         * @param {number} matchCount - Number of matches found
         * @param {number} total - Total number of entries
         */
        function updateLogSearchCount(matchCount, total) {
            const countEl = document.getElementById('logSearchCount');
            if (!countEl) return;
            
            if (!currentLogSearch) {
                countEl.textContent = '';
                countEl.className = 'log-search-count';
            } else if (matchCount === 0) {
                countEl.textContent = 'No matches';
                countEl.className = 'log-search-count no-matches';
            } else {
                countEl.textContent = matchCount + ' of ' + total;
                countEl.className = 'log-search-count has-matches';
            }
        }

        /**
         * Checks if a log entry matches the current search.
         * Used when adding new log entries.
         * @param {string} message - The log message text
         * @returns {boolean} True if the message matches or no search is active
         */
        function logMatchesSearch(message) {
            if (!currentLogSearch) return true;
            return message.toLowerCase().includes(currentLogSearch);
        }

        /** Escapes HTML to prevent XSS in log messages */
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // ====================================================================
        // Loading Spinners for Async Operations
        // ====================================================================

        /**
         * Shows a loading spinner on a button element.
         * @param {HTMLElement} button - The button element to add spinner to
         * @param {string} loadingText - Optional text to show while loading
         */
        function showButtonSpinner(button, loadingText) {
            if (!button) return;
            
            // Store original content for restoration
            if (!button.dataset.originalContent) {
                button.dataset.originalContent = button.innerHTML;
            }
            if (!button.dataset.originalDisabled) {
                button.dataset.originalDisabled = button.disabled ? 'true' : 'false';
            }
            
            button.classList.add('loading');
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            
            // For icon-only buttons, keep the icon but add animation via CSS
            if (button.classList.contains('icon-only')) {
                return;
            }
            
            // Create spinner element
            const spinner = '<span class="btn-spinner" aria-hidden="true"></span>';
            const text = loadingText || 'Loading...';
            button.innerHTML = spinner + ' ' + text;
        }

        /**
         * Hides the loading spinner on a button element and restores original content.
         * @param {HTMLElement} button - The button element to remove spinner from
         */
        function hideButtonSpinner(button) {
            if (!button) return;
            
            button.classList.remove('loading');
            button.removeAttribute('aria-busy');
            
            // Restore original content
            if (button.dataset.originalContent) {
                button.innerHTML = button.dataset.originalContent;
                delete button.dataset.originalContent;
            }
            
            // Restore original disabled state
            if (button.dataset.originalDisabled) {
                button.disabled = button.dataset.originalDisabled === 'true';
                delete button.dataset.originalDisabled;
            }
        }

        /**
         * Shows loading state on the refresh button.
         */
        function showRefreshLoading() {
            const refreshBtn = document.querySelector('button[onclick="send(\\'refresh\\')"]');
            if (refreshBtn) {
                showButtonSpinner(refreshBtn, '');
            }
        }

        /**
         * Hides loading state on the refresh button.
         */
        function hideRefreshLoading() {
            const refreshBtn = document.querySelector('button[onclick="send(\\'refresh\\')"]');
            if (refreshBtn) {
                hideButtonSpinner(refreshBtn);
            }
        }

        /**
         * Shows loading state on the generate PRD button.
         */
        function showGenerateLoading() {
            const btn = document.querySelector('.generate-btn');
            if (btn) {
                showButtonSpinner(btn, 'Generating PRD...');
            }
        }

        /**
         * Hides loading state on the generate PRD button.
         */
        function hideGenerateLoading() {
            const btn = document.querySelector('.generate-btn');
            if (btn) {
                hideButtonSpinner(btn);
            }
        }

        /**
         * Shows loading state on a control button by ID.
         * @param {string} buttonId - The ID of the button (e.g., 'btnStart', 'btnStop')
         * @param {string} loadingText - Optional loading text
         */
        function showControlButtonLoading(buttonId, loadingText) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                showButtonSpinner(btn, loadingText);
            }
        }

        /**
         * Hides loading state on a control button by ID.
         * @param {string} buttonId - The ID of the button
         */
        function hideControlButtonLoading(buttonId) {
            const btn = document.getElementById(buttonId);
            if (btn) {
                hideButtonSpinner(btn);
            }
        }

        /**
         * Resets all control button loading states.
         * Called after receiving an update message to ensure buttons are in correct state.
         */
        function resetControlButtonLoading() {
            ['btnStart', 'btnPause', 'btnResume', 'btnStop', 'btnNext', 'btnSkip', 'btnRetry', 'btnCompleteAll', 'btnResetAll'].forEach(function(id) {
                hideControlButtonLoading(id);
            });
        }

        // ====================================================================
        // Skeleton Loaders for Content Areas
        // ====================================================================

        // IDs of skeleton loader elements
        const SKELETON_IDS = ['skeletonTimeline', 'skeletonTask', 'skeletonLog', 'skeletonRequirements'];
        
        // IDs of actual content elements
        const CONTENT_IDS = ['timelineSection', 'taskSection', 'logArea', 'requirementsSection'];

        /**
         * Shows skeleton loaders for all content areas using requestAnimationFrame.
         * Hides actual content and displays skeleton placeholders with smooth transitions.
         */
        function showSkeletons() {
            const mainContent = document.getElementById('mainContent');
            
            // Use RAF for smooth visual updates
            runOnNextFrame(function() {
                if (mainContent) {
                    mainContent.classList.add('loading');
                }

                // Set aria-busy on skeletons
                SKELETON_IDS.forEach(function(id) {
                    const skeleton = document.getElementById(id);
                    if (skeleton) {
                        skeleton.setAttribute('aria-busy', 'true');
                        skeleton.style.display = 'block';
                    }
                });

                // Hide actual content
                CONTENT_IDS.forEach(function(id) {
                    const content = document.getElementById(id);
                    if (content) {
                        content.style.display = 'none';
                    }
                });
            });

            // Announce to screen readers
            announceToScreenReader('Loading content');
        }

        /**
         * Hides skeleton loaders and shows actual content using requestAnimationFrame.
         * Uses RAF for smooth fade-in of content.
         */
        function hideSkeletons() {
            const mainContent = document.getElementById('mainContent');
            
            // Use RAF for smooth visual transition
            runOnNextFrame(function() {
                if (mainContent) {
                    mainContent.classList.remove('loading');
                }

                // Hide skeletons
                SKELETON_IDS.forEach(function(id) {
                    const skeleton = document.getElementById(id);
                    if (skeleton) {
                        skeleton.setAttribute('aria-busy', 'false');
                        skeleton.style.display = 'none';
                    }
                });

                // Show actual content
                CONTENT_IDS.forEach(function(id) {
                    const content = document.getElementById(id);
                    if (content) {
                        // Don't override existing display styles, just remove the none
                        content.style.display = '';
                    }
                });
            });

            // Announce to screen readers
            announceToScreenReader('Content loaded');
        }

        /**
         * Shows skeleton loader for a specific content area using RAF.
         * @param {string} skeletonId - The ID of the skeleton element (without 'skeleton' prefix)
         */
        function showSkeleton(skeletonId) {
            runOnNextFrame(function() {
                const skeleton = document.getElementById('skeleton' + skeletonId);
                const content = document.getElementById(skeletonId.charAt(0).toLowerCase() + skeletonId.slice(1));
                
                if (skeleton) {
                    skeleton.setAttribute('aria-busy', 'true');
                    skeleton.style.display = 'block';
                }
                
                if (content) {
                    content.style.display = 'none';
                }
            });
        }

        /**
         * Hides skeleton loader for a specific content area using RAF.
         * @param {string} skeletonId - The ID of the skeleton element (without 'skeleton' prefix)
         */
        function hideSkeleton(skeletonId) {
            runOnNextFrame(function() {
                const skeleton = document.getElementById('skeleton' + skeletonId);
                const content = document.getElementById(skeletonId.charAt(0).toLowerCase() + skeletonId.slice(1));
                
                if (skeleton) {
                    skeleton.setAttribute('aria-busy', 'false');
                    skeleton.style.display = 'none';
            }
            
            if (content) {
                content.style.display = '';
            }
        }

        /**
         * Shows skeleton loader for the timeline section.
         */
        function showTimelineSkeleton() {
            const skeleton = document.getElementById('skeletonTimeline');
            const section = document.getElementById('timelineSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'true');
                skeleton.style.display = 'block';
            }
            
            if (section) {
                section.style.display = 'none';
            }
        }

        /**
         * Hides skeleton loader for the timeline section.
         */
        function hideTimelineSkeleton() {
            const skeleton = document.getElementById('skeletonTimeline');
            const section = document.getElementById('timelineSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'false');
                skeleton.style.display = 'none';
            }
            
            if (section) {
                section.style.display = '';
            }
        }

        /**
         * Shows skeleton loader for the task section.
         */
        function showTaskSkeleton() {
            const skeleton = document.getElementById('skeletonTask');
            const section = document.getElementById('taskSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'true');
                skeleton.style.display = 'block';
            }
            
            if (section) {
                section.style.display = 'none';
            }
        }

        /**
         * Hides skeleton loader for the task section.
         */
        function hideTaskSkeleton() {
            const skeleton = document.getElementById('skeletonTask');
            const section = document.getElementById('taskSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'false');
                skeleton.style.display = 'none';
            }
            
            if (section) {
                section.style.display = '';
            }
        }

        /**
         * Shows skeleton loader for the log section.
         */
        function showLogSkeleton() {
            const skeleton = document.getElementById('skeletonLog');
            const section = document.querySelector('.log-section');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'true');
                skeleton.style.display = 'block';
            }
            
            if (section) {
                section.style.display = 'none';
            }
        }

        /**
         * Hides skeleton loader for the log section.
         */
        function hideLogSkeleton() {
            const skeleton = document.getElementById('skeletonLog');
            const section = document.querySelector('.log-section');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'false');
                skeleton.style.display = 'none';
            }
            
            if (section) {
                section.style.display = '';
            }
        }

        /**
         * Shows skeleton loader for the requirements section.
         */
        function showRequirementsSkeleton() {
            const skeleton = document.getElementById('skeletonRequirements');
            const section = document.getElementById('requirementsSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'true');
                skeleton.style.display = 'block';
            }
            
            if (section) {
                section.style.display = 'none';
            }
        }

        /**
         * Hides skeleton loader for the requirements section.
         */
        function hideRequirementsSkeleton() {
            const skeleton = document.getElementById('skeletonRequirements');
            const section = document.getElementById('requirementsSection');
            
            if (skeleton) {
                skeleton.setAttribute('aria-busy', 'false');
                skeleton.style.display = 'none';
            }
            
            if (section) {
                section.style.display = '';
            }
        }

        /**
         * Checks if any skeleton loaders are currently visible.
         * @returns {boolean} True if any skeletons are visible
         */
        function areSkeletonsVisible() {
            return SKELETON_IDS.some(function(id) {
                const skeleton = document.getElementById(id);
                return skeleton && skeleton.style.display !== 'none' && skeleton.getAttribute('aria-busy') === 'true';
            });
        }

        /**
         * Shows skeletons during initial content load or refresh.
         * Automatically hides skeletons after content is loaded.
         * @param {number} minDuration - Minimum duration to show skeletons (prevents flash)
         */
        function showSkeletonsWithAutoHide(minDuration) {
            minDuration = minDuration || 300;
            const startTime = Date.now();
            
            showSkeletons();
            
            // Return a function to hide skeletons (ensures minimum duration)
            return function hideAfterLoad() {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, minDuration - elapsed);
                
                setTimeout(function() {
                    hideSkeletons();
                }, remaining);
            };
        }

        // ====================================================================
        // Task Progress Animations
        // ====================================================================

        // Track task execution state
        let taskExecutionStartTime = null;
        let taskProgressInterval = null;
        let previousTaskCount = 0;

        /**
         * Starts the task execution animation using requestAnimationFrame.
         * Shows the executing state with shimmer effect and indeterminate progress bar.
         * Uses RAF for smooth class transitions and style updates.
         */
        function startTaskExecution() {
            const taskSection = document.getElementById('taskSection');
            const progressBar = document.getElementById('taskProgressBar');
            const progress = document.getElementById('taskProgress');

            // Use requestAnimationFrame for smooth visual updates
            runOnNextFrame(function() {
                if (taskSection) {
                    taskSection.classList.add('executing');
                    taskSection.classList.remove('completing');
                }

                if (progressBar && progress) {
                    progressBar.classList.add('indeterminate');
                    progressBar.style.width = '40%';
                    progress.setAttribute('aria-valuenow', '0');
                    progress.setAttribute('aria-valuetext', 'Task in progress');
                }
            });

            taskExecutionStartTime = Date.now();
        }

        /**
         * Updates the task progress bar with a specific percentage using RAF.
         * Uses animateValue for smooth interpolation of progress values.
         * @param {number} percent - Progress percentage (0-100)
         * @param {boolean} animate - If true, animates to the new value (default: false)
         */
        function updateTaskProgress(percent, animate) {
            const progressBar = document.getElementById('taskProgressBar');
            const progress = document.getElementById('taskProgress');
            
            var targetPercent = Math.min(Math.max(percent, 0), 100);

            if (progressBar) {
                progressBar.classList.remove('indeterminate');
                
                if (animate) {
                    // Get current width as a number
                    var currentWidth = parseFloat(progressBar.style.width) || 0;
                    
                    // Animate to target using requestAnimationFrame
                    animateValue({
                        id: 'taskProgress',
                        from: currentWidth,
                        to: targetPercent,
                        duration: 300,
                        easing: 'easeOutQuad',
                        onUpdate: function(value) {
                            progressBar.style.width = value + '%';
                        }
                    });
                } else {
                    // Use RAF for immediate update
                    runOnNextFrame(function() {
                        progressBar.style.width = targetPercent + '%';
                    });
                }
            }

            // Update ARIA attributes immediately for accessibility
            if (progress) {
                progress.setAttribute('aria-valuenow', String(Math.round(targetPercent)));
                progress.setAttribute('aria-valuetext', Math.round(targetPercent) + '% complete');
            }
        }

        /**
         * Completes the task execution animation using requestAnimationFrame.
         * Shows the completion animation and resets the progress bar with smooth transitions.
         */
        function completeTaskExecution() {
            const taskSection = document.getElementById('taskSection');
            const progressBar = document.getElementById('taskProgressBar');
            const progress = document.getElementById('taskProgress');

            // Use RAF for smooth class transitions
            runOnNextFrame(function() {
                if (taskSection) {
                    taskSection.classList.remove('executing');
                    taskSection.classList.add('completing');
                }

                if (progressBar) {
                    progressBar.classList.remove('indeterminate');
                }

                if (progress) {
                    progress.setAttribute('aria-valuenow', '100');
                    progress.setAttribute('aria-valuetext', 'Task complete');
                }
            });

            // Animate progress bar to 100% using animateValue
            if (progressBar) {
                var currentWidth = parseFloat(progressBar.style.width) || 0;
                
                animateValue({
                    id: 'taskProgressComplete',
                    from: currentWidth,
                    to: 100,
                    duration: 200,
                    easing: 'easeOutQuad',
                    onUpdate: function(value) {
                        progressBar.style.width = value + '%';
                    },
                    onComplete: function() {
                        // After reaching 100%, animate back to 0%
                        runAfterPaint(function() {
                            animateValue({
                                id: 'taskProgressReset',
                                from: 100,
                                to: 0,
                                duration: 300,
                                easing: 'easeOutQuad',
                                onUpdate: function(value) {
                                    if (progressBar) {
                                        progressBar.style.width = value + '%';
                                    }
                                }
                            });
                        });
                    }
                });
            }

            // Remove completing class after animation completes
            setTimeout(function() {
                runOnNextFrame(function() {
                    if (taskSection) {
                        taskSection.classList.remove('completing');
                    }
                });
            }, 600);

            taskExecutionStartTime = null;
        }

        /**
         * Stops the task execution animation without completion effect using RAF.
         */
        function stopTaskExecution() {
            const taskSection = document.getElementById('taskSection');
            const progressBar = document.getElementById('taskProgressBar');
            const progress = document.getElementById('taskProgress');

            // Cancel any running progress animations
            cancelAnimation('taskProgress');
            cancelAnimation('taskProgressComplete');
            cancelAnimation('taskProgressReset');

            // Use RAF for smooth class removal
            runOnNextFrame(function() {
                if (taskSection) {
                    taskSection.classList.remove('executing', 'completing');
                }

                if (progressBar) {
                    progressBar.classList.remove('indeterminate');
                    progressBar.style.width = '0%';
                }

                if (progress) {
                    progress.setAttribute('aria-valuenow', '0');
                    progress.setAttribute('aria-valuetext', 'Ready');
                }
            });

            taskExecutionStartTime = null;
        }

        /**
         * Marks a timeline bar as newly completed with animation using RAF.
         * Uses requestAnimationFrame for smooth class transitions.
         * @param {number} index - The index of the bar (0-based)
         */
        function animateBarCompletion(index) {
            const bars = document.getElementById('timelineBars');
            if (!bars) return;

            const barElements = bars.querySelectorAll('.timeline-bar');
            if (index >= 0 && index < barElements.length) {
                const bar = barElements[index];
                
                // Use RAF for smooth animation start
                runOnNextFrame(function() {
                    bar.classList.add('completed-new');
                });

                // Remove animation class after it completes
                setTimeout(function() {
                    runOnNextFrame(function() {
                        bar.classList.remove('completed-new');
                    });
                }, 500);
            }
        }

        /**
         * Checks for task completion and triggers animations.
         * Called when stats are updated.
         * @param {number} completedCount - Current number of completed tasks
         */
        function checkTaskCompletion(completedCount) {
            if (completedCount > previousTaskCount && previousTaskCount > 0) {
                // Task(s) completed - animate
                completeTaskExecution();

                // Animate the newly completed bar(s)
                for (let i = previousTaskCount; i < completedCount; i++) {
                    animateBarCompletion(i);
                }
            }
            previousTaskCount = completedCount;
        }

        // ====================================================================
        // PRD Generation
        // ====================================================================

        function generatePrd() {
            const textarea = document.getElementById('taskInput');

            if (!textarea) return;

            const taskDescription = textarea.value;
            
            // Validate input using validation system
            const validation = validatePrdInput(taskDescription);
            
            if (!validation.isValid) {
                showValidationMessage(validation.message, validation.type);
                textarea.focus();
                // Announce error to screen readers
                announceToScreenReader('Error: ' + validation.message);
                return;
            }
            
            // Clear any previous validation errors
            clearValidation();

            // Show loading spinner on the generate button
            showGenerateLoading();

            vscode.postMessage({
                command: 'generatePrd',
                taskDescription: taskDescription.trim()
            });
        }

        // ====================================================================
        // Message Event Handler
        // ====================================================================

        window.addEventListener('message', function(event) {
            const msg = event.data;
            if (msg.type === 'update') {
                // Clear loading states when we receive an update
                resetControlButtonLoading();
                hideRefreshLoading();
                hideSkeletons();
                updateUI(msg.status, msg.iteration, msg.taskInfo);
            }
            if (msg.type === 'countdown') {
                showCountdown(msg.seconds);
            }
            if (msg.type === 'log') {
                // Support explicit level or fallback to highlight-based logic
                const logLevel = msg.level || (msg.highlight ? 'success' : 'info');
                addLog(msg.message, logLevel);
            }
            if (msg.type === 'loading') {
                // Show or hide skeleton loaders based on loading state
                if (msg.isLoading) {
                    showSkeletons();
                } else {
                    hideSkeletons();
                }
            }
            if (msg.type === 'prdGenerating') {
                // Update generate button to show Copilot is working
                const btn = document.querySelector('.generate-btn');
                if (btn) {
                    showButtonSpinner(btn, 'Copilot is generating PRD...');
                }
                showInfoToast('Copilot is generating your PRD...', 'Generating PRD');
            }
            if (msg.type === 'prdComplete') {
                // Clear the generate button loading state
                hideGenerateLoading();
                showSuccessToast('PRD has been generated successfully!', 'PRD Ready');
            }
            if (msg.type === 'history') {
                updateTimeline(msg.history);
                updateDurationChart(msg.history);
                // Update currentTaskHistory for estimated time calculation
                if (msg.history) {
                    currentTaskHistory = msg.history;
                    updateEstimatedTime();
                }
            }
            if (msg.type === 'timing') {
                updateTiming(msg.startTime, msg.taskHistory, msg.pendingTasks);
                updateDurationChart(msg.taskHistory);
            }
            if (msg.type === 'stats') {
                // Clear refresh loading when stats are received
                hideRefreshLoading();
                updateStatsDisplay(msg);
                if (msg.tasks) {
                    renderDependencyGraph(msg.tasks);
                    renderPendingTasks(msg.tasks);
                }
            }
            if (msg.type === 'aggregatedStats') {
                // Update the aggregated stats section
                updateAggregatedStats(msg);
            }
            if (msg.type === 'completionHistory') {
                // Update the completion history section
                updateCompletionHistory(msg);
            }
            if (msg.type === 'sessionStats') {
                // Update the session statistics dashboard
                updateSessionStats(msg);
            }
            if (msg.type === 'reportComplete') {
                // Handle productivity report generation completion
                handleReportComplete(msg);
            }
            if (msg.type === 'reportError') {
                // Handle productivity report generation error
                handleReportError(msg.message || 'Unknown error generating report');
            }
            if (msg.type === 'toast') {
                // Handle toast message from extension
                showToast({
                    type: msg.toastType || 'info',
                    title: msg.title || '',
                    message: msg.message || '',
                    duration: msg.duration,
                    dismissible: msg.dismissible
                });
            }
            if (msg.type === 'error') {
                // Show error toast for extension errors
                showErrorToast(msg.message, 'Error');
            }
        });

        // ====================================================================
        // Stats Display
        // ====================================================================

        // Track previous completed count to detect task completions
        let previousCompletedCount = 0;

        /**
         * Internal stats display update function.
         * This is the actual implementation, debounced for performance.
         */
        function updateStatsDisplayInternal(stats) {
            const taskSection = document.getElementById('taskSection');

            // Announce and show toast for task completions
            if (stats.completed > previousCompletedCount && previousCompletedCount > 0) {
                const tasksJustCompleted = stats.completed - previousCompletedCount;
                const announcement = tasksJustCompleted === 1
                    ? 'Task completed. ' + stats.completed + ' of ' + (stats.completed + stats.pending) + ' tasks done.'
                    : tasksJustCompleted + ' tasks completed. ' + stats.completed + ' of ' + (stats.completed + stats.pending) + ' tasks done.';
                announceToScreenReader(announcement);
                
                // Show toast for task completion
                const toastMessage = tasksJustCompleted === 1
                    ? stats.completed + ' of ' + (stats.completed + stats.pending) + ' tasks done'
                    : tasksJustCompleted + ' tasks completed. ' + stats.completed + ' of ' + (stats.completed + stats.pending) + ' done';
                showSuccessToast(toastMessage, 'Task Completed');
                
                // Trigger task completion animation
                checkTaskCompletion(stats.completed);
            }
            previousCompletedCount = stats.completed;

            // Handle all tasks completed state
            if (stats.pending === 0 && stats.completed > 0) {
                // Stop any running execution animation
                stopTaskExecution();
                
                if (taskSection) {
                    taskSection.className = 'task-section completing';
                    taskSection.innerHTML = '<div class="empty-state">' +
                        '<div class="empty-state-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>' +
                        '<div>All tasks completed!</div>' +
                        '</div>';
                    
                    // Remove completing class after animation
                    setTimeout(function() {
                        if (taskSection) {
                            taskSection.classList.remove('completing');
                        }
                    }, 600);
                }
                // Announce and show toast for all tasks complete
                announceToScreenReader('All ' + stats.completed + ' tasks completed successfully!');
                showSuccessToast('All ' + stats.completed + ' tasks have been completed!', 'All Done! 🎉');
            } else if (stats.nextTask && taskSection) {
                // Restore task section to show current task with progress bar
                const isExecuting = window.isRunning || window.isWaiting;
                const executingClass = isExecuting ? ' executing' : '';
                taskSection.className = 'task-section active' + executingClass;
                taskSection.innerHTML = '<div class="task-label">Current Task</div>' +
                    '<div class="task-text" id="taskText">' + escapeHtml(stats.nextTask) + '</div>' +
                    '<div class="task-progress" id="taskProgress" role="progressbar" aria-label="Task execution progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">' +
                    '<div class="task-progress-bar' + (isExecuting ? ' indeterminate' : '') + '" id="taskProgressBar" style="width: ' + (isExecuting ? '40%' : '0%') + '"></div>' +
                    '</div>';
            }

            currentPendingTasks = stats.pending;
            totalTasks = stats.completed + stats.pending;
            updatePipeline(stats.completed, stats.pending);
        }

        // Store reference to internal function for debouncing
        _updateStatsDisplayInternal = updateStatsDisplayInternal;

        /**
         * Updates the stats display.
         * Uses debouncing to batch rapid updates for better performance.
         * 
         * @param {Object} stats - The stats object with completed, pending, total, nextTask
         * @param {boolean} immediate - If true, bypasses debouncing
         */
        function updateStatsDisplay(stats, immediate) {
            // Task completion notifications should be immediate
            if (immediate || stats.completed > previousCompletedCount) {
                // Flush any pending updates and run immediately
                if (debouncedUpdateStatsDisplay && debouncedUpdateStatsDisplay.pending()) {
                    debouncedUpdateStatsDisplay.cancel();
                }
                updateStatsDisplayInternal(stats);
            } else if (debouncedUpdateStatsDisplay) {
                debouncedUpdateStatsDisplay(stats);
            } else {
                // Fallback if debouncing not yet initialized
                updateStatsDisplayInternal(stats);
            }
        }

        function updatePipeline(completed, pending) {
            const track = document.getElementById('pipelineTrack');
            const countEl = document.getElementById('pipelineCount');
            const totalEl = document.getElementById('pipelineTotal');

            if (!track) return;

            const total = completed + pending;
            if (countEl) countEl.textContent = String(completed);
            if (totalEl) totalEl.textContent = String(total);
            track.innerHTML = '';

            if (total === 0) return;

            for (let i = 0; i < completed; i++) {
                const segment = document.createElement('div');
                segment.className = 'pipeline-segment completed';
                segment.style.flex = '1';
                track.appendChild(segment);
            }

            if (pending > 0) {
                const current = document.createElement('div');
                current.className = 'pipeline-segment current';
                current.style.flex = '1';
                track.appendChild(current);

                for (let i = 1; i < pending; i++) {
                    const segment = document.createElement('div');
                    segment.className = 'pipeline-segment pending';
                    segment.style.flex = '1';
                    track.appendChild(segment);
                }
            }
        }

        // ====================================================================
        // Session Timing
        // ====================================================================

        let sessionStartTime = null;
        let elapsedInterval = null;
        let currentTaskHistory = [];
        let currentPendingTasks = 0;
        let currentTaskStartTime = null;
        let totalTasks = 0;

        function getTaskStats() {
            const completed = currentTaskHistory ? currentTaskHistory.length : 0;
            return {
                completed: completed,
                pending: currentPendingTasks,
                total: totalTasks || completed + currentPendingTasks
            };
        }

        function updateTiming(startTime, taskHistory, pendingTasks) {
            const timingDisplay = document.getElementById('timingDisplay');

            if (startTime > 0) {
                sessionStartTime = startTime;
                currentTaskHistory = taskHistory || [];
                currentPendingTasks = pendingTasks;

                const completed = currentTaskHistory.length;
                totalTasks = completed + pendingTasks;

                if (currentTaskHistory.length > 0) {
                    const lastTask = currentTaskHistory[currentTaskHistory.length - 1];
                    currentTaskStartTime = lastTask.completedAt;
                } else {
                    currentTaskStartTime = startTime;
                }

                if (timingDisplay) timingDisplay.classList.add('visible');

                if (!elapsedInterval) {
                    elapsedInterval = setInterval(function() {
                        updateCurrentTaskBar();
                        updateElapsedAndEta();
                    }, 1000);
                }

                updateElapsedAndEta();
                
                // Update estimated time in task details panel based on new historical data
                updateEstimatedTime();
            } else {
                if (elapsedInterval) {
                    clearInterval(elapsedInterval);
                    elapsedInterval = null;
                }
                if (timingDisplay) timingDisplay.classList.remove('visible');
            }
        }

        function updateElapsedAndEta() {
            if (!sessionStartTime) return;

            const elapsed = Date.now() - sessionStartTime;
            const elapsedEl = document.getElementById('elapsedTime');
            const etaEl = document.getElementById('etaTime');

            if (elapsedEl) elapsedEl.textContent = formatTime(elapsed);

            if (etaEl) {
                const completed = currentTaskHistory ? currentTaskHistory.length : 0;
                if (completed > 0 && currentPendingTasks > 0) {
                    const totalDuration = currentTaskHistory.reduce(function(sum, h) { return sum + h.duration; }, 0);
                    const avgDuration = totalDuration / completed;
                    const remainingTime = avgDuration * currentPendingTasks;
                    etaEl.textContent = formatTime(remainingTime);
                } else if (currentPendingTasks > 0) {
                    etaEl.textContent = '--:--:--';
                } else {
                    etaEl.textContent = 'Done!';
                }
            }
        }

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            return String(hours).padStart(2, '0') + ':' +
                   String(minutes).padStart(2, '0') + ':' +
                   String(seconds).padStart(2, '0');
        }

        // ====================================================================
        // Timeline Visualization
        // ====================================================================

        let currentBarElement = null;
        let currentBarLabel = null;
        let maxDurationForScale = 0;

        // Zoom levels for timeline bars (width in pixels)
        const ZOOM_LEVELS = [10, 15, 20, 30, 40, 60, 80];
        let currentZoomIndex = 2; // Default 20px

        // Tooltip for timelines
        let timelineTooltip = null;

        function createTimelineTooltip() {
             if (document.getElementById('timelineTooltip')) {
                 timelineTooltip = document.getElementById('timelineTooltip');
                 return;
             }
             
             timelineTooltip = document.createElement('div');
             timelineTooltip.id = 'timelineTooltip';
             timelineTooltip.className = 'timeline-tooltip';
             document.body.appendChild(timelineTooltip);
        }

        function showTimelineTooltip(event, task, index) {
            if (!timelineTooltip) createTimelineTooltip();
            
            const duration = formatDuration(task.duration);
            
            timelineTooltip.innerHTML = 
                '<div class="tooltip-header">' +
                    '<span>Task #' + (index + 1) + '</span>' +
                '</div>' +
                '<div class="tooltip-desc">' + escapeHtml(task.taskDescription) + '</div>' +
                '<div class="tooltip-meta">' +
                    '<div class="tooltip-tag">' +
                        '<span class="tooltip-icon">⏱️</span>' +
                        '<span>' + duration + '</span>' +
                    '</div>' +
                '</div>';
                
            timelineTooltip.classList.add('visible');
            updateTooltipPosition(event.target);
        }

        function showSimpleTooltip(event, title, desc) {
            if (!timelineTooltip) createTimelineTooltip();
            
            timelineTooltip.innerHTML = 
                '<div class="tooltip-header">' +
                    '<span>' + title + '</span>' +
                '</div>' +
                (desc ? '<div class="tooltip-desc">' + desc + '</div>' : '');
                
            timelineTooltip.classList.add('visible');
            updateTooltipPosition(event.target);
        }

        function hideTimelineTooltip() {
            if (timelineTooltip) {
                timelineTooltip.classList.remove('visible');
            }
        }
        
        function updateTooltipPosition(target) {
            if (!timelineTooltip || !timelineTooltip.classList.contains('visible') || !target) return;
            
            const rect = target.getBoundingClientRect();
            // Need to measure tooltip after content update, but browser might not have laid it out yet.
            // Force layout or use requestAnimationFrame?
            // Usually just setting content allows getting dimensions immediately if attached to DOM.
            const tooltipRect = timelineTooltip.getBoundingClientRect();
            
            // Center horizontally above the target
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            let top = rect.top - tooltipRect.height - 8; // 8px spacing
            
            // Keep within viewport bounds
            if (left < 5) left = 5;
            if (left + tooltipRect.width > window.innerWidth - 5) {
                left = window.innerWidth - tooltipRect.width - 5;
            }
            
            if (top < 5) {
                // If not enough space above, show below
                top = rect.bottom + 8;
            }
            
            timelineTooltip.style.left = left + 'px';
            timelineTooltip.style.top = top + 'px';
        }

        /**
         * Adjusts the timeline zoom level.
         * @param {number} delta - The direction to zoom (+1 or -1)
         */
        function zoomTimeline(delta) {
            const newIndex = currentZoomIndex + delta;
            
            // Bounds check
            if (newIndex >= 0 && newIndex < ZOOM_LEVELS.length) {
                currentZoomIndex = newIndex;
                applyZoom();
            }
        }

        /**
         * Resets the timeline zoom to default.
         */
        function resetZoom() {
            currentZoomIndex = 2; // Resize to default (20px)
            applyZoom();
        }

        /**
         * Triggers the data export process.
         */
        function activeExportData() {
            try {
                vscode.postMessage({ command: 'exportData' });
            } catch (e) {
                console.error('Failed to trigger export:', e);
            }
        }

        /**
         * Applies the current zoom level to the timeline elements.
         */
        function applyZoom() {
            const width = ZOOM_LEVELS[currentZoomIndex];
            const bars = document.getElementById('timelineBars');
            const labels = document.getElementById('timelineLabels');
            
            // Set CSS variable for bar width
            if (bars) {
                bars.style.setProperty('--timeline-bar-width', width + 'px');
            }
            if (labels) {
                labels.style.setProperty('--timeline-bar-width', width + 'px');
            }
            
            // Update UI feedback (button states could be updated here if needed)
            const zoomInBtn = document.querySelector('button[onclick="zoomTimeline(1)"]');
            const zoomOutBtn = document.querySelector('button[onclick="zoomTimeline(-1)"]');
            
            if (zoomInBtn) {
                zoomInBtn.disabled = currentZoomIndex >= ZOOM_LEVELS.length - 1;
                zoomInBtn.style.opacity = zoomInBtn.disabled ? '0.5' : '1';
            }
            
            if (zoomOutBtn) {
                zoomOutBtn.disabled = currentZoomIndex <= 0;
                zoomOutBtn.style.opacity = zoomOutBtn.disabled ? '0.5' : '1';
            }
        }

        /**
         * Internal timeline update function.
         * This is the actual implementation, debounced for performance.
         */
        function updateTimelineInternal(history) {
            // Apply current zoom setting first
            applyZoom();

            const empty = document.getElementById('timelineEmpty');
            const bars = document.getElementById('timelineBars');
            const labels = document.getElementById('timelineLabels');
            const count = document.getElementById('timelineCount');
            const stats = getTaskStats();

            if (!empty || !bars || !labels) return;

            if (count) {
                count.textContent = stats.completed + '/' + stats.total;
            }

            let avgDuration = 60000;
            if (history && history.length > 0) {
                const totalDuration = history.reduce(function(sum, h) { return sum + h.duration; }, 0);
                avgDuration = totalDuration / history.length;
            }

            if (!history || history.length === 0) {
                if (currentPendingTasks > 0 || (window.isRunning || window.isWaiting)) {
                    empty.style.display = 'none';
                    bars.style.display = 'flex';
                    labels.style.display = 'flex';
                    bars.innerHTML = '';
                    labels.innerHTML = '';
                    addCurrentTaskBar(bars, labels, 1, avgDuration);
                    if (currentPendingTasks > 1) {
                        addConnector(bars, labels);
                        addPendingBars(bars, labels, 2, currentPendingTasks - 1, avgDuration, avgDuration);
                    }
                } else {
                    empty.innerHTML = 'No tasks completed yet';
                    empty.style.display = 'block';
                    bars.style.display = 'none';
                    labels.style.display = 'none';
                }
                return;
            }

            empty.style.display = 'none';
            bars.style.display = 'flex';
            labels.style.display = 'flex';

            const maxDuration = Math.max.apply(null, history.map(function(h) { return h.duration; }));
            maxDurationForScale = Math.max(maxDuration, avgDuration);

            bars.innerHTML = '';
            labels.innerHTML = '';

            history.forEach(function(task, i) {
                if (i > 0) {
                    addConnector(bars, labels);
                }
                const heightPercent = (task.duration / maxDurationForScale) * 100;
                const bar = document.createElement('div');
                bar.className = 'timeline-bar';
                bar.style.height = Math.max(heightPercent, 10) + '%';
                bar.setAttribute('data-duration', formatDuration(task.duration));
                // Remove native tooltip
                // bar.title = task.taskDescription;
                
                // Add custom tooltip events
                bar.onmouseenter = function(e) { showTimelineTooltip(e, task, i); };
                bar.onmouseleave = function() { hideTimelineTooltip(); };
                
                bars.appendChild(bar);

                const label = document.createElement('div');
                label.className = 'timeline-label';
                label.textContent = '#' + (i + 1);
                labels.appendChild(label);
            });

            if (currentPendingTasks > 0) {
                if (history.length > 0) {
                    addConnector(bars, labels);
                }
                addCurrentTaskBar(bars, labels, history.length + 1, maxDurationForScale);
                if (currentPendingTasks > 1) {
                    addConnector(bars, labels);
                    addPendingBars(bars, labels, history.length + 2, currentPendingTasks - 1, avgDuration, maxDurationForScale);
                }
            } else {
                currentBarElement = null;
                currentBarLabel = null;
            }
        }

        // Store reference to internal function for debouncing
        _updateTimelineInternal = updateTimelineInternal;

        /**
         * Updates the timeline visualization.
         * Uses debouncing to batch rapid updates for better performance.
         * Can also use requestAnimationFrame for smooth visual updates.
         * 
         * @param {Array} history - The task completion history
         * @param {boolean} immediate - If true, bypasses debouncing
         * @param {boolean} useRAF - If true, uses requestAnimationFrame instead of debouncing
         */
        function updateTimeline(history, immediate, useRAF) {
            if (immediate) {
                // Flush any pending updates and run immediately
                if (debouncedUpdateTimeline && debouncedUpdateTimeline.pending()) {
                    debouncedUpdateTimeline.cancel();
                }
                if (rafUpdateTimeline && rafUpdateTimeline.pending()) {
                    rafUpdateTimeline.cancel();
                }
                updateTimelineInternal(history);
            } else if (useRAF && rafUpdateTimeline) {
                // Use requestAnimationFrame for smooth visual updates
                rafUpdateTimeline(history);
            } else if (debouncedUpdateTimeline) {
                debouncedUpdateTimeline(history);
            } else {
                // Fallback if debouncing not yet initialized
                updateTimelineInternal(history);
            }
        }

        function addConnector(bars, labels) {
            const connector = document.createElement('div');
            connector.className = 'timeline-connector';
            bars.appendChild(connector);

            const spacer = document.createElement('div');
            spacer.style.flex = '0 0 auto';
            spacer.style.width = '12px';
            labels.appendChild(spacer);
        }

        function addPendingBars(bars, labels, startNum, count, avgDuration, maxDuration) {
            if (count <= 0) return;

            const heightPercent = (avgDuration / maxDuration) * 100;

            for (let i = 0; i < count; i++) {
                if (i > 0) {
                    addConnector(bars, labels);
                }
                const bar = document.createElement('div');
                bar.className = 'timeline-bar pending';
                bar.style.height = Math.max(heightPercent, 10) + '%';
                bar.setAttribute('data-duration', '~' + formatDuration(avgDuration));
                
                // Custom tooltip
                const taskNum = startNum + i;
                const durationStr = formatDuration(avgDuration);
                bar.onmouseenter = function(e) { 
                    showSimpleTooltip(e, 'Task #' + taskNum + ' (Pending)', 'Estimated duration: ' + durationStr); 
                };
                bar.onmouseleave = function() { hideTimelineTooltip(); };
                
                bars.appendChild(bar);

                const label = document.createElement('div');
                label.className = 'timeline-label';
                label.textContent = '#' + (startNum + i);
                label.style.opacity = '0.5';
                labels.appendChild(label);
            }
        }

        function addCurrentTaskBar(bars, labels, taskNum, maxDuration) {
            const bar = document.createElement('div');
            bar.className = 'timeline-bar current';
            bar.style.height = '5%';
            bar.setAttribute('data-duration', '0s');
            
            // Custom tooltip
            bar.onmouseenter = function(e) { 
                showSimpleTooltip(e, 'Task #' + taskNum + ' (In Progress)', 'Current task is executing...'); 
            };
            bar.onmouseleave = function() { hideTimelineTooltip(); };
            
            bars.appendChild(bar);
            currentBarElement = bar;
            maxDurationForScale = maxDuration;

            const label = document.createElement('div');
            label.className = 'timeline-label';
            label.textContent = '#' + taskNum;
            labels.appendChild(label);
            currentBarLabel = label;
        }

        // Track the last RAF ID for updateCurrentTaskBar
        var currentTaskBarRAFId = null;
        var lastBarHeight = 5;

        /**
         * Updates the current task bar using requestAnimationFrame.
         * Provides smooth animation for the growing bar during task execution.
         */
        function updateCurrentTaskBar() {
            if (!currentBarElement || !currentTaskStartTime) return;

            const elapsed = Date.now() - currentTaskStartTime;
            const scale = maxDurationForScale > 0 ? maxDurationForScale : 60000;
            const targetHeightPercent = Math.min((elapsed / scale) * 100, 100);
            const finalHeight = Math.max(targetHeightPercent, 5);

            // Animate height smoothly using requestAnimationFrame
            if (Math.abs(finalHeight - lastBarHeight) > 0.1) {
                animateValue({
                    id: 'currentTaskBar',
                    from: lastBarHeight,
                    to: finalHeight,
                    duration: 200,
                    easing: 'easeOutQuad',
                    onUpdate: function(value) {
                        if (currentBarElement) {
                            currentBarElement.style.height = value + '%';
                        }
                    }
                });
                lastBarHeight = finalHeight;
            }

            // Update data attribute without animation
            currentBarElement.setAttribute('data-duration', formatDuration(elapsed));
        }

        /**
         * Starts continuous animation of the current task bar using requestAnimationFrame.
         * Creates a smooth growing animation for the task progress.
         */
        function startCurrentTaskBarAnimation() {
            if (currentTaskBarRAFId !== null) return;
            
            function animate() {
                updateCurrentTaskBar();
                currentTaskBarRAFId = requestAnimationFrame(animate);
            }
            
            currentTaskBarRAFId = requestAnimationFrame(animate);
        }

        /**
         * Stops the current task bar animation.
         */
        function stopCurrentTaskBarAnimation() {
            if (currentTaskBarRAFId !== null) {
                cancelAnimationFrame(currentTaskBarRAFId);
                currentTaskBarRAFId = null;
            }
            cancelAnimation('currentTaskBar');
            lastBarHeight = 5;
        }

        function formatDuration(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);

            if (hours > 0) return hours + 'h ' + (minutes % 60) + 'm';
            if (minutes > 0) return minutes + 'm ' + (seconds % 60) + 's';
            return seconds + 's';
        }

        // ====================================================================
        // Keyboard Navigation
        // ====================================================================

        // List of focusable element selectors for Tab navigation
        const FOCUSABLE_SELECTORS = [
            'button:not([disabled])',
            'input:not([disabled])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'a[href]',
            'label[for]'
        ].join(', ');

        /**
         * Gets all focusable elements in the current context (modal or main page).
         * If settings overlay is visible, only returns focusable elements within it.
         */
        function getFocusableElements() {
            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsOverlay && settingsOverlay.classList.contains('visible')) {
                // Focus trap: only return elements inside the settings overlay
                return Array.from(settingsOverlay.querySelectorAll(FOCUSABLE_SELECTORS));
            }
            return Array.from(document.querySelectorAll(FOCUSABLE_SELECTORS));
        }

        /**
         * Gets the currently focused element.
         */
        function getCurrentFocus() {
            return document.activeElement;
        }

        /**
         * Moves focus to the next or previous focusable element.
         * @param {boolean} reverse - If true, move to previous element (Shift+Tab)
         */
        function moveFocus(reverse) {
            const focusable = getFocusableElements();
            if (focusable.length === 0) return;

            const current = getCurrentFocus();
            let currentIndex = focusable.indexOf(current);

            if (currentIndex === -1) {
                // If no focusable element has focus, start at the beginning/end
                currentIndex = reverse ? focusable.length : -1;
            }

            let nextIndex;
            if (reverse) {
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) {
                    nextIndex = focusable.length - 1; // Wrap to end
                }
            } else {
                nextIndex = currentIndex + 1;
                if (nextIndex >= focusable.length) {
                    nextIndex = 0; // Wrap to beginning
                }
            }

            const nextElement = focusable[nextIndex];
            if (nextElement && typeof nextElement.focus === 'function') {
                nextElement.focus();
            }
        }

        /**
         * Handles Escape key actions:
         * - Close settings overlay if open
         * - Clear focus and return to main content
         */
        function handleEscape() {
            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsOverlay && settingsOverlay.classList.contains('visible')) {
                closeSettings();
                // Return focus to the settings button after closing
                const settingsButton = document.querySelector('button[onclick="openSettings()"]');
                if (settingsButton) {
                    settingsButton.focus();
                }
                return true; // Handled
            }

            // Clear focus by focusing the body or main content
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.focus();
            } else {
                document.body.focus();
            }
            return true;
        }

        /**
         * Handles Enter key actions:
         * - Activate focused button/element
         * - Toggle checkboxes
         * - Submit forms
         */
        function handleEnter(event) {
            const target = event.target;
            if (!target) return false;

            const tagName = target.tagName.toLowerCase();
            
            // For buttons, the browser handles Enter natively, but we ensure it works
            if (tagName === 'button' && !target.disabled) {
                target.click();
                return true;
            }

            // For checkboxes, toggle the checked state
            if (tagName === 'input' && target.type === 'checkbox' && !target.disabled) {
                target.checked = !target.checked;
                // Trigger the change event to notify listeners
                const changeEvent = new Event('change', { bubbles: true });
                target.dispatchEvent(changeEvent);
                return true;
            }

            // For elements with role="button", trigger click
            if (target.getAttribute('role') === 'button') {
                target.click();
                return true;
            }

            // For labels with 'for' attribute, click the associated input
            if (tagName === 'label' && target.htmlFor) {
                const input = document.getElementById(target.htmlFor);
                if (input) {
                    input.click();
                    return true;
                }
            }

            return false;
        }

        /**
         * Global keydown handler for keyboard navigation.
         */
        function handleGlobalKeydown(event) {
            const key = event.key;

            // Handle Escape key
            if (key === 'Escape') {
                if (handleEscape()) {
                    event.preventDefault();
                }
                return;
            }

            // Handle Tab key for custom focus management within settings overlay
            if (key === 'Tab') {
                const settingsOverlay = document.getElementById('settingsOverlay');
                if (settingsOverlay && settingsOverlay.classList.contains('visible')) {
                    // Focus trap inside settings overlay
                    event.preventDefault();
                    moveFocus(event.shiftKey);
                }
                // For main page, let browser handle Tab naturally
                return;
            }

            // Handle Enter key
            if (key === 'Enter') {
                // Don't handle Enter in textarea (allow newlines)
                if (event.target && event.target.tagName.toLowerCase() === 'textarea') {
                    return;
                }
                if (handleEnter(event)) {
                    event.preventDefault();
                }
                return;
            }
        }

        /**
         * Sets up keyboard navigation for the panel.
         */
        function setupKeyboardNavigation() {
            document.addEventListener('keydown', handleGlobalKeydown);
        }

        /**
         * Focus the settings overlay's first focusable element when it opens.
         */
        function focusSettingsOverlay() {
            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsOverlay && settingsOverlay.classList.contains('visible')) {
                const focusable = getFocusableElements();
                if (focusable.length > 0) {
                    focusable[0].focus();
                }
            }
        }

        // Override openSettings to add focus management
        const originalOpenSettings = openSettings;
        openSettings = function() {
            originalOpenSettings();
            // Focus first element in settings after a short delay for DOM update
            setTimeout(focusSettingsOverlay, 50);
        };

        // ====================================================================
        // Lazy Loading for Non-Critical Sections
        // ====================================================================

        /**
         * IDs of sections that should be lazy-loaded.
         * These are non-critical sections that don't need to be visible on initial load.
         */
        const LAZY_LOAD_SECTIONS = [
            'durationSection',      // Duration chart - not visible until tasks complete
            'dependencySection',    // Dependency graph - supplementary visualization
            'taskQueueSection',     // Pending tasks queue - below fold
            'settingsOverlay'       // Settings overlay - only shown on demand
        ];

        /**
         * Maps section IDs to their loading state.
         * Values: 'pending' | 'loading' | 'loaded' | 'error'
         */
        const lazySectionStates = {};

        /**
         * The IntersectionObserver instance for lazy loading.
         */
        let lazyLoadObserver = null;

        /**
         * Minimum time to show loading state (in milliseconds) for smooth UX.
         */
        const LAZY_LOAD_MIN_DELAY = 50;

        /**
         * Root margin for IntersectionObserver - start loading slightly before visible.
         */
        const LAZY_LOAD_ROOT_MARGIN = '100px';

        /**
         * Threshold for IntersectionObserver - trigger when any part is visible.
         */
        const LAZY_LOAD_THRESHOLD = 0.01;

        /**
         * Callbacks registered for when sections are loaded.
         * Map of sectionId -> array of callbacks
         */
        const lazyLoadCallbacks = {};

        /**
         * Gets the current loading state of a lazy section.
         * @param {string} sectionId - The section ID
         * @returns {'pending' | 'loading' | 'loaded' | 'error' | undefined}
         */
        function getLazySectionState(sectionId) {
            return lazySectionStates[sectionId];
        }

        /**
         * Checks if a section has been lazy-loaded.
         * @param {string} sectionId - The section ID
         * @returns {boolean}
         */
        function isSectionLoaded(sectionId) {
            return lazySectionStates[sectionId] === 'loaded';
        }

        /**
         * Checks if a section is currently loading.
         * @param {string} sectionId - The section ID
         * @returns {boolean}
         */
        function isSectionLoading(sectionId) {
            return lazySectionStates[sectionId] === 'loading';
        }

        /**
         * Checks if all lazy sections have been loaded.
         * @returns {boolean}
         */
        function areAllSectionsLoaded() {
            return LAZY_LOAD_SECTIONS.every(function(id) {
                return lazySectionStates[id] === 'loaded';
            });
        }

        /**
         * Registers a callback to be called when a section is loaded.
         * If the section is already loaded, the callback is called immediately.
         * @param {string} sectionId - The section ID
         * @param {Function} callback - The callback to call
         */
        function onSectionLoaded(sectionId, callback) {
            if (typeof callback !== 'function') return;

            if (lazySectionStates[sectionId] === 'loaded') {
                // Already loaded, call immediately
                callback(sectionId);
                return;
            }

            // Register for future load
            if (!lazyLoadCallbacks[sectionId]) {
                lazyLoadCallbacks[sectionId] = [];
            }
            lazyLoadCallbacks[sectionId].push(callback);
        }

        /**
         * Notifies all registered callbacks that a section has been loaded.
         * @param {string} sectionId - The section ID
         */
        function notifyLazyLoadCallbacks(sectionId) {
            const callbacks = lazyLoadCallbacks[sectionId];
            if (callbacks && callbacks.length > 0) {
                callbacks.forEach(function(cb) {
                    try {
                        cb(sectionId);
                    } catch (e) {
                        console.error('Error in lazy load callback for ' + sectionId + ':', e);
                    }
                });
                // Clear callbacks after firing
                lazyLoadCallbacks[sectionId] = [];
            }
        }

        /**
         * Shows loading state for a lazy section.
         * @param {string} sectionId - The section ID
         */
        function showLazySectionLoading(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;

            lazySectionStates[sectionId] = 'loading';
            section.classList.add('lazy-loading');
            section.setAttribute('aria-busy', 'true');

            // Add loading indicator if not present
            let indicator = section.querySelector('.lazy-load-indicator');
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.className = 'lazy-load-indicator';
                indicator.setAttribute('role', 'status');
                indicator.setAttribute('aria-label', 'Loading section');
                indicator.innerHTML = '<div class="lazy-load-spinner" aria-hidden="true"></div><span class="lazy-load-text">Loading...</span>';
                
                // Insert at the beginning of section content
                const content = section.querySelector('.section-content') || section;
                content.insertBefore(indicator, content.firstChild);
            }
            indicator.style.display = 'flex';
        }

        /**
         * Hides loading state and marks section as loaded.
         * @param {string} sectionId - The section ID
         */
        function hideLazySectionLoading(sectionId) {
            const section = document.getElementById(sectionId);
            if (!section) return;

            lazySectionStates[sectionId] = 'loaded';
            section.classList.remove('lazy-loading');
            section.classList.add('lazy-loaded');
            section.setAttribute('aria-busy', 'false');

            // Hide loading indicator
            const indicator = section.querySelector('.lazy-load-indicator');
            if (indicator) {
                indicator.style.display = 'none';
            }

            // Notify callbacks
            notifyLazyLoadCallbacks(sectionId);

            // Announce to screen readers
            const sectionName = getSectionName(sectionId);
            announceToScreenReader(sectionName + ' loaded');
        }

        /**
         * Marks a section as having failed to load.
         * @param {string} sectionId - The section ID
         * @param {string} errorMessage - Optional error message
         */
        function markLazySectionError(sectionId, errorMessage) {
            const section = document.getElementById(sectionId);
            if (!section) return;

            lazySectionStates[sectionId] = 'error';
            section.classList.remove('lazy-loading');
            section.classList.add('lazy-error');
            section.setAttribute('aria-busy', 'false');

            // Update loading indicator to show error
            const indicator = section.querySelector('.lazy-load-indicator');
            if (indicator) {
                indicator.innerHTML = '<span class="lazy-load-error-icon" aria-hidden="true">⚠️</span><span class="lazy-load-text">' + 
                    escapeHtml(errorMessage || 'Failed to load') + '</span>';
            }
        }

        /**
         * Gets a human-readable section name from its ID.
         * @param {string} sectionId - The section ID
         * @returns {string}
         */
        function getLazySectionName(sectionId) {
            const names = {
                'durationSection': 'Duration chart',
                'dependencySection': 'Dependency graph',
                'taskQueueSection': 'Task queue',
                'settingsOverlay': 'Settings'
            };
            return names[sectionId] || sectionId;
        }

        /**
         * Initializes lazy loading content for a section.
         * This is called when a section enters the viewport.
         * @param {string} sectionId - The section ID
         */
        function initializeLazySection(sectionId) {
            // Skip if already loaded or loading
            if (lazySectionStates[sectionId] === 'loaded' || lazySectionStates[sectionId] === 'loading') {
                return;
            }

            showLazySectionLoading(sectionId);

            // Use setTimeout to ensure smooth visual transition
            setTimeout(function() {
                try {
                    // Section-specific initialization
                    switch (sectionId) {
                        case 'durationSection':
                            // Duration chart is data-driven, just mark as ready
                            // Actual content rendered when history data arrives
                            hideLazySectionLoading(sectionId);
                            break;

                        case 'dependencySection':
                            // Render dependency graph if we have task data
                            if (window.__RALPH_INITIAL_TASKS__) {
                                renderDependencyGraph(window.__RALPH_INITIAL_TASKS__, true);
                            }
                            hideLazySectionLoading(sectionId);
                            break;

                        case 'taskQueueSection':
                            // Render pending tasks if we have task data
                            if (window.__RALPH_INITIAL_TASKS__) {
                                renderPendingTasks(window.__RALPH_INITIAL_TASKS__);
                            }
                            hideLazySectionLoading(sectionId);
                            break;

                        case 'settingsOverlay':
                            // Settings overlay is already rendered, just mark as loaded
                            hideLazySectionLoading(sectionId);
                            break;

                        default:
                            // Unknown section, just mark as loaded
                            hideLazySectionLoading(sectionId);
                    }
                } catch (error) {
                    console.error('Error initializing lazy section ' + sectionId + ':', error);
                    markLazySectionError(sectionId, 'Failed to initialize');
                }
            }, LAZY_LOAD_MIN_DELAY);
        }

        /**
         * Force-loads a lazy section immediately, bypassing IntersectionObserver.
         * Useful for sections that need to be ready before becoming visible (e.g., settings).
         * @param {string} sectionId - The section ID
         */
        function forceLoadSection(sectionId) {
            // Stop observing this section
            if (lazyLoadObserver) {
                const section = document.getElementById(sectionId);
                if (section) {
                    lazyLoadObserver.unobserve(section);
                }
            }

            // Initialize immediately
            initializeLazySection(sectionId);
        }

        /**
         * Force-loads all lazy sections immediately.
         * Useful when the panel needs to be fully initialized.
         */
        function forceLoadAllSections() {
            LAZY_LOAD_SECTIONS.forEach(forceLoadSection);
        }

        /**
         * IntersectionObserver callback for lazy loading.
         * @param {IntersectionObserverEntry[]} entries
         */
        function handleLazyIntersection(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Stop observing once triggered
                    if (lazyLoadObserver) {
                        lazyLoadObserver.unobserve(entry.target);
                    }

                    // Initialize the section
                    initializeLazySection(sectionId);
                }
            });
        }

        /**
         * Sets up IntersectionObserver for lazy loading sections.
         */
        function initLazyLoadObserver() {
            // Check for IntersectionObserver support
            if (typeof IntersectionObserver === 'undefined') {
                // Fallback: load all sections immediately
                console.warn('IntersectionObserver not supported, loading all sections immediately');
                forceLoadAllSections();
                return;
            }

            // Create observer with generous margins for smooth loading
            lazyLoadObserver = new IntersectionObserver(handleLazyIntersection, {
                root: null, // Use viewport
                rootMargin: LAZY_LOAD_ROOT_MARGIN,
                threshold: LAZY_LOAD_THRESHOLD
            });

            // Start observing lazy sections
            LAZY_LOAD_SECTIONS.forEach(function(sectionId) {
                const section = document.getElementById(sectionId);
                if (section) {
                    // Mark as pending
                    lazySectionStates[sectionId] = 'pending';
                    section.classList.add('lazy-section');
                    
                    // Start observing
                    lazyLoadObserver.observe(section);
                } else {
                    // Section doesn't exist in DOM, mark as loaded
                    lazySectionStates[sectionId] = 'loaded';
                }
            });
        }

        /**
         * Cleans up the lazy load observer.
         */
        function destroyLazyLoadObserver() {
            if (lazyLoadObserver) {
                lazyLoadObserver.disconnect();
                lazyLoadObserver = null;
            }
        }

        /**
         * Gets lazy loading statistics for debugging.
         * @returns {{ total: number, loaded: number, pending: number, loading: number, error: number }}
         */
        function getLazyLoadStats() {
            let loaded = 0, pending = 0, loading = 0, error = 0;

            LAZY_LOAD_SECTIONS.forEach(function(id) {
                switch (lazySectionStates[id]) {
                    case 'loaded': loaded++; break;
                    case 'pending': pending++; break;
                    case 'loading': loading++; break;
                    case 'error': error++; break;
                }
            });

            return {
                total: LAZY_LOAD_SECTIONS.length,
                loaded: loaded,
                pending: pending,
                loading: loading,
                error: error
            };
        }

        // ====================================================================
        // Duration Chart
        // ====================================================================

        /**
         * Internal duration chart update function.
         * This is the actual implementation, debounced for performance.
         */
        function updateDurationChartInternal(history) {
            const chart = document.getElementById('durationChart');
            const empty = document.getElementById('durationEmpty');

            if (!chart || !empty) return;

            if (!history || history.length === 0) {
                chart.style.display = 'none';
                empty.style.display = 'block';
                return;
            }

            chart.style.display = 'flex';
            empty.style.display = 'none';

            // Calculate max duration for scaling
            let maxDuration = 0;
            history.forEach(function(task) {
                if (task.duration > maxDuration) {
                    maxDuration = task.duration;
                }
            });

            // Ensure we have a minimum scale (e.g., 1 minute) to avoid full bars for very short tasks
            maxDuration = Math.max(maxDuration, 60000);

            // Rebuild chart
            chart.innerHTML = '';

            history.forEach(function(task, i) {
                const duration = task.duration;
                const percentage = (duration / maxDuration) * 100;
                const formattedTime = formatDurationShort(duration);

                const row = document.createElement('div');
                row.className = 'duration-row';
                // Add staggered animation delay
                row.style.animationDelay = (i * 0.05) + 's';
                
                row.innerHTML = 
                    '<div class="duration-label" title="' + escapeHtml(task.taskDescription) + '">' + escapeHtml(task.taskDescription) + '</div>' +
                    '<div class="duration-bar-container">' +
                        '<div class="duration-bar" style="width: ' + percentage + '%"></div>' +
                    '</div>' +
                    '<div class="duration-time">' + formattedTime + '</div>';
                
                chart.appendChild(row);
            });
        }

        // Store reference to internal function for debouncing
        _updateDurationChartInternal = updateDurationChartInternal;

        /**
         * Updates the duration chart visualization.
         * Uses debouncing to batch rapid updates for better performance.
         * 
         * @param {Array} history - The task completion history
         * @param {boolean} immediate - If true, bypasses debouncing
         */
        function updateDurationChart(history, immediate) {
            if (immediate) {
                // Flush any pending updates and run immediately
                if (debouncedUpdateDurationChart && debouncedUpdateDurationChart.pending()) {
                    debouncedUpdateDurationChart.cancel();
                }
                updateDurationChartInternal(history);
            } else if (debouncedUpdateDurationChart) {
                debouncedUpdateDurationChart(history);
            } else {
                // Fallback if debouncing not yet initialized
                updateDurationChartInternal(history);
            }
        }

        function formatDurationShort(ms) {
            const seconds = Math.floor(ms / 1000);
            const minutes = Math.floor(seconds / 60);

            if (minutes > 0) {
                return minutes + 'm ' + (seconds % 60) + 's';
            }
            return seconds + 's';
        }

        // ====================================================================
        // Initialization
        // ====================================================================

        // Restore panel state and set up tracking when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initDebouncedFunctions();
                restorePanelState();
                setupScrollTracking();
                setupKeyboardNavigation();
                setupPrdInputValidation();
                initMobileCollapsible();
                initResizeObserver();
                restoreTimestampPreference();
                restoreAutoScrollPreference();
                restoreTaskDetailsPreference();
                initVirtualScroll();
                initLazyLoadObserver();
            });
        } else {
            // DOM already loaded
            initDebouncedFunctions();
            restorePanelState();
            setupScrollTracking();
            setupKeyboardNavigation();
            setupPrdInputValidation();
            initMobileCollapsible();
            initResizeObserver();
            restoreTimestampPreference();
            restoreAutoScrollPreference();
            restoreTaskDetailsPreference();
            initVirtualScroll();
            initLazyLoadObserver();
        }


        /**
         * Internal dependency graph rendering function.
         * This is the actual implementation, debounced for performance.
         */
        function renderDependencyGraphInternal(tasks) {
            const graphContainer = document.getElementById('dependencyGraph');
            const emptyState = document.getElementById('dependencyEmpty');
            
            if (!graphContainer) return;

            if (!tasks || tasks.length === 0) {
                graphContainer.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
                return;
            }

            const hasDependencies = tasks.some(function(t) { return t.dependencies && t.dependencies.length > 0; });
            
            if (!hasDependencies) {
                 if (emptyState) {
                    emptyState.textContent = 'No explicit dependencies found. Showing sequential flow.';
                    emptyState.style.display = 'block';
                 }
            } else {
                 if (emptyState) emptyState.style.display = 'none';
            }
            
            const nodes = tasks.map(function(t, i) {
                return {
                    id: i,
                    taskId: t.id,
                    label: t.description.length > 25 ? t.description.substring(0, 25) + '...' : t.description,
                    fullLabel: t.description,
                    status: t.status,
                    dependencies: t.dependencies || [],
                    x: 0, 
                    y: 0,
                    width: 200,
                    height: 40
                };
            });
            
            const edges = [];
            nodes.forEach(function(node) {
                if (node.dependencies.length > 0) {
                     node.dependencies.forEach(function(depName) {
                         let targetTaskNode = nodes.find(function(n) { return n.fullLabel === depName; });
                         if (!targetTaskNode) {
                             targetTaskNode = nodes.find(function(n) { return n.fullLabel.indexOf(depName) !== -1; });
                         }
                         if (targetTaskNode) {
                             edges.push({ from: targetTaskNode.id, to: node.id });
                         }
                     });
                } else {
                    if (!hasDependencies && node.id > 0) {
                        edges.push({ from: node.id - 1, to: node.id });
                    }
                }
            });
            
            const levels = new Map();
            nodes.forEach(function(n) { levels.set(n.id, 0); });
            
            for(let i=0; i<tasks.length + 2; i++) {
                let changed = false;
                edges.forEach(function(e) {
                    const fromLevel = levels.get(e.from);
                    const toLevel = levels.get(e.to);
                    if (fromLevel >= toLevel) {
                        levels.set(e.to, fromLevel + 1);
                        changed = true;
                    }
                });
                if (!changed) break;
            }
            
            const levelValues = Array.from(levels.values());
            const maxLevel = levelValues.length > 0 ? Math.max.apply(null, levelValues) : 0;
            
            const SVG_WIDTH = Math.max(graphContainer.clientWidth || 600, 400);
            const NODE_WIDTH = 180;
            const NODE_HEIGHT = 36;
            const LEVEL_HEIGHT = 80;
            const Y_PAD = 20;
            
            const svgHeight = (maxLevel + 1) * LEVEL_HEIGHT + Y_PAD;
            
            let svgHtml = '<svg width="100%" height="' + svgHeight + '" viewBox="0 0 ' + SVG_WIDTH + ' ' + svgHeight + '" style="font-family: var(--vscode-font-family);">' +
                '<defs>' +
                    '<marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">' +
                        '<polygon points="0 0, 10 3.5, 0 7" fill="var(--vscode-charts-lines)" />' +
                    '</marker>' +
                '</defs>';
            
            for (let l=0; l <= maxLevel; l++) {
                const group = nodes.filter(function(n) { return levels.get(n.id) === l; });
                const count = group.length;
                const totalRowWidth = count * NODE_WIDTH + (count - 1) * 20;
                
                let startX = (SVG_WIDTH - totalRowWidth) / 2;
                if (startX < 10) startX = 10;
                
                group.forEach(function(node, idx) {
                    const x = startX + idx * (NODE_WIDTH + 20);
                    const y = l * LEVEL_HEIGHT + Y_PAD;
                    
                    node.x = x;
                    node.y = y;
                    
                    const statusClass = node.status.toLowerCase();
                    
                    svgHtml += '<g class="node ' + statusClass + '" transform="translate(' + x + ',' + y + ')">' +
                        '<rect width="' + NODE_WIDTH + '" height="' + NODE_HEIGHT + '" rx="4" ' +
                            'style="fill: var(--vscode-editor-background); stroke: var(--vscode-button-secondaryForeground); stroke-width: 1px;" ' +
                            'class="node-rect ' + statusClass + '" />' +
                        '<text x="10" y="24" font-size="12" fill="var(--vscode-foreground)" ' +
                            'style="pointer-events: none;">' + escapeHtml(node.label) + '</text>' +
                        '<title>' + escapeHtml(node.fullLabel) + '</title>' +
                    '</g>';
                });
            }
            
            edges.forEach(function(e) {
                const fromNode = nodes.find(function(n) { return n.id === e.from; });
                const toNode = nodes.find(function(n) { return n.id === e.to; });
                if (fromNode && toNode) {
                     const x1 = fromNode.x + NODE_WIDTH / 2;
                     const y1 = fromNode.y + NODE_HEIGHT;
                     const x2 = toNode.x + NODE_WIDTH / 2;
                     const y2 = toNode.y;
                     
                     const d = 'M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + (y1 + 20) + ', ' + x2 + ' ' + (y2 - 20) + ', ' + x2 + ' ' + y2;
                     
                     svgHtml += '<path d="' + d + '" stroke="var(--vscode-charts-lines)" stroke-width="1.5" fill="none" marker-end="url(#arrowhead)" opacity="0.6"/>';
                }
            });
            
            svgHtml += '</svg>';
            graphContainer.innerHTML = svgHtml;
            graphContainer.style.display = 'block';
            
            const styleId = 'dependency-graph-styles';
            if (!document.getElementById(styleId)) {
                 const style = document.createElement('style');
                 style.id = styleId;
                 style.textContent = '.node-rect.complete { stroke: var(--vscode-notebookStatusSuccessIcon-foreground, #388a34) !important; stroke-width: 2px !important; } ' +
                    '.node-rect.in_progress { stroke: var(--vscode-notebookStatusRunningIcon-foreground, #388a34) !important; stroke-width: 2px !important; stroke-dasharray: 5,5; animation: dash 1s linear infinite; } ' +
                    '@keyframes dash { to { stroke-dashoffset: 10; } }';
                 document.head.appendChild(style);
            }
        }

        // Store reference to internal function for debouncing
        _renderDependencyGraphInternal = renderDependencyGraphInternal;

        /**
         * Renders the dependency graph visualization.
         * Uses debouncing to prevent excessive re-renders during rapid updates.
         * 
         * @param {Array} tasks - The tasks array with dependency information
         * @param {boolean} immediate - If true, bypasses debouncing
         */
        function renderDependencyGraph(tasks, immediate) {
            if (immediate) {
                // Flush any pending updates and run immediately
                if (debouncedRenderDependencyGraph && debouncedRenderDependencyGraph.pending()) {
                    debouncedRenderDependencyGraph.cancel();
                }
                renderDependencyGraphInternal(tasks);
            } else if (debouncedRenderDependencyGraph) {
                debouncedRenderDependencyGraph(tasks);
            } else {
                // Fallback if debouncing not yet initialized
                renderDependencyGraphInternal(tasks);
            }
        }

        // ====================================================================
        // Aggregated Stats Functions
        // ====================================================================

        /**
         * Updates the aggregated statistics section with data from multiple projects.
         * @param {Object} stats - The aggregated stats object from the extension
         * @param {Array} stats.projects - Array of project stats objects
         * @param {number} stats.totalTasks - Total tasks across all projects
         * @param {number} stats.totalCompleted - Total completed tasks
         * @param {number} stats.totalPending - Total pending tasks
         * @param {number} stats.overallProgress - Overall progress percentage
         * @param {number} stats.projectCount - Number of projects
         * @param {string|null} stats.currentProject - Current active project path
         */
        function updateAggregatedStats(stats) {
            var section = document.getElementById('aggregatedStatsSection');
            var empty = document.getElementById('aggregatedStatsEmpty');
            var summary = document.getElementById('aggregatedStatsSummary');
            var countBadge = document.getElementById('aggregatedProjectCount');
            
            if (!section) return;

            // Update project count badge
            if (countBadge) {
                var countText = stats.projectCount + ' project' + (stats.projectCount !== 1 ? 's' : '');
                countBadge.textContent = countText;
            }

            // Show/hide empty state vs summary based on project count
            if (!stats.projects || stats.projects.length <= 1) {
                // Hide section if only 0 or 1 project (no aggregation needed)
                if (empty) empty.style.display = 'flex';
                if (summary) summary.style.display = 'none';
                return;
            }

            // Show summary
            if (empty) empty.style.display = 'none';
            if (summary) summary.style.display = 'block';

            // Update totals
            var totalTasksEl = document.getElementById('aggregatedTotalTasks');
            var completedEl = document.getElementById('aggregatedCompleted');
            var pendingEl = document.getElementById('aggregatedPending');
            var progressEl = document.getElementById('aggregatedProgress');
            var progressFillEl = document.getElementById('aggregatedProgressFill');
            var progressBarEl = summary ? summary.querySelector('.aggregated-stats-progress-bar') : null;

            if (totalTasksEl) totalTasksEl.textContent = String(stats.totalTasks);
            if (completedEl) completedEl.textContent = String(stats.totalCompleted);
            if (pendingEl) pendingEl.textContent = String(stats.totalPending);
            if (progressEl) progressEl.textContent = stats.overallProgress + '%';
            
            if (progressFillEl) {
                progressFillEl.style.width = stats.overallProgress + '%';
            }
            if (progressBarEl) {
                progressBarEl.setAttribute('aria-valuenow', String(stats.overallProgress));
            }

            // Update project rows
            var projectsContainer = document.getElementById('aggregatedStatsProjects');
            if (projectsContainer && stats.projects) {
                var projectsHtml = '';
                stats.projects.forEach(function(project) {
                    projectsHtml += getProjectStatsRowHtml(project, stats.currentProject);
                });
                projectsContainer.innerHTML = projectsHtml;
            }

            // Announce to screen reader
            announceToScreenReader(
                'Aggregated stats: ' + stats.totalCompleted + ' of ' + stats.totalTasks + 
                ' tasks completed across ' + stats.projectCount + ' projects. ' +
                'Overall progress: ' + stats.overallProgress + ' percent.'
            );
        }

        /**
         * Generates HTML for a single project stats row.
         * @param {Object} project - The project stats object
         * @param {string|null} currentPath - The current active project path
         * @returns {string} HTML string for the project row
         */
        function getProjectStatsRowHtml(project, currentPath) {
            var isActive = project.path === currentPath;
            var activeClass = isActive ? ' active' : '';
            var progressColor = project.progress === 100 ? 'complete' : project.progress >= 50 ? 'partial' : 'low';
            var activeIndicator = isActive ? '▶' : '';
            
            return '<div class="project-stats-row' + activeClass + '" role="listitem" data-project-path="' + escapeHtml(project.path) + '">' +
                '<div class="project-stats-name">' +
                    '<span class="project-active-indicator" aria-hidden="true">' + activeIndicator + '</span>' +
                    '<span class="project-name-text" title="' + escapeHtml(project.path) + '">' + escapeHtml(project.name) + '</span>' +
                '</div>' +
                '<div class="project-stats-bar">' +
                    '<div class="project-stats-bar-bg">' +
                        '<div class="project-stats-bar-fill ' + progressColor + '" style="width: ' + project.progress + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="project-stats-numbers">' +
                    '<span class="project-completed">' + project.completed + '</span>' +
                    '<span class="project-separator">/</span>' +
                    '<span class="project-total">' + project.total + '</span>' +
                    '<span class="project-percent">(' + project.progress + '%)</span>' +
                '</div>' +
            '</div>';
        }

        /**
         * Gets the current aggregated stats display state.
         * @returns {Object|null} The current stats or null if not available
         */
        function getAggregatedStatsState() {
            var totalEl = document.getElementById('aggregatedTotalTasks');
            var completedEl = document.getElementById('aggregatedCompleted');
            var pendingEl = document.getElementById('aggregatedPending');
            var progressEl = document.getElementById('aggregatedProgress');
            var countBadge = document.getElementById('aggregatedProjectCount');

            if (!totalEl) return null;

            return {
                totalTasks: parseInt(totalEl.textContent || '0', 10),
                totalCompleted: parseInt(completedEl ? completedEl.textContent || '0' : '0', 10),
                totalPending: parseInt(pendingEl ? pendingEl.textContent || '0' : '0', 10),
                overallProgress: parseInt((progressEl ? progressEl.textContent || '0%' : '0%').replace('%', ''), 10),
                projectCountText: countBadge ? countBadge.textContent : '0 projects'
            };
        }

        /**
         * Checks if the aggregated stats section is visible.
         * @returns {boolean} True if the section is visible
         */
        function isAggregatedStatsVisible() {
            var section = document.getElementById('aggregatedStatsSection');
            return section !== null && section.offsetParent !== null;
        }

        // ====================================================================
        // Pending Task Queue (Drag and Drop)
        // ====================================================================
        
        function renderPendingTasks(tasks) {
             const queueList = document.getElementById('taskQueueList');
             if (!queueList) return;
             
             // Filter for pending tasks
             const pendingTasks = tasks.filter(function(t) { 
                 return t.status === 'PENDING' || t.status === 'BLOCKED' || t.status === 'SKIPPED' || t.status === 'IN_PROGRESS'; 
             });
             
             if (pendingTasks.length <= 1) {
                 const section = document.getElementById('taskQueueSection');
                 if (section) section.style.display = 'none';
                 return;
             } else {
                 const section = document.getElementById('taskQueueSection');
                 if (section) section.style.display = 'block';
             }

             const listItems = pendingTasks.map(function(task) {
                 const dragHandle = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="drag-handle-icon" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>';
                 
                 return '<div class="task-queue-item" draggable="true" data-task-id="' + task.id + '" role="listitem" tabindex="0" aria-label="Task: ' + escapeHtml(task.description).replace(/"/g, '&quot;') + '. Press Enter to start dragging.">' + 
                    '<span class="drag-handle">' + dragHandle + '</span>' + 
                    '<span class="task-queue-text">' + escapeHtml(task.description) + '</span>' + 
                 '</div>';
             }).join('');
             
             queueList.innerHTML = listItems;
             
             // Re-bind DnD events
             setupDnD();
        }

        let dragSrcEl = null;

        function handleDragStart(e) {
            dragSrcEl = this;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', this.getAttribute('data-task-id'));
            this.classList.add('dragging');
            
            // Announce to screen reader
            announceToScreenReader('Started dragging task. Use arrow keys to reorder if supported, or drop on another task.');
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
            return false;
        }

        function handleDragEnter(e) {
            this.classList.add('drag-over');
        }

        function handleDragLeave(e) {
            this.classList.remove('drag-over');
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            this.classList.remove('drag-over');
            
            if (dragSrcEl !== this) {
                // Get all items in the list
                const list = document.getElementById('taskQueueList');
                const items = Array.from(list.children);
                
                const srcIndex = items.indexOf(dragSrcEl);
                const targetIndex = items.indexOf(this);
                
                // Move element in DOM for immediate feedback
                if (srcIndex < targetIndex) {
                    this.after(dragSrcEl);
                } else {
                    this.before(dragSrcEl);
                }
                
                // Get new order of IDs
                const newIds = Array.from(list.children).map(function(el) { return el.getAttribute('data-task-id'); });
                
                // Send to extension
                vscode.postMessage({
                    command: 'reorderTasks',
                    taskIds: newIds
                });
                
                announceToScreenReader('Task dropped. New order saved.');
            }
            return false;
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
            this.classList.remove('drag-over');
            
            const items = document.querySelectorAll('.task-queue-item');
            items.forEach(function(item) {
                item.classList.remove('drag-over');
            });
            dragSrcEl = null;
        }

        function setupDnD() {
            const items = document.querySelectorAll('.task-queue-item');
            items.forEach(function(item) {
                item.removeEventListener('dragstart', handleDragStart);
                item.removeEventListener('dragenter', handleDragEnter);
                item.removeEventListener('dragover', handleDragOver);
                item.removeEventListener('dragleave', handleDragLeave);
                item.removeEventListener('drop', handleDrop);
                item.removeEventListener('dragend', handleDragEnd);
                
                item.addEventListener('dragstart', handleDragStart, false);
                item.addEventListener('dragenter', handleDragEnter, false);
                item.addEventListener('dragover', handleDragOver, false);
                item.addEventListener('dragleave', handleDragLeave, false);
                item.addEventListener('drop', handleDrop, false);
                item.addEventListener('dragend', handleDragEnd, false);
            });
        }

        // ====================================================================
        // Completion History Section
        // ====================================================================

        /**
         * Updates the completion history section with data from the extension.
         * @param {Object} data - The history data
         * @param {Object} data.stats - Overall statistics
         * @param {Array} data.dailySummaries - Array of daily summary objects
         */
        function updateCompletionHistory(data) {
            var section = document.getElementById('completionHistorySection');
            var empty = document.getElementById('completionHistoryEmpty');
            var dataContainer = document.getElementById('completionHistoryData');
            var countBadge = document.getElementById('completionHistoryCount');

            if (!section) {
                return;
            }

            // Update count badge
            if (countBadge && data.stats) {
                var taskCount = data.stats.totalTasks || 0;
                countBadge.textContent = taskCount + ' task' + (taskCount !== 1 ? 's' : '') + ' tracked';
            }

            // Show empty state or data
            if (!data.stats || data.stats.totalTasks === 0) {
                if (empty) empty.style.display = 'flex';
                if (dataContainer) dataContainer.style.display = 'none';
                return;
            }

            if (empty) empty.style.display = 'none';
            if (dataContainer) dataContainer.style.display = 'block';

            // Update stats summary
            var totalTasksEl = document.getElementById('historyTotalTasks');
            var totalDurationEl = document.getElementById('historyTotalDuration');
            var avgDurationEl = document.getElementById('historyAvgDuration');
            var projectsEl = document.getElementById('historyUniqueProjects');

            if (totalTasksEl) {
                totalTasksEl.textContent = data.stats.totalTasks || 0;
            }
            if (totalDurationEl) {
                totalDurationEl.textContent = formatHistoryDuration(data.stats.totalDuration || 0);
            }
            if (avgDurationEl) {
                avgDurationEl.textContent = formatHistoryDuration(data.stats.averageDuration || 0);
            }
            if (projectsEl) {
                projectsEl.textContent = data.stats.uniqueProjects || 0;
            }

            // Update daily list
            var dailyList = document.getElementById('historyDailyList');
            if (dailyList && data.dailySummaries) {
                var html = '';
                
                // Add chart if we have data
                if (data.dailySummaries.length > 0) {
                    html += getHistoryChartHtml(data.dailySummaries);
                }
                
                // Add daily rows
                for (var i = 0; i < data.dailySummaries.length && i < 14; i++) {
                    html += getDailySummaryRowHtml(data.dailySummaries[i]);
                }
                
                dailyList.innerHTML = html;
            }

            // Announce to screen reader
            announceToScreenReader('Completion history updated. ' + (data.stats.totalTasks || 0) + ' tasks tracked.');
        }

        /**
         * Formats a duration in milliseconds to a human-readable string.
         * @param {number} ms - Duration in milliseconds
         * @returns {string} Formatted duration
         */
        function formatHistoryDuration(ms) {
            if (ms < 1000) {
                return '<1s';
            }
            var seconds = Math.floor(ms / 1000);
            if (seconds < 60) {
                return seconds + 's';
            }
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = seconds % 60;
            if (minutes < 60) {
                return remainingSeconds > 0 ? minutes + 'm ' + remainingSeconds + 's' : minutes + 'm';
            }
            var hours = Math.floor(minutes / 60);
            var remainingMinutes = minutes % 60;
            return remainingMinutes > 0 ? hours + 'h ' + remainingMinutes + 'm' : hours + 'h';
        }

        /**
         * Formats a date key (YYYY-MM-DD) to a readable format.
         * @param {string} dateKey - Date in YYYY-MM-DD format
         * @returns {string} Formatted date
         */
        function formatHistoryDate(dateKey) {
            var today = new Date();
            var parts = dateKey.split('-');
            var year = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10) - 1;
            var day = parseInt(parts[2], 10);
            var date = new Date(year, month, day);

            var todayKey = today.getFullYear() + '-' + 
                String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                String(today.getDate()).padStart(2, '0');

            var yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            var yesterdayKey = yesterday.getFullYear() + '-' + 
                String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                String(yesterday.getDate()).padStart(2, '0');

            if (dateKey === todayKey) {
                return 'Today';
            }
            if (dateKey === yesterdayKey) {
                return 'Yesterday';
            }

            var options = { weekday: 'short', month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }

        /**
         * Generates HTML for a daily summary row.
         * @param {Object} summary - Daily summary object
         * @returns {string} HTML string
         */
        function getDailySummaryRowHtml(summary) {
            var formattedDate = formatHistoryDate(summary.date);
            var formattedDuration = formatHistoryDuration(summary.totalDuration);
            var formattedAvg = formatHistoryDuration(summary.averageDuration);
            var projectsText = summary.projects.length > 2 
                ? summary.projects.slice(0, 2).join(', ') + ' +' + (summary.projects.length - 2)
                : summary.projects.join(', ');

            return '<div class="history-daily-row" role="listitem" data-date="' + escapeHtml(summary.date) + '">' +
                '<div class="history-date-col">' +
                    '<span class="history-date-icon" aria-hidden="true">' +
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
                    '</span>' +
                    '<span class="history-date-text">' + escapeHtml(formattedDate) + '</span>' +
                '</div>' +
                '<div class="history-tasks-col">' +
                    '<span class="history-tasks-value">' + summary.tasksCompleted + '</span>' +
                    '<span class="history-tasks-label">task' + (summary.tasksCompleted !== 1 ? 's' : '') + '</span>' +
                '</div>' +
                '<div class="history-duration-col">' +
                    '<span class="history-duration-value">' + escapeHtml(formattedDuration) + '</span>' +
                    '<span class="history-duration-avg" title="Average: ' + escapeHtml(formattedAvg) + ' per task">(avg ' + escapeHtml(formattedAvg) + ')</span>' +
                '</div>' +
                '<div class="history-projects-col" title="' + escapeHtml(summary.projects.join(', ')) + '">' +
                    '<span class="history-projects-icon" aria-hidden="true">' +
                        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>' +
                    '</span>' +
                    '<span class="history-projects-text">' + escapeHtml(projectsText) + '</span>' +
                '</div>' +
            '</div>';
        }

        /**
         * Generates HTML for the history chart.
         * @param {Array} dailySummaries - Array of daily summaries
         * @returns {string} HTML string
         */
        function getHistoryChartHtml(dailySummaries) {
            if (!dailySummaries || dailySummaries.length === 0) {
                return '';
            }

            var maxTasks = Math.max.apply(null, dailySummaries.map(function(s) { return s.tasksCompleted; }));
            maxTasks = Math.max(maxTasks, 1);

            var bars = dailySummaries.slice(0, 14).reverse().map(function(summary) {
                var heightPercent = (summary.tasksCompleted / maxTasks) * 100;
                var formattedDate = formatHistoryDate(summary.date);
                return '<div class="history-chart-bar-container" title="' + escapeHtml(formattedDate) + ': ' + summary.tasksCompleted + ' task(s)">' +
                    '<div class="history-chart-bar" style="height: ' + Math.max(heightPercent, 4) + '%">' +
                        '<span class="history-chart-bar-value">' + summary.tasksCompleted + '</span>' +
                    '</div>' +
                    '<span class="history-chart-bar-label">' + summary.date.substring(5) + '</span>' +
                '</div>';
            }).join('');

            return '<div class="history-chart" role="img" aria-label="Task completion chart for the last 14 days">' +
                '<div class="history-chart-bars">' + bars + '</div>' +
            '</div>';
        }

        /**
         * Gets the current state of the completion history section.
         * @returns {Object} Current state
         */
        function getCompletionHistoryState() {
            var countBadge = document.getElementById('completionHistoryCount');
            var totalTasksEl = document.getElementById('historyTotalTasks');
            var empty = document.getElementById('completionHistoryEmpty');
            
            return {
                isVisible: isCompletionHistoryVisible(),
                isEmpty: empty && empty.style.display !== 'none',
                totalTasks: totalTasksEl ? parseInt(totalTasksEl.textContent, 10) || 0 : 0,
                countText: countBadge ? countBadge.textContent : '0 tasks tracked'
            };
        }

        /**
         * Checks if the completion history section is visible.
         * @returns {boolean} True if visible
         */
        function isCompletionHistoryVisible() {
            var section = document.getElementById('completionHistorySection');
            return section !== null && section.offsetParent !== null;
        }

        // ====================================================================
        // Session Statistics Dashboard
        // ====================================================================

        /**
         * Updates the session statistics dashboard with data from the extension.
         * @param {Object} data - The session stats data
         */
        function updateSessionStats(data) {
            var section = document.getElementById('sessionStatsSection');
            var empty = document.getElementById('sessionStatsEmpty');
            var dataContainer = document.getElementById('sessionStatsData');
            var badge = document.getElementById('sessionStatsBadge');

            if (!section) {
                return;
            }

            // Update badge
            if (badge) {
                if (data.tasksCompleted > 0) {
                    badge.textContent = data.tasksCompleted + ' task' + (data.tasksCompleted !== 1 ? 's' : '');
                    badge.classList.add('active');
                } else {
                    badge.textContent = 'No activity';
                    badge.classList.remove('active');
                }
            }

            // Show empty state or data
            if (!data || data.tasksCompleted === 0) {
                if (empty) empty.style.display = 'flex';
                if (dataContainer) dataContainer.style.display = 'none';
                return;
            }

            if (empty) empty.style.display = 'none';
            if (dataContainer) dataContainer.style.display = 'block';

            // Update session info bar
            var startTimeEl = document.getElementById('sessionStartTime');
            var durationEl = document.getElementById('sessionDuration');
            var projectsEl = document.getElementById('sessionProjects');

            if (startTimeEl && data.sessionStartTime) {
                startTimeEl.textContent = formatSessionTime(data.sessionStartTime);
            }
            if (durationEl && data.sessionStartTime) {
                var sessionDuration = Date.now() - data.sessionStartTime;
                durationEl.textContent = formatSessionDuration(sessionDuration);
            }
            if (projectsEl) {
                projectsEl.textContent = data.projectsWorkedOn || 0;
            }

            // Update stats grid
            var tasksCompletedEl = document.getElementById('sessionTasksCompleted');
            var tasksPerHourEl = document.getElementById('sessionTasksPerHour');
            var totalDurationEl = document.getElementById('sessionTotalDuration');
            var avgDurationEl = document.getElementById('sessionAvgDuration');
            var fastestEl = document.getElementById('sessionFastest');
            var slowestEl = document.getElementById('sessionSlowest');

            if (tasksCompletedEl) {
                tasksCompletedEl.textContent = data.tasksCompleted || 0;
            }
            if (tasksPerHourEl) {
                tasksPerHourEl.textContent = (data.tasksPerHour || 0) + ' tasks/hr';
            }
            if (totalDurationEl) {
                totalDurationEl.textContent = formatSessionDuration(data.totalDuration || 0);
            }
            if (avgDurationEl) {
                avgDurationEl.textContent = 'avg: ' + formatSessionDuration(data.averageDuration || 0);
            }
            if (fastestEl) {
                fastestEl.textContent = data.fastestTask !== null 
                    ? formatSessionDuration(data.fastestTask) 
                    : '--';
            }
            if (slowestEl) {
                slowestEl.textContent = data.slowestTask !== null 
                    ? formatSessionDuration(data.slowestTask) 
                    : '--';
            }

            // Update streak
            var streakEl = document.getElementById('sessionStreak');
            var streakFillEl = document.getElementById('sessionStreakFill');

            if (streakEl) {
                streakEl.textContent = data.currentStreak || 0;
            }
            if (streakFillEl) {
                // Cap streak at 10 for visual representation
                var streakPercent = Math.min((data.currentStreak || 0) / 10, 1) * 100;
                streakFillEl.style.width = streakPercent + '%';
            }

            // Update recent tasks
            var recentListEl = document.getElementById('sessionRecentTasks');
            if (recentListEl && data.completedTasks) {
                if (data.completedTasks.length === 0) {
                    recentListEl.innerHTML = '<div class="session-recent-empty">No tasks completed yet</div>';
                } else {
                    var tasksHtml = data.completedTasks.slice().reverse().map(function(task, index) {
                        return getSessionTaskItemHtml(task, index);
                    }).join('');
                    recentListEl.innerHTML = tasksHtml;
                }
            }

            // Announce to screen reader
            announceToScreenReader('Session dashboard updated. ' + (data.tasksCompleted || 0) + ' tasks completed this session.');
        }

        /**
         * Formats a duration in milliseconds to a compact human-readable string.
         * @param {number} ms - Duration in milliseconds
         * @returns {string} Formatted duration
         */
        function formatSessionDuration(ms) {
            if (ms < 1000) {
                return '< 1s';
            }
            var seconds = Math.floor(ms / 1000);
            if (seconds < 60) {
                return seconds + 's';
            }
            var minutes = Math.floor(seconds / 60);
            var remainingSeconds = seconds % 60;
            if (minutes < 60) {
                return remainingSeconds > 0 ? minutes + 'm ' + remainingSeconds + 's' : minutes + 'm';
            }
            var hours = Math.floor(minutes / 60);
            var remainingMinutes = minutes % 60;
            if (hours < 24) {
                return remainingMinutes > 0 ? hours + 'h ' + remainingMinutes + 'm' : hours + 'h';
            }
            var days = Math.floor(hours / 24);
            var remainingHours = hours % 24;
            return remainingHours > 0 ? days + 'd ' + remainingHours + 'h' : days + 'd';
        }

        /**
         * Formats a timestamp to a readable time string.
         * @param {number} timestamp - Unix timestamp in milliseconds
         * @returns {string} Formatted time
         */
        function formatSessionTime(timestamp) {
            var date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

        /**
         * Generates HTML for a session task item.
         * @param {string} taskDescription - The task description
         * @param {number} index - The task index (0-based)
         * @returns {string} HTML string
         */
        function getSessionTaskItemHtml(taskDescription, index) {
            var truncated = taskDescription.length > 60 
                ? taskDescription.substring(0, 60) + '...' 
                : taskDescription;
            return '<div class="session-task-item" role="listitem">' +
                '<span class="session-task-number">' + (index + 1) + '</span>' +
                '<span class="session-task-text" title="' + escapeHtml(taskDescription) + '">' + escapeHtml(truncated) + '</span>' +
            '</div>';
        }

        /**
         * Gets the current state of the session stats section.
         * @returns {Object} Current state
         */
        function getSessionStatsState() {
            var badge = document.getElementById('sessionStatsBadge');
            var tasksCompletedEl = document.getElementById('sessionTasksCompleted');
            var empty = document.getElementById('sessionStatsEmpty');
            
            return {
                isVisible: isSessionStatsVisible(),
                isEmpty: empty && empty.style.display !== 'none',
                tasksCompleted: tasksCompletedEl ? parseInt(tasksCompletedEl.textContent, 10) || 0 : 0,
                badgeText: badge ? badge.textContent : 'No activity'
            };
        }

        /**
         * Checks if the session stats section is visible.
         * @returns {boolean} True if visible
         */
        function isSessionStatsVisible() {
            var section = document.getElementById('sessionStatsSection');
            return section !== null && section.offsetParent !== null;
        }

        // ====================================================================
        // Productivity Report Section
        // ====================================================================

        /**
         * Currently selected report format.
         * @type {'markdown'|'html'|'json'}
         */
        var selectedReportFormat = 'markdown';

        /**
         * Last generated report data for preview.
         * @type {Object|null}
         */
        var lastReportData = null;

        /**
         * Selects a report format and updates the UI.
         * @param {string} format - The format to select ('markdown', 'html', 'json')
         */
        function selectReportFormat(format) {
            selectedReportFormat = format;
            
            // Update button states
            var buttons = document.querySelectorAll('.report-format-btn');
            buttons.forEach(function(btn) {
                var btnFormat = btn.getAttribute('data-format');
                if (btnFormat === format) {
                    btn.classList.add('selected');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('selected');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });
        }

        /**
         * Gets the currently selected report format.
         * @returns {string} The selected format
         */
        function getSelectedReportFormat() {
            return selectedReportFormat;
        }

        /**
         * Gets the currently selected report period.
         * @returns {string} The selected period
         */
        function getSelectedReportPeriod() {
            var select = document.getElementById('reportPeriodSelect');
            return select ? select.value : 'today';
        }

        /**
         * Generates a productivity report.
         * Sends a message to the extension to generate the report.
         */
        function generateReport() {
            var period = getSelectedReportPeriod();
            var format = getSelectedReportFormat();
            
            // Show loading state
            var btn = document.getElementById('btnGenerateReport');
            if (btn) {
                btn.classList.add('loading');
                btn.disabled = true;
            }
            
            // Hide empty state and show preview area
            var empty = document.getElementById('reportEmpty');
            if (empty) {
                empty.style.display = 'none';
            }
            
            // Send message to extension
            vscode.postMessage({
                command: 'generateReport',
                period: period,
                format: format
            });
            
            announceToScreenReader('Generating ' + period + ' productivity report...');
        }

        /**
         * Updates the report preview with generated data.
         * @param {Object} reportData - The report data from the extension
         */
        function updateReportPreview(reportData) {
            lastReportData = reportData;
            
            // Hide loading state
            var btn = document.getElementById('btnGenerateReport');
            if (btn) {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
            
            var previewContainer = document.getElementById('reportPreview');
            var previewContent = document.getElementById('reportPreviewContent');
            var emptyState = document.getElementById('reportEmpty');
            
            if (!reportData || reportData.totalTasks === 0) {
                // Show empty state if no data
                if (previewContainer) {
                    previewContainer.style.display = 'none';
                }
                if (emptyState) {
                    emptyState.style.display = 'flex';
                    emptyState.querySelector('.report-empty-text').textContent = 'No tasks completed in this period';
                }
                announceToScreenReader('No tasks completed in the selected period.');
                return;
            }
            
            // Hide empty state
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Generate preview HTML
            if (previewContainer && previewContent) {
                previewContainer.style.display = 'block';
                previewContent.innerHTML = getReportPreviewHtml(reportData);
            }
            
            announceToScreenReader('Report generated. ' + reportData.totalTasks + ' tasks completed in ' + formatSessionDuration(reportData.totalDuration) + '.');
        }

        /**
         * Generates HTML for the report preview.
         * @param {Object} report - The report data
         * @returns {string} HTML string
         */
        function getReportPreviewHtml(report) {
            var trendIcon = getTrendIcon(report.trends.trendDirection);
            var trendClass = 'trend-' + report.trends.trendDirection;
            var trendLabel = report.trends.trendDirection === 'up' ? 'Increase' 
                : report.trends.trendDirection === 'down' ? 'Decrease' : 'Stable';
            
            var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var mostProductiveDayName = report.trends.mostProductiveDay !== null 
                ? dayNames[report.trends.mostProductiveDay] 
                : '--';
            
            var mostProductiveHourStr = report.trends.mostProductiveHour !== null
                ? formatHourDisplay(report.trends.mostProductiveHour)
                : '--';
            
            var projectRows = (report.projectBreakdown || []).slice(0, 5).map(function(p) {
                return '<div class="preview-project-row">' +
                    '<span class="preview-project-name">' + escapeHtml(p.name) + '</span>' +
                    '<span class="preview-project-tasks">' + p.tasksCompleted + ' tasks</span>' +
                    '<div class="preview-project-bar">' +
                        '<div class="preview-project-fill" style="width: ' + p.taskPercentage + '%"></div>' +
                    '</div>' +
                    '<span class="preview-project-percent">' + p.taskPercentage + '%</span>' +
                '</div>';
            }).join('');
            
            var projectsSection = report.projectBreakdown && report.projectBreakdown.length > 0 
                ? '<div class="preview-projects">' +
                    '<h4 class="preview-subheading">Project Breakdown</h4>' +
                    '<div class="preview-project-list">' + projectRows + '</div>' +
                  '</div>'
                : '';
            
            return '<div class="preview-summary">' +
                '<h3 class="preview-heading">' + escapeHtml(report.title) + '</h3>' +
                '<div class="preview-stats-grid">' +
                    '<div class="preview-stat">' +
                        '<span class="preview-stat-value">' + report.totalTasks + '</span>' +
                        '<span class="preview-stat-label">Tasks Completed</span>' +
                    '</div>' +
                    '<div class="preview-stat">' +
                        '<span class="preview-stat-value">' + formatSessionDuration(report.totalDuration) + '</span>' +
                        '<span class="preview-stat-label">Total Time</span>' +
                    '</div>' +
                    '<div class="preview-stat">' +
                        '<span class="preview-stat-value">' + report.sessions + '</span>' +
                        '<span class="preview-stat-label">Sessions</span>' +
                    '</div>' +
                    '<div class="preview-stat">' +
                        '<span class="preview-stat-value">' + report.projects + '</span>' +
                        '<span class="preview-stat-label">Projects</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="preview-trends">' +
                '<h4 class="preview-subheading">Trends & Insights</h4>' +
                '<div class="preview-trend-grid">' +
                    '<div class="preview-trend-item">' +
                        '<span class="trend-icon ' + trendClass + '" aria-hidden="true">' + trendIcon + '</span>' +
                        '<span class="trend-value">' + report.trends.trendPercentage + '%</span>' +
                        '<span class="trend-label">' + trendLabel + '</span>' +
                    '</div>' +
                    '<div class="preview-trend-item">' +
                        '<span class="trend-icon" aria-hidden="true">' + getChartIcon() + '</span>' +
                        '<span class="trend-value">' + report.trends.avgTasksPerDay + '</span>' +
                        '<span class="trend-label">Tasks/Day</span>' +
                    '</div>' +
                    '<div class="preview-trend-item">' +
                        '<span class="trend-icon" aria-hidden="true">' + getFireIcon() + '</span>' +
                        '<span class="trend-value">' + report.trends.currentStreak + '</span>' +
                        '<span class="trend-label">Current Streak</span>' +
                    '</div>' +
                    '<div class="preview-trend-item">' +
                        '<span class="trend-icon" aria-hidden="true">' + getCalendarIcon() + '</span>' +
                        '<span class="trend-value">' + mostProductiveDayName + '</span>' +
                        '<span class="trend-label">Best Day</span>' +
                    '</div>' +
                    '<div class="preview-trend-item">' +
                        '<span class="trend-icon" aria-hidden="true">' + getClockIcon() + '</span>' +
                        '<span class="trend-value">' + mostProductiveHourStr + '</span>' +
                        '<span class="trend-label">Peak Hour</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            projectsSection;
        }

        /**
         * Gets the trend icon based on direction.
         * @param {string} direction - 'up', 'down', or 'stable'
         * @returns {string} SVG icon HTML
         */
        function getTrendIcon(direction) {
            if (direction === 'up') {
                return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>';
            } else if (direction === 'down') {
                return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>';
            }
            return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
        }

        /**
         * Gets the chart icon SVG.
         * @returns {string} SVG icon HTML
         */
        function getChartIcon() {
            return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
        }

        /**
         * Gets the fire icon SVG.
         * @returns {string} SVG icon HTML
         */
        function getFireIcon() {
            return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c4-2 8-7 8-12 0-3-3-5-5-6-1-0.5-3 1-3 3s2 3 2 5c0 3-4 4-4 4s-4-1-4-4c0-2 2-3 2-5s-2-3.5-3-3c-2 1-5 3-5 6 0 5 4 10 8 12z"/></svg>';
        }

        /**
         * Gets the calendar icon SVG.
         * @returns {string} SVG icon HTML
         */
        function getCalendarIcon() {
            return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
        }

        /**
         * Gets the clock icon SVG.
         * @returns {string} SVG icon HTML
         */
        function getClockIcon() {
            return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
        }

        /**
         * Formats an hour (0-23) to a readable string.
         * @param {number} hour - Hour (0-23)
         * @returns {string} Formatted hour
         */
        function formatHourDisplay(hour) {
            if (hour === 0) return '12 AM';
            if (hour === 12) return '12 PM';
            if (hour < 12) return hour + ' AM';
            return (hour - 12) + ' PM';
        }

        /**
         * Closes the report preview.
         */
        function closeReportPreview() {
            var previewContainer = document.getElementById('reportPreview');
            var emptyState = document.getElementById('reportEmpty');
            
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
            
            // Show default empty state
            if (emptyState) {
                emptyState.style.display = 'flex';
                emptyState.querySelector('.report-empty-text').textContent = 'No reports generated yet';
            }
            
            lastReportData = null;
        }

        /**
         * Gets the last generated report data.
         * @returns {Object|null} The last report data
         */
        function getLastReportData() {
            return lastReportData;
        }

        /**
         * Checks if the report section is visible.
         * @returns {boolean} True if visible
         */
        function isReportSectionVisible() {
            var section = document.getElementById('productivityReportSection');
            return section !== null && section.offsetParent !== null;
        }

        /**
         * Sets up event listeners for report format buttons.
         */
        function setupReportFormatButtons() {
            var buttons = document.querySelectorAll('.report-format-btn');
            buttons.forEach(function(btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var format = this.getAttribute('data-format');
                    if (format) {
                        selectReportFormat(format);
                    }
                });
            });
            
            // Select default format (first button)
            if (buttons.length > 0) {
                selectReportFormat('markdown');
            }
        }

        /**
         * Handles report generation complete message from extension.
         * @param {Object} data - Message data with report and optional exported file info
         */
        function handleReportComplete(data) {
            if (data.report) {
                updateReportPreview(data.report);
            }
            
            if (data.exported) {
                showSuccessToast('Report exported to ' + data.format.toUpperCase());
            }
        }

        /**
         * Handles report generation error.
         * @param {string} errorMessage - The error message
         */
        function handleReportError(errorMessage) {
            // Hide loading state
            var btn = document.getElementById('btnGenerateReport');
            if (btn) {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
            
            showErrorToast('Failed to generate report: ' + errorMessage);
            announceToScreenReader('Error generating report. ' + errorMessage);
        }
        
        // Initial setup on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setupDnD();
                setupReportFormatButtons();
            });
        } else {
            setupDnD();
            setupReportFormatButtons();
        }

    `;
}
