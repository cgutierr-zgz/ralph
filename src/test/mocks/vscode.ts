/**
 * Mock implementations for VS Code API types.
 * These mocks simulate the VS Code API for unit testing without the extension host.
 */

// ============================================================================
// URI Mock
// ============================================================================

export class MockUri {
    constructor(
        public readonly scheme: string,
        public readonly authority: string,
        public readonly path: string,
        public readonly query: string,
        public readonly fragment: string
    ) {}

    get fsPath(): string {
        return this.path;
    }

    with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): MockUri {
        return new MockUri(
            change.scheme ?? this.scheme,
            change.authority ?? this.authority,
            change.path ?? this.path,
            change.query ?? this.query,
            change.fragment ?? this.fragment
        );
    }

    toString(): string {
        return `${this.scheme}://${this.authority}${this.path}${this.query ? '?' + this.query : ''}${this.fragment ? '#' + this.fragment : ''}`;
    }

    toJSON(): object {
        return {
            $mid: 1,
            scheme: this.scheme,
            authority: this.authority,
            path: this.path,
            query: this.query,
            fragment: this.fragment
        };
    }

    static file(path: string): MockUri {
        return new MockUri('file', '', path, '', '');
    }

    static parse(value: string): MockUri {
        const match = /^([^:]+):\/\/([^/]*)(.*)$/.exec(value);
        if (match) {
            return new MockUri(match[1], match[2], match[3], '', '');
        }
        return new MockUri('file', '', value, '', '');
    }

    static joinPath(base: MockUri, ...pathSegments: string[]): MockUri {
        const joinedPath = [base.path, ...pathSegments].join('/').replace(/\/+/g, '/');
        return new MockUri(base.scheme, base.authority, joinedPath, base.query, base.fragment);
    }
}

// ============================================================================
// Disposable Mock
// ============================================================================

export class MockDisposable {
    private disposed = false;
    private disposeCallback?: () => void;

    constructor(disposeCallback?: () => void) {
        this.disposeCallback = disposeCallback;
    }

    dispose(): void {
        if (!this.disposed) {
            this.disposed = true;
            this.disposeCallback?.();
        }
    }

    get isDisposed(): boolean {
        return this.disposed;
    }

    static from(...disposables: Array<{ dispose: () => void }>): MockDisposable {
        return new MockDisposable(() => {
            disposables.forEach(d => d.dispose());
        });
    }
}

// ============================================================================
// Event Emitter Mock
// ============================================================================

export type MockEventListener<T> = (e: T) => void | Promise<void>;

export class MockEventEmitter<T> {
    private listeners: MockEventListener<T>[] = [];
    private disposed = false;

    readonly event = (listener: MockEventListener<T>): MockDisposable => {
        if (this.disposed) {
            return new MockDisposable();
        }
        this.listeners.push(listener);
        return new MockDisposable(() => {
            const index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        });
    };

    fire(data: T): void {
        if (this.disposed) { return; }
        this.listeners.forEach(listener => listener(data));
    }

    dispose(): void {
        this.disposed = true;
        this.listeners = [];
    }

    get listenerCount(): number {
        return this.listeners.length;
    }
}

// ============================================================================
// Webview Mock
// ============================================================================

export interface MockWebviewOptions {
    enableScripts?: boolean;
    enableCommandUris?: boolean;
    localResourceRoots?: MockUri[];
}

export class MockWebview {
    private _html = '';
    private _options: MockWebviewOptions = {};
    private messages: object[] = [];
    private readonly messageEmitter = new MockEventEmitter<object>();
    private disposed = false;

    constructor(options?: MockWebviewOptions) {
        this._options = options ?? {};
    }

    get html(): string {
        return this._html;
    }

    set html(value: string) {
        this._html = value;
    }

    get options(): MockWebviewOptions {
        return this._options;
    }

    set options(value: MockWebviewOptions) {
        this._options = value;
    }

    get onDidReceiveMessage() {
        return this.messageEmitter.event;
    }

    postMessage(message: object): Thenable<boolean> {
        if (this.disposed) {
            return Promise.resolve(false);
        }
        this.messages.push(message);
        return Promise.resolve(true);
    }

    asWebviewUri(localResource: MockUri): MockUri {
        return new MockUri('vscode-webview', '', localResource.path, '', '');
    }

    get cspSource(): string {
        return 'https://webview.example.com';
    }

    // Test helper methods
    getPostedMessages(): object[] {
        return [...this.messages];
    }

    getLastPostedMessage<T extends object>(): T | undefined {
        return this.messages[this.messages.length - 1] as T;
    }

    clearMessages(): void {
        this.messages = [];
    }

    simulateMessage(message: object): void {
        this.messageEmitter.fire(message);
    }

    dispose(): void {
        this.disposed = true;
        this.messageEmitter.dispose();
    }
}

// ============================================================================
// Webview Panel Mock
// ============================================================================

export class MockWebviewPanel {
    private _viewType: string;
    private _title: string;
    private readonly _webview: MockWebview;
    private _visible = true;
    private _active = true;
    private _viewColumn: number;
    private disposed = false;

    private readonly disposeEmitter = new MockEventEmitter<void>();
    private readonly visibilityChangeEmitter = new MockEventEmitter<void>();
    private readonly activeChangeEmitter = new MockEventEmitter<void>();

    readonly iconPath: MockUri | undefined;

    constructor(
        viewType: string,
        title: string,
        viewColumn: number,
        webviewOptions?: MockWebviewOptions
    ) {
        this._viewType = viewType;
        this._title = title;
        this._viewColumn = viewColumn;
        this._webview = new MockWebview(webviewOptions);
    }

    get viewType(): string {
        return this._viewType;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get webview(): MockWebview {
        return this._webview;
    }

    get visible(): boolean {
        return this._visible;
    }

    get active(): boolean {
        return this._active;
    }

    get viewColumn(): number | undefined {
        return this._viewColumn;
    }

    get onDidDispose() {
        return this.disposeEmitter.event;
    }

    get onDidChangeViewState() {
        return this.visibilityChangeEmitter.event;
    }

    reveal(viewColumn?: number, preserveFocus?: boolean): void {
        if (this.disposed) { return; }
        this._viewColumn = viewColumn ?? this._viewColumn;
        this._visible = true;
        this._active = !preserveFocus;
        this.visibilityChangeEmitter.fire();
    }

    dispose(): void {
        if (this.disposed) { return; }
        this.disposed = true;
        this._webview.dispose();
        this.disposeEmitter.fire();
        this.disposeEmitter.dispose();
        this.visibilityChangeEmitter.dispose();
        this.activeChangeEmitter.dispose();
    }

    // Test helper methods
    setVisible(visible: boolean): void {
        this._visible = visible;
        this.visibilityChangeEmitter.fire();
    }

    setActive(active: boolean): void {
        this._active = active;
        this.activeChangeEmitter.fire();
    }

    get isDisposed(): boolean {
        return this.disposed;
    }
}

// ============================================================================
// Webview View Mock (for sidebar)
// ============================================================================

export class MockWebviewView {
    private readonly _webview: MockWebview;
    private _visible = true;
    private _title: string;
    private _description?: string;
    private readonly _viewType: string;
    private disposed = false;

    private readonly visibilityChangeEmitter = new MockEventEmitter<void>();
    private readonly disposeEmitter = new MockEventEmitter<void>();

    constructor(
        viewType: string,
        title: string,
        webviewOptions?: MockWebviewOptions
    ) {
        this._viewType = viewType;
        this._title = title;
        this._webview = new MockWebview(webviewOptions);
    }

    get viewType(): string {
        return this._viewType;
    }

    get webview(): MockWebview {
        return this._webview;
    }

    get visible(): boolean {
        return this._visible;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get onDidChangeVisibility() {
        return this.visibilityChangeEmitter.event;
    }

    get onDidDispose() {
        return this.disposeEmitter.event;
    }

    show(preserveFocus?: boolean): void {
        this._visible = true;
        this.visibilityChangeEmitter.fire();
    }

    dispose(): void {
        if (this.disposed) { return; }
        this.disposed = true;
        this._webview.dispose();
        this.disposeEmitter.fire();
        this.visibilityChangeEmitter.dispose();
        this.disposeEmitter.dispose();
    }

    // Test helper methods
    setVisible(visible: boolean): void {
        this._visible = visible;
        this.visibilityChangeEmitter.fire();
    }

    get isDisposed(): boolean {
        return this.disposed;
    }
}

// ============================================================================
// Extension Context Mock
// ============================================================================

export class MockMemento {
    private storage = new Map<string, unknown>();

    get<T>(key: string): T | undefined;
    get<T>(key: string, defaultValue: T): T;
    get<T>(key: string, defaultValue?: T): T | undefined {
        if (this.storage.has(key)) {
            return this.storage.get(key) as T;
        }
        return defaultValue;
    }

    async update(key: string, value: unknown): Promise<void> {
        if (value === undefined) {
            this.storage.delete(key);
        } else {
            this.storage.set(key, value);
        }
    }

    keys(): readonly string[] {
        return Array.from(this.storage.keys());
    }

    // Test helper methods
    clear(): void {
        this.storage.clear();
    }

    has(key: string): boolean {
        return this.storage.has(key);
    }

    getAll(): Map<string, unknown> {
        return new Map(this.storage);
    }
}

export class MockSecretStorage {
    private storage = new Map<string, string>();
    private readonly changeEmitter = new MockEventEmitter<{ key: string }>();

    get onDidChange() {
        return this.changeEmitter.event;
    }

    async get(key: string): Promise<string | undefined> {
        return this.storage.get(key);
    }

    async store(key: string, value: string): Promise<void> {
        this.storage.set(key, value);
        this.changeEmitter.fire({ key });
    }

    async delete(key: string): Promise<void> {
        this.storage.delete(key);
        this.changeEmitter.fire({ key });
    }

    // Test helper methods
    clear(): void {
        this.storage.clear();
    }
}

export class MockExtensionContext {
    readonly subscriptions: MockDisposable[] = [];
    readonly workspaceState: MockMemento;
    readonly globalState: MockMemento;
    readonly secrets: MockSecretStorage;
    readonly extensionUri: MockUri;
    readonly extensionPath: string;
    readonly globalStorageUri: MockUri;
    readonly logUri: MockUri;
    readonly storageUri: MockUri;
    readonly extensionMode: number = 1; // Development

    constructor(extensionPath = '/test/extension') {
        this.extensionPath = extensionPath;
        this.extensionUri = MockUri.file(extensionPath);
        this.globalStorageUri = MockUri.file(`${extensionPath}/.global-storage`);
        this.logUri = MockUri.file(`${extensionPath}/.logs`);
        this.storageUri = MockUri.file(`${extensionPath}/.storage`);
        this.workspaceState = new MockMemento();
        this.globalState = new MockMemento();
        this.secrets = new MockSecretStorage();
    }

    asAbsolutePath(relativePath: string): string {
        return `${this.extensionPath}/${relativePath}`;
    }

    // Test helper methods
    dispose(): void {
        this.subscriptions.forEach(d => d.dispose());
        this.subscriptions.length = 0;
    }

    clearState(): void {
        this.workspaceState.clear();
        this.globalState.clear();
        this.secrets.clear();
    }
}

// ============================================================================
// Status Bar Item Mock
// ============================================================================

export class MockStatusBarItem {
    text = '';
    tooltip: string | undefined;
    color: string | undefined;
    backgroundColor: object | undefined;
    command: string | undefined;
    accessibilityInformation: { label: string; role?: string } | undefined;
    alignment: number = 1; // Left
    priority: number | undefined;
    name: string | undefined;

    private _visible = false;

    show(): void {
        this._visible = true;
    }

    hide(): void {
        this._visible = false;
    }

    dispose(): void {
        this._visible = false;
    }

    // Test helper methods
    get isVisible(): boolean {
        return this._visible;
    }
}

// ============================================================================
// Output Channel Mock
// ============================================================================

export class MockOutputChannel {
    private lines: string[] = [];
    private _visible = false;
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    append(value: string): void {
        if (this.lines.length === 0) {
            this.lines.push(value);
        } else {
            this.lines[this.lines.length - 1] += value;
        }
    }

    appendLine(value: string): void {
        this.lines.push(value);
    }

    clear(): void {
        this.lines = [];
    }

    show(preserveFocus?: boolean): void;
    show(column?: number, preserveFocus?: boolean): void;
    show(_columnOrPreserveFocus?: number | boolean, _preserveFocus?: boolean): void {
        this._visible = true;
    }

    hide(): void {
        this._visible = false;
    }

    dispose(): void {
        this._visible = false;
        this.lines = [];
    }

    replace(value: string): void {
        this.lines = [value];
    }

    // Test helper methods
    getOutput(): string {
        return this.lines.join('\n');
    }

    getLines(): string[] {
        return [...this.lines];
    }

    get isVisible(): boolean {
        return this._visible;
    }
}

// ============================================================================
// Workspace Configuration Mock
// ============================================================================

export class MockWorkspaceConfiguration {
    private config = new Map<string, unknown>();
    private readonly sectionPrefix: string;

    constructor(sectionPrefix = '') {
        this.sectionPrefix = sectionPrefix;
    }

    get<T>(section: string): T | undefined;
    get<T>(section: string, defaultValue: T): T;
    get<T>(section: string, defaultValue?: T): T | undefined {
        const key = this.sectionPrefix ? `${this.sectionPrefix}.${section}` : section;
        if (this.config.has(key)) {
            return this.config.get(key) as T;
        }
        return defaultValue;
    }

    has(section: string): boolean {
        const key = this.sectionPrefix ? `${this.sectionPrefix}.${section}` : section;
        return this.config.has(key);
    }

    inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T } | undefined {
        const key = this.sectionPrefix ? `${this.sectionPrefix}.${section}` : section;
        const value = this.config.get(key) as T;
        return {
            key,
            defaultValue: undefined,
            globalValue: value,
            workspaceValue: undefined
        };
    }

    async update(section: string, value: unknown, configurationTarget?: boolean | number): Promise<void> {
        const key = this.sectionPrefix ? `${this.sectionPrefix}.${section}` : section;
        if (value === undefined) {
            this.config.delete(key);
        } else {
            this.config.set(key, value);
        }
    }

    // Test helper methods
    set(section: string, value: unknown): void {
        const key = this.sectionPrefix ? `${this.sectionPrefix}.${section}` : section;
        this.config.set(key, value);
    }

    clear(): void {
        this.config.clear();
    }

    getAll(): Map<string, unknown> {
        return new Map(this.config);
    }
}

// ============================================================================
// Theme Color Mock
// ============================================================================

export class MockThemeColor {
    constructor(public readonly id: string) {}
}

// ============================================================================
// Input Box Mock
// ============================================================================

export interface MockInputBoxOptions {
    title?: string;
    prompt?: string;
    placeHolder?: string;
    value?: string;
    password?: boolean;
    ignoreFocusOut?: boolean;
    validateInput?: (value: string) => string | undefined | null | Promise<string | undefined | null>;
}

export class MockInputBox {
    value = '';
    placeholder = '';
    password = false;
    title: string | undefined;
    prompt: string | undefined;
    validationMessage: string | undefined;
    enabled = true;
    busy = false;
    ignoreFocusOut = false;
    buttons: object[] = [];
    step: number | undefined;
    totalSteps: number | undefined;

    private readonly acceptEmitter = new MockEventEmitter<void>();
    private readonly changeEmitter = new MockEventEmitter<string>();
    private readonly hideEmitter = new MockEventEmitter<void>();
    private readonly buttonEmitter = new MockEventEmitter<object>();

    get onDidAccept() { return this.acceptEmitter.event; }
    get onDidChangeValue() { return this.changeEmitter.event; }
    get onDidHide() { return this.hideEmitter.event; }
    get onDidTriggerButton() { return this.buttonEmitter.event; }

    show(): void {}
    hide(): void { this.hideEmitter.fire(); }
    dispose(): void {
        this.acceptEmitter.dispose();
        this.changeEmitter.dispose();
        this.hideEmitter.dispose();
        this.buttonEmitter.dispose();
    }

    // Test helper methods
    accept(): void { this.acceptEmitter.fire(); }
    change(value: string): void {
        this.value = value;
        this.changeEmitter.fire(value);
    }
    triggerButton(button: object): void { this.buttonEmitter.fire(button); }
}

// ============================================================================
// Quick Pick Mock
// ============================================================================

export interface MockQuickPickItem {
    label: string;
    description?: string;
    detail?: string;
    picked?: boolean;
    alwaysShow?: boolean;
}

export class MockQuickPick<T extends MockQuickPickItem = MockQuickPickItem> {
    value = '';
    placeholder = '';
    title: string | undefined;
    items: T[] = [];
    selectedItems: T[] = [];
    activeItems: T[] = [];
    enabled = true;
    busy = false;
    ignoreFocusOut = false;
    matchOnDescription = false;
    matchOnDetail = false;
    canSelectMany = false;
    buttons: object[] = [];
    step: number | undefined;
    totalSteps: number | undefined;

    private readonly acceptEmitter = new MockEventEmitter<void>();
    private readonly changeEmitter = new MockEventEmitter<string>();
    private readonly selectionEmitter = new MockEventEmitter<T[]>();
    private readonly hideEmitter = new MockEventEmitter<void>();
    private readonly buttonEmitter = new MockEventEmitter<object>();

    get onDidAccept() { return this.acceptEmitter.event; }
    get onDidChangeValue() { return this.changeEmitter.event; }
    get onDidChangeSelection() { return this.selectionEmitter.event; }
    get onDidHide() { return this.hideEmitter.event; }
    get onDidTriggerButton() { return this.buttonEmitter.event; }

    show(): void {}
    hide(): void { this.hideEmitter.fire(); }
    dispose(): void {
        this.acceptEmitter.dispose();
        this.changeEmitter.dispose();
        this.selectionEmitter.dispose();
        this.hideEmitter.dispose();
        this.buttonEmitter.dispose();
    }

    // Test helper methods
    accept(): void { this.acceptEmitter.fire(); }
    select(items: T[]): void {
        this.selectedItems = items;
        this.selectionEmitter.fire(items);
    }
    change(value: string): void {
        this.value = value;
        this.changeEmitter.fire(value);
    }
}

// ============================================================================
// Progress Mock
// ============================================================================

export interface MockProgressOptions {
    location: number;
    title?: string;
    cancellable?: boolean;
}

export interface MockProgress<T> {
    report(value: T): void;
}

export class MockProgressReporter<T> implements MockProgress<T> {
    private reports: T[] = [];

    report(value: T): void {
        this.reports.push(value);
    }

    getReports(): T[] {
        return [...this.reports];
    }

    getLastReport(): T | undefined {
        return this.reports[this.reports.length - 1];
    }
}

// ============================================================================
// Cancellation Token Mock
// ============================================================================

export class MockCancellationTokenSource {
    private _isCancellationRequested = false;
    private readonly cancelEmitter = new MockEventEmitter<void>();

    readonly token = {
        isCancellationRequested: false as boolean,
        onCancellationRequested: this.cancelEmitter.event
    };

    cancel(): void {
        this._isCancellationRequested = true;
        (this.token as { isCancellationRequested: boolean }).isCancellationRequested = true;
        this.cancelEmitter.fire();
    }

    dispose(): void {
        this.cancelEmitter.dispose();
    }

    get isCancellationRequested(): boolean {
        return this._isCancellationRequested;
    }
}

// ============================================================================
// File System Watcher Mock
// ============================================================================

export class MockFileSystemWatcher {
    private readonly createEmitter = new MockEventEmitter<MockUri>();
    private readonly changeEmitter = new MockEventEmitter<MockUri>();
    private readonly deleteEmitter = new MockEventEmitter<MockUri>();
    private disposed = false;

    ignoreCreateEvents = false;
    ignoreChangeEvents = false;
    ignoreDeleteEvents = false;

    get onDidCreate() { return this.createEmitter.event; }
    get onDidChange() { return this.changeEmitter.event; }
    get onDidDelete() { return this.deleteEmitter.event; }

    dispose(): void {
        this.disposed = true;
        this.createEmitter.dispose();
        this.changeEmitter.dispose();
        this.deleteEmitter.dispose();
    }

    // Test helper methods
    fireCreate(uri: MockUri): void {
        if (!this.ignoreCreateEvents && !this.disposed) {
            this.createEmitter.fire(uri);
        }
    }

    fireChange(uri: MockUri): void {
        if (!this.ignoreChangeEvents && !this.disposed) {
            this.changeEmitter.fire(uri);
        }
    }

    fireDelete(uri: MockUri): void {
        if (!this.ignoreDeleteEvents && !this.disposed) {
            this.deleteEmitter.fire(uri);
        }
    }

    get isDisposed(): boolean {
        return this.disposed;
    }
}

// ============================================================================
// Workspace Folder Mock
// ============================================================================

export class MockWorkspaceFolder {
    readonly uri: MockUri;
    readonly name: string;
    readonly index: number;

    constructor(path: string, name?: string, index = 0) {
        this.uri = MockUri.file(path);
        this.name = name ?? path.split('/').pop() ?? 'workspace';
        this.index = index;
    }
}

// ============================================================================
// Text Document Mock
// ============================================================================

export class MockTextDocument {
    private _content: string;
    readonly uri: MockUri;
    readonly fileName: string;
    readonly languageId: string;
    readonly version: number;
    readonly isDirty: boolean;
    readonly isUntitled: boolean;
    readonly isClosed: boolean;

    constructor(uri: MockUri | string, content = '', languageId = 'plaintext') {
        this.uri = typeof uri === 'string' ? MockUri.file(uri) : uri;
        this.fileName = this.uri.fsPath;
        this._content = content;
        this.languageId = languageId;
        this.version = 1;
        this.isDirty = false;
        this.isUntitled = false;
        this.isClosed = false;
    }

    get lineCount(): number {
        return this._content.split('\n').length;
    }

    getText(): string {
        return this._content;
    }

    lineAt(line: number): { text: string; lineNumber: number } {
        const lines = this._content.split('\n');
        return {
            text: lines[line] ?? '',
            lineNumber: line
        };
    }

    positionAt(offset: number): { line: number; character: number } {
        const text = this._content.substring(0, offset);
        const lines = text.split('\n');
        return {
            line: lines.length - 1,
            character: lines[lines.length - 1].length
        };
    }

    offsetAt(position: { line: number; character: number }): number {
        const lines = this._content.split('\n');
        let offset = 0;
        for (let i = 0; i < position.line && i < lines.length; i++) {
            offset += lines[i].length + 1; // +1 for newline
        }
        return offset + Math.min(position.character, (lines[position.line] ?? '').length);
    }

    // Test helper methods
    setContent(content: string): void {
        this._content = content;
    }
}

// ============================================================================
// Position and Range Mocks
// ============================================================================

export class MockPosition {
    constructor(
        public readonly line: number,
        public readonly character: number
    ) {}

    isAfter(other: MockPosition): boolean {
        return this.line > other.line || (this.line === other.line && this.character > other.character);
    }

    isBefore(other: MockPosition): boolean {
        return this.line < other.line || (this.line === other.line && this.character < other.character);
    }

    isEqual(other: MockPosition): boolean {
        return this.line === other.line && this.character === other.character;
    }

    with(line?: number, character?: number): MockPosition {
        return new MockPosition(line ?? this.line, character ?? this.character);
    }

    translate(lineDelta?: number, characterDelta?: number): MockPosition {
        return new MockPosition(
            this.line + (lineDelta ?? 0),
            this.character + (characterDelta ?? 0)
        );
    }
}

export class MockRange {
    readonly start: MockPosition;
    readonly end: MockPosition;

    constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);
    constructor(start: MockPosition, end: MockPosition);
    constructor(
        startOrLine: MockPosition | number,
        endOrCharacter: MockPosition | number,
        endLine?: number,
        endCharacter?: number
    ) {
        if (typeof startOrLine === 'number') {
            this.start = new MockPosition(startOrLine, endOrCharacter as number);
            this.end = new MockPosition(endLine!, endCharacter!);
        } else {
            this.start = startOrLine;
            this.end = endOrCharacter as MockPosition;
        }
    }

    get isEmpty(): boolean {
        return this.start.isEqual(this.end);
    }

    get isSingleLine(): boolean {
        return this.start.line === this.end.line;
    }

    contains(positionOrRange: MockPosition | MockRange): boolean {
        if (positionOrRange instanceof MockRange) {
            return this.contains(positionOrRange.start) && this.contains(positionOrRange.end);
        }
        return !positionOrRange.isBefore(this.start) && !positionOrRange.isAfter(this.end);
    }

    with(start?: MockPosition, end?: MockPosition): MockRange {
        return new MockRange(start ?? this.start, end ?? this.end);
    }
}
