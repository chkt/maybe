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
[`./source/failure.ts`](https://github.com/chkt/maybe/blob/b54683d/source/failure.ts#L1)
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
interface FailuresProvider {
  readonly messages : Failures;
}
interface MessageFailure extends FailureCommon {
  readonly message : string;
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
function containsFailure(maybe:FailuresProvider, failure:Failure<unknown>) : boolean;
function createCardinalFailure(code:number, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : CardinalFailure;
function createDataFailure<T>(data:T, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : DataFailure<T>;
function createErrorFailure(error:Error, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : ErrorFailure;
function createFailure<T>(reason:T, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : Failure<T>;
function createMessageFailure(message:string, severity:FailureSeverity = failureSeverity.error, messages:Failures = []) : MessageFailure;
function flattenFailure(failure:Failure<unknown>) : Failures;
function flattenFailures(failures:Failures, res:Failure<unknown>[] = []) : Failures;
function isCardinalFailure(failure:Failure<unknown>) : failure is CardinalFailure;
function isDataFailure<T>(failure:Failure<T>) : failure is DataFailure<T>;
function isErrorFailure(failure:Failure<unknown>) : failure is ErrorFailure;
function isMessageFailure(failure:Failure<unknown>) : failure is MessageFailure;
function resolveFailureValue(failure:Failure<unknown>) : unknown;
```
## flow
[`./source/flow.ts`](https://github.com/chkt/maybe/blob/b54683d/source/flow.ts#L1)
### Type Aliases
```ts
type process<T, U, R> = (fn:transform<T, U>, v:T) => R;
type processFailure<F, R> = transform<Failure<F>, Maybe<R>>;
type processValue<T, R> = transform<T, Maybe<R>>;
type transform<T, R> = (v:T) => R;
```
### Functions
```ts
function and<T, R>(fn:processValue<T, R>, maybe:Maybe<T, Failure<unknown>>) : Maybe<R>;
function apply<T, U, R>(b:process<T, U, R>, a:transform<T, U>) : transform<T, R>;
function may<T, R>(fn:processValue<T, R>, value:T) : Maybe<R>;
function or<T, F>(fn:processFailure<F, T>, maybe:Maybe<T, Failure<F>>) : Maybe<T>;
function resolve<T, R>(fn:(v:T) => Maybe<Promise<R>, Failure<unknown>>, value:T) : Promise<Maybe<R>>;
```
## index
[`./source/index.ts`](https://github.com/chkt/maybe/blob/b54683d/source/index.ts#L1)
### References
```ts
export {
  CardinalFailure,
  DataFailure,
  ErrorFailure,
  Failure,
  FailureSeverity,
  Failures,
  FailuresProvider,
  MessageFailure,
  containsFailure,
  createCardinalFailure,
  createDataFailure,
  createErrorFailure,
  createFailure,
  createMessageFailure,
  failureSeverity,
  flattenFailure,
  flattenFailures,
  isCardinalFailure,
  isDataFailure,
  isErrorFailure,
  isMessageFailure,
  resolveFailureValue
} from "./failure";
export {
  and,
  apply,
  may,
  or,
  process,
  processFailure,
  processValue,
  resolve,
  transform
} from "./flow";
export {
  Maybe,
  Result,
  createResult,
  isFailure,
  isResult
} from "./maybe";
export { maybeFrom, resultFrom } from "./native";
```
## maybe
[`./source/maybe.ts`](https://github.com/chkt/maybe/blob/b54683d/source/maybe.ts#L1)
### Interfaces
```ts
interface Result<T> extends FailuresProvider {
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
[`./source/native.ts`](https://github.com/chkt/maybe/blob/b54683d/source/native.ts#L1)
### Functions
```ts
function maybeFrom<R, T = undefined>(fn:(v:T) => R, isResult:filter<R>, value?:T) : Maybe<R, Failure<R>>;
function resultFrom<R, T = undefined>(fn:(v:T) => R, value?:T) : Result<R>;
```
