import { Failure, Maybe, createFailure, createResult, isResult, mergeMessagesAb, mergeMessagesBa } from '../maybe';
import { MessageComposite } from '../message';


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

export async function all<T, R, F extends Failure>(
	fn:(value:T) => Promise<Maybe<R, F>>,
	values:readonly T[]
) : Promise<Maybe<R[], F>> {
	const res:R[] = [];
	let messages:MessageComposite = { messages : [] };
	let failure:F | undefined;

	for (const maybe of await Promise.all(values.map(fn))) {
		if (isResult(maybe)) res.push(maybe.value);
		else failure ??= maybe;

		messages = mergeMessagesAb(messages, maybe);
	}

	if (failure) return { ...failure, messages : messages.messages };
	else return createResult(res, messages.messages);
}
