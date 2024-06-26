import { Failure, Maybe, createFailure, createResult, isResult, mergeMessagesAb } from '../maybe';
import { MessageComposite } from '../message';


export function may<T, R>(fn:(v:T) => Maybe<R>, value:T) : Maybe<R> {
	try {
		return fn(value);
	}
	catch (err:unknown) {
		return createFailure(err);
	}
}

export function all<T, R, F extends Failure>(fn:(v:T) => Maybe<R, F>, values:readonly T[]) : Maybe<R[], F> {
	const res:R[] = [];
	let messages:MessageComposite = { messages : [] };
	let failure:F | undefined;

	for (const maybe of values.map(fn)) {
		if (isResult(maybe)) res.push(maybe.value);
		else failure ??= maybe;

		messages = mergeMessagesAb(messages, maybe);
	}

	if (failure) return { ...failure, messages : messages.messages };
	else return createResult(res, messages.messages);
}

export function blank<T, M extends Failure>(maybe:Maybe<T, M>) : Maybe<void, M> {
	if (isResult(maybe)) return createResult(undefined, maybe.messages);
	else return maybe;
}
