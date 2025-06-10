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
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly _AuthService = inject(AuthService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);
  readonly _TranslateService = inject(TranslateService);

  msgError: string = '';
  isLoading: boolean = false;
  msgSuccess: boolean = false;
  showPassword: boolean = false;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&^#~()\-_=+{}[\]|\\:;\"'<>,./]{4,}$/)]],
  });

  confirmPassword(g: AbstractControl) {
    if (g.get('password')?.value === g.get('rePassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.msgError = ''; // Clear any previous error messages
      this._AuthService.setloginForm(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.msgSuccess = true;
            localStorage.setItem('userToken', res.token);
            this._AuthService.saveUserData();
            this._Router.navigate(['/home']);
          }
          this.isLoading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.msgError = err.error.message || 'An error occurred during login';
          this.isLoading = false;
          // Mark form as touched to trigger validation messages
          Object.keys(this.loginForm.controls).forEach(key => {
            const control = this.loginForm.get(key);
            control?.markAsTouched();
          });
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
