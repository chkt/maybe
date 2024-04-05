import { Message, MessageComposite, Messages, createMessage } from './message';


export interface Result<T> extends MessageComposite {
	readonly value : T;
}

/**
 * @alias of Message
 */
export type Failure<T = unknown> = Message<T>;

export type Maybe<T, F extends Failure = Failure> = Result<T> | F;


export function isResult<T, F extends Failure>(maybe:Maybe<T, F>) : maybe is Result<T> {
	return 'value' in maybe;
}

export function isFailure<T, F extends Failure>(maybe:Maybe<T, F>) : maybe is F {
	return 'severity' in maybe;
}

export function createResult<T>(value:T, messages:Messages = []) : Result<T> {
	return { value, messages };
}

/**
 * @alias of createMessage
 */
export const createFailure = createMessage;

export function mergeMessagesAb<T extends MessageComposite, F extends Failure>(a:T, b:Maybe<unknown, F>) : T {
	const messages = isResult(b) ? b.messages : [ b ];

	return { ...a, messages : [ ...a.messages, ...messages ] };
}

export function mergeMessagesBa<T extends MessageComposite, F extends Failure>(a:T, b:Maybe<unknown, F>) : T {
	const messages = isResult(b) ? b.messages : [ b ];

	return { ...a, messages : [ ...messages, ...a.messages ] };
}
