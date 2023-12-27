import {
	Failure,
	Maybe,
	isFailure,
	isResult,
	mergeMessagesAb,
	mergeMessagesBa
} from '../maybe';


export function and<T, R>(
	fn:(value:T) => Maybe<R>,
	maybe:Maybe<T>
) : Maybe<R> {
	if (isResult(maybe)) {
		const res = fn(maybe.value);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export function or<T, R, F0, F1>(
	fn:(value:Failure<F0>) => Maybe<R, F1>,
	maybe:Maybe<T, F0>
) : Maybe<T | R, F1> {
	if (isFailure(maybe)) {
		const res = fn(maybe);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export function onResult<T, F>(
	fn:(value:T) => Maybe<unknown>,
	maybe:Maybe<T, F>
) : Maybe<T, F> {
	if (isResult(maybe)) {
		const res = fn(maybe.value);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}

export function onFailure<T, F>(
	fn:(failure:Failure<F>) => Maybe<unknown>,
	maybe:Maybe<T, F>
) : Maybe<T, F> {
	if (isFailure(maybe)) {
		const res = fn(maybe);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}
