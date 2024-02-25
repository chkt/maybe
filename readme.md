[![Tests](https://github.com/chkt/maybe/workflows/tests/badge.svg)](https://github.com/chkt/maybe/actions)
[![Version](https://img.shields.io/npm/v/@chkt/maybe)](https://www.npmjs.com/package/@chkt/maybe)
![Node](https://img.shields.io/node/v/@chkt/maybe)
![Dependencies](https://img.shields.io/librariesio/release/npm/@chkt/maybe)
![Licence](https://img.shields.io/npm/l/@chkt/maybe)
![Language](https://img.shields.io/github/languages/top/chkt/maybe)
![Size](https://img.shields.io/bundlephobia/min/@chkt/maybe)

# maybe

Minimalistic application flow handling

## Install

```sh
yarn add @chkt/maybe
```
# Modules
## compose
[`./source/compose.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/compose.ts#L1)
### Functions
```ts
function apply<T, R0, R1>(b:process<T, R0, R1>, a:transform<T, R0>) : transform<T, R1>;
```
## convert
[`./source/convert/index.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/convert/index.ts#L1)
### References
```ts
export { all as allAsync, resolve } from "./async"
export { all, blank, may } from "./sync"
```
## convert/async
[`./source/convert/async.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/convert/async.ts#L1)
### Functions
```ts
function all<T, R, F>(fn:(value:T) => Promise<Maybe<R, F>>, values:readonly T[]) : Promise<Maybe<R[], F>>;
function resolve<T, R>(fn:(v:T) => Maybe<Promise<R>>, value:T) : Promise<Maybe<R>>;
```
## convert/sync
[`./source/convert/sync.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/convert/sync.ts#L1)
### Functions
```ts
function all<T, R, F>(fn:(v:T) => Maybe<R, F>, values:readonly T[]) : Maybe<R[], F>;
function blank<T, M>(maybe:Maybe<T, M>) : Maybe<void, M>;
function may<T, R>(fn:(v:T) => Maybe<R>, value:T) : Maybe<R>;
```
## flow
[`./source/flow/index.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/flow/index.ts#L1)
### References
```ts
export {
  and as andAsync,
  failureIf as failureIfAsync,
  onFailure as onFailureAsync,
  onResult as onResultAsync,
  or as orAsync,
  resultIf as resultIfAsync
} from "./async"
export {
  and,
  failureIf,
  onFailure,
  onResult,
  or,
  resultIf
} from "./sync"
```
## flow/async
[`./source/flow/async.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/flow/async.ts#L1)
### Functions
```ts
function and<T, R, M, F>(fn:(value:T) => Promise<Maybe<R, F>>, maybe:Maybe<T, M>) : Promise<Maybe<R, M | F>>;
function failureIf<T, M, F>(shouldFail:(value:T) => boolean, fail:(value:T) => Failure<F>, maybe:Promise<Maybe<T, M>>) : Promise<Maybe<T, M | F>>;
function onFailure<T, F>(fn:(failure:Failure<F>) => Promise<Maybe<unknown>>, maybe:Maybe<T, F>) : Promise<Maybe<T, F>>;
function onResult<T, F>(fn:(value:T) => Promise<Maybe<unknown>>, maybe:Maybe<T, F>) : Promise<Maybe<T, F>>;
function or<T, R, M, F>(fn:(failure:Failure<M>) => Promise<Maybe<R, F>>, maybe:Maybe<T, M>) : Promise<Maybe<T | R, F>>;
function resultIf<T, R, M>(shouldSucceed:(failure:Failure<M>) => boolean, succeed:(failure:Failure<M>) => Result<R>, maybe:Promise<Maybe<T, M>>) : Promise<Maybe<T | R, M>>;
```
## flow/sync
[`./source/flow/sync.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/flow/sync.ts#L1)
### Functions
```ts
function and<T, R, M, F>(fn:(value:T) => Maybe<R, F>, maybe:Maybe<T, M>) : Maybe<R, M | F>;
function failureIf<T, M, F>(shouldFail:(value:T) => boolean, fail:(value:T) => Failure<F>, maybe:Maybe<T, M>) : Maybe<T, M | F>;
function onFailure<T, F>(fn:(failure:Failure<F>) => Maybe<unknown>, maybe:Maybe<T, F>) : Maybe<T, F>;
function onResult<T, F>(fn:(value:T) => Maybe<unknown>, maybe:Maybe<T, F>) : Maybe<T, F>;
function or<T, R, M, F>(fn:(value:Failure<M>) => Maybe<R, F>, maybe:Maybe<T, M>) : Maybe<T | R, F>;
function resultIf<T, R, M>(shouldSucceed:(failure:Failure<M>) => boolean, succeed:(failure:Failure<M>) => Result<R>, maybe:Maybe<T, M>) : Maybe<T | R, M>;
```
## index
[`./source/index.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/index.ts#L1)
### References
```ts
export { apply } from "./compose"
export { all as allAsync, resolve } from "./convert/async"
export { all, blank, may } from "./convert/sync"
export {
  and as andAsync,
  failureIf as failureIfAsync,
  onFailure as onFailureAsync,
  onResult as onResultAsync,
  or as orAsync,
  resultIf as resultIfAsync
} from "./flow/async"
export {
  and,
  failureIf,
  onFailure,
  onResult,
  or,
  resultIf
} from "./flow/sync"
export {
  Failure,
  Maybe,
  Result,
  createFailure,
  createResult,
  isFailure,
  isResult
} from "./maybe"
export {
  CardinalMessage,
  DataMessage,
  DataRecord,
  DataValue,
  ErrorMessage,
  Message,
  MessageSeverity,
  Messages,
  TextMessage,
  containsMessage,
  createCardinalMessage,
  createDataMessage,
  createErrorMessage,
  createMessage,
  createTextMessage,
  flattenMessage,
  flattenMessages,
  isCardinalMessage,
  isDataMessage,
  isErrorMessage,
  isTextMessage,
  messageSeverity,
  resolveMessageValue
} from "./message"
export { failureFrom as failureAsync, maybeFrom as maybeAsync, resultFrom as resultAsync } from "./native/async"
export { filterAll } from "./native/common"
export { failureFrom, maybeFrom, resultFrom } from "./native/sync"
```
## maybe
[`./source/maybe.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/maybe.ts#L1)
### Interfaces
```ts
interface Result<T> extends MessageComposite {
  readonly value : T;
}
```
### Type Aliases
```ts
type Failure<T = unknown> = Message<T>;
type Maybe<T, F = unknown> = Result<T> | Failure<F>;
```
### Functions
```ts
function createFailure<T>(value:T, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : MessageDistinct<T>;  // 
function createResult<T>(value:T, messages:Messages = []) : Result<T>;
function isFailure<T, F>(maybe:Maybe<T, F>) : maybe is Failure<F>;
function isResult<T, F>(maybe:Maybe<T, F>) : maybe is Result<T>;
function mergeMessagesAb<T extends MessageComposite, F>(a:T, b:Maybe<unknown, F>) : T;
function mergeMessagesBa<T extends MessageComposite, F>(a:T, b:Maybe<unknown, F>) : T;
```
## message
[`./source/message.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/message.ts#L1)
### Enumerations
```ts
const enum messageSeverity {
  debug = 6,
  error = 1,
  fatal = 0,
  info = 4,
  notice = 3,
  verbose = 5,
  warn = 2
}
```
### Interfaces
```ts
interface CardinalMessage extends MessageCommon {
  readonly code : number;
}
interface DataMessage<T> extends MessageCommon {
  readonly data : T;
}
interface DataValue<T> {
  readonly value : T;
}
interface ErrorMessage<T extends Error> extends MessageCommon {
  readonly error : T;
}
interface MessageComposite {
  readonly messages : Messages;
}
interface TextMessage extends MessageCommon {
  readonly text : string;
}
```
### Type Aliases
```ts
type DataRecord = Readonly<Record<string | symbol, unknown>>;
type Message<T = unknown> = ErrorMessage<> | CardinalMessage | TextMessage | DataMessage<> | DataMessage<DataValue<T>>;
type MessageSeverity = messageSeverity;
type Messages = readonly Message[];
```
### Functions
```ts
function containsMessage(parent:MessageComposite, message:Message<unknown>) : boolean;
function createCardinalMessage(code:number, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : CardinalMessage;
function createDataMessage<T>(data:T, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : DataMessageDistinct<T>;
function createErrorMessage<T extends Error>(error:T, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : ErrorMessage<T>;
function createMessage<T>(value:T, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : MessageDistinct<T>;
function createTextMessage(text:string, severity:messageSeverity = messageSeverity.error, messages:Messages = []) : TextMessage;
function flattenMessage(message:Message<unknown>) : Messages;
function flattenMessages(messages:Messages) : Messages;
function isCardinalMessage<T>(message:Message<T>) : message is CardinalMessage;
function isDataMessage<T>(message:Message<T>) : message is DataMessage<DataValue<T>> | DataMessage<>;
function isErrorMessage<T>(message:Message<T>) : message is ErrorMessage<>;
function isTextMessage<T>(message:Message<T>) : message is TextMessage;
function mergeCompositeAb<T extends MessageComposite, U extends MessageComposite>(a:T, b:U) : T;
function mergeCompositeBa<T extends MessageComposite, U extends MessageComposite>(a:T, b:U) : T;
function resolveMessageValue<T>(message:Message<T>) : unknown;
```
## native
[`./source/native/index.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/native/index.ts#L1)
### References
```ts
export { failureFrom as failureAsync, maybeFrom as maybeAsync, resultFrom as resultAsync } from "./async"
export { filterAll } from "./common"
export { failureFrom, maybeFrom, resultFrom } from "./sync"
```
## native/async
[`./source/native/async.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/native/async.ts#L1)
### Functions
```ts
function failureFrom<T, R>(fn:(v:T) => Promise<R>, value?:T) : Promise<Failure<R>>;
function maybeFrom<T, R, F>(fn:(v:T) => Promise<R>, isResult:filter<R> = filterAll, value?:T) : Promise<Maybe<R, R | F>>;
function resultFrom<T, R>(fn:(v:T) => Promise<R>, value?:T) : Promise<Maybe<R>>;
```
## native/common
[`./source/native/common.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/native/common.ts#L1)
### Type Aliases
```ts
type filter<T> = (value:T) => boolean;
```
### Functions
```ts
function filterAll() : boolean;
```
## native/sync
[`./source/native/sync.ts`](https://github.com/chkt/maybe/blob/4e12a86/source/native/sync.ts#L1)
### Functions
```ts
function failureFrom<T, R>(fn:(v:T) => R, value?:T) : Failure<R>;
function maybeFrom<T, R>(fn:(v:T) => R, isResult:filter<R> = filterAll, value?:T) : Maybe<R, R>;
function resultFrom<T, R>(fn:(v:T) => R, value?:T) : Result<R>;
```
