import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { getData, getCode } from 'country-list';
import { Login } from 'src/app/model/login';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { interval, Subscription } from 'rxjs';
import { AuthGoogleService } from 'src/app/services/auth-google.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  countries: { name: string, code: string, flagUrl: string }[] = [];
  loginForm!: FormGroup;
  otpform!: FormGroup;
  otpForm1!: FormGroup;
  isSubmit: boolean = false;
  isError: boolean = true;
  isLogin: boolean = false;

  message: string = '';
  otp: any;
  token: any;
  userID: string = '';
  name: string = '';
  mobile: string = '';
  email: string = '';
  showOtpComponent = true;
  selectedInput: string = 'mobile';
  country: any
  selectedDialingCode: any = '+91';
  // Venkat New code

  countdown: number = 120;
  maxCountdown: number = 120;
  isResendDisabled: boolean = true;
  private timerSubscription!: Subscription;
  submitBtn: boolean = false;
  constructor(private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private apiservice: ApiserviceService,
    private googleservice: AuthGoogleService,
  ) {
  }

  ngOnInit(): void {
    this.getCountry()
    this.selectedInput = 'mobile';  // Default selection  
    this.loginForm = this.fb.group({
      inputType: [this.selectedInput, Validators.required],
      mobile: ['', this.selectedInput === 'mobile' ? [Validators.required, this.mobileNumberValidator()] : []],
      email: ['', this.selectedInput === 'email' ? [Validators.required, Validators.email] : []],
      authkey: ['Cpki', Validators.required],
    });

    this.loginForm.get('inputType')!.valueChanges.subscribe(value => {
      if (value === 'mobile') {
        this.loginForm.get('mobile')!.setValidators([Validators.required, this.mobileNumberValidator()]);
        this.loginForm.get('email')!.clearValidators();
      } else if (value === 'email') {
        this.loginForm.get('email')!.setValidators([Validators.required, Validators.email]);
        this.loginForm.get('mobile')!.clearValidators();
      }
      this.loginForm.get('mobile')!.updateValueAndValidity();
      this.loginForm.get('email')!.updateValueAndValidity();
    });


    this.otpform = this.fb.group({
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      authkey: ['', [Validators.required, Validators.minLength(1)]],
    })

    this.otpForm1 = this.fb.group({
      otp: this.fb.array(
        new Array(6).fill('').map(() => this.fb.control('', [Validators.required, Validators.pattern('^[0-9]$')]))
      )
    });
    this.countries = this.getCountryListWithFlags();
    // console.log("hihihihi", this.countries);
  }
  signInWithGoogle() {
    this.googleservice.login();
  }
  showData() {
    let profile = this.googleservice.getProfile();
    // console.log(profile);
  }
  getCountryListWithFlags(): { name: string, code: string, flagUrl: string }[] {
    const countryData = getData();
    return countryData.map((country: { name: string; code: string }) => ({
      name: country.name,
      code: country.code,
      flagUrl: `https://www.countryflags.io/${country.code}/flat/64.png` // or use a different flag service
    }));
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

  resendOtp() {
    this.otp = ''; // Clear the OTP input field
    this.countdown = this.maxCountdown;
    this.isResendDisabled = true;
    this.startTimer();
    // console.log('OTP resent');
    this.loginService.login(this.loginForm.value).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.isLogin = true;
          this.startTimer()
        }
      }, error: (err) => {
        // console.log(err.message);
        this.loginForm.get('mobile')?.setValue('')
        this.loginForm.get('email')?.setValue('')
      }
    })
  }

  formSubmit() {
    this.loginService.login(this.loginForm.value).subscribe({
      next: (data) => {
        // console.log(data.message);
        if (data.status === 'error') {
          this.loginForm.get('mobile')?.setValue('')
          this.loginForm.get('email')?.setValue('')
          // this.message = data.message
          // setTimeout(() => {
          //   this.isError = false
          //   this.message = ""
          // }, 2000);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Please Create Your Account',
            showConfirmButton: false,
            width: '300px',
            timer: 3000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });
          this.clearErrors();
        } else if (data.status === 'success') {
          this.isLogin = true;
          this.startTimer()
        }
      }, error: (err) => {
        // console.log(err.message);
        this.loginForm.get('mobile')?.setValue('')
        this.loginForm.get('email')?.setValue('')
      }
    })
  }

  get formControls() {
    return this.loginForm.controls;
  }

  get otpformControls() {
    return this.otpform.controls;
  }

  get otpControls() {
    return (this.otpForm1.get('otp') as FormArray).controls;
  }

  clearErrors() {
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
    this.loginForm.setErrors(null);
  }


  onConfigChange() {
    this.showOtpComponent = false;
    this.otp = null;
    setTimeout(() => {
      this.showOtpComponent = true;
    }, 0);
  }

  submitOtp() {
    // console.log("inside ");
    let otpValue
    if (this.otpForm1.valid) {
      otpValue = this.otpForm1.value.otp.join('');
      // console.log('OTP Submitted:', otpValue);
      // Handle OTP submission logic here
    } else {
      // console.log('OTP Form is invalid');
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please enter OTP',
        showConfirmButton: false,
        width: '500px',
        timer: 1000,
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
    }


    this.otpform.setValue({
      mobile: this.loginForm.get('mobile')?.value,
      email: this.loginForm.get('email')?.value,
      authkey: otpValue
    })
    // console.log(this.otpform.value);
    this.loginService.otpVerify(this.otpform.value).subscribe({
      next: (data) => {
        // console.log(data)
        if (data.status === 'error') {
          // this.profileForm.get('mobile')?.setValue('')
          // this.message = data.message
          // setTimeout(() => {
          //   this.isError = true;
          //   this.message = ""
          // }, 2000);

          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Please Enter The Correct Otp',
            showConfirmButton: false,
            width: '300px',
            timer: 2000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });

        } else if (data.status === 'success') {
          this.isLogin = true;
          this.token = data.data.accessToken;
          this.userID = data.data.userID;
          this.name = data.data.name;
          this.mobile = data.data.mobile
          this.email = data.data.email
          localStorage.setItem('token', this.token);   // after verify store token in localStorage
          localStorage.setItem('userId', this.userID);
          localStorage.setItem('name', this.name);
          localStorage.setItem('mobile', this.mobile);
          localStorage.setItem('email', this.email);
          localStorage.setItem('coupon', data.data.coupon);
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

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && input.nextElementSibling) {
      (input.nextElementSibling as HTMLInputElement).focus();
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


  onInputSelectionChange(inputType: string) {
    // Handle input selection change if needed
    this.selectedInput = inputType;
    // console.log(inputType);
  }

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumberKey = event.key >= '0' && event.key <= '9';

    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
      this.formSubmit(); // Call the form submission method
    }

    if (!isNumberKey && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onKeyDown1(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && input.previousElementSibling) {
      (input.previousElementSibling as HTMLInputElement).focus();
    }
  }

  allowOnlyNumbersAndEnter(event: KeyboardEvent): void {
    const charCode = event.charCode;
    if ((charCode >= 48 && charCode <= 57) || charCode === 13) {
      return; // Allow number keys and Enter key
    } else {
      event.preventDefault(); // Prevent all other keys
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
