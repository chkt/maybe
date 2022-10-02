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
## failure
[`./source/failure.ts`](https://github.com/chkt/maybe/blob/1bc5e7a/source/failure.ts#L1)
### Enumerations
```ts
const enum failureSeverity {
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
interface CardinalFailure extends FailureCommon {
  readonly code : number;
}
interface DataFailure<T> extends FailureCommon {
  readonly data : T;
}
interface ErrorFailure extends FailureCommon {
  readonly error : Error;
}
interface MessageFailure extends FailureCommon {
  readonly message : string;
}
interface MessagesProvider {
  readonly messages : Failures;
}
```
### Type Aliases
```ts
type Failure<T = unknown> = ErrorFailure | CardinalFailure | MessageFailure | DataFailure<T>;
type FailureSeverity = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Failures = readonly Failure[];
```
### Functions
```ts
function containsFailure(maybe:MessagesProvider, message:Failure<unknown>) : boolean;
function createCardinalFailure(code:number, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : CardinalFailure;
function createDataFailure<T>(data:T, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : DataFailure<T>;
function createErrorFailure(error:Error, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : ErrorFailure;
function createFailure<T>(reason:T, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : Failure<T>;
function createMessageFailure(message:string, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : MessageFailure;
function isCardinalFailure(failure:Failure<unknown>) : failure is CardinalFailure;
function isDataFailure<T>(failure:Failure<T>) : failure is DataFailure<T>;
function isErrorFailure(failure:Failure<unknown>) : failure is ErrorFailure;
function isMessageFailure(failure:Failure<unknown>) : failure is MessageFailure;
function resolveFailureValue(failure:Failure<unknown>) : unknown;
```
## flow
[`./source/flow.ts`](https://github.com/chkt/maybe/blob/1bc5e7a/source/flow.ts#L1)
### Type Aliases
```ts
type processFailure<F, R> = (value:Failure<F>) => Maybe<R>;
type processValue<T, R> = (value:T) => Maybe<R>;
```
### Functions
```ts
function and<T, R>(fn:processValue<T, R>, maybe:Maybe<T, Failure<unknown>>) : Maybe<R>;
function may<R, T = undefined>(fn:processValue<T, R>, value?:T) : Maybe<R>;
function or<T, F>(fn:processFailure<F, T>, maybe:Maybe<T, Failure<F>>) : Maybe<T>;
function resolve<T>(maybe:Maybe<Promise<T>, Failure<unknown>>) : Promise<Maybe<T>>;
```
## index
[`./source/index.ts`](https://github.com/chkt/maybe/blob/1bc5e7a/source/index.ts#L1)
### References
```ts
export {
  CardinalFailure,
  DataFailure,
  ErrorFailure,
  Failure,
  FailureSeverity,
  Failures,
  MessageFailure,
  MessagesProvider,
  containsFailure,
  createCardinalFailure,
  createDataFailure,
  createErrorFailure,
  createFailure,
  createMessageFailure,
  failureSeverity,
  isCardinalFailure,
  isDataFailure,
  isErrorFailure,
  isMessageFailure,
  resolveFailureValue
} from "./failure";
export {
  and,
  may,
  or,
  processFailure,
  processValue,
  resolve
} from "./flow";
export {
  Maybe,
  Result,
  createResult,
  isFailure,
  isResult
} from "./maybe";
export { filter, result } from "./native";
```
## maybe
[`./source/maybe.ts`](https://github.com/chkt/maybe/blob/1bc5e7a/source/maybe.ts#L1)
### Interfaces
```ts
interface Result<T> extends MessagesProvider {
  readonly value : T;
}
```
### Type Aliases
```ts
type Maybe<T, F extends Failure = Failure> = Result<T> | F;
```
### Functions
```ts
function createResult<T>(value:T, messages:Failures = []) : Result<T>;
function isFailure<T, U>(maybe:Maybe<T, Failure<U>>) : maybe is Failure<U>;
function isResult<T>(maybe:Maybe<T, Failure<unknown>>) : maybe is Result<T>;
```
## native
[`./source/native.ts`](https://github.com/chkt/maybe/blob/1bc5e7a/source/native.ts#L1)
### Functions
```ts
function filter<R, T = undefined>(fn:(v:T) => R, isResult:(v:R) => boolean, value?:T) : Maybe<R, Failure<R>>;
function result<R, T = undefined>(fn:(v:T) => R, value?:T) : Maybe<R>;
```
