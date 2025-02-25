import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { AuthService } from './../../services/auth.service';
import { CommonService } from './../../services/common.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    userLoginForm: FormGroup;
    emailControl;
    passwordControl;
    submit = 'Log in';
    loginError = false;
    loginFieldError = false;
    errorEmail = '';
    errorPass = '';
    failedMessage = '';
    constructor (
        private fb: FormBuilder,
        private router: Router,
        private auth: AuthService,
        private meta: Meta,
        private common: CommonService
    ) {
        this.buildLoginForm();
    }

    ngOnInit() {
    }

    buildLoginForm() {
        this.userLoginForm = this.fb.group({
            email: this.fb.control('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            password: this.fb.control('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
        });
        this.emailControl = this.userLoginForm.get('email') as FormControl;
        this.passwordControl = this.userLoginForm.get('password') as FormControl;
    }

    submitLoginForm() {
        this.loginError = false;
        this.loginFieldError = false;
        this.errorEmail = '';
        this.errorPass = '';
        const data = this.userLoginForm.value;
        this.submit = 'Submitting....';
        this.auth.login(data).subscribe(
            res => {
                this.submit = 'Login';
                const response = res['response'];
                const result = res['result'];
                if (response === 200) {
                    const token = res.user_info['api_token'];
                    const cvalue = { 'name': res.user_info['name'], 'username': data.email, 'bearertoken': token, 'status': 'true' }
                    sessionStorage.removeItem('pageurl')
                    this.auth.setCookie('Xm0oZsKtAaCfViSz', JSON.stringify(cvalue), 1);
                    this.router.navigate(['dashboard']);
                    this.common.mycookie = cvalue;
                    this.common.rolelist = res.role_list;
                } else if (response === 400) {
                    this.loginError = true;
                    this.failedMessage = res.message;
                } else if (response === 401) {
                    this.loginFieldError = true;
                    if (res.email.length > 0) {
                        this.errorEmail = res.email;
                    }
                    if (res.password.length > 0) {
                        this.errorPass = res.password;
                    }
                }
                if (!res) {
                    this.loginError = true;
                } else {
                    console.log('no');
                }
            },

            error => {
                this.submit = 'Login';
                this.loginError = true;
                console.log(error);
            }
        );

    }

    login_Error() {
        this.loginError = false;
        this.loginFieldError = false;
    }

}
