import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlStatus,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appHasError]',
  standalone: true,
})
export class hasErrorDirective implements OnInit, OnDestroy {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) field!: string;
  control?: AbstractControl;
  suscribtion?: Subscription;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (this.form && this.field && this.form.get(this.field)) {
      this.control = this.form.get(this.field) as AbstractControl;
      this.suscribtion = this.control.statusChanges.subscribe((prop) => {
        this.updateErrorMessage();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.suscribtion) {
      this.suscribtion.unsubscribe();
    }
  }

  updateErrorMessage(): void {
    if (!this.control?.errors) {
      this.el.nativeElement.style['display'] = 'none';
      return
    }

    this.el.nativeElement.style['display'] = 'block'
    this.el.nativeElement.style['color'] = 'red'
    this.el.nativeElement.innerText = this.getMessage(this.control.errors)
  }

  getMessage(errors: ValidationErrors | null): string {
    console.log(errors)
    if(errors?.['required']) return "Campo requerido"
    if(errors?.['minlength']) return "Cantidad mínima de caracteres incorrecta"
    if(errors?.['maxlength']) return "Cantidad máxima de caracteres incorrecta"
    return "Revisa el campo"
  }
}
