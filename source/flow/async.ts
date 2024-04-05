import {
	Failure,
	Maybe,
	Result,
	isFailure,
	isResult,
	mergeMessagesAb,
	mergeMessagesBa
} from '../maybe';


export async function and<T, R, M extends Failure, F extends Failure>(
	fn:(value:T) => Promise<Maybe<R, F>>,
	maybe:Maybe<T, M>
) : Promise<Maybe<R, M | F>> {
	if (isResult(maybe)) {
		const res = await fn(maybe.value);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export async function or<T, R, M extends Failure, F extends Failure>(
	fn:(failure:M) => Promise<Maybe<R, F>>,
	maybe:Maybe<T, M>
) : Promise<Maybe<T | R, F>> {
	if (isFailure(maybe)) {
		const res = await fn(maybe);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export async function failureIf<T, M extends Failure, F extends Failure>(
	shouldFail:(value:T) => boolean,
	fail:(value:T) => F,
	maybe:Promise<Maybe<T, M>>
) : Promise<Maybe<T, M | F>> {
	const resolved = await maybe;

	if (isResult(resolved) && shouldFail(resolved.value)) return mergeMessagesBa(fail(resolved.value), resolved);
	else return resolved;
}

export async function resultIf<T, R, M extends Failure>(
	shouldSucceed:(failure:M) => boolean,
	succeed:(failure:M) => Result<R>,
	maybe:Promise<Maybe<T, M>>
) : Promise<Maybe<T | R, M>> {
	const resolved = await maybe;

	if (isFailure(resolved) && shouldSucceed(resolved)) return mergeMessagesBa(succeed(resolved), resolved);
	else return resolved;
}

export async function onResult<T, F extends Failure>(
	fn:(value:T) => Promise<Maybe<unknown>>,
	maybe:Maybe<T, F>
) : Promise<Maybe<T, F>> {
	if (isResult(maybe)) {
		const res = await fn(maybe.value);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}

export async function onFailure<T, F extends Failure>(
	fn:(failure:F) => Promise<Maybe<unknown>>,
	maybe:Maybe<T, F>
) : Promise<Maybe<T, F>> {
	if (isFailure(maybe)) {
		const res = await fn(maybe);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}
