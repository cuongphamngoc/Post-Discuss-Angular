import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimumTagsValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const tags = control.value as string[];
    return tags && tags.length >= min ? null : { minimumTags: { requiredLength: min, actualLength: tags.length } };
  };
}
