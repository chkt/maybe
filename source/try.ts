import { createFailure } from './failure';
import { Maybe, createResult } from './maybe';


export function tryMaybe<R>(block:() => R) : Maybe<R> {
	try {
		return createResult(block());
	}
	catch (err) {
		return createFailure(err);
	}
}

export async function tryResolve<R>(block:() => Promise<R>) : Promise<Maybe<R>> {
	try {
		return createResult(await block());
	}
	catch (err) {
		return createFailure(err);
	}
}
