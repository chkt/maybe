import {
	Failure,
	Maybe,
	Result,
	createFailure,
	createResult,
	isResult,
	mergeMessagesAb,
	mergeMessagesBa
} from '../maybe.js';
import { MessageComposite, Messages } from '../message.js';
import { ConversionFailure, createConversionFailure } from './common.js';


export async function may<T, R>(fn:(v:T) => Promise<Maybe<R>>, value:T) : Promise<Maybe<R>> {
	try {
		return await fn(value);
	}
	catch (err:unknown) {
		return createFailure(err);
	}
}

export async function resolve<T, R>(fn:(v:T) => Maybe<Promise<R>>, value:T) : Promise<Maybe<R>> {
	const maybe = fn(value);

	if (isResult(maybe)) {
		try {
			return createResult(await maybe.value, maybe.messages);
		}
		catch (err) {
			return mergeMessagesBa(createFailure(err), maybe);
		}
	}
	else return maybe;
}

export async function all<T extends unknown[]>(maybes:{ readonly [P in keyof T] : Promise<Maybe<T[P]>> }) : Promise<Maybe<T, ConversionFailure>> {
	const res:{ [P in keyof T] ?: T[P] } = [];
	let composite:MessageComposite = { messages : [] };
	const failures:Failure[] = [];

	const resolved = await Promise.all(maybes.map(async promise => may(async v => v, promise)));

	for (const maybe of resolved) {
		if (isResult(maybe)) res.push(maybe.value);
		else failures.push(maybe);

		composite = mergeMessagesAb(composite, maybe);
	}

	if (failures.length === 0) return createResult(res as T, composite.messages);
	else return createConversionFailure('some failures', failures, composite.messages);
}

export async function any<T extends unknown[]>(maybes:{ readonly [P in keyof T] : Promise<Maybe<T[P]>> }) : Promise<Maybe<T[number], ConversionFailure>> {
	let composite:MessageComposite = { messages : [] };
	let result:Result<T[number]> | undefined;

	const resolved = await Promise.all(maybes.map(async promise => may(async v => v, promise)));

	for (const maybe of resolved) {
		if (isResult(maybe)) result ??= maybe;

		composite = mergeMessagesAb(composite, maybe);
	}

	if (result) return createResult(result.value, composite.messages);
	else return createConversionFailure('no result', resolved as Messages, composite.messages);
}
