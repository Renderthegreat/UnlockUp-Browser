// Awaiting removal.

import { EventEmitter, } from 'eventemitter3';

export type Extension = {
	id: string,

	manifest: any,
};

export namespace chrome {
	export class EventHandler {
		constructor(
			private name: string
		) {
			this.emitter = new EventEmitter();
		};

		public addListener(func: (...args: any) => any): void {
			console.log(`${this.name}: ${func}`);
			this.emitter.on(this.name, func);
		};

		public emit(...args: any): void {
			try {
				this.emitter.emit(this.name, ...args);
			} catch (err: any) {
				console.error(err);
			};
		};

		public reset(): void {
			this.emitter.removeAllListeners(this.name);
		};

		private emitter: EventEmitter;
	};

	export const SELF = Symbol('SELF');

	export namespace cookies {
		export type Set = {
			name: string,
			url: string,
			value: string,
			domain: string,
		};
	};

	export namespace storage {
		export const CONTAINER = Symbol('container');
	};

	export namespace tabs {
		export type Create = {
			active?: boolean,
			cookieStoreId: string,
			discarded?: boolean,
			index?: number,
			muted?: boolean,
			openerTabId?: number,
			openInReaderMode?: number,
			pinned?: boolean,
			selected?: boolean,
			title?: string,
			url?: string,
		};

		export type Tab = {
			active: boolean,
			attention?: boolean,
			audible?: boolean,
			autoDiscardable?: boolean,
			cookieStoreId: number,
			discarded?: boolean,
			favIconUrl?: string,
			groupId?: number,
			height?: number,
			hidden: boolean,
			highlighted?: boolean,
			id?: number,
			incognito: boolean,
			index: number,
			isArtical: boolean,
			isInReaderMode: boolean,
			lastAccessed: number,
			mutedInfo?: /* TODO: Replace. */ any,
			openerTabId?: number,
			pendingUrl: string,
			pinned: boolean,

			sessionId?: string,
			status?: 'loading' | 'complete',
			successorTabId?: number,
			title?: string,
			url?: string,
			width?: string,
			windowId: number,
		};
	};
};

export class Chrome {
	public constructor(
		private extension: Extension
	) {
		for (const key in this) {
			if (typeof this[key] === 'object') {
				(this[key] as any)._ = this.extension;
				(this[key] as any)[chrome.SELF] = this;
			};
		};

		return this._secure(this, 'chrome');
	};

	private _secure(obj: any, path: string): any {
		return new Proxy(obj, {
			get: (target, prop, receiver) => {
				// Ignore symbols.
				if (typeof prop === 'symbol' || prop[0] == '_' || prop == 'then') {
					return target[prop];
				};
				
				// Return the property if it exists.
				if (prop in target) {
					const value = Reflect.get(target, prop, receiver)
					
					// Recursively wrap nested objects (but not functions, symbols, or nulls).
					if (typeof value === 'object' && value !== null && !(value instanceof chrome.EventHandler)) {
						return this._secure(value, `${path}.${String(prop)}`);
					};

					if (typeof value === 'function') {
						return value.bind(target);
					};

					return value;
				};

				// If the property is missing, give an error with location info.
				const error = new Error(`Property "${String(prop)}" does not exist on "${path}".`);
				console.error(`Unknown property access at:`, error.stack);
				throw error;
			},
			ownKeys: (target) => {
				return Reflect.ownKeys(target);
			},
		});
	};

	public cookies = {
		set(cookie: chrome.cookies.Set): void {
			this.onChanged.emit(); // Update.
		},

		onChanged: new chrome.EventHandler('cookies.onChanged'),
	};

	public i18n = {
		getMessage(): string | null {
			return '' /* TODO: Update. */
		},
	};

	public management = {
		async getSelf(): Promise<any> {
			return { id: this._.id, };
		},

		onEnabled: new chrome.EventHandler('management.onEnabled'),

		_: null as any,
	};

	public runtime = {
		async getPlatformInfo(): Promise<any> {
			return {
				os: 'ChromeOS',
			};
		},
		getManifest(): any {
			console.log(this._.manifest);
			return this._.manifest;
		},
		getURL(path: string) {
			return `./ldb/${path}`; // TODO: Replace.
		},
		reload(): void {
			console.log('Reloading...');
			let eventHandlers: chrome.EventHandler[] = [];
			// this.onInstalled.emit({} /* Update.*/);
			const scan = (obj: any, depth: number = 0) => {
				for (const key in obj) {
					// console.log(key);

					if (obj[key] instanceof chrome.EventHandler) {
						console.log(key);
						eventHandlers.push(obj[key]);
					} else if (typeof obj[key] === 'object' && depth < 4) {
						scan(obj[key], depth + 1);
					};
				};
			};

			// @ts-ignore()
			scan(this[chrome.SELF]);

			for (const eventHandler of eventHandlers) {
				eventHandler.reset();
			};

			this.onInstalled.emit({} /* TODO: Replace. */);
		},

		get id() {
			return this._.id;
		},

		onInstalled: new chrome.EventHandler('runtime.onInstalled'),
		onMessage: new chrome.EventHandler('runtime.onMessage'),

		sendMessage(...args: any): void {
			this.onMessage.emit(...args);
		},

		_: null as any,
	};

	public storage = {
		local: {
			async set(obj: any): Promise<void> {
				console.log(`Storing: ${Object.keys(obj)}.`);

				for (const key in obj) {
					console.log(key, obj[key]);
					// @ts-ignore()
					this[chrome.storage.CONTAINER][key] = obj[key];
				};
			},
			async get(obj: string[] | string): Promise<any> {
				console.log(`Getting: ${obj}.`);

				let value: any;

				if (typeof obj === 'string') {
					console.log('DB', this[chrome.storage.CONTAINER]);
					console.log(Object.keys(this[chrome.storage.CONTAINER]));
					// @ts-ignore()
					value = this[chrome.storage.CONTAINER][obj];
				} else if (obj instanceof Array) {
					obj.map((key: string) => {
						// @ts-ignore()
						value[key] = this[chrome.storage.CONTAINER][key];
					});
				};

				console.log(value);

				return value;
			},

			[chrome.storage.CONTAINER]: {},
		},
	};

	public tabs = {
		async create(config: chrome.tabs.Create, then: (tab: chrome.tabs.Tab) => any) {
			let tab: chrome.tabs.Tab = {/* TODO: Replace. */} as any;

			console.log(config);
			
			await then(tab);

			this.onCreated.emit(tab);

			return tab;
		},

		async remove(id: number | number[]) {
			
		},

		onActivated: new chrome.EventHandler('tabs.onActivated'),
		onCreated: new chrome.EventHandler('tabs.onCreated'),
		onUpdated: new chrome.EventHandler('tabs.onUpdated'),
		onRemoved: new chrome.EventHandler('tabs.onRemove'),
	};

	public webNavigation = {
		onBeforeNavigate: new chrome.EventHandler('webNavigation.onBeforeNavigate'),
		onCompleted: new chrome.EventHandler('webNavigation.onCompleted'),
		onDOMContentLoaded: new chrome.EventHandler('webNavigation.onDOMContentLoaded'),
		onErrorOccurred: new chrome.EventHandler('webNavigation.onErrorOccurred'),
	};

	public webRequest = {
		onBeforeRequest: new chrome.EventHandler('webRequest.onBeforeRequest'),
		onCompleted: new chrome.EventHandler('webRequest.onCompleted'),
		onErrorOccurred: new chrome.EventHandler('webRequest.onErrorOccurred'),

		onHeadersReceived: new chrome.EventHandler('webRequest.onHeadersReceived')
	};
};