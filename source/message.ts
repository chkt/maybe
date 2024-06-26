export const enum messageSeverity {
	fatal,
	error,
	warn,
	notice,
	info,
	verbose,
	debug
}

export type MessageSeverity = messageSeverity;

export interface MessageComposite {
	readonly messages : Messages;
}

interface MessageCommon extends MessageComposite {
	readonly severity : MessageSeverity;
}

export interface ErrorMessage<T extends Error = Error> extends MessageCommon {
	readonly error : T;
}

export interface CardinalMessage extends MessageCommon {
	readonly code : number;
}

export interface TextMessage extends MessageCommon {
	readonly text : string;
}

// TODO Exclude<object, Error | unknown[]> is the same as object
export type DataRecord = Exclude<object, Error | unknown[]>;

type NullRecord = Readonly<Record<never, never>>;

export interface DataValue<T> {
	readonly value : T;
}

type DataDistinct<T> = T extends DataRecord ? T : DataValue<T>;

export interface DataMessage<T> extends MessageCommon {
	readonly data : T;
}

export type Message<T = unknown> =
	ErrorMessage<T extends Error ? T : Error> |
	CardinalMessage |
	TextMessage |
	DataMessage<T extends DataRecord ? T : NullRecord> |
	DataMessage<DataValue<T>>;

type MessageDistinct<T> =
	T extends number ?
		CardinalMessage | DataMessage<T> :
		T extends string ?
			TextMessage :
			T extends Error ?
				ErrorMessage<T> :
				DataMessage<DataDistinct<T>>;

export type Messages = readonly Message[];


function isDataRecord(value:unknown) : value is DataRecord {
	return typeof value === 'object' &&
		value !== null &&
		!(value instanceof Error) &&
		!Array.isArray(value);
}

export function isErrorMessage<T>(message:Message<T>) : message is ErrorMessage<T extends Error ? T : Error> {
	return 'error' in message;
}

export function isCardinalMessage<T>(message:Message<T>) : message is CardinalMessage {
	return 'code' in message;
}

export function isTextMessage<T>(message:Message<T>) : message is TextMessage {
	return 'text' in message;
}

export function isDataMessage<T>(message:Message<T>) : message is DataMessage<DataDistinct<T>> {
	return 'data' in message;
}

export function createErrorMessage<T extends Error>(
	error:T,
	severity:MessageSeverity = messageSeverity.error,
	messages:Messages = []
) : ErrorMessage<T> {
	return { severity, error, messages };
}

export function createCardinalMessage(
	code:number,
	severity:MessageSeverity = messageSeverity.error,
	messages:Messages = []
) : CardinalMessage {
	return { severity, code, messages };
}

export function createTextMessage(
	text:string,
	severity:MessageSeverity = messageSeverity.error,
	messages:Messages = []
) : TextMessage {
	return { severity, text, messages };
}

export function createDataMessage<T>(
	data:T,
	severity:MessageSeverity = messageSeverity.error,
	messages:Messages = []
) : DataMessage<DataDistinct<T>> {
	if (isDataRecord(data)) return { data, severity, messages } as DataMessage<DataDistinct<T>>;
	else return { data : { value : data }, severity, messages } as DataMessage<DataDistinct<T>>;
}

export function createMessage<T>(
	value:T,
	severity:MessageSeverity = messageSeverity.error,
	messages:Messages = []
) : MessageDistinct<T> {
	switch (typeof value) {
		case 'number' :
			if (Number.isSafeInteger(value)) {
				return createCardinalMessage(value, severity, messages) as MessageDistinct<T>;
			}
			else break;
		case 'string' : return createTextMessage(value, severity, messages) as MessageDistinct<T>;
		case 'object' :
			if (value instanceof Error) return createErrorMessage(value, severity, messages) as MessageDistinct<T>;
			else if (isDataRecord(value)) return createDataMessage(value, severity, messages) as MessageDistinct<T>;
		// no default
	}

	return createDataMessage(value, severity, messages) as MessageDistinct<T>;
}

export function resolveMessageValue<T>(message:Message<T>) : unknown {
	if (isErrorMessage(message)) return message.error;
	else if (isCardinalMessage(message)) return message.code;
	else if (isTextMessage(message)) return message.text;
	else return message.data;
}

function flatten(path:Messages, messages:Messages, res:Message[] = []) : Messages {
	for (let i = messages.length - 1; i > -1; i -= 1) {
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

export const flattenMessages:(messages:Messages) => Messages = flatten.bind(null, []);

export function flattenMessage(message:Message) : Messages {
	return [ ...flatten([ message ], message.messages), message ];
}

export function mergeCompositeAb<T extends MessageComposite, U extends MessageComposite>(a:T, b:U) : T {
	return {
		...a,
		messages : [ ...a.messages, ...b.messages ]
	};
}

export function mergeCompositeBa<T extends MessageComposite, U extends MessageComposite>(a:T, b:U) : T {
	return {
		...a,
		messages : [ ...b.messages, ...a.messages ]
	};
}
