import { createMessage, Message, MessageComposite, Messages } from './message';


export interface Result<T> extends MessageComposite {
	readonly value : T;
}

/**
 * @alias of Message
 */
export type Failure<T> = Message<T>;

export type Maybe<T, F = unknown> = Result<T> | Failure<F>;


export function isResult<T, F>(maybe:Maybe<T, F>) : maybe is Result<T> {
	return 'value' in maybe;
}

export function isFailure<T, F>(maybe:Maybe<T, F>) : maybe is Failure<F> {
	return 'severity' in maybe;
}

export function createResult<T>(value:T, messages:Messages = []) : Result<T> {
	return { value, messages };
}

/**
 * @alias of createMessage
 */
export const createFailure = createMessage;

export function mergeMessagesAb<T extends MessageComposite>(a:T, b:Maybe<unknown>) : T {
	const messages = isResult(b) ? b.messages : [ b ];

	return { ...a, messages : [ ...a.messages, ...messages ] };
}

export function mergeMessagesBa<T extends MessageComposite>(a:T, b:Maybe<unknown>) : T {
	const messages = isResult(b) ? b.messages : [ b ];

	return { ...a, messages : [ ...messages, ...a.messages ] };
}
