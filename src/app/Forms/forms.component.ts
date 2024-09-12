import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  confirmPassword,
  emailValidator,
  passwordValidator,
} from './validators';
import { hasErrorDirective } from './hasError.directive';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [ReactiveFormsModule, hasErrorDirective],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent {
  preferences = [
    'Angular',
    'React',
    'Vue',
    'Gatsby',
    'Astro',
    'Next.js',
    'Node.js',
  ];
  countries = ['Colombia', 'Brasil', 'Perú', 'Argentina'];
  cities = {
    [this.countries[0]]: ['Bogotá', 'Medellin', 'Cartagena'],
    [this.countries[1]]: ['Brasil1', 'Brasil2'],
    [this.countries[2]]: ['Peru1', 'Peru2'],
    [this.countries[3]]: ['Argentina1'],
  };

  form = this.fb.group(
    {
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, emailValidator]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('3[0-9]{2} [0-9]{3} [0-9]{4}'),
        ],
      ],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: confirmPassword('password', 'confirmPassword'),
    }
  );

  constructor(private fb: FormBuilder) {}

  get country() {
    return this.form.value.country;
  }

  onSubmit(): void {

  }
}
