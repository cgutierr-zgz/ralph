/**
 * Null Safety Utilities
 * 
 * This module provides comprehensive utilities for strict null checking
 * of optional properties. It includes:
 * 
 * - Type guards for checking if values are defined/non-null
 * - Assertion functions that throw on null/undefined
 * - Safe accessor functions with default values
 * - Utility types for type transformations
 * 
 * These utilities ensure type-safe access to optional properties throughout
 * the codebase, preventing runtime null/undefined errors.
 */

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Removes null and undefined from a type.
 * Equivalent to NonNullable<T> but with a more descriptive name.
 */
export type Defined<T> = T extends null | undefined ? never : T;

/**
 * Makes all properties of T required and non-nullable.
 * Useful for ensuring complete objects when all properties must be present.
 */
export type RequiredNonNullable<T> = {
    [K in keyof T]-?: NonNullable<T[K]>;
};

/**
 * Extracts keys from T where the value type includes undefined.
 */
export type OptionalKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Extracts keys from T where the value type does not include undefined.
 */
export type RequiredKeys<T> = {
    [K in keyof T]: undefined extends T[K] ? never : K;
}[keyof T];

/**
 * Type for a value that may be null or undefined.
 */
export type Nullable<T> = T | null | undefined;

/**
 * Result type for safe operations that may fail.
 */
export type SafeResult<T> = 
    | { success: true; value: T }
    | { success: false; error: string };

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard that checks if a value is defined (not null or undefined).
 * 
 * @param value - The value to check
 * @returns True if the value is defined
 * 
 * @example
 * ```typescript
 * const task: Task | undefined = getTask();
 * if (isDefined(task)) {
 *     // TypeScript knows task is Task here
 *     console.log(task.description);
 * }
 * ```
 */
export function isDefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
}

/**
 * Type guard that checks if a value is null or undefined.
 * 
 * @param value - The value to check
 * @returns True if the value is null or undefined
 */
export function isNullish<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined;
}

/**
 * Type guard that checks if a value is null.
 * 
 * @param value - The value to check
 * @returns True if the value is null
 */
export function isNull<T>(value: T | null): value is null {
    return value === null;
}

/**
 * Type guard that checks if a value is undefined.
 * 
 * @param value - The value to check
 * @returns True if the value is undefined
 */
export function isUndefined<T>(value: T | undefined): value is undefined {
    return value === undefined;
}

/**
 * Type guard that checks if a value is a non-empty string.
 * 
 * @param value - The value to check
 * @returns True if the value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard that checks if a value is a non-empty array.
 * 
 * @param value - The value to check
 * @returns True if the value is a non-empty array
 */
export function isNonEmptyArray<T>(value: T[] | null | undefined): value is [T, ...T[]] {
    return Array.isArray(value) && value.length > 0;
}

/**
 * Type guard that checks if an object has a property defined.
 * 
 * @param obj - The object to check
 * @param key - The property key to check
 * @returns True if the property is defined (not null or undefined)
 * 
 * @example
 * ```typescript
 * const task = { description: "Test", dependencies: undefined };
 * if (hasDefinedProperty(task, 'dependencies')) {
 *     // TypeScript knows task.dependencies is string[] here
 * }
 * ```
 */
export function hasDefinedProperty<T extends object, K extends keyof T>(
    obj: T,
    key: K
): obj is T & { [P in K]-?: NonNullable<T[P]> } {
    return obj[key] !== null && obj[key] !== undefined;
}

/**
 * Type guard that checks if all specified properties of an object are defined.
 * 
 * @param obj - The object to check
 * @param keys - The property keys to check
 * @returns True if all properties are defined
 */
export function hasAllDefinedProperties<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): obj is T & { [P in K]-?: NonNullable<T[P]> } {
    return keys.every(key => obj[key] !== null && obj[key] !== undefined);
}

// ============================================================================
// ASSERTION FUNCTIONS
// ============================================================================

/**
 * Error class for assertion failures.
 */
export class AssertionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AssertionError';
    }
}

/**
 * Asserts that a value is defined (not null or undefined).
 * Throws an AssertionError if the value is null or undefined.
 * 
 * @param value - The value to assert
 * @param message - Optional error message
 * @throws AssertionError if value is null or undefined
 * 
 * @example
 * ```typescript
 * const task: Task | undefined = getTask();
 * assertDefined(task, 'Task must be defined');
 * // TypeScript knows task is Task here
 * console.log(task.description);
 * ```
 */
export function assertDefined<T>(
    value: T | null | undefined,
    message?: string
): asserts value is T {
    if (value === null || value === undefined) {
        throw new AssertionError(message ?? 'Value must be defined (not null or undefined)');
    }
}

/**
 * Asserts that a value is not null.
 * Throws an AssertionError if the value is null.
 * 
 * @param value - The value to assert
 * @param message - Optional error message
 * @throws AssertionError if value is null
 */
export function assertNotNull<T>(
    value: T | null,
    message?: string
): asserts value is T {
    if (value === null) {
        throw new AssertionError(message ?? 'Value must not be null');
    }
}

/**
 * Asserts that a value is not undefined.
 * Throws an AssertionError if the value is undefined.
 * 
 * @param value - The value to assert
 * @param message - Optional error message
 * @throws AssertionError if value is undefined
 */
export function assertNotUndefined<T>(
    value: T | undefined,
    message?: string
): asserts value is T {
    if (value === undefined) {
        throw new AssertionError(message ?? 'Value must not be undefined');
    }
}

/**
 * Asserts that a string is non-empty.
 * Throws an AssertionError if the string is empty or whitespace-only.
 * 
 * @param value - The string to assert
 * @param message - Optional error message
 * @throws AssertionError if string is empty or whitespace-only
 */
export function assertNonEmptyString(
    value: unknown,
    message?: string
): asserts value is string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new AssertionError(message ?? 'Value must be a non-empty string');
    }
}

/**
 * Asserts that an array is non-empty.
 * Throws an AssertionError if the array is empty.
 * 
 * @param value - The array to assert
 * @param message - Optional error message
 * @throws AssertionError if array is empty
 */
export function assertNonEmptyArray<T>(
    value: T[] | null | undefined,
    message?: string
): asserts value is [T, ...T[]] {
    if (!Array.isArray(value) || value.length === 0) {
        throw new AssertionError(message ?? 'Value must be a non-empty array');
    }
}

/**
 * Asserts that an object has a defined property.
 * Throws an AssertionError if the property is null or undefined.
 * 
 * @param obj - The object to check
 * @param key - The property key to check
 * @param message - Optional error message
 * @throws AssertionError if property is null or undefined
 */
export function assertHasProperty<T extends object, K extends keyof T>(
    obj: T,
    key: K,
    message?: string
): asserts obj is T & { [P in K]-?: NonNullable<T[P]> } {
    if (obj[key] === null || obj[key] === undefined) {
        throw new AssertionError(message ?? `Property '${String(key)}' must be defined`);
    }
}

// ============================================================================
// SAFE ACCESSOR FUNCTIONS
// ============================================================================

/**
 * Returns the value if defined, otherwise returns the default value.
 * 
 * @param value - The value to check
 * @param defaultValue - The default value to return if value is null/undefined
 * @returns The value or default value
 * 
 * @example
 * ```typescript
 * const task = { description: "Test", dependencies: undefined };
 * const deps = valueOrDefault(task.dependencies, []);
 * // deps is guaranteed to be string[]
 * ```
 */
export function valueOrDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value ?? defaultValue;
}

/**
 * Returns the value if defined, otherwise returns the result of the factory function.
 * Useful when the default value is expensive to compute.
 * 
 * @param value - The value to check
 * @param factory - Factory function to create the default value
 * @returns The value or result of factory function
 */
export function valueOrFactory<T>(value: T | null | undefined, factory: () => T): T {
    return value ?? factory();
}

/**
 * Returns the property value if defined, otherwise returns the default value.
 * 
 * @param obj - The object to access
 * @param key - The property key
 * @param defaultValue - The default value
 * @returns The property value or default value
 * 
 * @example
 * ```typescript
 * const task = { description: "Test", dependencies: undefined };
 * const deps = getPropertyOrDefault(task, 'dependencies', []);
 * ```
 */
export function getPropertyOrDefault<T extends object, K extends keyof T>(
    obj: T,
    key: K,
    defaultValue: NonNullable<T[K]>
): NonNullable<T[K]> {
    const value = obj[key];
    return (value ?? defaultValue) as NonNullable<T[K]>;
}

/**
 * Safely accesses a nested property path and returns undefined if any part is null/undefined.
 * 
 * @param obj - The object to access
 * @param accessor - Function that accesses the nested property
 * @returns The value or undefined
 * 
 * @example
 * ```typescript
 * const result = safeAccess(obj, o => o.a?.b?.c);
 * ```
 */
export function safeAccess<T, R>(obj: T | null | undefined, accessor: (obj: T) => R): R | undefined {
    if (obj === null || obj === undefined) {
        return undefined;
    }
    try {
        return accessor(obj);
    } catch {
        return undefined;
    }
}

/**
 * Maps over an array that may be null or undefined.
 * Returns an empty array if the input is null/undefined.
 * 
 * @param array - The array to map over
 * @param mapper - The mapping function
 * @returns Mapped array or empty array
 * 
 * @example
 * ```typescript
 * const task = { dependencies: undefined };
 * const depNames = mapOrEmpty(task.dependencies, d => d.toUpperCase());
 * // depNames is string[] (empty in this case)
 * ```
 */
export function mapOrEmpty<T, R>(
    array: T[] | null | undefined,
    mapper: (item: T, index: number) => R
): R[] {
    if (!array) {
        return [];
    }
    return array.map(mapper);
}

/**
 * Filters an array that may be null or undefined.
 * Returns an empty array if the input is null/undefined.
 * 
 * @param array - The array to filter
 * @param predicate - The filter predicate
 * @returns Filtered array or empty array
 */
export function filterOrEmpty<T>(
    array: T[] | null | undefined,
    predicate: (item: T, index: number) => boolean
): T[] {
    if (!array) {
        return [];
    }
    return array.filter(predicate);
}

/**
 * Gets the first element of an array that may be null or undefined.
 * Returns undefined if the array is null/undefined or empty.
 * 
 * @param array - The array to access
 * @returns The first element or undefined
 */
export function firstOrUndefined<T>(array: T[] | null | undefined): T | undefined {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[0];
}

/**
 * Gets the last element of an array that may be null or undefined.
 * Returns undefined if the array is null/undefined or empty.
 * 
 * @param array - The array to access
 * @returns The last element or undefined
 */
export function lastOrUndefined<T>(array: T[] | null | undefined): T | undefined {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[array.length - 1];
}

/**
 * Finds an element in an array that may be null or undefined.
 * Returns undefined if the array is null/undefined or element not found.
 * 
 * @param array - The array to search
 * @param predicate - The search predicate
 * @returns The found element or undefined
 */
export function findOrUndefined<T>(
    array: T[] | null | undefined,
    predicate: (item: T, index: number) => boolean
): T | undefined {
    if (!array) {
        return undefined;
    }
    return array.find(predicate);
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Creates a new object with all null/undefined values removed.
 * 
 * @param obj - The object to compact
 * @returns A new object with only defined values
 * 
 * @example
 * ```typescript
 * const obj = { a: 1, b: undefined, c: null, d: 'test' };
 * const compact = compactObject(obj);
 * // compact = { a: 1, d: 'test' }
 * ```
 */
export function compactObject<T extends object>(obj: T): Partial<T> {
    const result: Partial<T> = {};
    for (const key of Object.keys(obj) as (keyof T)[]) {
        if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}

/**
 * Merges two objects, using values from the second object to fill in null/undefined values in the first.
 * 
 * @param target - The target object
 * @param defaults - The defaults object
 * @returns A new merged object
 */
export function mergeWithDefaults<T extends object>(target: Partial<T>, defaults: T): T {
    const result = { ...defaults };
    for (const key of Object.keys(target) as (keyof T)[]) {
        if (target[key] !== null && target[key] !== undefined) {
            result[key] = target[key] as T[keyof T];
        }
    }
    return result;
}

/**
 * Picks defined properties from an object.
 * 
 * @param obj - The source object
 * @param keys - Keys to pick
 * @returns New object with only the specified keys that have defined values
 */
export function pickDefined<T extends object, K extends keyof T>(
    obj: T,
    keys: K[]
): Partial<Pick<T, K>> {
    const result: Partial<Pick<T, K>> = {};
    for (const key of keys) {
        if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}

// ============================================================================
// TYPE-SPECIFIC UTILITIES
// ============================================================================

/**
 * Returns the string if non-empty, otherwise returns the default.
 * 
 * @param value - The string value
 * @param defaultValue - The default value
 * @returns The string or default
 */
export function stringOrDefault(value: string | null | undefined, defaultValue: string): string {
    if (typeof value === 'string' && value.trim().length > 0) {
        return value;
    }
    return defaultValue;
}

/**
 * Returns the number if finite, otherwise returns the default.
 * 
 * @param value - The number value
 * @param defaultValue - The default value
 * @returns The number or default
 */
export function numberOrDefault(value: number | null | undefined, defaultValue: number): number {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }
    return defaultValue;
}

/**
 * Returns the boolean value, with explicit handling of undefined/null.
 * 
 * @param value - The boolean value
 * @param defaultValue - The default value
 * @returns The boolean or default
 */
export function booleanOrDefault(value: boolean | null | undefined, defaultValue: boolean): boolean {
    if (typeof value === 'boolean') {
        return value;
    }
    return defaultValue;
}

/**
 * Returns the array if non-empty, otherwise returns the default.
 * 
 * @param value - The array value
 * @param defaultValue - The default value
 * @returns The array or default
 */
export function arrayOrDefault<T>(value: T[] | null | undefined, defaultValue: T[]): T[] {
    if (Array.isArray(value) && value.length > 0) {
        return value;
    }
    return defaultValue;
}

// ============================================================================
// COALESCE UTILITIES
// ============================================================================

/**
 * Returns the first defined value from a list of values.
 * Similar to ?? but works with multiple values.
 * 
 * @param values - Values to coalesce
 * @returns The first defined value or undefined
 * 
 * @example
 * ```typescript
 * const value = coalesce(undefined, null, 'default');
 * // value = 'default'
 * ```
 */
export function coalesce<T>(...values: (T | null | undefined)[]): T | undefined {
    for (const value of values) {
        if (value !== null && value !== undefined) {
            return value;
        }
    }
    return undefined;
}

/**
 * Returns the first defined value from a list of values, with a required fallback.
 * 
 * @param fallback - The fallback value (required)
 * @param values - Values to coalesce
 * @returns The first defined value or the fallback
 */
export function coalesceWithFallback<T>(fallback: T, ...values: (T | null | undefined)[]): T {
    for (const value of values) {
        if (value !== null && value !== undefined) {
            return value;
        }
    }
    return fallback;
}

// ============================================================================
// SAFE EXECUTION UTILITIES
// ============================================================================

/**
 * Executes a function and returns a SafeResult.
 * Catches any errors and returns them in the result.
 * 
 * @param fn - The function to execute
 * @returns A SafeResult with either the value or an error message
 */
export function safeExecute<T>(fn: () => T): SafeResult<T> {
    try {
        return { success: true, value: fn() };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, error: message };
    }
}

/**
 * Executes an async function and returns a Promise<SafeResult>.
 * Catches any errors and returns them in the result.
 * 
 * @param fn - The async function to execute
 * @returns A Promise resolving to a SafeResult
 */
export async function safeExecuteAsync<T>(fn: () => Promise<T>): Promise<SafeResult<T>> {
    try {
        const value = await fn();
        return { success: true, value };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { success: false, error: message };
    }
}

/**
 * Wraps a function to return undefined instead of throwing.
 * 
 * @param fn - The function to wrap
 * @returns A wrapped function that returns undefined on error
 */
export function catchToUndefined<T, Args extends unknown[]>(
    fn: (...args: Args) => T
): (...args: Args) => T | undefined {
    return (...args: Args): T | undefined => {
        try {
            return fn(...args);
        } catch {
            return undefined;
        }
    };
}
