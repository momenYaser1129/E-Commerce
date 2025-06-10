import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TranslateModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss'], // Corrected to styleUrls
})
export class ForgetpasswordComponent {
  step: number = 1;
  showPassword: boolean = false;
  isLoading1: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;

  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  readonly _TranslateService = inject(TranslateService);

  verifyEmail: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
  });

  verifyCode: FormGroup = this._FormBuilder.group({
    resetCode: [null, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
  });

  resetPassword: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
  });

  // functions to make action submit and take the service from auth service

  verifyEmailSubmit(): void {
    // submit --> get VAlue  -- email  form1 --> set --- form3 inside email

    let emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.get('email')?.patchValue(emailValue);

    this.isLoading1 = true;
    this._AuthService.setEmailVerify(this.verifyEmail.value).subscribe({
      next: (res) => {
        console.log(res);
        if (res.statusMsg === 'success') {
          this.step = 2;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading1 = false;
      },
    });
  }

  verifyCodeSubmit(): void {
    this.isLoading2 = true;
    this._AuthService.setCodeVerify(this.verifyCode.value).subscribe({
      next: (res) => {
        if (res.status === 'Success') {
          console.log(res);
          this.step = 3;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading2 = false;
      },
    });
  }

  resetPasswordSubmit(): void {
    this.isLoading3 = true;
    this._AuthService.setResetPass(this.resetPassword.value).subscribe({
      next: (res) => {
        console.log(res);
        localStorage.setItem('userToken', res.token);
        this._AuthService.saveUserData();
        this._Router.navigate(['/home']);
        this.isLoading3 = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading3  = false;
      },
    });
  }
}
