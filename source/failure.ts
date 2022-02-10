export type FailureSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface FailureCommon {
	readonly severity : FailureSeverity;
}

export interface ErrorFailure extends FailureCommon {
	readonly error : Error;
}

export interface CardinalFailure extends FailureCommon {
	readonly code : number;
}

export interface MessageFailure extends FailureCommon {
	readonly message : string;
}

export interface DataFailure<T> extends FailureCommon {
	readonly data : T;
}

export type Failure<T = unknown> = ErrorFailure | CardinalFailure | MessageFailure | DataFailure<T>;
export type Failures = readonly Failure[];


export const enum failureSeverity {
	fatal,
	error,
	warn,
	notice,
	info,
	verbose,
	debug
}


export function isErrorFailure(failure:Failure) : failure is ErrorFailure {
	return 'error' in failure;
}

export function isCardinalFailure(failure:Failure) : failure is CardinalFailure {
	return 'code' in failure;
}

export function isMessageFailure(failure:Failure) : failure is MessageFailure {
	return 'message' in failure;
}

export function isDataFailure<T>(failure:Failure<T>) : failure is DataFailure<T> {
	return 'data' in failure;
}

export function createErrorFailure(error:Error, severity:FailureSeverity = failureSeverity.error) : ErrorFailure {
	return { severity, error };
}

export function createCardinalFailure(code:number, severity:FailureSeverity = failureSeverity.error) : CardinalFailure {
	return { severity, code };
}

export function createMessageFailure(
	message:string,
	severity:FailureSeverity = failureSeverity.error
) : MessageFailure {
	return { severity, message };
}

export function createDataFailure<T>(data:T, severity:FailureSeverity = failureSeverity.error) : DataFailure<T> {
	return { severity, data };
}

export function createFailure<T>(reason:T, severity:FailureSeverity = failureSeverity.error) : Failure<T> {
	switch (typeof reason) {
		case 'number' : return createCardinalFailure(reason, severity);
		case 'string' : return createMessageFailure(reason, severity);
		case 'object' :
			if (reason instanceof Error) return createErrorFailure(reason, severity);
		// no default
	}

	return { severity, data : reason };
}

export function resolveFailureValue(failure:Failure) : unknown {
	if (isErrorFailure(failure)) return failure.error;
	else if (isCardinalFailure(failure)) return failure.code;
	else if (isMessageFailure(failure)) return failure.message;
	else return failure.data;
}
