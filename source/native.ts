import { Failure, createFailure } from './failure';
import { Maybe, createResult } from './maybe';


export function filter<R, T = undefined>(fn:(v:T) => R, isResult:(v:R) => boolean, value?:T) : Maybe<R, Failure<R>> {
	const res = fn(value as T);

	if (isResult(res)) return createResult(res);
	else return createFailure(res);
}

export function result<R, T = undefined>(fn:(v:T) => R, value?:T) : Maybe<R> {
	return createResult(fn(value as T));
}
