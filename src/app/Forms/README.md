# Forms

Existen 2 tipos de formularios: Template Driven y Reactivos

## Template Driven Forms

Se crean usando directivas en las plantillas. Angular realiza un seguimiento automático del valor y de la validez de los mismos

```js
@Component({})
export class AppComponent {
  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}

// ....

<form #myForm="ngForm" (ngSubmit)="onSubmit(myForm)">
  <input type="text" name="name" ngModel required />
  <button type="submit">Submit</button>
</form>
```

## Reactivos

Se crean de foram programatica en el componente. se usan controles y grupos de formularios, mayor flexibilidad.

```js
@Component({})
export class AppComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
    });
  }

  onSubmit() {
    console.log(this.form.value);
  }
}

//

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input type="text" formControlName="name" />
  <input type="email" formControlName="email" />
  <button type="submit">Submit</button>
</form>
```

```js
// Cambio de valor
this.form.valueChanges.subscribe((value) => {
  console.log(value);
});

// Form group
form: FormGroup;

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    name: '',
    email: '',
  });
}

// Form array o campos dinamicos
form: FormGroup;

constructor(private fb: FormBuilder) {
  this.form = this.fb.group({
    name: '',
    emails: this.fb.array([]),
  });
}

get emails() {
  return this.form.get('emails') as FormArray;
}

addEmail() {
  this.emails.push(this.fb.control(''));
}

removeEmail(index: number) {
  this.emails.removeAt(index);
}

// setValue y patchValue
this.form.setValue({
  name: 'John',
  addresses: [
    { street: '123 Main St', city: 'Anytown', state: 'CA', zip: '12345' },
    { street: '456 Elm St', city: 'Othertown', state: 'NY', zip: '67890' },
  ],
});

this.form.patchValue({
  name: 'Jane',
});
```

