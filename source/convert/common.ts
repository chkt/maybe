import { DataMessage, Messages, messageSeverity } from '../message.js';


interface ConversionFailureData {
	readonly id : string;
	readonly failures : Messages;
}

export type ConversionFailure = DataMessage<ConversionFailureData>;


export function createConversionFailure(id:string, failures:Messages, messages:Messages) : ConversionFailure {
	return {
		data : { id, failures },
		severity : messageSeverity.error,
		messages
	};
}
