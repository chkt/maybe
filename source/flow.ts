import { Failure, createFailure, failureSeverity } from './failure';
import { Maybe, createResult, isFailure, isResult } from './maybe';


export type transform<T, R> = (v:T) => R;
export type process<T, U, R> = (fn:transform<T, U>, v:T) => R;
export type processValue<T, R> = transform<T, Maybe<R>>;
export type processFailure<F, R> = transform<Failure<F>, Maybe<R>>;


export function apply<T, U, R>(b:process<T, U, R>, a:transform<T, U>) : transform<T, R> {
	return b.bind(null, a);
}

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

export function may<T, R>(fn:processValue<T, R>, value:T) : Maybe<R> {
	try {
		return fn(value);
	}
	catch (err) {
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
			return createFailure(err, failureSeverity.error, maybe.messages);
		}
	}
	else return maybe;
}
