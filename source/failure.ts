export type FailureSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface MessagesProvider {
	readonly messages : Failures;
}

interface FailureCommon extends MessagesProvider {
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

export function createErrorFailure(
	error:Error,
	severity:FailureSeverity = failureSeverity.error,
	messages:Failures = []
) : ErrorFailure {
	return { severity, error, messages };
}

export function createCardinalFailure(
	code:number,
	severity:FailureSeverity = failureSeverity.error,
	messages:Failures = []
) : CardinalFailure {
	return { severity, code, messages };
}

export function createMessageFailure(
	message:string,
	severity:FailureSeverity = failureSeverity.error,
	messages:Failures = []
) : MessageFailure {
	return { severity, message, messages };
}

export function createDataFailure<T>(
	data:T,
	severity:FailureSeverity = failureSeverity.error,
	messages:Failures = []
) : DataFailure<T> {
	return { severity, data, messages };
}

export function createFailure<T>(
	reason:T,
	severity:FailureSeverity = failureSeverity.error,
	messages:Failures = []
) : Failure<T> {
	switch (typeof reason) {
		case 'number' : return createCardinalFailure(reason, severity, messages);
		case 'string' : return createMessageFailure(reason, severity, messages);
		case 'object' :
			if (reason instanceof Error) return createErrorFailure(reason, severity, messages);
		// no default
	}

	return { severity, data : reason, messages };
}

export function resolveFailureValue(failure:Failure) : unknown {
	if (isErrorFailure(failure)) return failure.error;
	else if (isCardinalFailure(failure)) return failure.code;
	else if (isMessageFailure(failure)) return failure.message;
	else return failure.data;
}

export function containsFailure(maybe:MessagesProvider, message:Failure) : boolean {
	for (const msg of maybe.messages) {
		if (msg === message || containsFailure(msg, message)) return true;
	}

	return false;
}
