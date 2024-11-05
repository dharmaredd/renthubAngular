import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registorForm!: FormGroup;
  isLogIn: boolean = true;
  isExistuser: boolean = true;
  loginData: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appService: AppService,
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegistorForm();
    this.appService.getLoginData().subscribe((res) => {
      localStorage.setItem('loginData', JSON.stringify(res));
      this.loginData = localStorage.getItem('loginData');
      this.loginData = JSON.parse(this.loginData);
    });
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  createRegistorForm(): void {
    this.registorForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void {
    this.isExistuser = this.loginData
      ? this.loginData.find(
          (ele: { email: any; password: any }) =>
            ele.email === this.loginForm.getRawValue().email &&
            ele.password === this.loginForm.getRawValue().password,
        )
      : false;
    if (this.isExistuser) {
      localStorage.setItem('isLogin', 'true');
      this.router.navigate(['/']);
    } else {
      setTimeout(() => {
        this.isExistuser = !this.isExistuser;
      }, 4000);
    }
  }

  onRegistor(): void {
    this.isLogIn = !this.isLogIn;
  }

  onSubmitReg(): void {
    this.isLogIn = !this.isLogIn;
    this.loginData.push(this.registorForm.value);
    localStorage.removeItem('loginData');
    localStorage.setItem('loginData', JSON.stringify(this.loginData));
  }

  registorCancelClick(): void {
    this.isLogIn = !this.isLogIn;
    this.loginForm.reset();
    this.registorForm.reset();
    this.registorForm.updateValueAndValidity();
  }
}
