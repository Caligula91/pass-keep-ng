import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordsMatch = ((): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const passwordConfirm = formGroup.get('passwordConfirm')?.value;
    return (password === passwordConfirm) 
      ? null
      : { 'passwordsNotMatching': true };
  }
})();

export const pinsMatch = ((): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const pin = formGroup.get('pin')?.value;
    const pinConfirm = formGroup.get('pinConfirm')?.value;
    return (pin === pinConfirm) 
      ? null
      : { 'pinsNotMatching': true };
  }
})();

export const validCharacters = ((): ValidatorFn => {
  const serbianLatinRegExp = new RegExp(/(č|š|dž|ž|đ|ć|[a-z])|\s/, 'ig');
  const error = { 'invalidCharacters': true };
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const name = formGroup.get('name')?.value;
    if (!name) return null
    if (name.match(/^\s*$/)) return error;
    const arr: string[] | null = name.match(serbianLatinRegExp);
    return (arr && arr.length === name.length)
      ? null
      : error
  }
})();

export const validDeactivate = ((): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const valid = formGroup.get('deactivate')?.value === 'deactivate';
    return (valid) 
      ? null
      : { 'invalidDeactivate': true };
  }
})();

export const validDelete = ((): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const valid = formGroup.get('delete')?.value === 'delete';
    return (valid) 
      ? null
      : { 'invalidDelete': true };
  }
})();

export const validPassword = ((): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.value;
    if (!password) return null;
    return (password.match(/^[0-9a-zA-Z]+$/)) 
      ? null
      : { 'invalidCharacters': true };
  }
})();