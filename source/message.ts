export const enum MessageSeverity {
	fatal,
	error,
	warn,
	notice,
	info,
	verbose,
	debug
}

export interface MessageComposite {
	readonly messages : Messages;
}

const NULL_VALUE = Symbol('no value');

type NullValue = typeof NULL_VALUE;

export interface NullMessage extends MessageComposite {
	readonly severity : MessageSeverity;
}

export interface CardinalMessage<T extends number = number> extends NullMessage {
	readonly code : T;
}

export interface TextMessage<T extends string = string> extends NullMessage {
	readonly text : T;
}

export interface ErrorMessage<T extends Error> extends NullMessage {
	readonly error : T;
}

interface DataValue<T> {
	readonly value : T;
}

type NotData = unknown[] | ((...args:unknown[]) => unknown) | Error;
type DataRecord<T extends object> = object & Exclude<T, NotData>;

export interface DataMessage<T extends object> extends NullMessage {
	readonly data : DataRecord<T>;
}

export type Message<T = unknown> =
	NullMessage |
	CardinalMessage<T & number> |
	TextMessage<T & string> |
	ErrorMessage<T & Error> |
	DataMessage<T & object> |
	DataMessage<DataValue<T>>;

export type Messages<T = unknown> = readonly Message<T>[];


export function isNullValue(value:unknown) : value is NullValue {
	return value === NULL_VALUE;
}

export function isMessage(composite:MessageComposite) : composite is NullMessage {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return typeof (composite as NullMessage).severity === 'number';
}

export function isCardinalMessage<T>(message:Message<T>) : message is CardinalMessage<T & number> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return typeof (message as { code : unknown }).code === 'number';
}

export function isTextMessage<T>(message:Message<T>) : message is TextMessage<T & string> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return typeof (message as { text : unknown }).text === 'string';
}

export function isDataMessage<T>(message:Message<T>) : message is DataMessage<T & object> | DataMessage<DataValue<T>> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	const { data } = (message as { data : unknown });

	return typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		!(data instanceof Function) &&
		!(data instanceof Error);
}

export function isErrorMessage<T>(message:Message<T>) : message is ErrorMessage<T & Error> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
	return (message as { error : unknown }).error instanceof Error;
}

export function createCardinalMessage<T extends number>(
	code:T,
	severity:MessageSeverity = MessageSeverity.error,
	messages:Messages = []
) : CardinalMessage<T> {
	return { code, severity, messages };
}

export function createTextMessage<T extends string>(
	text:T,
	severity:MessageSeverity = MessageSeverity.error,
	messages:Messages = []
) : TextMessage<T> {
	return { text, severity, messages };
}

export function createDataMessage<T extends NotData>(data:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<DataValue<T>>;
export function createDataMessage<T extends object>(data:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<T>;
export function createDataMessage<T>(data:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<DataValue<T>>;
export function createDataMessage<T>(
	data:T,
	severity:MessageSeverity = MessageSeverity.error,
	messages:Messages = []
) : DataMessage<T & object> | DataMessage<DataValue<T>> {
	if (
		typeof data === 'object' &&
		data !== null &&
		!Array.isArray(data) &&
		!(data instanceof Function) &&
		!(data instanceof Error)
	) return { data : data as DataRecord<T & object>, severity, messages };
	else return { data : { value : data }, severity, messages };
}

export function createErrorMessage<T extends Error>(
	error:T,
	severity:MessageSeverity = MessageSeverity.error,
	messages:Messages = []
) : ErrorMessage<T> {
	return { error, severity, messages };
}

export function createMessage<T extends number>(value:T, severity?:MessageSeverity, messages?:Messages) : CardinalMessage<T>;
export function createMessage<T extends string>(value:T, severity?:MessageSeverity, messages?:Messages) : TextMessage<T>;
export function createMessage<T extends Error>(value:T, severity?:MessageSeverity, messages?:Messages) : ErrorMessage<T>;
export function createMessage<T extends NotData>(value:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<DataValue<T>>;
export function createMessage<T extends object>(value:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<T>;
export function createMessage<T>(value:T, severity?:MessageSeverity, messages?:Messages) : DataMessage<DataValue<T>>;
export function createMessage<T>(
	value:T,
	severity:MessageSeverity = MessageSeverity.error,
	messages:Messages = []
) : Message<T> {
	switch (typeof value) {
		case 'number' :
			if (Number.isSafeInteger(value)) return createCardinalMessage(value, severity, messages);
			else break;
		case 'string' : return createTextMessage(value, severity, messages);
		case 'object' :
			if (value instanceof Error) return createErrorMessage(value, severity, messages);
			else break;
		// no default
	}

	return createDataMessage(value, severity, messages);
}

export function resolveMessageValue<T>(message:Message<T>) : T | DataValue<T> | NullValue {
	if (isCardinalMessage(message)) return message.code;
	else if (isTextMessage(message)) return message.text;
	else if (isDataMessage(message)) return message.data;
	else if (isErrorMessage(message)) return message.error;
	else return NULL_VALUE;
}

function flatten(path:Messages, messages:Messages, res:Message[] = []) : Messages {
	for (let i = messages.length - 1; i >= 0; i -= 1) {
		const message = messages[i];

		if (!path.includes(message)) {
			if (message.messages.length !== 0) flatten([ ...path, message ], message.messages, res);

			if (!res.includes(message)) res.push(message);
		}
	}

	return res;
}

export function containsMessage(parent:MessageComposite, message:Message) : boolean {
	return flatten([], parent.messages).includes(message);
}

/**
 * @function
 */
export const flattenMessages:(messages:Messages) => Messages = flatten.bind(null, []);

export function flattenMessage(message:Message) : Messages {
	return [ ...flatten([ message ], message.messages), message ];
}

export function mergeCompositeAb<T extends MessageComposite>(a:T, b:MessageComposite) : T {
	return {
		...a,
		messages : [ ...a.messages, ...b.messages ]
	};
}

export function mergeCompositeBa<T extends MessageComposite>(a:T, b:MessageComposite) : T {
	return {
		...a,
		messages : [ ...b.messages, ...a.messages ]
	};
}

export function mergeMessagesAb<T extends MessageComposite>(a:T, b:MessageComposite) : T {
	if (a !== b) {
		const messages = isMessage(b) ? [ b ] : b.messages;

		return { ...a, messages : [ ...a.messages, ...messages ] };
	}
	else return a;
}

export function mergeMessagesBa<T extends MessageComposite>(a:T, b:MessageComposite) : T {
	if (a !== b) {
		const messages = isMessage(b) ? [ b ] : b.messages;

		return { ...a, messages : [ ...messages, ...a.messages ] };
	}
	else return a;
}
