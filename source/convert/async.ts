import { Failure, Maybe, createFailure, createResult, isResult, mergeMessagesAb, mergeMessagesBa } from '../maybe.js';
import { MessageComposite, messageSeverity } from '../message.js';


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

export async function all<
	T extends unknown[],
	F extends Failure
>(values:{ readonly [P in keyof T] : Promise<Maybe<T[P], F>> }) : Promise<Maybe<T, F>> {
	const res:{ [P in keyof T] ?: T[P] } = [];
	let composite:MessageComposite = { messages : [] };
	let failure:F | undefined;

	const resolved = await Promise.all(values.map(async promise => may(async v => v, promise)));

	for (const maybe of resolved) {
		if (isResult(maybe)) res.push(maybe.value);
		else failure ??= maybe as F;

		composite = mergeMessagesAb(composite, maybe);
	}

	if (failure) return { ...failure, messages : composite.messages };
	else return createResult(res as T, composite.messages);
}

export async function any<
	T extends unknown[],
	F extends Failure
>(values:{ readonly [P in keyof T] : Promise<Maybe<T[P], F>> }) : Promise<Maybe<T[keyof T]>> {
	const messages:Failure[] = [];

	const resolved = await Promise.all(values.map(async promise => may(async v => v, promise)));

	for (const value of resolved) {
		if (isResult(value)) return value as Maybe<T[keyof T], F>;
		else messages.push(value);
	}

	return createFailure('no result', messageSeverity.error, messages);
}
