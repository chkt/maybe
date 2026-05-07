import { Failure, Maybe, createFailure, createResult, isResult, mergeMessagesAb } from '../maybe.js';
import { MessageComposite, messageSeverity } from '../message.js';


export function may<T, R>(fn:(v:T) => Maybe<R>, value:T) : Maybe<R> {
	try {
		return fn(value);
	}
	catch (err:unknown) {
		return createFailure(err);
	}
}

export function all<
	T extends unknown[],
	F extends Failure
>(value:{ readonly [P in keyof T] : Maybe<T[P], F> }) : Maybe<T, F> {
	const res:{ [P in keyof T] ?: T[P] } = [];
	let composite:MessageComposite = { messages : [] };
	let failure:F | undefined;

	for (const maybe of value) {
		if (isResult(maybe)) res.push(maybe.value);
		else failure ??= maybe;

		composite = mergeMessagesAb(composite, maybe);
	}

	if (failure) return { ...failure, messages : composite.messages };
	else return createResult(res as T, composite.messages);
}

export function any<T extends unknown[]>(values:{ readonly [P in keyof T] : Maybe<T[P]> }) : Maybe<T[number]> {
	const messages:Failure[] = [];

	for (const value of values) {
		if (isResult(value)) return value;
		else messages.push(value);
	}

	return createFailure('no result', messageSeverity.error, messages);
}


export function blank<T, M extends Failure>(maybe:Maybe<T, M>) : Maybe<void, M> {
	if (isResult(maybe)) return createResult(undefined, maybe.messages);
	else return maybe;
}
