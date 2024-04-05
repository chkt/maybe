import { Failure, Maybe, createFailure, createResult } from '../maybe';
import { filter, filterAll } from './common';


export async function maybeFrom<T, R, F extends Failure>(
	fn:(v:T) => Promise<R>,
	isResult:filter<R> = filterAll,
	value?:T
) : Promise<Maybe<R, Failure<R> | F>> {
	try {
		const res = await fn(value as T);

		if (isResult(res)) return createResult(res);
		else return createFailure(res) as Failure<R>;
	}
	catch (err) {
		return createFailure(err) as F;
	}
}

export async function resultFrom<T, R>(
	fn:(v:T) => Promise<R>,
	value?:T
) : Promise<Maybe<R>> {
	try {
		return createResult(await fn(value as T));
	}
	catch (err) {
		return createFailure(err);
	}
}

export async function failureFrom<T, R>(
	fn:(v:T) => Promise<R>,
	value?:T
) : Promise<Failure<R>> {
	try {
		return createFailure(await fn(value as T)) as Failure<R>;
	}
	catch (err) {
		return createFailure(err) as Failure<R>;
	}
}
