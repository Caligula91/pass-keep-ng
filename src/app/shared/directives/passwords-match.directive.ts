// import { Directive } from '@angular/core';
// import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

// @Directive({
//   selector: '[appPasswordsMatch]',
//   providers: [{provide: NG_VALIDATORS, useExisting: PasswordsMatchDirective, multi: true}]
// })
// export class PasswordsMatchDirective implements Validator {

//   constructor() { }

//   validate(control: AbstractControl): ValidationErrors | null {
//     return this.passwordMatch()(control);
//   }

//   passwordMatch(): ValidatorFn {
//     return (formGroup: AbstractControl): ValidationErrors | null => {
//       const password = formGroup.get('password')?.value;
//       const passwordConfirm = formGroup.get('passwordConfirm')?.value;
//       return (password === passwordConfirm) 
//         ? null
//         : { 'passwordsNotMatching': true};
//     }
//   };
  
// }
