import { DataMessage, Message, MessageSeverity, Messages, isDataMessage } from '../message.js';


interface ConversionFailureData {
	readonly id : string;
	readonly failures : Messages;
}

export type ConversionFailure = DataMessage<ConversionFailureData>;


export function createConversionFailure(id:string, failures:Messages, messages:Messages = []) : ConversionFailure {
	return {
		data : { id, failures },
		severity : MessageSeverity.error,
		messages
	};
}

export function isConversionFailure(message:Message) : message is ConversionFailure {
	return isDataMessage(message) && 'id' in message.data && 'failures' in message.data;
}
