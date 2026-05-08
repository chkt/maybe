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
npm install @chkt/maybe
```

## convert
[`./source/convert/index.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/convert/index.ts#L1)
### References
```ts
export {
  all as allAsync,
  any as anyAsync,
  may as mayAsync,
  resolve
} from "./async"
export {
  all,
  any,
  blank,
  may
} from "./sync"
```
## convert/async
[`./source/convert/async.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/convert/async.ts#L1)
### Functions
```ts
function all<T extends unknown[]>(maybes:) : Promise<Maybe<T, ConversionFailure>>;
function any<T extends unknown[]>(maybes:) : Promise<Maybe<, ConversionFailure>>;
function may<T, R>(fn:(v:T) => Promise<Maybe<R>>, value:T) : Promise<Maybe<R>>;
function resolve<T, R>(fn:(v:T) => Maybe<Promise<R>>, value:T) : Promise<Maybe<R>>;
```
## convert/common
[`./source/convert/common.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/convert/common.ts#L1)
### Type Aliases
```ts
type ConversionFailure = DataMessage<ConversionFailureData>;
```
### Functions
```ts
function createConversionFailure(id:string, failures:Messages, messages:Messages) : ConversionFailure;
```
## convert/sync
[`./source/convert/sync.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/convert/sync.ts#L1)
### Functions
```ts
function all<T extends unknown[]>(maybes:) : Maybe<T, ConversionFailure>;
function any<T extends unknown[]>(maybes:) : Maybe<, ConversionFailure>;
function blank<T, M extends Failure>(maybe:Maybe<T, M>) : Maybe<void, M>;
function may<T, R>(fn:(v:T) => Maybe<R>, value:T) : Maybe<R>;
```
## flow
[`./source/flow/index.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/flow/index.ts#L1)
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
[`./source/flow/async.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/flow/async.ts#L1)
### Functions
```ts
function and<T, R, M extends Failure, F extends Failure>(fn:(value:T) => Promise<Maybe<R, F>>, maybe:Maybe<T, M>) : Promise<Maybe<R, M | F>>;
function failureIf<T, M extends Failure, F extends Failure>(shouldFail:(value:T) => boolean, fail:(value:T) => F, maybe:Promise<Maybe<T, M>>) : Promise<Maybe<T, M | F>>;
function onFailure<T, F extends Failure>(fn:(failure:F) => Promise<Maybe<unknown>>, maybe:Maybe<T, F>) : Promise<Maybe<T, F>>;
function onResult<T, F extends Failure>(fn:(value:T) => Promise<Maybe<unknown>>, maybe:Maybe<T, F>) : Promise<Maybe<T, F>>;
function or<T, R, M extends Failure, F extends Failure>(fn:(failure:M) => Promise<Maybe<R, F>>, maybe:Maybe<T, M>) : Promise<Maybe<T | R, F>>;
function resultIf<T, R, M extends Failure>(shouldSucceed:(failure:M) => boolean, succeed:(failure:M) => Result<R>, maybe:Promise<Maybe<T, M>>) : Promise<Maybe<T | R, M>>;
```
## flow/sync
[`./source/flow/sync.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/flow/sync.ts#L1)
### Functions
```ts
function and<T, R, M extends Failure, F extends Failure>(fn:(value:T) => Maybe<R, F>, maybe:Maybe<T, M>) : Maybe<R, M | F>;
function failureIf<T, M extends Failure, F extends Failure>(shouldFail:(value:T) => boolean, fail:(value:T) => F, maybe:Maybe<T, M>) : Maybe<T, M | F>;
function onFailure<T, F extends Failure>(fn:(failure:F) => Maybe<unknown>, maybe:Maybe<T, F>) : Maybe<T, F>;
function onResult<T, F extends Failure>(fn:(value:T) => Maybe<unknown>, maybe:Maybe<T, F>) : Maybe<T, F>;
function or<T, R, M extends Failure, F extends Failure>(fn:(value:M) => Maybe<R, F>, maybe:Maybe<T, M>) : Maybe<T | R, F>;
function resultIf<T, R, M extends Failure>(shouldSucceed:(failure:M) => boolean, succeed:(failure:M) => Result<R>, maybe:Maybe<T, M>) : Maybe<T | R, M>;
```
## native
[`./source/native/index.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/native/index.ts#L1)
### References
```ts
export { failureFrom as failureAsync, maybeFrom as maybeAsync, resultFrom as resultAsync } from "./async"
export { filterAll } from "./common"
export { failureFrom, maybeFrom, resultFrom } from "./sync"
```
## native/async
[`./source/native/async.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/native/async.ts#L1)
### Functions
```ts
function failureFrom<T, R>(fn:(v:T) => Promise<R>, value?:T) : Promise<Failure<R>>;
function maybeFrom<T, R, F extends Failure>(fn:(v:T) => Promise<R>, isResult:filter<R> = filterAll, value?:T) : Promise<Maybe<R, F | Failure<R>>>;
function resultFrom<T, R>(fn:(v:T) => Promise<R>, value?:T) : Promise<Maybe<R>>;
```
## native/common
[`./source/native/common.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/native/common.ts#L1)
### Type Aliases
```ts
type filter<T> = (value:T) => boolean;
```
### Functions
```ts
function filterAll() : boolean;
```
## native/sync
[`./source/native/sync.ts`](https://github.com/chkt/maybe/blob/2da1072bf9e0368eca28a08b983a0896243c4fe2/source/native/sync.ts#L1)
### Functions
```ts
function failureFrom<T, R>(fn:(v:T) => R, value?:T) : Failure<R>;
function maybeFrom<T, R>(fn:(v:T) => R, isResult:filter<R> = filterAll, value?:T) : Maybe<R, Failure<R>>;
function resultFrom<T, R>(fn:(v:T) => R, value?:T) : Result<R>;
```
