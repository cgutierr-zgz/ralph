/**
 * Schema-Based Type Generation for Webview Messages
 * 
 * This module provides a schema definition system that can be used to:
 * 1. Define message schemas in a declarative format
 * 2. Generate TypeScript types from those schemas at compile time
 * 3. Generate runtime validators from the schemas
 * 4. Create type guards automatically
 * 
 * The schemas serve as the single source of truth for message types,
 * ensuring consistency between compile-time types and runtime validation.
 */

// ============================================================================
// SCHEMA PRIMITIVE TYPES
// ============================================================================

/**
 * Primitive types that can appear in a schema.
 */
export type SchemaPrimitiveType = 
    | 'string'
    | 'number'
    | 'boolean'
    | 'null'
    | 'undefined';

/**
 * Complex types that can appear in a schema.
 */
export type SchemaComplexType =
    | 'object'
    | 'array';

/**
 * All schema types.
 */
export type SchemaType = SchemaPrimitiveType | SchemaComplexType;

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

/**
 * Base schema definition with common properties.
 */
export interface BaseSchema {
    /** The type of this schema node */
    readonly type: SchemaType | SchemaType[];
    /** Description for documentation */
    readonly description?: string;
    /** Whether this field is optional */
    readonly optional?: boolean;
    /** Whether this value is readonly at runtime */
    readonly readonly?: boolean;
}

/**
 * Schema for string values.
 */
export interface StringSchema extends BaseSchema {
    readonly type: 'string';
    /** Enum of allowed values */
    readonly enum?: readonly string[];
    /** Minimum length */
    readonly minLength?: number;
    /** Maximum length */
    readonly maxLength?: number;
    /** Regex pattern for validation */
    readonly pattern?: string;
    /** Default value */
    readonly default?: string;
}

/**
 * Schema for number values.
 */
export interface NumberSchema extends BaseSchema {
    readonly type: 'number';
    /** Minimum value */
    readonly minimum?: number;
    /** Maximum value */
    readonly maximum?: number;
    /** Whether the value must be an integer */
    readonly integer?: boolean;
    /** Default value */
    readonly default?: number;
}

/**
 * Schema for boolean values.
 */
export interface BooleanSchema extends BaseSchema {
    readonly type: 'boolean';
    /** Default value */
    readonly default?: boolean;
}

/**
 * Schema for null values.
 */
export interface NullSchema extends BaseSchema {
    readonly type: 'null';
}

/**
 * Schema for undefined values.
 */
export interface UndefinedSchema extends BaseSchema {
    readonly type: 'undefined';
}

/**
 * Schema for array values.
 */
export interface ArraySchema extends BaseSchema {
    readonly type: 'array';
    /** Schema for array items */
    readonly items: PropertySchema;
    /** Minimum number of items */
    readonly minItems?: number;
    /** Maximum number of items */
    readonly maxItems?: number;
    /** Whether all items must be unique */
    readonly uniqueItems?: boolean;
}

/**
 * Schema for object values.
 */
export interface ObjectSchema extends BaseSchema {
    readonly type: 'object';
    /** Property schemas */
    readonly properties: Readonly<Record<string, PropertySchema>>;
    /** Required property names */
    readonly required?: readonly string[];
    /** Whether additional properties are allowed */
    readonly additionalProperties?: boolean;
}

/**
 * Union schema for values that can be one of several types.
 */
export interface UnionSchema extends BaseSchema {
    readonly type: SchemaType[];
    /** Possible schemas for this union */
    readonly oneOf: readonly PropertySchema[];
}

/**
 * Reference schema that points to another defined schema.
 */
export interface RefSchema {
    /** Reference to another schema by name */
    readonly $ref: string;
    /** Description override */
    readonly description?: string;
    /** Whether this field is optional */
    readonly optional?: boolean;
    /** Whether this value is readonly at runtime */
    readonly readonly?: boolean;
}

/**
 * Literal schema for exact value matching.
 */
export interface LiteralSchema<T extends string | number | boolean = string | number | boolean> {
    /** The literal type marker */
    readonly literal: true;
    /** The exact value that must match */
    readonly value: T;
    /** Description for documentation */
    readonly description?: string;
    /** Whether this field is optional */
    readonly optional?: boolean;
    /** Whether this value is readonly at runtime */
    readonly readonly?: boolean;
}

/**
 * All possible property schema types.
 */
export type PropertySchema =
    | StringSchema
    | NumberSchema
    | BooleanSchema
    | NullSchema
    | UndefinedSchema
    | ArraySchema
    | ObjectSchema
    | UnionSchema
    | RefSchema
    | LiteralSchema;

// ============================================================================
// MESSAGE SCHEMA DEFINITIONS
// ============================================================================

/**
 * Schema for a complete message type.
 */
export interface MessageSchema {
    /** The command or type value that identifies this message */
    readonly discriminant: string;
    /** The discriminant property name (e.g., 'command' or 'type') */
    readonly discriminantProperty: 'command' | 'type';
    /** Full schema for this message */
    readonly schema: ObjectSchema;
    /** Category for grouping related messages */
    readonly category?: string;
    /** Description for documentation */
    readonly description?: string;
}

/**
 * Collection of message schemas organized by discriminant.
 */
export interface MessageSchemaCollection {
    /** Name of this collection */
    readonly name: string;
    /** Description */
    readonly description?: string;
    /** The discriminant property used by all messages in this collection */
    readonly discriminantProperty: 'command' | 'type';
    /** All message schemas in this collection */
    readonly messages: Readonly<Record<string, MessageSchema>>;
    /** Shared type definitions that can be referenced */
    readonly definitions?: Readonly<Record<string, PropertySchema>>;
}

// ============================================================================
// SCHEMA HELPERS - CREATE SCHEMA NODES
// ============================================================================

/**
 * Create a string schema.
 */
export function stringSchema(options?: Omit<StringSchema, 'type'>): StringSchema {
    return { type: 'string', ...options };
}

/**
 * Create a string literal schema (for discriminant values).
 */
export function literalSchema<T extends string | number | boolean>(value: T): LiteralSchema<T> {
    return { literal: true, value };
}

/**
 * Create a string enum schema.
 */
export function enumSchema(values: readonly string[], options?: Omit<StringSchema, 'type' | 'enum'>): StringSchema {
    return { type: 'string', enum: values, ...options };
}

/**
 * Create a number schema.
 */
export function numberSchema(options?: Omit<NumberSchema, 'type'>): NumberSchema {
    return { type: 'number', ...options };
}

/**
 * Create an integer schema.
 */
export function integerSchema(options?: Omit<NumberSchema, 'type' | 'integer'>): NumberSchema {
    return { type: 'number', integer: true, ...options };
}

/**
 * Create a boolean schema.
 */
export function booleanSchema(options?: Omit<BooleanSchema, 'type'>): BooleanSchema {
    return { type: 'boolean', ...options };
}

/**
 * Create an array schema.
 */
export function arraySchema(items: PropertySchema, options?: Omit<ArraySchema, 'type' | 'items'>): ArraySchema {
    return { type: 'array', items, ...options };
}

/**
 * Create an object schema.
 */
export function objectSchema(
    properties: Record<string, PropertySchema>,
    required?: string[],
    options?: Omit<ObjectSchema, 'type' | 'properties' | 'required'>
): ObjectSchema {
    return { type: 'object', properties, required, ...options };
}

/**
 * Create a reference schema.
 */
export function refSchema(name: string, options?: Omit<RefSchema, '$ref'>): RefSchema {
    return { $ref: name, ...options };
}

/**
 * Mark a schema as optional.
 */
export function optional<T extends PropertySchema>(schema: T): T & { optional: true } {
    return { ...schema, optional: true } as T & { optional: true };
}

// ============================================================================
// SCHEMA PROPERTY ACCESSORS
// ============================================================================

/**
 * Check if a schema is a reference schema.
 */
export function isRefSchema(schema: PropertySchema): schema is RefSchema {
    return '$ref' in schema;
}

/**
 * Check if a schema is a literal schema.
 */
export function isLiteralSchema(schema: PropertySchema): schema is LiteralSchema {
    return 'literal' in schema && (schema as LiteralSchema).literal === true;
}

/**
 * Check if a schema is a base schema (has type property).
 */
export function isBaseSchema(schema: PropertySchema): schema is StringSchema | NumberSchema | BooleanSchema | NullSchema | UndefinedSchema | ArraySchema | ObjectSchema | UnionSchema {
    return 'type' in schema;
}

/**
 * Safely get the optional property from any schema.
 */
export function isSchemaOptional(schema: PropertySchema): boolean {
    return 'optional' in schema && schema.optional === true;
}

/**
 * Safely get the readonly property from any schema.
 */
export function isSchemaReadonly(schema: PropertySchema): boolean {
    return 'readonly' in schema && (schema as { readonly?: boolean }).readonly === true;
}

/**
 * Safely get the description from any schema.
 */
export function getSchemaDescription(schema: PropertySchema): string | undefined {
    return 'description' in schema ? schema.description : undefined;
}

// ============================================================================
// INCOMING MESSAGE SCHEMAS (Webview → Extension)
// ============================================================================

/**
 * Shared type definitions used across message schemas.
 */
export const SHARED_DEFINITIONS: Readonly<Record<string, PropertySchema>> = {
    TaskRequirements: objectSchema({
        runTests: booleanSchema({ description: 'Whether to run tests after task completion' }),
        runLinting: booleanSchema({ description: 'Whether to run linting after task completion' }),
        runTypeCheck: booleanSchema({ description: 'Whether to run type checking after task completion' }),
        writeTests: booleanSchema({ description: 'Whether to write tests for new code' }),
        updateDocs: booleanSchema({ description: 'Whether to update documentation' }),
        commitChanges: booleanSchema({ description: 'Whether to commit changes automatically' })
    }, ['runTests', 'runLinting', 'runTypeCheck', 'writeTests', 'updateDocs', 'commitChanges']),
    
    RalphSettings: objectSchema({
        maxIterations: integerSchema({ 
            minimum: 0, 
            maximum: 1000,
            description: 'Maximum number of iterations for the automation loop'
        })
    }, ['maxIterations']),
    
    WebviewError: objectSchema({
        message: stringSchema({ description: 'Error message' }),
        source: stringSchema({ description: 'Source file where error occurred' }),
        lineno: integerSchema({ minimum: 0, description: 'Line number of error' }),
        colno: integerSchema({ minimum: 0, description: 'Column number of error' }),
        stack: optional(stringSchema({ description: 'Stack trace if available' }))
    }, ['message', 'source', 'lineno', 'colno']),
    
    LogEntry: objectSchema({
        time: stringSchema({ description: 'Timestamp of log entry' }),
        level: stringSchema({ description: 'Log level (info, warning, error, success)' }),
        message: stringSchema({ description: 'Log message content' })
    }, ['time', 'level', 'message']),
    
    TaskCompletion: objectSchema({
        taskDescription: stringSchema({ description: 'Description of completed task' }),
        completedAt: numberSchema({ description: 'Unix timestamp of completion' }),
        duration: numberSchema({ minimum: 0, description: 'Duration in milliseconds' }),
        iteration: integerSchema({ minimum: 0, description: 'Iteration number when completed' })
    }, ['taskDescription', 'completedAt', 'duration', 'iteration']),
    
    LogLevel: enumSchema(['info', 'warning', 'error', 'success'], {
        description: 'Log level for filtering and display'
    }),
    
    ToastType: enumSchema(['success', 'error', 'warning', 'info'], {
        description: 'Type of toast notification'
    }),
    
    ExportFormat: enumSchema(['json', 'csv'], {
        description: 'Format for data export'
    }),
    
    TaskStatus: enumSchema(['PENDING', 'IN_PROGRESS', 'COMPLETE', 'BLOCKED', 'SKIPPED'], {
        description: 'Current status of a task'
    }),
    
    Task: objectSchema({
        id: stringSchema({ description: 'Unique task identifier' }),
        description: stringSchema({ description: 'Task description text' }),
        status: refSchema('TaskStatus'),
        lineNumber: integerSchema({ minimum: 1, description: 'Line number in PRD file' }),
        rawLine: stringSchema({ description: 'Raw line content from PRD' }),
        dependencies: optional(arraySchema(stringSchema(), { description: 'Task IDs this task depends on' })),
        acceptanceCriteria: optional(arraySchema(stringSchema(), { description: 'Acceptance criteria for this task' }))
    }, ['id', 'description', 'status', 'lineNumber', 'rawLine'])
};

/**
 * Schema collection for all incoming webview messages.
 */
export const INCOMING_MESSAGE_SCHEMAS: MessageSchemaCollection = {
    name: 'IncomingWebviewMessage',
    description: 'Messages sent from webview to extension',
    discriminantProperty: 'command',
    definitions: SHARED_DEFINITIONS,
    messages: {
        // Control messages
        start: {
            discriminant: 'start',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Start the automation loop',
            schema: objectSchema({
                command: literalSchema('start')
            }, ['command'])
        },
        stop: {
            discriminant: 'stop',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Stop the automation loop',
            schema: objectSchema({
                command: literalSchema('stop')
            }, ['command'])
        },
        pause: {
            discriminant: 'pause',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Pause the automation loop',
            schema: objectSchema({
                command: literalSchema('pause')
            }, ['command'])
        },
        resume: {
            discriminant: 'resume',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Resume the automation loop',
            schema: objectSchema({
                command: literalSchema('resume')
            }, ['command'])
        },
        next: {
            discriminant: 'next',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Execute the next task (single step)',
            schema: objectSchema({
                command: literalSchema('next')
            }, ['command'])
        },
        refresh: {
            discriminant: 'refresh',
            discriminantProperty: 'command',
            category: 'control',
            description: 'Refresh the panel content',
            schema: objectSchema({
                command: literalSchema('refresh')
            }, ['command'])
        },
        
        // Task messages
        skipTask: {
            discriminant: 'skipTask',
            discriminantProperty: 'command',
            category: 'task',
            description: 'Skip the current task',
            schema: objectSchema({
                command: literalSchema('skipTask')
            }, ['command'])
        },
        retryTask: {
            discriminant: 'retryTask',
            discriminantProperty: 'command',
            category: 'task',
            description: 'Retry the first blocked/failed task',
            schema: objectSchema({
                command: literalSchema('retryTask')
            }, ['command'])
        },
        completeAllTasks: {
            discriminant: 'completeAllTasks',
            discriminantProperty: 'command',
            category: 'task',
            description: 'Mark all tasks as complete',
            schema: objectSchema({
                command: literalSchema('completeAllTasks')
            }, ['command'])
        },
        resetAllTasks: {
            discriminant: 'resetAllTasks',
            discriminantProperty: 'command',
            category: 'task',
            description: 'Reset all tasks to pending',
            schema: objectSchema({
                command: literalSchema('resetAllTasks')
            }, ['command'])
        },
        reorderTasks: {
            discriminant: 'reorderTasks',
            discriminantProperty: 'command',
            category: 'task',
            description: 'Reorder tasks with new priority',
            schema: objectSchema({
                command: literalSchema('reorderTasks'),
                taskIds: arraySchema(stringSchema({ minLength: 1 }), { 
                    minItems: 1,
                    description: 'New order of task IDs' 
                })
            }, ['command', 'taskIds'])
        },
        
        // PRD messages
        generatePrd: {
            discriminant: 'generatePrd',
            discriminantProperty: 'command',
            category: 'prd',
            description: 'Generate a new PRD from task description',
            schema: objectSchema({
                command: literalSchema('generatePrd'),
                taskDescription: stringSchema({ 
                    minLength: 1,
                    description: 'Description of tasks to generate PRD from' 
                })
            }, ['command', 'taskDescription'])
        },
        requirementsChanged: {
            discriminant: 'requirementsChanged',
            discriminantProperty: 'command',
            category: 'prd',
            description: 'User changed requirement checkbox selections',
            schema: objectSchema({
                command: literalSchema('requirementsChanged'),
                requirements: refSchema('TaskRequirements')
            }, ['command', 'requirements'])
        },
        settingsChanged: {
            discriminant: 'settingsChanged',
            discriminantProperty: 'command',
            category: 'prd',
            description: 'User changed settings',
            schema: objectSchema({
                command: literalSchema('settingsChanged'),
                settings: refSchema('RalphSettings')
            }, ['command', 'settings'])
        },
        
        // Export messages
        exportData: {
            discriminant: 'exportData',
            discriminantProperty: 'command',
            category: 'export',
            description: 'Export timeline data',
            schema: objectSchema({
                command: literalSchema('exportData'),
                format: optional(refSchema('ExportFormat'))
            }, ['command'])
        },
        exportLog: {
            discriminant: 'exportLog',
            discriminantProperty: 'command',
            category: 'export',
            description: 'Export activity log entries',
            schema: objectSchema({
                command: literalSchema('exportLog'),
                entries: arraySchema(refSchema('LogEntry'), {
                    description: 'Log entries to export'
                })
            }, ['command', 'entries'])
        },
        generateReport: {
            discriminant: 'generateReport',
            discriminantProperty: 'command',
            category: 'export',
            description: 'Generate a productivity report',
            schema: objectSchema({
                command: literalSchema('generateReport'),
                period: enumSchema(['today', 'week', 'month', 'custom']),
                format: enumSchema(['markdown', 'html', 'json']),
                customStartDate: optional(stringSchema()),
                customEndDate: optional(stringSchema())
            }, ['command', 'period', 'format'])
        },
        
        // State messages
        panelStateChanged: {
            discriminant: 'panelStateChanged',
            discriminantProperty: 'command',
            category: 'state',
            description: 'Panel state changed',
            schema: objectSchema({
                command: literalSchema('panelStateChanged'),
                collapsedSections: optional(arraySchema(stringSchema())),
                scrollPosition: optional(numberSchema({ minimum: 0 }))
            }, ['command'])
        },
        webviewError: {
            discriminant: 'webviewError',
            discriminantProperty: 'command',
            category: 'state',
            description: 'Webview script error occurred',
            schema: objectSchema({
                command: literalSchema('webviewError'),
                error: optional(refSchema('WebviewError'))
            }, ['command'])
        },
        openPanel: {
            discriminant: 'openPanel',
            discriminantProperty: 'command',
            category: 'state',
            description: 'Open the main panel from sidebar',
            schema: objectSchema({
                command: literalSchema('openPanel')
            }, ['command'])
        }
    }
};

/**
 * Schema collection for all outgoing extension messages.
 */
export const OUTGOING_MESSAGE_SCHEMAS: MessageSchemaCollection = {
    name: 'OutgoingExtensionMessage',
    description: 'Messages sent from extension to webview',
    discriminantProperty: 'type',
    definitions: SHARED_DEFINITIONS,
    messages: {
        update: {
            discriminant: 'update',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Update loop status, iteration count, and current task',
            schema: objectSchema({
                type: literalSchema('update'),
                status: stringSchema({ description: 'Current loop status' }),
                iteration: integerSchema({ minimum: 0, description: 'Current iteration number' }),
                taskInfo: stringSchema({ description: 'Current task information' })
            }, ['type', 'status', 'iteration', 'taskInfo'])
        },
        countdown: {
            discriminant: 'countdown',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Update countdown timer display',
            schema: objectSchema({
                type: literalSchema('countdown'),
                seconds: integerSchema({ minimum: 0, description: 'Seconds remaining' })
            }, ['type', 'seconds'])
        },
        history: {
            discriminant: 'history',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Update task completion history',
            schema: objectSchema({
                type: literalSchema('history'),
                history: arraySchema(refSchema('TaskCompletion'))
            }, ['type', 'history'])
        },
        timing: {
            discriminant: 'timing',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Update session timing information',
            schema: objectSchema({
                type: literalSchema('timing'),
                startTime: numberSchema({ description: 'Session start timestamp' }),
                taskHistory: arraySchema(refSchema('TaskCompletion')),
                pendingTasks: integerSchema({ minimum: 0, description: 'Number of pending tasks' })
            }, ['type', 'startTime', 'taskHistory', 'pendingTasks'])
        },
        stats: {
            discriminant: 'stats',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Update task statistics',
            schema: objectSchema({
                type: literalSchema('stats'),
                completed: integerSchema({ minimum: 0, description: 'Number of completed tasks' }),
                pending: integerSchema({ minimum: 0, description: 'Number of pending tasks' }),
                total: integerSchema({ minimum: 0, description: 'Total number of tasks' }),
                progress: numberSchema({ minimum: 0, maximum: 100, description: 'Progress percentage' }),
                nextTask: optional(stringSchema({ description: 'Next task description if available' })),
                tasks: optional(arraySchema(refSchema('Task')))
            }, ['type', 'completed', 'pending', 'total', 'progress'])
        },
        log: {
            discriminant: 'log',
            discriminantProperty: 'type',
            category: 'logging',
            description: 'Add a log entry to the activity log',
            schema: objectSchema({
                type: literalSchema('log'),
                message: stringSchema({ description: 'Log message' }),
                highlight: booleanSchema({ description: 'Whether to highlight this entry' }),
                level: optional(refSchema('LogLevel'))
            }, ['type', 'message', 'highlight'])
        },
        prdGenerating: {
            discriminant: 'prdGenerating',
            discriminantProperty: 'type',
            category: 'prd',
            description: 'PRD generation has started',
            schema: objectSchema({
                type: literalSchema('prdGenerating')
            }, ['type'])
        },
        prdComplete: {
            discriminant: 'prdComplete',
            discriminantProperty: 'type',
            category: 'prd',
            description: 'PRD generation has completed',
            schema: objectSchema({
                type: literalSchema('prdComplete')
            }, ['type'])
        },
        toast: {
            discriminant: 'toast',
            discriminantProperty: 'type',
            category: 'notification',
            description: 'Show a toast notification',
            schema: objectSchema({
                type: literalSchema('toast'),
                toastType: refSchema('ToastType'),
                message: stringSchema({ description: 'Toast message' }),
                title: optional(stringSchema({ description: 'Optional toast title' })),
                duration: optional(integerSchema({ minimum: 0, description: 'Display duration in ms' })),
                dismissible: optional(booleanSchema({ description: 'Whether user can dismiss' }))
            }, ['type', 'toastType', 'message'])
        },
        loading: {
            discriminant: 'loading',
            discriminantProperty: 'type',
            category: 'status',
            description: 'Show/hide loading overlay',
            schema: objectSchema({
                type: literalSchema('loading'),
                isLoading: booleanSchema({ description: 'Whether to show loading state' })
            }, ['type', 'isLoading'])
        },
        error: {
            discriminant: 'error',
            discriminantProperty: 'type',
            category: 'error',
            description: 'Display an error message',
            schema: objectSchema({
                type: literalSchema('error'),
                message: stringSchema({ description: 'Error message' }),
                code: optional(stringSchema({ description: 'Error code for programmatic handling' }))
            }, ['type', 'message'])
        }
    }
};

// ============================================================================
// TYPE GENERATION UTILITIES
// ============================================================================

/**
 * Generate TypeScript type string from a property schema.
 * This produces a string representation of the TypeScript type.
 */
export function generateTypeString(schema: PropertySchema, definitions?: Readonly<Record<string, PropertySchema>>): string {
    // Handle reference schemas
    if (isRefSchema(schema)) {
        const refName = schema.$ref;
        // Check if it's a known type name, otherwise inline it
        if (definitions && definitions[refName]) {
            return refName;
        }
        return refName;
    }
    
    // Handle literal schemas
    if (isLiteralSchema(schema)) {
        const value = schema.value;
        return typeof value === 'string' ? `'${value}'` : String(value);
    }
    
    // Handle base schemas
    const baseSchema = schema as BaseSchema;
    
    // Handle union types
    if (Array.isArray(baseSchema.type)) {
        const unionSchema = schema as UnionSchema;
        if (unionSchema.oneOf) {
            return unionSchema.oneOf.map(s => generateTypeString(s, definitions)).join(' | ');
        }
        return baseSchema.type.join(' | ');
    }
    
    switch (baseSchema.type) {
        case 'string': {
            const strSchema = schema as StringSchema;
            if (strSchema.enum) {
                return strSchema.enum.map(v => `'${v}'`).join(' | ');
            }
            return 'string';
        }
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'null':
            return 'null';
        case 'undefined':
            return 'undefined';
        case 'array': {
            const arrSchema = schema as ArraySchema;
            const itemType = generateTypeString(arrSchema.items, definitions);
            return `${itemType}[]`;
        }
        case 'object': {
            const objSchema = schema as ObjectSchema;
            const props = Object.entries(objSchema.properties).map(([name, propSchema]) => {
                const propType = generateTypeString(propSchema, definitions);
                const propIsOptional = isSchemaOptional(propSchema) || 
                    (objSchema.required && !objSchema.required.includes(name));
                const optionalMarker = propIsOptional ? '?' : '';
                const readonlyMarker = isSchemaReadonly(propSchema) ? 'readonly ' : '';
                return `  ${readonlyMarker}${name}${optionalMarker}: ${propType};`;
            });
            return `{\n${props.join('\n')}\n}`;
        }
        default:
            return 'unknown';
    }
}

/**
 * Generate TypeScript interface declaration from a message schema.
 */
export function generateInterfaceDeclaration(
    name: string,
    schema: MessageSchema,
    definitions?: Readonly<Record<string, PropertySchema>>
): string {
    const props = Object.entries(schema.schema.properties).map(([propName, propSchema]) => {
        const propType = generateTypeString(propSchema, definitions);
        const isRequired = schema.schema.required?.includes(propName);
        const optionalMarker = isRequired ? '' : '?';
        const description = getSchemaDescription(propSchema) || '';
        const docComment = description ? `  /** ${description} */\n` : '';
        return `${docComment}  readonly ${propName}${optionalMarker}: ${propType};`;
    });
    
    const docComment = schema.description 
        ? `/**\n * ${schema.description}\n */\n`
        : '';
    
    return `${docComment}export interface ${name} {\n${props.join('\n')}\n}`;
}

/**
 * Generate a complete TypeScript file with all types from a schema collection.
 */
export function generateTypeFile(collection: MessageSchemaCollection): string {
    const lines: string[] = [];
    
    // File header
    lines.push('/**');
    lines.push(` * Auto-generated types from ${collection.name} schema`);
    lines.push(' * DO NOT EDIT - Generated by schemaTypes.ts');
    lines.push(' */');
    lines.push('');
    
    // Generate definition types first
    if (collection.definitions) {
        lines.push('// ============================================================================');
        lines.push('// SHARED TYPE DEFINITIONS');
        lines.push('// ============================================================================');
        lines.push('');
        
        for (const [name, schema] of Object.entries(collection.definitions)) {
            // Skip enums, handle them specially
            if ((schema as StringSchema).enum) {
                const enumValues = (schema as StringSchema).enum!;
                lines.push(`export type ${name} = ${enumValues.map(v => `'${v}'`).join(' | ')};`);
            } else {
                const typeString = generateTypeString(schema, collection.definitions);
                lines.push(`export type ${name} = ${typeString};`);
            }
            lines.push('');
        }
    }
    
    // Generate message interfaces
    lines.push('// ============================================================================');
    lines.push('// MESSAGE INTERFACES');
    lines.push('// ============================================================================');
    lines.push('');
    
    const interfaceNames: string[] = [];
    for (const [command, schema] of Object.entries(collection.messages)) {
        const interfaceName = capitalizeFirst(command) + 'Message';
        interfaceNames.push(interfaceName);
        lines.push(generateInterfaceDeclaration(interfaceName, schema, collection.definitions));
        lines.push('');
    }
    
    // Generate discriminated union
    lines.push('// ============================================================================');
    lines.push('// DISCRIMINATED UNION');
    lines.push('// ============================================================================');
    lines.push('');
    lines.push(`/**`);
    lines.push(` * Discriminated union of all ${collection.name} types.`);
    lines.push(` * Discriminant: \`${collection.discriminantProperty}\` property`);
    lines.push(` */`);
    lines.push(`export type ${collection.name} =`);
    lines.push(`  | ${interfaceNames.join('\n  | ')};`);
    lines.push('');
    
    // Generate command/type constants
    const discriminantValues = Object.keys(collection.messages);
    const constantName = collection.discriminantProperty === 'command' 
        ? 'ALL_COMMANDS' 
        : 'ALL_TYPES';
    lines.push(`export const ${constantName} = [`);
    lines.push(`  ${discriminantValues.map(v => `'${v}'`).join(',\n  ')}`);
    lines.push('] as const;');
    lines.push('');
    
    return lines.join('\n');
}

/**
 * Capitalize the first letter of a string.
 */
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// VALIDATOR GENERATION
// ============================================================================

/**
 * Interface for generated validators.
 */
export interface GeneratedValidator<T = unknown> {
    /** Validate a value against the schema */
    validate(value: unknown): value is T;
    /** Get validation errors for a value */
    getErrors(value: unknown): string[];
    /** The schema this validator was generated from */
    schema: PropertySchema;
}

/**
 * Generate a validator function from a property schema.
 */
export function generateValidator<T = unknown>(
    schema: PropertySchema,
    definitions?: Readonly<Record<string, PropertySchema>>
): GeneratedValidator<T> {
    const errors: string[] = [];
    
    function validateSchema(value: unknown, currentSchema: PropertySchema, path: string): boolean {
        // Handle reference schemas
        if (isRefSchema(currentSchema)) {
            const refName = currentSchema.$ref;
            if (definitions && definitions[refName]) {
                return validateSchema(value, definitions[refName], path);
            }
            return true; // Unknown reference, assume valid
        }
        
        // Handle literal schemas
        if (isLiteralSchema(currentSchema)) {
            if (value !== currentSchema.value) {
                errors.push(`${path}: expected literal value '${currentSchema.value}', got '${value}'`);
                return false;
            }
            return true;
        }
        
        // Handle optional values
        if (isSchemaOptional(currentSchema) && (value === undefined || value === null)) {
            return true;
        }
        
        const baseSchema = currentSchema as BaseSchema;
        
        // Handle union types
        if (Array.isArray(baseSchema.type)) {
            const unionSchema = currentSchema as UnionSchema;
            if (unionSchema.oneOf) {
                const originalErrors = [...errors];
                for (const subSchema of unionSchema.oneOf) {
                    errors.length = 0;
                    if (validateSchema(value, subSchema, path)) {
                        return true;
                    }
                }
                errors.length = 0;
                errors.push(...originalErrors);
                errors.push(`${path}: does not match any of the union types`);
                return false;
            }
            // Simple type union
            const matchesAny = baseSchema.type.some(t => {
                if (t === 'null') return value === null;
                if (t === 'undefined') return value === undefined;
                return typeof value === t;
            });
            if (!matchesAny) {
                errors.push(`${path}: expected one of [${baseSchema.type.join(', ')}], got ${typeof value}`);
                return false;
            }
            return true;
        }
        
        switch (baseSchema.type) {
            case 'string': {
                if (typeof value !== 'string') {
                    errors.push(`${path}: expected string, got ${typeof value}`);
                    return false;
                }
                const strSchema = currentSchema as StringSchema;
                if (strSchema.enum && !strSchema.enum.includes(value)) {
                    errors.push(`${path}: expected one of [${strSchema.enum.join(', ')}], got '${value}'`);
                    return false;
                }
                if (strSchema.minLength !== undefined && value.length < strSchema.minLength) {
                    errors.push(`${path}: string length ${value.length} is less than minimum ${strSchema.minLength}`);
                    return false;
                }
                if (strSchema.maxLength !== undefined && value.length > strSchema.maxLength) {
                    errors.push(`${path}: string length ${value.length} exceeds maximum ${strSchema.maxLength}`);
                    return false;
                }
                if (strSchema.pattern && !new RegExp(strSchema.pattern).test(value)) {
                    errors.push(`${path}: string does not match pattern '${strSchema.pattern}'`);
                    return false;
                }
                return true;
            }
            
            case 'number': {
                if (typeof value !== 'number' || !Number.isFinite(value)) {
                    errors.push(`${path}: expected number, got ${typeof value}`);
                    return false;
                }
                const numSchema = currentSchema as NumberSchema;
                if (numSchema.integer && !Number.isInteger(value)) {
                    errors.push(`${path}: expected integer, got ${value}`);
                    return false;
                }
                if (numSchema.minimum !== undefined && value < numSchema.minimum) {
                    errors.push(`${path}: value ${value} is less than minimum ${numSchema.minimum}`);
                    return false;
                }
                if (numSchema.maximum !== undefined && value > numSchema.maximum) {
                    errors.push(`${path}: value ${value} exceeds maximum ${numSchema.maximum}`);
                    return false;
                }
                return true;
            }
            
            case 'boolean': {
                if (typeof value !== 'boolean') {
                    errors.push(`${path}: expected boolean, got ${typeof value}`);
                    return false;
                }
                return true;
            }
            
            case 'null': {
                if (value !== null) {
                    errors.push(`${path}: expected null, got ${typeof value}`);
                    return false;
                }
                return true;
            }
            
            case 'undefined': {
                if (value !== undefined) {
                    errors.push(`${path}: expected undefined, got ${typeof value}`);
                    return false;
                }
                return true;
            }
            
            case 'array': {
                if (!Array.isArray(value)) {
                    errors.push(`${path}: expected array, got ${typeof value}`);
                    return false;
                }
                const arrSchema = currentSchema as ArraySchema;
                if (arrSchema.minItems !== undefined && value.length < arrSchema.minItems) {
                    errors.push(`${path}: array length ${value.length} is less than minimum ${arrSchema.minItems}`);
                    return false;
                }
                if (arrSchema.maxItems !== undefined && value.length > arrSchema.maxItems) {
                    errors.push(`${path}: array length ${value.length} exceeds maximum ${arrSchema.maxItems}`);
                    return false;
                }
                for (let i = 0; i < value.length; i++) {
                    if (!validateSchema(value[i], arrSchema.items, `${path}[${i}]`)) {
                        return false;
                    }
                }
                return true;
            }
            
            case 'object': {
                if (typeof value !== 'object' || value === null || Array.isArray(value)) {
                    errors.push(`${path}: expected object, got ${value === null ? 'null' : typeof value}`);
                    return false;
                }
                const objSchema = currentSchema as ObjectSchema;
                const obj = value as Record<string, unknown>;
                
                // Check required properties
                if (objSchema.required) {
                    for (const reqProp of objSchema.required) {
                        if (!(reqProp in obj)) {
                            errors.push(`${path}: missing required property '${reqProp}'`);
                            return false;
                        }
                    }
                }
                
                // Validate each property
                for (const [propName, propSchema] of Object.entries(objSchema.properties)) {
                    if (propName in obj) {
                        if (!validateSchema(obj[propName], propSchema, `${path}.${propName}`)) {
                            return false;
                        }
                    } else if (!isSchemaOptional(propSchema) && objSchema.required?.includes(propName)) {
                        errors.push(`${path}: missing required property '${propName}'`);
                        return false;
                    }
                }
                
                // Check for additional properties
                if (objSchema.additionalProperties === false) {
                    const knownProps = new Set(Object.keys(objSchema.properties));
                    for (const key of Object.keys(obj)) {
                        if (!knownProps.has(key)) {
                            errors.push(`${path}: unexpected property '${key}'`);
                            return false;
                        }
                    }
                }
                
                return true;
            }
            
            default:
                return true;
        }
    }
    
    return {
        validate(value: unknown): value is T {
            errors.length = 0;
            return validateSchema(value, schema, '$');
        },
        getErrors(value: unknown): string[] {
            errors.length = 0;
            validateSchema(value, schema, '$');
            return [...errors];
        },
        schema
    };
}

/**
 * Generate validators for all messages in a schema collection.
 */
export function generateMessageValidators(
    collection: MessageSchemaCollection
): Map<string, GeneratedValidator> {
    const validators = new Map<string, GeneratedValidator>();
    
    for (const [command, messageSchema] of Object.entries(collection.messages)) {
        validators.set(command, generateValidator(messageSchema.schema, collection.definitions));
    }
    
    return validators;
}

// ============================================================================
// RUNTIME TYPE GUARD GENERATION
// ============================================================================

/**
 * Create a type guard function for a specific message schema.
 */
export function createMessageTypeGuard<T>(
    collection: MessageSchemaCollection,
    discriminant: string
): (msg: unknown) => msg is T {
    const messageSchema = collection.messages[discriminant];
    if (!messageSchema) {
        throw new Error(`Unknown message discriminant: ${discriminant}`);
    }
    
    const validator = generateValidator<T>(messageSchema.schema, collection.definitions);
    
    return (msg: unknown): msg is T => validator.validate(msg);
}

/**
 * Create type guards for all messages in a collection.
 */
export function createAllTypeGuards(collection: MessageSchemaCollection): Record<string, (msg: unknown) => boolean> {
    const guards: Record<string, (msg: unknown) => boolean> = {};
    
    for (const discriminant of Object.keys(collection.messages)) {
        guards[discriminant] = createMessageTypeGuard(collection, discriminant);
    }
    
    return guards;
}

// ============================================================================
// SCHEMA INTROSPECTION
// ============================================================================

/**
 * Get all message discriminants (command or type values) from a collection.
 */
export function getDiscriminants(collection: MessageSchemaCollection): string[] {
    return Object.keys(collection.messages);
}

/**
 * Get messages grouped by category.
 */
export function getMessagesByCategory(collection: MessageSchemaCollection): Map<string, string[]> {
    const categories = new Map<string, string[]>();
    
    for (const [command, schema] of Object.entries(collection.messages)) {
        const category = schema.category || 'uncategorized';
        if (!categories.has(category)) {
            categories.set(category, []);
        }
        categories.get(category)!.push(command);
    }
    
    return categories;
}

/**
 * Get the schema for a specific message.
 */
export function getMessageSchema(collection: MessageSchemaCollection, discriminant: string): MessageSchema | undefined {
    return collection.messages[discriminant];
}

/**
 * Check if a collection contains a specific message.
 */
export function hasMessage(collection: MessageSchemaCollection, discriminant: string): boolean {
    return discriminant in collection.messages;
}

/**
 * Get all property names for a message schema.
 */
export function getMessageProperties(collection: MessageSchemaCollection, discriminant: string): string[] {
    const schema = collection.messages[discriminant];
    if (!schema) {
        return [];
    }
    return Object.keys(schema.schema.properties);
}

/**
 * Get required property names for a message schema.
 */
export function getRequiredProperties(collection: MessageSchemaCollection, discriminant: string): string[] {
    const schema = collection.messages[discriminant];
    if (!schema) {
        return [];
    }
    return schema.schema.required ? [...schema.schema.required] : [];
}

// ============================================================================
// PRE-GENERATED VALIDATORS
// ============================================================================

/** Pre-generated validators for incoming webview messages */
export const INCOMING_MESSAGE_VALIDATORS = generateMessageValidators(INCOMING_MESSAGE_SCHEMAS);

/** Pre-generated validators for outgoing extension messages */
export const OUTGOING_MESSAGE_VALIDATORS = generateMessageValidators(OUTGOING_MESSAGE_SCHEMAS);

/** Pre-generated type guards for incoming messages */
export const INCOMING_TYPE_GUARDS = createAllTypeGuards(INCOMING_MESSAGE_SCHEMAS);

/** Pre-generated type guards for outgoing messages */
export const OUTGOING_TYPE_GUARDS = createAllTypeGuards(OUTGOING_MESSAGE_SCHEMAS);

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Validate an incoming webview message using generated validators.
 */
export function validateIncomingMessageFromSchema(msg: unknown): { valid: boolean; errors: string[] } {
    if (typeof msg !== 'object' || msg === null) {
        return { valid: false, errors: ['Message must be a non-null object'] };
    }
    
    const command = (msg as Record<string, unknown>).command;
    if (typeof command !== 'string') {
        return { valid: false, errors: ['Message must have a string "command" property'] };
    }
    
    const validator = INCOMING_MESSAGE_VALIDATORS.get(command);
    if (!validator) {
        return { valid: false, errors: [`Unknown command: '${command}'`] };
    }
    
    const valid = validator.validate(msg);
    const errors = valid ? [] : validator.getErrors(msg);
    return { valid, errors };
}

/**
 * Validate an outgoing extension message using generated validators.
 */
export function validateOutgoingMessageFromSchema(msg: unknown): { valid: boolean; errors: string[] } {
    if (typeof msg !== 'object' || msg === null) {
        return { valid: false, errors: ['Message must be a non-null object'] };
    }
    
    const type = (msg as Record<string, unknown>).type;
    if (typeof type !== 'string') {
        return { valid: false, errors: ['Message must have a string "type" property'] };
    }
    
    const validator = OUTGOING_MESSAGE_VALIDATORS.get(type);
    if (!validator) {
        return { valid: false, errors: [`Unknown message type: '${type}'`] };
    }
    
    const valid = validator.validate(msg);
    const errors = valid ? [] : validator.getErrors(msg);
    return { valid, errors };
}
