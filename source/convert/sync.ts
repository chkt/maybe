import { createResult, Failure, isResult, Maybe, mergeMessagesAb } from '../maybe';
import { MessageComposite } from '../message';


export function all<T, R, F>(fn:(v:T) => Maybe<R, F>, values:readonly T[]) : Maybe<R[], F> {
	const res:R[] = [];
	let messages:MessageComposite = { messages : [] };
	let failure:Failure<F> | undefined;

	for (const maybe of values.map(fn)) {
		if (isResult(maybe)) res.push(maybe.value);
		else failure ??= maybe;

		messages = mergeMessagesAb(messages, maybe);
	}

	if (failure) return { ...failure, messages : messages.messages };
	else return createResult(res, messages.messages);
}
