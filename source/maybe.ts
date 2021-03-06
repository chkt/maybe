import { Failure, Failures } from './failure';


export interface Result<T> {
	readonly value : T;
	readonly failures ?: Failures;
}

export type Maybe<T, F extends Failure = Failure> = Result<T> | F;


export function isResult<T>(maybe:Maybe<T>) : maybe is Result<T> {
	return 'value' in maybe;
}

export function isFailure<T, U>(maybe:Maybe<T, Failure<U>>) : maybe is Failure<U> {
	return 'severity' in maybe;
}

export function createResult<T>(value:T, failures:Failures = []) : Result<T> {
	return { value, failures };
}
