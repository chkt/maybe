import { Failure, createFailure, failureSeverity } from './failure';
import { Maybe, createResult, isFailure, isResult } from './maybe';


export type processValue<T, R> = (value:T) => Maybe<R>;
export type processFailure<F, R> = (value:Failure<F>) => Maybe<R>;

export function and<T, R>(fn:processValue<T, R>, maybe:Maybe<T>) : Maybe<R> {
	if (isResult(maybe)) {
		const res = fn(maybe.value);

		return { ...res, messages : [ ...res.messages, ...maybe.messages ] };
	}
	else return maybe;
}

export function or<T, F>(fn:processFailure<F, T>, maybe:Maybe<T, Failure<F>>) : Maybe<T> {
	if (isFailure(maybe)) {
		const res = fn(maybe);

		return { ...res, messages : [ ...res.messages, maybe ] };
	}
	else return maybe;
}

export function may<R, T = undefined>(fn:processValue<T, R>, value?:T) : Maybe<R> {
	try {
		return fn(value as T);
	}
	catch (err) {
		return createFailure(err);
	}
}

export async function resolve<T>(maybe:Maybe<Promise<T>>) : Promise<Maybe<T>> {
	if (isResult(maybe)) {
		try {
			return createResult(await maybe.value, maybe.messages);
		}
		catch (err) {
			return createFailure(err, failureSeverity.error, maybe.messages);
		}
	}
	else return maybe;
}
