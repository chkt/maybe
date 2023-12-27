import {
	Failure,
	Maybe,
	isFailure,
	isResult,
	mergeMessagesAb,
	mergeMessagesBa
} from '../maybe';


export async function and<T, R>(
	fn:(value:T) => Promise<Maybe<R>>,
	maybe:Maybe<T>
) : Promise<Maybe<R>> {
	if (isResult(maybe)) {
		const res = await fn(maybe.value);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export async function or<T, R, F0, F1>(
	fn:(failure:Failure<F0>) => Promise<Maybe<R, F1>>,
	maybe:Maybe<T, F0>
) : Promise<Maybe<T | R, F1>> {
	if (isFailure(maybe)) {
		const res = await fn(maybe);

		return mergeMessagesBa(res, maybe);
	}
	else return maybe;
}

export async function onResult<T, F>(
	fn:(value:T) => Promise<Maybe<unknown>>,
	maybe:Maybe<T, F>
) : Promise<Maybe<T, F>> {
	if (isResult(maybe)) {
		const res = await fn(maybe.value);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}

export async function onFailure<T, F>(
	fn:(failure:Failure<F>) => Promise<Maybe<unknown>>,
	maybe:Maybe<T, F>
) : Promise<Maybe<T, F>> {
	if (isFailure(maybe)) {
		const res = await fn(maybe);

		return mergeMessagesAb(maybe, res);
	}
	else return maybe;
}
