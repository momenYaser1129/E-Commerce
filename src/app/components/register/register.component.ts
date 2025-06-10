import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router)


  msgError: string = '';
  isLoading: boolean = false;
  msgSuccess:boolean = false ;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  registerForm: FormGroup = this._FormBuilder.group(
    {
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&^#~()\-_=+{}[\]|\\:;\"'<>,./]{8,}$/)]],
      rePassword: [null],
      phone: [
        null,
        [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
      ],
    },
    { validators: this.confirmPassword }
  );

  // registerForm: FormGroup = new FormGroup(
  //   {
  //     name: new FormControl(null, [
  //       Validators.required,
  //       Validators.minLength(3),
  //       Validators.maxLength(20),
  //     ]),
  //     email: new FormControl(null, [Validators.required, Validators.email]),
  //     password: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^\w{6,}$/),
  //     ]),
  //     rePassword: new FormControl(null),
  //     phone: new FormControl(null, [
  //       Validators.required,
  //       Validators.pattern(/^01[0125][0-9]{8}$/),
  //     ]),
  //   },
  //   this.confirmPassword
  // );

  // custom validation function => parameter sometimes be form group or form control
  // so we need to make it type of AbstractContorl

  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  registerSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next: (res) => {
          // action after Res success
          if(res.message === "success") {
            this.msgSuccess = true
           setTimeout(() => {
            this._Router.navigate(['/login'])
           }, 2000);
          }
          console.log(res);
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          // Showing error in html for user
          this.msgError = err.error.message;
          console.log(err);
          this.isLoading = false;
        },
      });
    }
    else {
      this.registerForm.setErrors({mismatch: true})
      this.registerForm.markAllAsTouched()
    }
  }

  // isControlValid(controlName: string): boolean {

  //   if(this.registerForm.get(controlName)?.errors &&
  //   (this.registerForm.get(controlName)?.dirty ||
  //     this.registerForm.get(controlName)?.touched))
  //   {
  //     return true ;
  //   }
  //   else {
  //     return false ;
  //   }
  // }

  // isTouched(controlName: string): any  {
  //   if (this.registerForm.get(controlName)?.dirty) {
  //     return this.isControlValid(controlName) ;
  //   }
}
