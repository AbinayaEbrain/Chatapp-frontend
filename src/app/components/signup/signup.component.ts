import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errorMessage: String;
  showSpinner = false;
  socket: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  signupUser() {
    this.showSpinner = true;
    this.authService.registerUser(this.signupForm.value).subscribe(
      data => {
        this.tokenService.setToken(data.token);
        this.signupForm.reset();
        this.errorMessage = '';
        this.socket.emit('refresh', {});
        setTimeout(() => {
          this.router.navigate(['streams']);
        }, 2000);
      },
      err => {
        this.showSpinner = false;
        console.log(err);
        if (err.error.msg) {
          this.errorMessage = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMessage = err.error.message;
        }
      }
    );
  }
}
