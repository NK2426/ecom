import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-google-account',
  template: `<!-- Provide your HTML template here -->`
})
export class GoogleAccountComponent implements OnInit {

  loginForm!: FormGroup;
  profile: any;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private googleservice: AuthGoogleService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      name: ['']
    });
    
    this.fetchProfileAndLogin();
  }

  fetchProfileAndLogin() {
    // Using RxJS `of` to handle synchronous code
    of(this.googleservice.getProfile()).pipe(
      switchMap(profile => {
        this.profile = profile;
        console.log(this.profile);
        
        // Update form values
        this.loginForm.setValue({
          email: this.profile.email || '',
          name: this.profile.name || ''
        });

        // Return Observable from loginService
        return this.loginService.loginwithGoogle(this.loginForm.value);
      })
    ).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          // Store data in localStorage
          localStorage.setItem('token', data.data.accessToken);
          localStorage.setItem('userId', data.data.userID);
          localStorage.setItem('name', data.data.name);
          localStorage.setItem('mobile', data.data.mobile);
          localStorage.setItem('email', data.data.email);

          const currentroute = localStorage.getItem('currentroute');
          this.router.navigate([currentroute ? currentroute : '/']);
        } else {
          this.handleLoginError();
        }
      },
      error: (err) => {
        this.resetForm();
        console.error('Login Error:', err);
      }
    });
  }

  resetForm() {
    this.loginForm.get('email')?.setValue('');
    this.loginForm.get('name')?.setValue('');
  }

  handleLoginError() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Something went wrong. Please log in again.',
      showConfirmButton: false,
      width: '300px',
      timer: 2000,
      customClass: {
        popup: 'large-sa-popup',
      }
    });
    window.location.reload()
    this.router.navigate(['/login']);
  }
}
