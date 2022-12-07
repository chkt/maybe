import { Failure, createFailure } from './failure';
import { Maybe, Result, createResult } from './maybe';


type filter<T> = (value:T) => boolean;


export function maybeFrom<R, T = undefined>(fn:(v:T) => R, isResult:filter<R>, value?:T) : Maybe<R, Failure<R>> {
	const res = fn(value as T);

	if (isResult(res)) return createResult(res);
	else return createFailure(res);
}

export function resultFrom<R, T = undefined>(fn:(v:T) => R, value?:T) : Result<R> {
	return createResult(fn(value as T));
}
