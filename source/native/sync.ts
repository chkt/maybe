import { Failure, Maybe, Result, createFailure, createResult } from '../maybe';
import { filter, filterAll } from './common';


export function maybeFrom<T, R>(fn:(v:T) => R, isResult:filter<R> = filterAll, value?:T) : Maybe<R, R> {
	const res = fn(value as T);

	if (isResult(res)) return createResult(res);
	else return createFailure(res) as Failure<R>;
}

export function resultFrom<T, R>(fn:(v:T) => R, value?:T) : Result<R> {
	return createResult(fn(value as T));
}

export function failureFrom<T, R>(fn:(v:T) => R, value?:T) : Failure<R> {
	return createFailure(fn(value as T)) as Failure<R>;
}
