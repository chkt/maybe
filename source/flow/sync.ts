import {
	Failure,
	Maybe,
	Result,
	isFailure,
	isResult,
	mergeMessagesAb,
	mergeMessagesBa
} from '../maybe';


export function and<T, R, M extends Failure, F extends Failure>(
	fn:(value:T) => Maybe<R, F>,
	maybe:Maybe<T, M>
) : Maybe<R, M | F> {
	if (isResult(maybe)) {
		const res = fn(maybe.value);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export function or<T, R, M extends Failure, F extends Failure>(
	fn:(value:M) => Maybe<R, F>,
	maybe:Maybe<T, M>
) : Maybe<T | R, F> {
	if (isFailure(maybe)) {
		const res = fn(maybe);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export function failureIf<T, M extends Failure, F extends Failure>(
	shouldFail:(value:T) => boolean,
	fail:(value:T) => F,
	maybe:Maybe<T, M>
) : Maybe<T, M | F> {
	if (isResult(maybe) && shouldFail(maybe.value)) return mergeMessagesBa(fail(maybe.value), maybe);
	else return maybe;
}

export function resultIf<T, R, M extends Failure>(
	shouldSucceed:(failure:M) => boolean,
	succeed:(failure:M) => Result<R>,
	maybe:Maybe<T, M>
) : Maybe<T | R, M> {
	if (isFailure(maybe) && shouldSucceed(maybe)) return mergeMessagesBa(succeed(maybe), maybe);
	else return maybe;
}

export function onResult<T, F extends Failure>(
	fn:(value:T) => Maybe<unknown>,
	maybe:Maybe<T, F>
) : Maybe<T, F> {
	if (isResult(maybe)) {
		const res = fn(maybe.value);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}

export function onFailure<T, F extends Failure>(
	fn:(failure:F) => Maybe<unknown>,
	maybe:Maybe<T, F>
) : Maybe<T, F> {
	if (isFailure(maybe)) {
		const res = fn(maybe);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}
