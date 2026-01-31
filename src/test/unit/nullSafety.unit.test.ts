/**
 * Unit tests for nullSafety.ts - Strict null check utilities
 */

import * as assert from 'assert';
import {
    // Type guards
    isDefined,
    isNullish,
    isNull,
    isUndefined,
    isNonEmptyString,
    isNonEmptyArray,
    hasDefinedProperty,
    hasAllDefinedProperties,
    // Assertions
    AssertionError,
    assertDefined,
    assertNotNull,
    assertNotUndefined,
    assertNonEmptyString,
    assertNonEmptyArray,
    assertHasProperty,
    // Safe accessors
    valueOrDefault,
    valueOrFactory,
    getPropertyOrDefault,
    safeAccess,
    mapOrEmpty,
    filterOrEmpty,
    firstOrUndefined,
    lastOrUndefined,
    findOrUndefined,
    // Object utilities
    compactObject,
    mergeWithDefaults,
    pickDefined,
    // Type-specific utilities
    stringOrDefault,
    numberOrDefault,
    booleanOrDefault,
    arrayOrDefault,
    // Coalesce utilities
    coalesce,
    coalesceWithFallback,
    // Safe execution utilities
    safeExecute,
    safeExecuteAsync,
    catchToUndefined
} from '../../nullSafety';

describe('nullSafety Tests', () => {
    // ========================================================================
    // TYPE GUARDS
    // ========================================================================
    
    describe('isDefined', () => {
        it('returns true for defined values', () => {
            assert.strictEqual(isDefined('hello'), true);
            assert.strictEqual(isDefined(0), true);
            assert.strictEqual(isDefined(false), true);
            assert.strictEqual(isDefined([]), true);
            assert.strictEqual(isDefined({}), true);
            assert.strictEqual(isDefined(''), true);
        });

        it('returns false for null', () => {
            assert.strictEqual(isDefined(null), false);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isDefined(undefined), false);
        });

        it('narrows type correctly', () => {
            const value: string | undefined = 'test';
            if (isDefined(value)) {
                // TypeScript should know value is string here
                assert.strictEqual(value.length, 4);
            }
        });
    });

    describe('isNullish', () => {
        it('returns true for null', () => {
            assert.strictEqual(isNullish(null), true);
        });

        it('returns true for undefined', () => {
            assert.strictEqual(isNullish(undefined), true);
        });

        it('returns false for defined values', () => {
            assert.strictEqual(isNullish('hello'), false);
            assert.strictEqual(isNullish(0), false);
            assert.strictEqual(isNullish(false), false);
            assert.strictEqual(isNullish(''), false);
        });
    });

    describe('isNull', () => {
        it('returns true for null', () => {
            assert.strictEqual(isNull(null), true);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isNull(undefined as unknown as null), false);
        });

        it('returns false for defined values', () => {
            assert.strictEqual(isNull('hello' as unknown as null), false);
        });
    });

    describe('isUndefined', () => {
        it('returns true for undefined', () => {
            assert.strictEqual(isUndefined(undefined), true);
        });

        it('returns false for null', () => {
            assert.strictEqual(isUndefined(null as unknown as undefined), false);
        });

        it('returns false for defined values', () => {
            assert.strictEqual(isUndefined('hello' as unknown as undefined), false);
        });
    });

    describe('isNonEmptyString', () => {
        it('returns true for non-empty strings', () => {
            assert.strictEqual(isNonEmptyString('hello'), true);
            assert.strictEqual(isNonEmptyString('a'), true);
            assert.strictEqual(isNonEmptyString('  a  '), true);
        });

        it('returns false for empty string', () => {
            assert.strictEqual(isNonEmptyString(''), false);
        });

        it('returns false for whitespace-only string', () => {
            assert.strictEqual(isNonEmptyString('   '), false);
            assert.strictEqual(isNonEmptyString('\t\n'), false);
        });

        it('returns false for non-string values', () => {
            assert.strictEqual(isNonEmptyString(null), false);
            assert.strictEqual(isNonEmptyString(undefined), false);
            assert.strictEqual(isNonEmptyString(123), false);
            assert.strictEqual(isNonEmptyString({}), false);
        });
    });

    describe('isNonEmptyArray', () => {
        it('returns true for non-empty arrays', () => {
            assert.strictEqual(isNonEmptyArray([1]), true);
            assert.strictEqual(isNonEmptyArray([1, 2, 3]), true);
            assert.strictEqual(isNonEmptyArray(['a', 'b']), true);
        });

        it('returns false for empty array', () => {
            assert.strictEqual(isNonEmptyArray([]), false);
        });

        it('returns false for null', () => {
            assert.strictEqual(isNonEmptyArray(null), false);
        });

        it('returns false for undefined', () => {
            assert.strictEqual(isNonEmptyArray(undefined), false);
        });
    });

    describe('hasDefinedProperty', () => {
        it('returns true when property is defined', () => {
            const obj = { a: 'value', b: 123 };
            assert.strictEqual(hasDefinedProperty(obj, 'a'), true);
            assert.strictEqual(hasDefinedProperty(obj, 'b'), true);
        });

        it('returns false when property is undefined', () => {
            const obj = { a: undefined, b: 'value' };
            assert.strictEqual(hasDefinedProperty(obj, 'a'), false);
        });

        it('returns false when property is null', () => {
            const obj = { a: null, b: 'value' };
            assert.strictEqual(hasDefinedProperty(obj, 'a'), false);
        });

        it('narrows type correctly', () => {
            const obj: { a?: string; b: number } = { a: 'test', b: 1 };
            if (hasDefinedProperty(obj, 'a')) {
                // TypeScript should know obj.a is string here
                assert.strictEqual(obj.a.length, 4);
            }
        });
    });

    describe('hasAllDefinedProperties', () => {
        it('returns true when all properties are defined', () => {
            const obj = { a: 'value', b: 123, c: true };
            assert.strictEqual(hasAllDefinedProperties(obj, ['a', 'b', 'c']), true);
        });

        it('returns false when any property is undefined', () => {
            const obj = { a: 'value', b: undefined, c: true };
            assert.strictEqual(hasAllDefinedProperties(obj, ['a', 'b', 'c']), false);
        });

        it('returns false when any property is null', () => {
            const obj = { a: null, b: 123, c: true };
            assert.strictEqual(hasAllDefinedProperties(obj, ['a', 'b', 'c']), false);
        });

        it('returns true for empty keys array', () => {
            const obj = { a: undefined };
            assert.strictEqual(hasAllDefinedProperties(obj, []), true);
        });
    });

    // ========================================================================
    // ASSERTION FUNCTIONS
    // ========================================================================

    describe('AssertionError', () => {
        it('is an Error instance', () => {
            const error = new AssertionError('test');
            assert.ok(error instanceof Error);
        });

        it('has correct name', () => {
            const error = new AssertionError('test');
            assert.strictEqual(error.name, 'AssertionError');
        });

        it('has correct message', () => {
            const error = new AssertionError('custom message');
            assert.strictEqual(error.message, 'custom message');
        });
    });

    describe('assertDefined', () => {
        it('does not throw for defined values', () => {
            assert.doesNotThrow(() => assertDefined('hello'));
            assert.doesNotThrow(() => assertDefined(0));
            assert.doesNotThrow(() => assertDefined(false));
            assert.doesNotThrow(() => assertDefined(''));
        });

        it('throws for null', () => {
            assert.throws(() => assertDefined(null), AssertionError);
        });

        it('throws for undefined', () => {
            assert.throws(() => assertDefined(undefined), AssertionError);
        });

        it('uses custom message when provided', () => {
            try {
                assertDefined(null, 'Custom error message');
                assert.fail('Should have thrown');
            } catch (e) {
                assert.ok(e instanceof AssertionError);
                assert.strictEqual(e.message, 'Custom error message');
            }
        });

        it('uses default message when not provided', () => {
            try {
                assertDefined(null);
                assert.fail('Should have thrown');
            } catch (e) {
                assert.ok(e instanceof AssertionError);
                assert.ok(e.message.includes('defined'));
            }
        });
    });

    describe('assertNotNull', () => {
        it('does not throw for non-null values', () => {
            assert.doesNotThrow(() => assertNotNull('hello'));
            assert.doesNotThrow(() => assertNotNull(undefined)); // Only checks null
        });

        it('throws for null', () => {
            assert.throws(() => assertNotNull(null), AssertionError);
        });
    });

    describe('assertNotUndefined', () => {
        it('does not throw for non-undefined values', () => {
            assert.doesNotThrow(() => assertNotUndefined('hello'));
            assert.doesNotThrow(() => assertNotUndefined(null)); // Only checks undefined
        });

        it('throws for undefined', () => {
            assert.throws(() => assertNotUndefined(undefined), AssertionError);
        });
    });

    describe('assertNonEmptyString', () => {
        it('does not throw for non-empty strings', () => {
            assert.doesNotThrow(() => assertNonEmptyString('hello'));
            assert.doesNotThrow(() => assertNonEmptyString('a'));
        });

        it('throws for empty string', () => {
            assert.throws(() => assertNonEmptyString(''), AssertionError);
        });

        it('throws for whitespace-only string', () => {
            assert.throws(() => assertNonEmptyString('   '), AssertionError);
        });

        it('throws for non-string values', () => {
            assert.throws(() => assertNonEmptyString(null), AssertionError);
            assert.throws(() => assertNonEmptyString(123), AssertionError);
        });
    });

    describe('assertNonEmptyArray', () => {
        it('does not throw for non-empty arrays', () => {
            assert.doesNotThrow(() => assertNonEmptyArray([1]));
            assert.doesNotThrow(() => assertNonEmptyArray([1, 2, 3]));
        });

        it('throws for empty array', () => {
            assert.throws(() => assertNonEmptyArray([]), AssertionError);
        });

        it('throws for null', () => {
            assert.throws(() => assertNonEmptyArray(null), AssertionError);
        });

        it('throws for undefined', () => {
            assert.throws(() => assertNonEmptyArray(undefined), AssertionError);
        });
    });

    describe('assertHasProperty', () => {
        it('does not throw when property is defined', () => {
            const obj = { a: 'value' };
            assert.doesNotThrow(() => assertHasProperty(obj, 'a'));
        });

        it('throws when property is undefined', () => {
            const obj = { a: undefined };
            assert.throws(() => assertHasProperty(obj, 'a'), AssertionError);
        });

        it('throws when property is null', () => {
            const obj = { a: null };
            assert.throws(() => assertHasProperty(obj, 'a'), AssertionError);
        });

        it('includes property name in error message', () => {
            const obj = { myProp: undefined };
            try {
                assertHasProperty(obj, 'myProp');
                assert.fail('Should have thrown');
            } catch (e) {
                assert.ok(e instanceof AssertionError);
                assert.ok(e.message.includes('myProp'));
            }
        });
    });

    // ========================================================================
    // SAFE ACCESSOR FUNCTIONS
    // ========================================================================

    describe('valueOrDefault', () => {
        it('returns value when defined', () => {
            assert.strictEqual(valueOrDefault('hello', 'default'), 'hello');
            assert.strictEqual(valueOrDefault(0, 10), 0);
            assert.strictEqual(valueOrDefault(false, true), false);
            assert.strictEqual(valueOrDefault('', 'default'), '');
        });

        it('returns default when null', () => {
            assert.strictEqual(valueOrDefault(null, 'default'), 'default');
        });

        it('returns default when undefined', () => {
            assert.strictEqual(valueOrDefault(undefined, 'default'), 'default');
        });
    });

    describe('valueOrFactory', () => {
        it('returns value when defined', () => {
            let factoryCalled = false;
            const result = valueOrFactory('hello', () => {
                factoryCalled = true;
                return 'factory';
            });
            assert.strictEqual(result, 'hello');
            assert.strictEqual(factoryCalled, false);
        });

        it('calls factory when null', () => {
            let factoryCalled = false;
            const result = valueOrFactory(null, () => {
                factoryCalled = true;
                return 'factory';
            });
            assert.strictEqual(result, 'factory');
            assert.strictEqual(factoryCalled, true);
        });

        it('calls factory when undefined', () => {
            const result = valueOrFactory(undefined, () => 'factory');
            assert.strictEqual(result, 'factory');
        });
    });

    describe('getPropertyOrDefault', () => {
        it('returns property value when defined', () => {
            const obj = { a: 'value', b: 123 };
            assert.strictEqual(getPropertyOrDefault(obj, 'a', 'default'), 'value');
            assert.strictEqual(getPropertyOrDefault(obj, 'b', 0), 123);
        });

        it('returns default when property is undefined', () => {
            const obj: { a?: string } = {};
            assert.strictEqual(getPropertyOrDefault(obj, 'a', 'default'), 'default');
        });

        it('returns default when property is null', () => {
            const obj = { a: null as unknown as string };
            assert.strictEqual(getPropertyOrDefault(obj, 'a', 'default'), 'default');
        });
    });

    describe('safeAccess', () => {
        it('returns value when object is defined', () => {
            const obj = { a: { b: 'value' } };
            assert.strictEqual(safeAccess(obj, o => o.a.b), 'value');
        });

        it('returns undefined when object is null', () => {
            assert.strictEqual(safeAccess(null, (o: { a: string }) => o.a), undefined);
        });

        it('returns undefined when object is undefined', () => {
            assert.strictEqual(safeAccess(undefined, (o: { a: string }) => o.a), undefined);
        });

        it('returns undefined when accessor throws', () => {
            const obj = { a: null as unknown as { b: string } };
            // This would throw in normal access
            const result = safeAccess(obj, o => o.a.b);
            assert.strictEqual(result, undefined);
        });
    });

    describe('mapOrEmpty', () => {
        it('maps non-empty array', () => {
            const arr = [1, 2, 3];
            const result = mapOrEmpty(arr, x => x * 2);
            assert.deepStrictEqual(result, [2, 4, 6]);
        });

        it('returns empty array for null', () => {
            const result = mapOrEmpty(null, x => x);
            assert.deepStrictEqual(result, []);
        });

        it('returns empty array for undefined', () => {
            const result = mapOrEmpty(undefined, x => x);
            assert.deepStrictEqual(result, []);
        });

        it('returns empty array for empty array', () => {
            const result = mapOrEmpty([], x => x);
            assert.deepStrictEqual(result, []);
        });

        it('passes index to mapper', () => {
            const arr = ['a', 'b', 'c'];
            const result = mapOrEmpty(arr, (x, i) => `${x}${i}`);
            assert.deepStrictEqual(result, ['a0', 'b1', 'c2']);
        });
    });

    describe('filterOrEmpty', () => {
        it('filters non-empty array', () => {
            const arr = [1, 2, 3, 4, 5];
            const result = filterOrEmpty(arr, x => x > 2);
            assert.deepStrictEqual(result, [3, 4, 5]);
        });

        it('returns empty array for null', () => {
            const result = filterOrEmpty(null, () => true);
            assert.deepStrictEqual(result, []);
        });

        it('returns empty array for undefined', () => {
            const result = filterOrEmpty(undefined, () => true);
            assert.deepStrictEqual(result, []);
        });
    });

    describe('firstOrUndefined', () => {
        it('returns first element', () => {
            assert.strictEqual(firstOrUndefined([1, 2, 3]), 1);
        });

        it('returns undefined for empty array', () => {
            assert.strictEqual(firstOrUndefined([]), undefined);
        });

        it('returns undefined for null', () => {
            assert.strictEqual(firstOrUndefined(null), undefined);
        });

        it('returns undefined for undefined', () => {
            assert.strictEqual(firstOrUndefined(undefined), undefined);
        });
    });

    describe('lastOrUndefined', () => {
        it('returns last element', () => {
            assert.strictEqual(lastOrUndefined([1, 2, 3]), 3);
        });

        it('returns undefined for empty array', () => {
            assert.strictEqual(lastOrUndefined([]), undefined);
        });

        it('returns undefined for null', () => {
            assert.strictEqual(lastOrUndefined(null), undefined);
        });
    });

    describe('findOrUndefined', () => {
        it('finds matching element', () => {
            const arr = [1, 2, 3, 4, 5];
            assert.strictEqual(findOrUndefined(arr, x => x === 3), 3);
        });

        it('returns undefined when not found', () => {
            const arr = [1, 2, 3];
            assert.strictEqual(findOrUndefined(arr, x => x === 5), undefined);
        });

        it('returns undefined for null', () => {
            assert.strictEqual(findOrUndefined(null, () => true), undefined);
        });

        it('returns undefined for undefined', () => {
            assert.strictEqual(findOrUndefined(undefined, () => true), undefined);
        });
    });

    // ========================================================================
    // OBJECT UTILITIES
    // ========================================================================

    describe('compactObject', () => {
        it('removes undefined values', () => {
            const obj = { a: 1, b: undefined, c: 'test' };
            const result = compactObject(obj);
            assert.deepStrictEqual(result, { a: 1, c: 'test' });
        });

        it('removes null values', () => {
            const obj = { a: null, b: 2, c: null };
            const result = compactObject(obj);
            assert.deepStrictEqual(result, { b: 2 });
        });

        it('keeps falsy but defined values', () => {
            const obj = { a: 0, b: false, c: '', d: undefined };
            const result = compactObject(obj);
            assert.deepStrictEqual(result, { a: 0, b: false, c: '' });
        });

        it('returns empty object for all undefined', () => {
            const obj = { a: undefined, b: null };
            const result = compactObject(obj);
            assert.deepStrictEqual(result, {});
        });
    });

    describe('mergeWithDefaults', () => {
        it('uses target values when defined', () => {
            const target = { a: 'custom', b: undefined };
            const defaults = { a: 'default', b: 'default' };
            const result = mergeWithDefaults(target, defaults);
            assert.deepStrictEqual(result, { a: 'custom', b: 'default' });
        });

        it('uses defaults for undefined values', () => {
            const target = { a: undefined, b: undefined };
            const defaults = { a: 'A', b: 'B' };
            const result = mergeWithDefaults(target, defaults);
            assert.deepStrictEqual(result, { a: 'A', b: 'B' });
        });

        it('uses defaults for null values', () => {
            const target = { a: null as unknown as string };
            const defaults = { a: 'default' };
            const result = mergeWithDefaults(target, defaults);
            assert.deepStrictEqual(result, { a: 'default' });
        });
    });

    describe('pickDefined', () => {
        it('picks defined properties', () => {
            const obj = { a: 'A', b: undefined, c: 'C', d: null };
            const result = pickDefined(obj, ['a', 'b', 'c']);
            assert.deepStrictEqual(result, { a: 'A', c: 'C' });
        });

        it('returns empty object when all undefined', () => {
            const obj = { a: undefined, b: null };
            const result = pickDefined(obj, ['a', 'b']);
            assert.deepStrictEqual(result, {});
        });

        it('returns empty object for empty keys', () => {
            const obj = { a: 'A', b: 'B' };
            const result = pickDefined(obj, []);
            assert.deepStrictEqual(result, {});
        });
    });

    // ========================================================================
    // TYPE-SPECIFIC UTILITIES
    // ========================================================================

    describe('stringOrDefault', () => {
        it('returns string when non-empty', () => {
            assert.strictEqual(stringOrDefault('hello', 'default'), 'hello');
        });

        it('returns default for empty string', () => {
            assert.strictEqual(stringOrDefault('', 'default'), 'default');
        });

        it('returns default for whitespace string', () => {
            assert.strictEqual(stringOrDefault('   ', 'default'), 'default');
        });

        it('returns default for null', () => {
            assert.strictEqual(stringOrDefault(null, 'default'), 'default');
        });

        it('returns default for undefined', () => {
            assert.strictEqual(stringOrDefault(undefined, 'default'), 'default');
        });
    });

    describe('numberOrDefault', () => {
        it('returns number when finite', () => {
            assert.strictEqual(numberOrDefault(42, 0), 42);
            assert.strictEqual(numberOrDefault(0, 10), 0);
            assert.strictEqual(numberOrDefault(-5, 0), -5);
        });

        it('returns default for NaN', () => {
            assert.strictEqual(numberOrDefault(NaN, 0), 0);
        });

        it('returns default for Infinity', () => {
            assert.strictEqual(numberOrDefault(Infinity, 0), 0);
        });

        it('returns default for null', () => {
            assert.strictEqual(numberOrDefault(null, 0), 0);
        });

        it('returns default for undefined', () => {
            assert.strictEqual(numberOrDefault(undefined, 0), 0);
        });
    });

    describe('booleanOrDefault', () => {
        it('returns boolean when defined', () => {
            assert.strictEqual(booleanOrDefault(true, false), true);
            assert.strictEqual(booleanOrDefault(false, true), false);
        });

        it('returns default for null', () => {
            assert.strictEqual(booleanOrDefault(null, true), true);
        });

        it('returns default for undefined', () => {
            assert.strictEqual(booleanOrDefault(undefined, false), false);
        });
    });

    describe('arrayOrDefault', () => {
        it('returns array when non-empty', () => {
            assert.deepStrictEqual(arrayOrDefault([1, 2], []), [1, 2]);
        });

        it('returns default for empty array', () => {
            assert.deepStrictEqual(arrayOrDefault([], [1, 2]), [1, 2]);
        });

        it('returns default for null', () => {
            assert.deepStrictEqual(arrayOrDefault(null, [1, 2]), [1, 2]);
        });

        it('returns default for undefined', () => {
            assert.deepStrictEqual(arrayOrDefault(undefined, [1, 2]), [1, 2]);
        });
    });

    // ========================================================================
    // COALESCE UTILITIES
    // ========================================================================

    describe('coalesce', () => {
        it('returns first defined value', () => {
            assert.strictEqual(coalesce(undefined, null, 'third'), 'third');
            assert.strictEqual(coalesce('first', 'second'), 'first');
            assert.strictEqual(coalesce(null, 'second', 'third'), 'second');
        });

        it('returns undefined if all values are nullish', () => {
            assert.strictEqual(coalesce(undefined, null, undefined), undefined);
        });

        it('returns falsy but defined values', () => {
            assert.strictEqual(coalesce(undefined, 0, 1), 0);
            assert.strictEqual(coalesce(null, false, true), false);
            assert.strictEqual(coalesce(undefined, '', 'default'), '');
        });
    });

    describe('coalesceWithFallback', () => {
        it('returns first defined value', () => {
            assert.strictEqual(coalesceWithFallback('fallback', undefined, 'value'), 'value');
        });

        it('returns fallback if all values are nullish', () => {
            assert.strictEqual(coalesceWithFallback('fallback', undefined, null), 'fallback');
        });

        it('returns fallback if no values provided', () => {
            assert.strictEqual(coalesceWithFallback('fallback'), 'fallback');
        });
    });

    // ========================================================================
    // SAFE EXECUTION UTILITIES
    // ========================================================================

    describe('safeExecute', () => {
        it('returns success result for successful execution', () => {
            const result = safeExecute(() => 'value');
            assert.deepStrictEqual(result, { success: true, value: 'value' });
        });

        it('returns failure result for thrown error', () => {
            const result = safeExecute(() => { throw new Error('Test error'); });
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.strictEqual(result.error, 'Test error');
            }
        });

        it('handles non-Error thrown values', () => {
            const result = safeExecute(() => { throw 'String error'; });
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.strictEqual(result.error, 'String error');
            }
        });
    });

    describe('safeExecuteAsync', () => {
        it('returns success result for successful async execution', async () => {
            const result = await safeExecuteAsync(async () => 'value');
            assert.deepStrictEqual(result, { success: true, value: 'value' });
        });

        it('returns failure result for rejected promise', async () => {
            const result = await safeExecuteAsync(async () => { throw new Error('Async error'); });
            assert.strictEqual(result.success, false);
            if (!result.success) {
                assert.strictEqual(result.error, 'Async error');
            }
        });

        it('handles async functions correctly', async () => {
            const result = await safeExecuteAsync(async () => {
                await Promise.resolve();
                return 42;
            });
            assert.deepStrictEqual(result, { success: true, value: 42 });
        });
    });

    describe('catchToUndefined', () => {
        it('returns value for successful execution', () => {
            const fn = (x: number) => x * 2;
            const safeFn = catchToUndefined(fn);
            assert.strictEqual(safeFn(5), 10);
        });

        it('returns undefined for thrown error', () => {
            const fn = () => { throw new Error('Test'); };
            const safeFn = catchToUndefined(fn);
            assert.strictEqual(safeFn(), undefined);
        });

        it('preserves arguments', () => {
            const fn = (a: number, b: number) => a + b;
            const safeFn = catchToUndefined(fn);
            assert.strictEqual(safeFn(3, 4), 7);
        });
    });

    // ========================================================================
    // INTEGRATION TESTS
    // ========================================================================

    describe('Integration tests with Task-like objects', () => {
        interface MockTask {
            id: string;
            description: string;
            dependencies?: string[];
            acceptanceCriteria?: string[];
        }

        it('safely handles optional dependencies', () => {
            const taskWithDeps: MockTask = { id: '1', description: 'Test', dependencies: ['dep1', 'dep2'] };
            const taskWithoutDeps: MockTask = { id: '2', description: 'Test 2' };

            // Using mapOrEmpty for safe dependency access
            const deps1 = mapOrEmpty(taskWithDeps.dependencies, d => d.toUpperCase());
            const deps2 = mapOrEmpty(taskWithoutDeps.dependencies, d => d.toUpperCase());

            assert.deepStrictEqual(deps1, ['DEP1', 'DEP2']);
            assert.deepStrictEqual(deps2, []);
        });

        it('safely handles optional acceptance criteria', () => {
            const task: MockTask = { id: '1', description: 'Test' };
            
            // Using valueOrDefault for safe criteria access
            const criteria = valueOrDefault(task.acceptanceCriteria, []);
            assert.deepStrictEqual(criteria, []);

            // Using isNonEmptyArray for conditional rendering
            const hasCriteria = isNonEmptyArray(task.acceptanceCriteria);
            assert.strictEqual(hasCriteria, false);
        });

        it('narrows optional properties with hasDefinedProperty', () => {
            const task: MockTask = { id: '1', description: 'Test', dependencies: ['a', 'b'] };

            if (hasDefinedProperty(task, 'dependencies')) {
                // TypeScript knows dependencies is defined here
                assert.strictEqual(task.dependencies.length, 2);
            }
        });

        it('uses assertHasProperty for required properties', () => {
            const task: MockTask = { id: '1', description: 'Test', dependencies: ['a'] };
            
            assertHasProperty(task, 'dependencies', 'Task must have dependencies');
            // TypeScript knows dependencies is defined after assertion
            assert.strictEqual(task.dependencies[0], 'a');
        });
    });

    describe('Integration tests with WebviewError-like objects', () => {
        interface MockError {
            message: string;
            source: string;
            lineno: number;
            colno: number;
            stack?: string;
        }

        it('safely accesses optional stack trace', () => {
            const errorWithStack: MockError = {
                message: 'Test',
                source: 'test.js',
                lineno: 10,
                colno: 5,
                stack: 'Error at line 10'
            };
            const errorWithoutStack: MockError = {
                message: 'Test',
                source: 'test.js',
                lineno: 10,
                colno: 5
            };

            const stack1 = valueOrDefault(errorWithStack.stack, 'No stack trace');
            const stack2 = valueOrDefault(errorWithoutStack.stack, 'No stack trace');

            assert.strictEqual(stack1, 'Error at line 10');
            assert.strictEqual(stack2, 'No stack trace');
        });

        it('uses stringOrDefault for optional stack', () => {
            const error: MockError = { message: 'Test', source: 'test.js', lineno: 1, colno: 1 };
            const stack = stringOrDefault(error.stack, 'unavailable');
            assert.strictEqual(stack, 'unavailable');
        });
    });

    describe('Integration tests with message format properties', () => {
        interface ExportMessage {
            command: 'exportData';
            format?: 'json' | 'csv';
        }

        it('safely handles optional format', () => {
            const msgWithFormat: ExportMessage = { command: 'exportData', format: 'json' };
            const msgWithoutFormat: ExportMessage = { command: 'exportData' };

            const format1 = valueOrDefault(msgWithFormat.format, 'json');
            const format2 = valueOrDefault(msgWithoutFormat.format, 'json');

            assert.strictEqual(format1, 'json');
            assert.strictEqual(format2, 'json');
        });

        it('checks for defined format', () => {
            const msg: ExportMessage = { command: 'exportData', format: 'csv' };

            if (hasDefinedProperty(msg, 'format')) {
                assert.strictEqual(msg.format, 'csv');
            }
        });
    });

    describe('Integration tests with optional toast properties', () => {
        interface ToastOptions {
            type: 'success' | 'error';
            message: string;
            title?: string;
            duration?: number;
            dismissible?: boolean;
        }

        it('safely applies default toast options', () => {
            const defaults: Required<ToastOptions> = {
                type: 'success',
                message: '',
                title: '',
                duration: 5000,
                dismissible: true
            };

            const toast: ToastOptions = { type: 'error', message: 'Error occurred' };
            const merged = mergeWithDefaults(toast, defaults);

            assert.strictEqual(merged.type, 'error');
            assert.strictEqual(merged.message, 'Error occurred');
            assert.strictEqual(merged.title, '');
            assert.strictEqual(merged.duration, 5000);
            assert.strictEqual(merged.dismissible, true);
        });

        it('extracts defined optional properties', () => {
            const toast: ToastOptions = { 
                type: 'success', 
                message: 'Done', 
                title: 'Success!', 
                duration: undefined 
            };
            
            const defined = pickDefined(toast, ['title', 'duration', 'dismissible']);
            assert.deepStrictEqual(defined, { title: 'Success!' });
        });
    });
});
