import * as assert from 'assert';
import {
    // Schema types
    SchemaPrimitiveType,
    SchemaComplexType,
    SchemaType,
    StringSchema,
    NumberSchema,
    BooleanSchema,
    ArraySchema,
    ObjectSchema,
    RefSchema,
    LiteralSchema,
    PropertySchema,
    MessageSchema,
    MessageSchemaCollection,
    // Schema helpers
    stringSchema,
    literalSchema,
    enumSchema,
    numberSchema,
    integerSchema,
    booleanSchema,
    arraySchema,
    objectSchema,
    refSchema,
    optional,
    // Schema property accessors
    isRefSchema,
    isLiteralSchema,
    isBaseSchema,
    isSchemaOptional,
    isSchemaReadonly,
    getSchemaDescription,
    // Schema collections
    SHARED_DEFINITIONS,
    INCOMING_MESSAGE_SCHEMAS,
    OUTGOING_MESSAGE_SCHEMAS,
    // Type generation
    generateTypeString,
    generateInterfaceDeclaration,
    generateTypeFile,
    // Validator generation
    GeneratedValidator,
    generateValidator,
    generateMessageValidators,
    // Type guard generation
    createMessageTypeGuard,
    createAllTypeGuards,
    // Schema introspection
    getDiscriminants,
    getMessagesByCategory,
    getMessageSchema,
    hasMessage,
    getMessageProperties,
    getRequiredProperties,
    // Pre-generated validators
    INCOMING_MESSAGE_VALIDATORS,
    OUTGOING_MESSAGE_VALIDATORS,
    INCOMING_TYPE_GUARDS,
    OUTGOING_TYPE_GUARDS,
    // Convenience functions
    validateIncomingMessageFromSchema,
    validateOutgoingMessageFromSchema
} from '../../messageHandlers/schemaTypes';

describe('Schema Types - Type Generation', () => {
    describe('Schema Helper Functions', () => {
        describe('stringSchema', () => {
            it('should create a basic string schema', () => {
                const schema = stringSchema();
                assert.strictEqual(schema.type, 'string');
            });

            it('should create a string schema with options', () => {
                const schema = stringSchema({ minLength: 1, maxLength: 100 });
                assert.strictEqual(schema.type, 'string');
                assert.strictEqual(schema.minLength, 1);
                assert.strictEqual(schema.maxLength, 100);
            });

            it('should create a string schema with description', () => {
                const schema = stringSchema({ description: 'Test description' });
                assert.strictEqual(schema.description, 'Test description');
            });
        });

        describe('literalSchema', () => {
            it('should create a string literal schema', () => {
                const schema = literalSchema('start');
                assert.strictEqual(schema.literal, true);
                assert.strictEqual(schema.value, 'start');
            });

            it('should create a number literal schema', () => {
                const schema = literalSchema(42);
                assert.strictEqual(schema.literal, true);
                assert.strictEqual(schema.value, 42);
            });

            it('should create a boolean literal schema', () => {
                const schema = literalSchema(true);
                assert.strictEqual(schema.literal, true);
                assert.strictEqual(schema.value, true);
            });
        });

        describe('enumSchema', () => {
            it('should create an enum schema', () => {
                const schema = enumSchema(['a', 'b', 'c']);
                assert.strictEqual(schema.type, 'string');
                assert.deepStrictEqual(schema.enum, ['a', 'b', 'c']);
            });

            it('should create an enum schema with options', () => {
                const schema = enumSchema(['x', 'y'], { description: 'Letters' });
                assert.deepStrictEqual(schema.enum, ['x', 'y']);
                assert.strictEqual(schema.description, 'Letters');
            });
        });

        describe('numberSchema', () => {
            it('should create a basic number schema', () => {
                const schema = numberSchema();
                assert.strictEqual(schema.type, 'number');
            });

            it('should create a number schema with min/max', () => {
                const schema = numberSchema({ minimum: 0, maximum: 100 });
                assert.strictEqual(schema.minimum, 0);
                assert.strictEqual(schema.maximum, 100);
            });
        });

        describe('integerSchema', () => {
            it('should create an integer schema', () => {
                const schema = integerSchema();
                assert.strictEqual(schema.type, 'number');
                assert.strictEqual(schema.integer, true);
            });

            it('should create an integer schema with range', () => {
                const schema = integerSchema({ minimum: 1, maximum: 50 });
                assert.strictEqual(schema.integer, true);
                assert.strictEqual(schema.minimum, 1);
                assert.strictEqual(schema.maximum, 50);
            });
        });

        describe('booleanSchema', () => {
            it('should create a boolean schema', () => {
                const schema = booleanSchema();
                assert.strictEqual(schema.type, 'boolean');
            });

            it('should create a boolean schema with default', () => {
                const schema = booleanSchema({ default: true });
                assert.strictEqual(schema.default, true);
            });
        });

        describe('arraySchema', () => {
            it('should create an array schema', () => {
                const schema = arraySchema(stringSchema());
                assert.strictEqual(schema.type, 'array');
                assert.ok(isBaseSchema(schema.items));
                assert.strictEqual((schema.items as StringSchema).type, 'string');
            });

            it('should create an array schema with constraints', () => {
                const schema = arraySchema(numberSchema(), { minItems: 1, maxItems: 10 });
                assert.strictEqual(schema.minItems, 1);
                assert.strictEqual(schema.maxItems, 10);
            });
        });

        describe('objectSchema', () => {
            it('should create an object schema', () => {
                const schema = objectSchema({
                    name: stringSchema(),
                    age: numberSchema()
                });
                assert.strictEqual(schema.type, 'object');
                assert.ok('name' in schema.properties);
                assert.ok('age' in schema.properties);
            });

            it('should create an object schema with required properties', () => {
                const schema = objectSchema(
                    { name: stringSchema() },
                    ['name']
                );
                assert.deepStrictEqual(schema.required, ['name']);
            });
        });

        describe('refSchema', () => {
            it('should create a reference schema', () => {
                const schema = refSchema('TaskRequirements');
                assert.strictEqual(schema.$ref, 'TaskRequirements');
            });

            it('should create a reference schema with options', () => {
                const schema = refSchema('RalphSettings', { description: 'Settings ref' });
                assert.strictEqual(schema.$ref, 'RalphSettings');
                assert.strictEqual(schema.description, 'Settings ref');
            });
        });

        describe('optional', () => {
            it('should mark a schema as optional', () => {
                const schema = optional(stringSchema());
                assert.strictEqual(schema.optional, true);
            });

            it('should preserve original schema properties', () => {
                const schema = optional(numberSchema({ minimum: 0 }));
                assert.strictEqual(schema.optional, true);
                assert.strictEqual(schema.minimum, 0);
            });
        });
    });

    describe('Schema Property Accessors', () => {
        describe('isRefSchema', () => {
            it('should return true for reference schema', () => {
                assert.ok(isRefSchema(refSchema('Test')));
            });

            it('should return false for non-reference schema', () => {
                assert.ok(!isRefSchema(stringSchema()));
                assert.ok(!isRefSchema(numberSchema()));
                assert.ok(!isRefSchema(literalSchema('test')));
            });
        });

        describe('isLiteralSchema', () => {
            it('should return true for literal schema', () => {
                assert.ok(isLiteralSchema(literalSchema('test')));
                assert.ok(isLiteralSchema(literalSchema(42) as PropertySchema));
                assert.ok(isLiteralSchema(literalSchema(true) as PropertySchema));
            });

            it('should return false for non-literal schema', () => {
                assert.ok(!isLiteralSchema(stringSchema()));
                assert.ok(!isLiteralSchema(refSchema('Test')));
            });
        });

        describe('isBaseSchema', () => {
            it('should return true for schemas with type property', () => {
                assert.ok(isBaseSchema(stringSchema()));
                assert.ok(isBaseSchema(numberSchema()));
                assert.ok(isBaseSchema(booleanSchema()));
                assert.ok(isBaseSchema(arraySchema(stringSchema())));
                assert.ok(isBaseSchema(objectSchema({})));
            });

            it('should return false for ref and literal schemas', () => {
                assert.ok(!isBaseSchema(refSchema('Test')));
                assert.ok(!isBaseSchema(literalSchema('test')));
            });
        });

        describe('isSchemaOptional', () => {
            it('should return true for optional schemas', () => {
                assert.ok(isSchemaOptional(optional(stringSchema())));
                assert.ok(isSchemaOptional(optional(numberSchema())));
            });

            it('should return false for non-optional schemas', () => {
                assert.ok(!isSchemaOptional(stringSchema()));
                assert.ok(!isSchemaOptional(numberSchema()));
            });
        });

        describe('isSchemaReadonly', () => {
            it('should return false for schemas without readonly', () => {
                assert.ok(!isSchemaReadonly(stringSchema()));
                assert.ok(!isSchemaReadonly(refSchema('Test')));
            });

            it('should return true for schemas with readonly', () => {
                const schema = { ...stringSchema(), readonly: true };
                assert.ok(isSchemaReadonly(schema));
            });
        });

        describe('getSchemaDescription', () => {
            it('should return description for base schemas', () => {
                const schema = stringSchema({ description: 'Test description' });
                assert.strictEqual(getSchemaDescription(schema), 'Test description');
            });

            it('should return description for ref schemas', () => {
                const schema = refSchema('Test', { description: 'Ref description' });
                assert.strictEqual(getSchemaDescription(schema), 'Ref description');
            });

            it('should return undefined for schemas without description', () => {
                assert.strictEqual(getSchemaDescription(stringSchema()), undefined);
            });
        });
    });

    describe('SHARED_DEFINITIONS', () => {
        it('should contain TaskRequirements definition', () => {
            assert.ok('TaskRequirements' in SHARED_DEFINITIONS);
        });

        it('should contain RalphSettings definition', () => {
            assert.ok('RalphSettings' in SHARED_DEFINITIONS);
        });

        it('should contain WebviewError definition', () => {
            assert.ok('WebviewError' in SHARED_DEFINITIONS);
        });

        it('should contain LogEntry definition', () => {
            assert.ok('LogEntry' in SHARED_DEFINITIONS);
        });

        it('should contain TaskCompletion definition', () => {
            assert.ok('TaskCompletion' in SHARED_DEFINITIONS);
        });

        it('should contain LogLevel definition', () => {
            assert.ok('LogLevel' in SHARED_DEFINITIONS);
        });

        it('should contain ToastType definition', () => {
            assert.ok('ToastType' in SHARED_DEFINITIONS);
        });

        it('should contain Task definition', () => {
            assert.ok('Task' in SHARED_DEFINITIONS);
        });
    });

    describe('INCOMING_MESSAGE_SCHEMAS', () => {
        it('should have correct name', () => {
            assert.strictEqual(INCOMING_MESSAGE_SCHEMAS.name, 'IncomingWebviewMessage');
        });

        it('should have command as discriminant property', () => {
            assert.strictEqual(INCOMING_MESSAGE_SCHEMAS.discriminantProperty, 'command');
        });

        it('should contain all control messages', () => {
            const controlMessages = ['start', 'stop', 'pause', 'resume', 'next', 'refresh'];
            for (const cmd of controlMessages) {
                assert.ok(cmd in INCOMING_MESSAGE_SCHEMAS.messages, `Missing ${cmd}`);
            }
        });

        it('should contain all task messages', () => {
            const taskMessages = ['skipTask', 'retryTask', 'completeAllTasks', 'resetAllTasks', 'reorderTasks'];
            for (const cmd of taskMessages) {
                assert.ok(cmd in INCOMING_MESSAGE_SCHEMAS.messages, `Missing ${cmd}`);
            }
        });

        it('should contain all PRD messages', () => {
            const prdMessages = ['generatePrd', 'requirementsChanged', 'settingsChanged'];
            for (const cmd of prdMessages) {
                assert.ok(cmd in INCOMING_MESSAGE_SCHEMAS.messages, `Missing ${cmd}`);
            }
        });

        it('should contain all export messages', () => {
            const exportMessages = ['exportData', 'exportLog'];
            for (const cmd of exportMessages) {
                assert.ok(cmd in INCOMING_MESSAGE_SCHEMAS.messages, `Missing ${cmd}`);
            }
        });

        it('should contain all state messages', () => {
            const stateMessages = ['panelStateChanged', 'webviewError', 'openPanel'];
            for (const cmd of stateMessages) {
                assert.ok(cmd in INCOMING_MESSAGE_SCHEMAS.messages, `Missing ${cmd}`);
            }
        });

        it('should have shared definitions', () => {
            assert.ok(INCOMING_MESSAGE_SCHEMAS.definitions);
        });
    });

    describe('OUTGOING_MESSAGE_SCHEMAS', () => {
        it('should have correct name', () => {
            assert.strictEqual(OUTGOING_MESSAGE_SCHEMAS.name, 'OutgoingExtensionMessage');
        });

        it('should have type as discriminant property', () => {
            assert.strictEqual(OUTGOING_MESSAGE_SCHEMAS.discriminantProperty, 'type');
        });

        it('should contain all outgoing message types', () => {
            const messageTypes = [
                'update', 'countdown', 'history', 'timing', 'stats',
                'log', 'prdGenerating', 'prdComplete', 'toast', 'loading', 'error'
            ];
            for (const type of messageTypes) {
                assert.ok(type in OUTGOING_MESSAGE_SCHEMAS.messages, `Missing ${type}`);
            }
        });
    });

    describe('generateTypeString', () => {
        it('should generate string type', () => {
            const result = generateTypeString(stringSchema());
            assert.strictEqual(result, 'string');
        });

        it('should generate number type', () => {
            const result = generateTypeString(numberSchema());
            assert.strictEqual(result, 'number');
        });

        it('should generate boolean type', () => {
            const result = generateTypeString(booleanSchema());
            assert.strictEqual(result, 'boolean');
        });

        it('should generate enum type as union of literals', () => {
            const result = generateTypeString(enumSchema(['a', 'b', 'c']));
            assert.strictEqual(result, "'a' | 'b' | 'c'");
        });

        it('should generate array type', () => {
            const result = generateTypeString(arraySchema(stringSchema()));
            assert.strictEqual(result, 'string[]');
        });

        it('should generate literal type for string', () => {
            const result = generateTypeString(literalSchema('start'));
            assert.strictEqual(result, "'start'");
        });

        it('should generate literal type for number', () => {
            const result = generateTypeString(literalSchema(42) as PropertySchema);
            assert.strictEqual(result, '42');
        });

        it('should generate object type', () => {
            const result = generateTypeString(objectSchema({
                name: stringSchema(),
                age: numberSchema()
            }));
            assert.ok(result.includes('name: string'));
            assert.ok(result.includes('age: number'));
        });

        it('should handle reference schemas', () => {
            const result = generateTypeString(refSchema('TaskRequirements'));
            assert.strictEqual(result, 'TaskRequirements');
        });
    });

    describe('generateInterfaceDeclaration', () => {
        it('should generate a valid interface declaration', () => {
            const schema: MessageSchema = {
                discriminant: 'start',
                discriminantProperty: 'command',
                description: 'Start command',
                schema: objectSchema({
                    command: literalSchema('start')
                }, ['command'])
            };
            const result = generateInterfaceDeclaration('StartMessage', schema);
            assert.ok(result.includes('export interface StartMessage'));
            assert.ok(result.includes('command: \'start\''));
        });

        it('should include JSDoc comment for description', () => {
            const schema: MessageSchema = {
                discriminant: 'test',
                discriminantProperty: 'command',
                description: 'Test description',
                schema: objectSchema({ command: literalSchema('test') }, ['command'])
            };
            const result = generateInterfaceDeclaration('TestMessage', schema);
            assert.ok(result.includes('/**'));
            assert.ok(result.includes('Test description'));
        });
    });

    describe('generateTypeFile', () => {
        it('should generate a complete type file', () => {
            const result = generateTypeFile(INCOMING_MESSAGE_SCHEMAS);
            assert.ok(result.includes('Auto-generated types'));
            assert.ok(result.includes('IncomingWebviewMessage'));
            assert.ok(result.includes('StartMessage'));
            assert.ok(result.includes('ALL_COMMANDS'));
        });

        it('should include shared definitions', () => {
            const result = generateTypeFile(INCOMING_MESSAGE_SCHEMAS);
            assert.ok(result.includes('SHARED TYPE DEFINITIONS'));
        });

        it('should include discriminated union', () => {
            const result = generateTypeFile(INCOMING_MESSAGE_SCHEMAS);
            assert.ok(result.includes('DISCRIMINATED UNION'));
        });
    });

    describe('generateValidator', () => {
        it('should validate a simple string schema', () => {
            const validator = generateValidator(stringSchema());
            assert.ok(validator.validate('test'));
            assert.ok(!validator.validate(123));
        });

        it('should validate a number schema', () => {
            const validator = generateValidator(numberSchema());
            assert.ok(validator.validate(42));
            assert.ok(!validator.validate('42'));
        });

        it('should validate a boolean schema', () => {
            const validator = generateValidator(booleanSchema());
            assert.ok(validator.validate(true));
            assert.ok(validator.validate(false));
            assert.ok(!validator.validate('true'));
        });

        it('should validate string enum', () => {
            const validator = generateValidator(enumSchema(['a', 'b', 'c']));
            assert.ok(validator.validate('a'));
            assert.ok(validator.validate('b'));
            assert.ok(!validator.validate('d'));
        });

        it('should validate string minLength', () => {
            const validator = generateValidator(stringSchema({ minLength: 3 }));
            assert.ok(validator.validate('abc'));
            assert.ok(!validator.validate('ab'));
        });

        it('should validate number minimum', () => {
            const validator = generateValidator(numberSchema({ minimum: 0 }));
            assert.ok(validator.validate(0));
            assert.ok(validator.validate(10));
            assert.ok(!validator.validate(-1));
        });

        it('should validate integer constraint', () => {
            const validator = generateValidator(integerSchema());
            assert.ok(validator.validate(42));
            assert.ok(!validator.validate(42.5));
        });

        it('should validate array schema', () => {
            const validator = generateValidator(arraySchema(stringSchema()));
            assert.ok(validator.validate(['a', 'b', 'c']));
            assert.ok(!validator.validate([1, 2, 3]));
        });

        it('should validate array minItems', () => {
            const validator = generateValidator(arraySchema(stringSchema(), { minItems: 1 }));
            assert.ok(validator.validate(['a']));
            assert.ok(!validator.validate([]));
        });

        it('should validate object schema', () => {
            const validator = generateValidator(objectSchema({
                name: stringSchema(),
                age: numberSchema()
            }, ['name', 'age']));
            assert.ok(validator.validate({ name: 'John', age: 30 }));
            assert.ok(!validator.validate({ name: 'John' }));
        });

        it('should validate literal schema', () => {
            const validator = generateValidator(literalSchema('start'));
            assert.ok(validator.validate('start'));
            assert.ok(!validator.validate('stop'));
        });

        it('should validate optional properties', () => {
            const validator = generateValidator(objectSchema({
                name: stringSchema(),
                nickname: optional(stringSchema())
            }, ['name']));
            assert.ok(validator.validate({ name: 'John' }));
            assert.ok(validator.validate({ name: 'John', nickname: 'Johnny' }));
        });

        it('should provide error messages', () => {
            const validator = generateValidator(stringSchema());
            assert.ok(!validator.validate(123));
            const errors = validator.getErrors(123);
            assert.ok(errors.length > 0);
            assert.ok(errors[0].includes('expected string'));
        });

        it('should validate with reference schemas', () => {
            const definitions = {
                Name: stringSchema()
            };
            const validator = generateValidator(refSchema('Name'), definitions);
            assert.ok(validator.validate('test'));
            assert.ok(!validator.validate(123));
        });
    });

    describe('generateMessageValidators', () => {
        it('should generate validators for all incoming messages', () => {
            const validators = generateMessageValidators(INCOMING_MESSAGE_SCHEMAS);
            assert.ok(validators.has('start'));
            assert.ok(validators.has('stop'));
            assert.ok(validators.has('generatePrd'));
        });

        it('should generate validators for all outgoing messages', () => {
            const validators = generateMessageValidators(OUTGOING_MESSAGE_SCHEMAS);
            assert.ok(validators.has('update'));
            assert.ok(validators.has('countdown'));
            assert.ok(validators.has('toast'));
        });
    });

    describe('INCOMING_MESSAGE_VALIDATORS', () => {
        it('should have a validator for each incoming message', () => {
            const commands = Object.keys(INCOMING_MESSAGE_SCHEMAS.messages);
            for (const cmd of commands) {
                assert.ok(INCOMING_MESSAGE_VALIDATORS.has(cmd), `Missing validator for ${cmd}`);
            }
        });

        it('should validate start message', () => {
            const validator = INCOMING_MESSAGE_VALIDATORS.get('start')!;
            assert.ok(validator.validate({ command: 'start' }));
            assert.ok(!validator.validate({ command: 'stop' }));
        });

        it('should validate generatePrd message', () => {
            const validator = INCOMING_MESSAGE_VALIDATORS.get('generatePrd')!;
            assert.ok(validator.validate({ command: 'generatePrd', taskDescription: 'Test task' }));
            assert.ok(!validator.validate({ command: 'generatePrd' }));
            assert.ok(!validator.validate({ command: 'generatePrd', taskDescription: '' }));
        });

        it('should validate reorderTasks message', () => {
            const validator = INCOMING_MESSAGE_VALIDATORS.get('reorderTasks')!;
            assert.ok(validator.validate({ command: 'reorderTasks', taskIds: ['1', '2', '3'] }));
            assert.ok(!validator.validate({ command: 'reorderTasks', taskIds: [] }));
            assert.ok(!validator.validate({ command: 'reorderTasks' }));
        });
    });

    describe('OUTGOING_MESSAGE_VALIDATORS', () => {
        it('should have a validator for each outgoing message', () => {
            const types = Object.keys(OUTGOING_MESSAGE_SCHEMAS.messages);
            for (const type of types) {
                assert.ok(OUTGOING_MESSAGE_VALIDATORS.has(type), `Missing validator for ${type}`);
            }
        });

        it('should validate update message', () => {
            const validator = OUTGOING_MESSAGE_VALIDATORS.get('update')!;
            assert.ok(validator.validate({
                type: 'update',
                status: 'running',
                iteration: 1,
                taskInfo: 'Task 1'
            }));
            assert.ok(!validator.validate({ type: 'update' }));
        });

        it('should validate countdown message', () => {
            const validator = OUTGOING_MESSAGE_VALIDATORS.get('countdown')!;
            assert.ok(validator.validate({ type: 'countdown', seconds: 10 }));
            assert.ok(!validator.validate({ type: 'countdown', seconds: -1 }));
        });
    });

    describe('createMessageTypeGuard', () => {
        it('should create a type guard for a message', () => {
            const isStart = createMessageTypeGuard(INCOMING_MESSAGE_SCHEMAS, 'start');
            assert.ok(isStart({ command: 'start' }));
            assert.ok(!isStart({ command: 'stop' }));
        });

        it('should throw for unknown discriminant', () => {
            assert.throws(() => {
                createMessageTypeGuard(INCOMING_MESSAGE_SCHEMAS, 'unknown');
            });
        });
    });

    describe('createAllTypeGuards', () => {
        it('should create type guards for all messages', () => {
            const guards = createAllTypeGuards(INCOMING_MESSAGE_SCHEMAS);
            assert.ok('start' in guards);
            assert.ok('stop' in guards);
            assert.ok('generatePrd' in guards);
        });
    });

    describe('INCOMING_TYPE_GUARDS', () => {
        it('should have guards for all incoming messages', () => {
            const commands = Object.keys(INCOMING_MESSAGE_SCHEMAS.messages);
            for (const cmd of commands) {
                assert.ok(cmd in INCOMING_TYPE_GUARDS, `Missing guard for ${cmd}`);
            }
        });

        it('should correctly identify start message', () => {
            assert.ok(INCOMING_TYPE_GUARDS.start({ command: 'start' }));
            assert.ok(!INCOMING_TYPE_GUARDS.start({ command: 'stop' }));
        });
    });

    describe('OUTGOING_TYPE_GUARDS', () => {
        it('should have guards for all outgoing messages', () => {
            const types = Object.keys(OUTGOING_MESSAGE_SCHEMAS.messages);
            for (const type of types) {
                assert.ok(type in OUTGOING_TYPE_GUARDS, `Missing guard for ${type}`);
            }
        });

        it('should correctly identify update message', () => {
            assert.ok(OUTGOING_TYPE_GUARDS.update({
                type: 'update',
                status: 'running',
                iteration: 1,
                taskInfo: 'Task'
            }));
        });
    });

    describe('Schema Introspection', () => {
        describe('getDiscriminants', () => {
            it('should return all discriminants for incoming messages', () => {
                const discriminants = getDiscriminants(INCOMING_MESSAGE_SCHEMAS);
                assert.ok(discriminants.includes('start'));
                assert.ok(discriminants.includes('stop'));
                assert.ok(discriminants.includes('generatePrd'));
            });

            it('should return all discriminants for outgoing messages', () => {
                const discriminants = getDiscriminants(OUTGOING_MESSAGE_SCHEMAS);
                assert.ok(discriminants.includes('update'));
                assert.ok(discriminants.includes('countdown'));
                assert.ok(discriminants.includes('toast'));
            });
        });

        describe('getMessagesByCategory', () => {
            it('should group messages by category', () => {
                const categories = getMessagesByCategory(INCOMING_MESSAGE_SCHEMAS);
                assert.ok(categories.has('control'));
                assert.ok(categories.has('task'));
                assert.ok(categories.has('prd'));
            });

            it('should have control messages in control category', () => {
                const categories = getMessagesByCategory(INCOMING_MESSAGE_SCHEMAS);
                const controlMessages = categories.get('control')!;
                assert.ok(controlMessages.includes('start'));
                assert.ok(controlMessages.includes('stop'));
            });
        });

        describe('getMessageSchema', () => {
            it('should return schema for a valid command', () => {
                const schema = getMessageSchema(INCOMING_MESSAGE_SCHEMAS, 'start');
                assert.ok(schema);
                assert.strictEqual(schema.discriminant, 'start');
            });

            it('should return undefined for unknown command', () => {
                const schema = getMessageSchema(INCOMING_MESSAGE_SCHEMAS, 'unknown');
                assert.strictEqual(schema, undefined);
            });
        });

        describe('hasMessage', () => {
            it('should return true for existing message', () => {
                assert.ok(hasMessage(INCOMING_MESSAGE_SCHEMAS, 'start'));
            });

            it('should return false for non-existing message', () => {
                assert.ok(!hasMessage(INCOMING_MESSAGE_SCHEMAS, 'unknown'));
            });
        });

        describe('getMessageProperties', () => {
            it('should return property names for a message', () => {
                const props = getMessageProperties(INCOMING_MESSAGE_SCHEMAS, 'generatePrd');
                assert.ok(props.includes('command'));
                assert.ok(props.includes('taskDescription'));
            });

            it('should return empty array for unknown message', () => {
                const props = getMessageProperties(INCOMING_MESSAGE_SCHEMAS, 'unknown');
                assert.deepStrictEqual(props, []);
            });
        });

        describe('getRequiredProperties', () => {
            it('should return required property names', () => {
                const required = getRequiredProperties(INCOMING_MESSAGE_SCHEMAS, 'generatePrd');
                assert.ok(required.includes('command'));
                assert.ok(required.includes('taskDescription'));
            });

            it('should return empty array for unknown message', () => {
                const required = getRequiredProperties(INCOMING_MESSAGE_SCHEMAS, 'unknown');
                assert.deepStrictEqual(required, []);
            });
        });
    });

    describe('Convenience Functions', () => {
        describe('validateIncomingMessageFromSchema', () => {
            it('should validate a valid start message', () => {
                const result = validateIncomingMessageFromSchema({ command: 'start' });
                assert.strictEqual(result.valid, true);
                assert.deepStrictEqual(result.errors, []);
            });

            it('should reject null message', () => {
                const result = validateIncomingMessageFromSchema(null);
                assert.strictEqual(result.valid, false);
                assert.ok(result.errors.length > 0);
            });

            it('should reject message without command', () => {
                const result = validateIncomingMessageFromSchema({});
                assert.strictEqual(result.valid, false);
            });

            it('should reject unknown command', () => {
                const result = validateIncomingMessageFromSchema({ command: 'unknown' });
                assert.strictEqual(result.valid, false);
            });

            it('should validate generatePrd with taskDescription', () => {
                const result = validateIncomingMessageFromSchema({
                    command: 'generatePrd',
                    taskDescription: 'Test task'
                });
                assert.strictEqual(result.valid, true);
            });

            it('should reject generatePrd without taskDescription', () => {
                const result = validateIncomingMessageFromSchema({
                    command: 'generatePrd'
                });
                assert.strictEqual(result.valid, false);
            });
        });

        describe('validateOutgoingMessageFromSchema', () => {
            it('should validate a valid update message', () => {
                const result = validateOutgoingMessageFromSchema({
                    type: 'update',
                    status: 'running',
                    iteration: 1,
                    taskInfo: 'Task 1'
                });
                assert.strictEqual(result.valid, true);
            });

            it('should reject null message', () => {
                const result = validateOutgoingMessageFromSchema(null);
                assert.strictEqual(result.valid, false);
            });

            it('should reject message without type', () => {
                const result = validateOutgoingMessageFromSchema({});
                assert.strictEqual(result.valid, false);
            });

            it('should reject unknown type', () => {
                const result = validateOutgoingMessageFromSchema({ type: 'unknown' });
                assert.strictEqual(result.valid, false);
            });

            it('should validate countdown message', () => {
                const result = validateOutgoingMessageFromSchema({
                    type: 'countdown',
                    seconds: 10
                });
                assert.strictEqual(result.valid, true);
            });

            it('should reject countdown with negative seconds', () => {
                const result = validateOutgoingMessageFromSchema({
                    type: 'countdown',
                    seconds: -1
                });
                assert.strictEqual(result.valid, false);
            });
        });
    });

    describe('Complex Validation Scenarios', () => {
        it('should validate requirementsChanged with full requirements object', () => {
            const result = validateIncomingMessageFromSchema({
                command: 'requirementsChanged',
                requirements: {
                    runTests: true,
                    runLinting: false,
                    runTypeCheck: true,
                    writeTests: false,
                    updateDocs: true,
                    commitChanges: false
                }
            });
            assert.strictEqual(result.valid, true);
        });

        it('should reject requirementsChanged with missing properties', () => {
            const result = validateIncomingMessageFromSchema({
                command: 'requirementsChanged',
                requirements: {
                    runTests: true
                }
            });
            assert.strictEqual(result.valid, false);
        });

        it('should validate settingsChanged with valid settings', () => {
            const result = validateIncomingMessageFromSchema({
                command: 'settingsChanged',
                settings: {
                    maxIterations: 50
                }
            });
            assert.strictEqual(result.valid, true);
        });

        it('should validate exportLog with entries', () => {
            const result = validateIncomingMessageFromSchema({
                command: 'exportLog',
                entries: [
                    { time: '2024-01-01', level: 'info', message: 'Test' }
                ]
            });
            assert.strictEqual(result.valid, true);
        });

        it('should validate toast message with all properties', () => {
            const result = validateOutgoingMessageFromSchema({
                type: 'toast',
                toastType: 'success',
                message: 'Success!',
                title: 'Operation Complete',
                duration: 5000,
                dismissible: true
            });
            assert.strictEqual(result.valid, true);
        });

        it('should validate stats message with optional tasks', () => {
            const result = validateOutgoingMessageFromSchema({
                type: 'stats',
                completed: 5,
                pending: 3,
                total: 8,
                progress: 62.5,
                nextTask: 'Next task',
                tasks: [
                    {
                        id: '1',
                        description: 'Task 1',
                        status: 'PENDING',
                        lineNumber: 1,
                        rawLine: '- [ ] Task 1'
                    }
                ]
            });
            assert.strictEqual(result.valid, true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty objects', () => {
            const result = validateIncomingMessageFromSchema({});
            assert.strictEqual(result.valid, false);
        });

        it('should handle undefined', () => {
            const result = validateIncomingMessageFromSchema(undefined);
            assert.strictEqual(result.valid, false);
        });

        it('should handle arrays', () => {
            const result = validateIncomingMessageFromSchema([]);
            assert.strictEqual(result.valid, false);
        });

        it('should handle strings', () => {
            const result = validateIncomingMessageFromSchema('start');
            assert.strictEqual(result.valid, false);
        });

        it('should handle numbers', () => {
            const result = validateIncomingMessageFromSchema(42);
            assert.strictEqual(result.valid, false);
        });

        it('should handle NaN in number fields', () => {
            const validator = generateValidator(numberSchema());
            assert.ok(!validator.validate(NaN));
        });

        it('should handle Infinity in number fields', () => {
            const validator = generateValidator(numberSchema());
            assert.ok(!validator.validate(Infinity));
        });
    });
});
