import { AbstractControl } from '@angular/forms';

export const emailValidator = (control: AbstractControl) => {
  const reg = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$');
  return reg.test(control.value) ? null : { invalidEmail: true };
};

export const confirmPassword = (controlA: string, controlB: string) => {
  return function (formGroup: AbstractControl) {
    const password = formGroup.get(controlA);
    const confirmPassword = formGroup.get(controlB);

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value === confirmPassword.value) {
      confirmPassword.setErrors({ invalidConfirmPassword: true });
    } else {
      confirmPassword.setErrors(null);
    }

    return null;
  };
};

export const passwordValidator = (control: AbstractControl) => {
  const reg = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,10}$'
  );
  return reg.test(control.value);
};
