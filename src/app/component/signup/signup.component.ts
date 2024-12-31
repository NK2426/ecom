import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignupService } from '../../services/signup.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { interval, Subscription } from 'rxjs';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  profileForm!: FormGroup;
  // signupForm!: FormGroup;
  otpform!: FormGroup;
  isSubmit: boolean = false;
  message: any;
  otp: any;
  isError: boolean = true;
  isSignup: boolean = false;
  showOtpComponent = true;
  selectedDialingCode: any = '+91';
  token: any;
  userID: string = '';
  name: string = '';
  mobile: string = '';
  email: string = '';
  region: string = '';
  selectedInput: string = 'mobile';
  country: any
  countdown: number = 120;
  maxCountdown: number = 120;
  isResendDisabled: boolean = true;
  private timerSubscription!: Subscription;
  @ViewChild('ngOtpInput') ngOtpInput: any;

  constructor(private fb: FormBuilder, private googleservice: AuthGoogleService, private signup: SignupService, private router: Router, private loginService: LoginService, private apiservice: ApiserviceService) { }

  ngOnInit(): void {
    // this.signupForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.email]],
    //   mobile: ['', [Validators.required, this.mobileNumberValidator()]],
    //   name: ['', [Validators.required]],
    //   password: ['', [Validators.required]]
    // })
    this.getCountry();

    this.profileForm = this.fb.group({
      region: ['1', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile: ['', [Validators.required, this.mobileNumberValidator()]],
      email: ['', [Validators.required, Validators.email]],
      authkey: ['X9U2', [Validators.required, Validators.minLength(1)]],
    })
    this.otpform = this.fb.group({
      mobile: [''],
      email: [''],
      authkey: ['', [Validators.required, Validators.minLength(1)]],
    })
  }

  get formControls() {
    return this.profileForm.controls;
  }
  get otpformControls() {
    return this.otpform.controls;
  }

  device: any
  userresponse: any
  formSubmit() {
    this.signup.signup(this.profileForm.value).subscribe({
      next: (data) => {
        this.userresponse = data.data.user == '1' ? data.data.mobile : data.data.email
        this.device = data.data.user == '1' ? ("Mobile ") : ("Email")
        // console.log(this.device);
        if (data.status === 'error') {
          this.profileForm.get('name')?.setValue('')
          this.profileForm.get('mobile')?.setValue('')
          this.profileForm.get('email')?.setValue('')
          this.profileForm.get('region')?.setValue('')
          // this.message = data.message
          // setTimeout(() => {
          //   this.isError = true;
          //   this.message = ""
          // }, 2000);

          Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: data.message,
            showConfirmButton: false,
            width: '300px',
            timer: 2000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });

          this.clearErrors()
        } else if (data.status === 'success') {
          this.isSignup = true;
          this.startTimer()
          // this.router.navigate(['/login']);
        }
      }, error: (err) => {
        // console.log(err.message);
        this.profileForm.get('name')?.setValue('')
        this.profileForm.get('mobile')?.setValue('')
        this.profileForm.get('email')?.setValue('')
        this.profileForm.get('region')?.setValue('')

      }
    })
  }
  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false;
        this.timerSubscription.unsubscribe();
      }
    });
  }
  signInWithGoogle() {
    this.googleservice.login();
  }
  resendOtp() {
    this.otp = ''; // Clear the OTP input field
    this.countdown = this.maxCountdown;
    this.isResendDisabled = true;
    this.startTimer();
    // console.log('OTP resent');
    this.signup.login(this.profileForm.value).subscribe({
      next: (data) => {
        this.userresponse = data.data.user == '1' ? data.data.mobile : data.data.email
        this.device = data.data.user == '1' ? ("Mobile ") : ("Email")
        // console.log(this.device);
        if (data.status === 'success') {
          this.isSignup = true;
        }
      }, error: (err) => {
        // console.log(err.message);
        this.profileForm.get('name')?.setValue('')
        this.profileForm.get('mobile')?.setValue('')
        this.profileForm.get('email')?.setValue('')
        this.profileForm.get('region')?.setValue('')

      }
    })
  }
  clearErrors() {
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
    this.profileForm.setErrors(null);
  }

  onOtpChange(otp: Event) {
    // console.log(otp, otp)
    this.otp = otp;
  }

  onCodeCompleted(otp: string) {
    // console.log(otp)
    this.otp = otp;

    this.otpform.get('authkey')?.setValue(this.otp)


  }

  setVal(val: any) {
    this.ngOtpInput.setValue(val);
  }

  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  submitOtp() {
    // console.log(this.otpform.value, this.profileForm.value);
    this.otpform.setValue({
      mobile: this.profileForm.get('mobile')?.value,
      email: this.profileForm.get('email')?.value,
      authkey: this.otp
    })

    // console.log(this.otpform.value);
    this.loginService.otpVerify(this.otpform.value).subscribe({
      next: (data) => {
        // console.log(data)
        if (data.status === 'error') {

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Please give correct OTP',
            showConfirmButton: false,
            width: '300px',
            timer: 3000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });

        } else if (data.status === 'success') {
          this.isSignup = true;
          this.token = data.data.accessToken;
          this.userID = data.data.userID;
          this.name = data.data.name;
          this.mobile = data.data.mobile
          this.email = data.data.email
          this.region = data.data.region
          localStorage.setItem('token', this.token);   // after verify store token in localStorage
          localStorage.setItem('userId', this.userID);
          localStorage.setItem('name', this.name);
          localStorage.setItem('mobile', this.mobile);
          localStorage.setItem('email', this.email);
          localStorage.setItem('email', this.region);

          let currentroute = localStorage.getItem('currentroute');
          this.router.navigate([currentroute]);
        }
      }, error: (err) => {
        // console.log(err)
      }
    })
  }

  onInputChange(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 15) {
      event.target.value = inputValue.slice(0, 15);
    }
  }


  mobileNumberValidator(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      // console.log(this.selectedDialingCode);
      if (this.selectedDialingCode === '+91') {
        if (value && !/^\d{10,10}$/.test(value)) {
          return { 'invalidMobileNumber': true };
        }
      } else {
        if (value && !/^\d{7,15}$/.test(value)) {
          return { 'invalidMobileNumber': true };
        }
      }
      return null;
    };
  }

  onInputSelectionChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const selectedValue = target.value;
    // Handle the selection change
    // console.log('Selected value:', selectedValue);
    // Add your custom logic here
    if (selectedValue === 'india') {
      // Logic for 'Inside India'
    } else if (selectedValue === 'other') {
      // Logic for 'Outside India'
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    // Get the key code of the pressed key
    const keyCode = event.keyCode || event.which;

    // Allow special keys like backspace, delete, arrow keys, etc.
    const specialKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];

    // Allow only numeric keys (0-9)
    if (!(keyCode >= 48 && keyCode <= 57) && // Main keyboard numbers
      !(keyCode >= 96 && keyCode <= 105) && // Numeric keypad numbers
      specialKeys.indexOf(event.key) === -1) {
      event.preventDefault(); // Prevent the default action (typing the character)
    }
  }



  getCountry() {
    this.apiservice.getCountries().subscribe((data: any) => {
      // console.log(data);
      this.country = data;
    })
  }
  selectDialingCode(dialingCode: string) {
    this.selectedDialingCode = dialingCode;
  }

}
