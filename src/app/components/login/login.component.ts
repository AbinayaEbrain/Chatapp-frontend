import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validator, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: String;
  showSpinner = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router,private tokenService: TokenService) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginUser() {
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.loginForm.reset();
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      err => {
        this.showSpinner = false;
        console.log(err);
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
