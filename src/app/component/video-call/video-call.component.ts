import { ChangeDetectorRef, Component, Inject, Injectable, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class VideoCallComponent implements OnInit {
  constructor(private apiservice: ApiserviceService, private fb: FormBuilder, private cd: ChangeDetectorRef,
    private router: Router, private dialog: MatDialog
  ) { }

  selectedDialingCode: any = '+91';
  country: any;
  videocallForm!: FormGroup;
  isSubmit: boolean = false;
  minDate: any;
  month: any;
  day: any;
  slotTime: any[] = [];
  showPopup: boolean = false;
  date: any

  ngOnInit(): void {
    this.videocallForm = this.fb.group({
      phone: ['', [Validators.required, this.mobileNumberValidator()]],
      date: ['', [Validators.required]],
      slot: ['', Validators.required],
      slot_id: [],
      c_code: []
    });

    const dtToday = new Date();
    this.month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    const year = dtToday.getFullYear();
    if (this.month < 10) {
      this.month = '0' + this.month.toString();
    }
    if (this.day < 10) {
      this.day = '0' + this.day.toString();
    }
    this.minDate = `${year}-${this.month}-${day}`;
    this.getCountry();
  }

  selectedDate(event: any) {
    const inputDate = event.target.value; // Assuming format 'DD-MM-YYYY'
    this.date = event.target.value
    this.getSlot(); // Assuming this should trigger the slot refresh
  }


  getSlot() {
    this.apiservice.getAllSlot().subscribe({
      next: resp => {
        this.slotTime = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  bookedSlot: any;
  slotavailable: any;
  selectSlot(event: any) {

    this.apiservice.slotAvailable(event.target.value, this.date).subscribe({
      next: resp => {
        this.slotavailable = resp.slotavailable;

        this.videocallForm.get('slot_id')?.setValue(event.target.value);


        this.showPopup = true;
        setTimeout(() => {
          this.showPopup = false;
        }, 2000);
        this.cd.detectChanges();
      }
    })
  }

  closePopup(): void {
    this.showPopup = false;
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

  get formControls() {
    return this.videocallForm.controls;
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

  onKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    const isNumberKey = event.key >= '0' && event.key <= '9';

    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default form submission
    }

    if (!isNumberKey && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onInputChange(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 15) {
      event.target.value = inputValue.slice(0, 15);
    }
  }

  isHidden: boolean = false;
  formSubmit() {
    this.isSubmit = true
    // this.videocallForm.value.c_code = this.selectedDialingCode;
    this.videocallForm.get('c_code')?.setValue(this.selectedDialingCode)
    if (this.videocallForm.invalid) {
      return;
    }


    let slot = this.slotTime.filter(e => {
      if (e.id == this.videocallForm.get('slot_id')?.value) {
        return e
      }

    })

    console.log(slot);

    this.videocallForm.get('slot')?.setValue(slot[0].value)

    // console.log(this.videocallForm.value);
    this.apiservice.callSchedule(this.videocallForm.value).subscribe({
      next: resp => {
        // console.log(resp);
        this.videocallForm.reset();
        if (resp.status == 'success') {
          this.dialog.closeAll();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Video call scheduled',
            showConfirmButton: false,
            timer: 1500
          });
        }
        else {

        }
        this.cd.detectChanges();
      }
    })
  }
}
