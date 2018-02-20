<p align="center">
  <a href="https://sweetalert2.github.io">
    <img src="assets/sweetalert2-guards-logo.png" width="498" height="200" alt="SweetAlert2 Guards">
  </a>
</p>

<h1 align="center">@sweetalert2/guards</h1>

<p align="center">
  Guard your methods calls with <a href="https://sweetalert2.github.io">SweetAlert2</a> decorators!
</p>

<p align="center">
  :construction: <b>Experimental project</b> :construction:<br>
  Please restrict your usage to testing and feedback only.
</p>

**SweetAlert2 Guards** are a simple, opinionated solution to elegantly wrap your JavaScript methods execution in alerts, without having to mix UI and logic code.

It can be used in any framework or custom solution that uses classes and class methods (Angular, React, Vue, etc.) – because of a language limitation, decorators [can't be used on simple functions yet](https://github.com/wycats/javascript-decorators/issues/4).

Here's a simple example *(the class is omitted)*:

```ts
import { guard, Confirm, ErrorStrategy } from '@sweetalert2/guards';

@Confirm(file => ({
    title: `Delete ${file}?`,
    text: `You won't be able to revert this!`,
    [guard.errorStrategy]: ErrorStrategy.validationError,
    [guard.onSuccess]: () => void swal('Deleted!', `${file} has been deleted`, 'success')
}))
public async deleteFile(file: string) {
    const response = await fetch(`/api/files/${file}`, { method: 'delete' });
    
    if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
    }
}
```

:white_check_mark: Now, every code that calls this method, may it be external code, Angular template, React JSX, etc. will transparently trigger a confirmation modal.

Resulting in:

<p align="center">
  <img src="assets/sweetalert2-guards-demo.gif" width="549" height="343">
</p>

----------------

 - [Installation & Requirements](#package-installation--requirements)
 - [`@Alert()` decorator](#alert-guard) — the most basic decorator
 - [`@Confirm()` decorator](#confirm-guard) — comes with confirmation dialog presets
 - [`@Loader()` decorator](#loader-guard) — show a loading dialog while your method is executing
 - [`[guard.*]` options](#guard-options-control-the-guards-behaviour) — control the guard's behaviour
 - [Recipes](#stew-recipes) — *Also a list of features!*
   - [How to change the modal's parameters depending on the method's arguments?](#grey_question-q0-how-to-change-the-modals-parameters-depending-on-the-methods-arguments)
   - [How to pass the SweetAlert2 modal result to the method?](#grey_question-q1-how-to-pass-the-sweetalert2-modal-result-to-the-method)
   - [How to modify the arguments passed to the method?](#grey_question-q2-how-to-modify-the-arguments-passed-to-the-method)
   - [When I click "Cancel", I want the function to return a result, not throw an exception](#grey_question-q3-when-i-click-cancel-i-want-the-function-to-return-a-result-not-throw-an-exception)
   - [I want to return a "placeholder" result when the modal is dismissed](#grey_question-q4-i-want-to-return-a-placeholder-result-when-the-modal-is-dismissed)
   - [I want to show an error or success modal when the method has terminated](#grey_question-q5-i-want-to-show-an-error-or-success-modal-when-the-method-has-terminated)
   - [Can I use synchronous code in the methods?](#grey_question-q6-can-i-use-synchronous-code-in-the-methods)

----------------

## :package: Installation & Requirements

Install _@sweetalert2/guards_ and _sweetalert2_ via the npm registry:

```bash
npm install --save sweetalert2 @sweetalert2/guards@1.0.0-alpha
```

 - [x] **TypeScript**: *Guards* is written in TypeScript – type definitions are bundled in the package.

:point_right: **Using Angular and liking declarative approaches?** See also [ngx-sweetalert2](https://github.com/sweetalert2/ngx-sweetalert2).

:point_right: **Before posting an issue**, please check that the problem isn't on SweetAlert's side.


## :link: API
 
### `@Alert()` Guard
 
This decorator is the simplest one. It will display an alert before your method executes, show a loading indicator when it's executing, and that's all.

<details>
<summary>Show <code>@Alert()</code>'s presets</summary>

```ts
{
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !swal.isLoading(),
    allowEscapeKey: () => !swal.isLoading()
}
```
</details>
<br>
 
```ts
@Alert({
    title: 'Downloading the Internet',
    text: 'This operation will take a long time. Please be patient.',
    type: 'warning'
})
public downloadTheInternet() {
    // If the following service returns a Promise,
    // the alert will show a loading indicator.
    return this.myInternerService.download('http://*');
}
```

<details>
<summary>Show visual result</summary>
</details>

<br>

### `@Confirm()` Guard
 
This decorator will show a confirmation dialog with _Confirm_ and _Cancel_ buttons. The user may choose to execute the decorated method or not.

<details>
<summary>Show <code>@Confirm()</code>'s presets</summary>

```ts
{
    type: 'question',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !swal.isLoading(),
    allowEscapeKey: () => !swal.isLoading()
}
```
</details>
<br>
 
```ts
@Confirm({
    title: 'Close account?',
    text: 'This will definitely close you account and you won\'t be able to login anymore.',
    type: 'warning'
})
public closeMyAccount() {
    return this.userService.closeAccount();
}
```

<details>
<summary>Show visual result</summary>
</details>

<br>

### `@Loader()` Guard
 
This decorator will execute the decorated method as soon as it's called, showing a loading indicator while the method is executing.

<details>
<summary>Show <code>@Loader()</code>'s presets</summary>

```ts
{
    showConfirmButton: false,
    showLoaderOnConfirm: true,
    allowOutsideClick: () => !swal.isLoading(),
    allowEscapeKey: () => !swal.isLoading(),
    onBeforeOpen: swal.clickConfirm
}
```
</details>
<br>
 
```ts
@Loader({
    title: 'Please wait',
    text: 'This may take a few seconds...'
})
public async syncDataFromApi() {
    const datas = await this.api.getDatas();

    this.apiCache.store(datas);
}
```

<details>
<summary>Show visual result</summary>
</details>

<br>

### `[guard.*]` options

#### `[guard.invokeStrategy]`

<details>
<summary>Control how arguments are passed to the decorated method. Show more...</summary>
</details>

#### `[guard.errorStrategy]`

<details>
<summary>Control how the guard reacts to execution errors (error flow control). Show more...</summary>
</details>

#### `[guard.onDismiss]`

<details>
<summary>React upon guard dialog dismissal (throw an error, return placeholder result, etc). Show more...</summary>
</details>

#### `[guard.onError]`

<details>
<summary>React upon decorated method execution failure. Show more...</summary>
</details>

#### `[guard.onSuccess]`

<details>
<summary>React upon decorated method execution success. Show more...</summary>
</details>


## :stew: Recipes 

#### :grey_question: Q0: How to change the modal's parameters depending on the method's arguments?

<details>
<summary>Instead of giving an object to the decorator (<code>@Decorator({})`</code>), pass a function (<code>@Decorator((arg1, arg2) => {})</code>). Show more...</summary>
</details>

#### :grey_question: Q1: How to pass the SweetAlert2 modal result to the method?

<details>
<summary>This is possible, but not recommended, especially in typed languages (like TypeScript) - except if you preserve the call signature. Show more...</summary>
</details>

#### :grey_question: Q2: How to modify the arguments passed to the method?

See Q1.

#### :grey_question: Q3: When I click "Cancel", I want the function to return a result, not throw an exception

<details>
<summary>Override default <code>[guard.onDismiss]</code> and return a value. Show more...</summary>
</details>

#### :grey_question: Q4: I want to return a "placeholder" result when the modal is dismissed

See Q3.

#### :grey_question: Q5: I want to show an error or success modal when the method has terminated

<details>
<summary>Use <code>[guard.onSuccess]</code> or <code>[guard.onError]</code> and call <code>swal()</code>. Show more...</summary>
</details>

#### :grey_question: Q6: Can I use synchronous code in the methods?

<details>
<summary>Yes, but return a resolved promise then. Show more...</summary>
</details>
