import {
	Failure,
	Maybe,
	Result,
	createFailure,
	createResult,
	isResult,
	mergeMessagesAb
} from '../maybe.js';
import { MessageComposite, Messages } from '../message.js';
import { ConversionFailure, createConversionFailure } from './common.js';


export function may<T, R>(fn:(v:T) => Maybe<R>, value:T) : Maybe<R> {
	try {
		return fn(value);
	}
	catch (err:unknown) {
		return createFailure(err);
	}
}

export function all<T extends unknown[]>(maybes:{ readonly [P in keyof T] : Maybe<T[P]> }) : Maybe<T, ConversionFailure> {
	const res:{ [P in keyof T] ?: T[P] } = [];
	let composite:MessageComposite = { messages : [] };
	const failures:Failure[] = [];

	for (const maybe of maybes) {
		if (isResult(maybe)) res.push(maybe.value);
		else failures.push(maybe);

		composite = mergeMessagesAb(composite, maybe);
	}

	if (failures.length === 0) return createResult(res as T, composite.messages);
	else return createConversionFailure('some failures', failures, composite.messages);
}

export function any<T extends unknown[]>(maybes:{ readonly [P in keyof T] : Maybe<T[P]> }) : Maybe<T[number], ConversionFailure> {
	let composite:MessageComposite = { messages : [] };
	let result:Result<T[number]> | undefined;

	for (const maybe of maybes) {
		if (isResult(maybe)) result ??= maybe;

		composite = mergeMessagesAb(composite, maybe);
	}

	if (result) return createResult(result.value, composite.messages);
	else return createConversionFailure('no result', maybes as Messages, composite.messages);
}


export function blank<T, M extends Failure>(maybe:Maybe<T, M>) : Maybe<void, M> {
	if (isResult(maybe)) return createResult(undefined, maybe.messages);
	else return maybe;
}
