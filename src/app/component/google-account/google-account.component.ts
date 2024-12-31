import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-google-account',
  template: ``
})
export class GoogleAccountComponent implements OnInit,AfterViewInit {

  loginForm!: FormGroup;
  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private apiservice: ApiserviceService,
    private googleservice: AuthGoogleService,
  ) {
  }
  ngAfterViewInit(): void {
    const token = this.googleservice.getToken();
    if (token) {
      console.log('Token:', token);
  
      this.profile = this.googleservice.getProfile();
      this.loginForm = this.fb.group({
        email: [''],
        name: [''],
      });
  
      console.log(this.profile);
      this.loginForm.setValue({
        email: this.profile.email,
        name: this.profile.name
      });
  
    
      this.loginService.loginwithGoogle(this.loginForm.value).subscribe({
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
        }
      });
    } else {
      console.error('Token is null or undefined');
      window.location.reload()
      this.googleservice.logout()
      
    }
  }
  profile: any

  ngOnInit(): void {
   
  }
  
  // Handle login error and reset form
  resetForm() {
    this.loginForm.get('mobile')?.setValue('');
    this.loginForm.get('email')?.setValue('');
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
      },
    });
    this.router.navigate(['/login']);
  }
  
  

}
