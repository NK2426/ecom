import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-care',
  templateUrl: './customer-care.component.html',
  styleUrls: ['./customer-care.component.css']
})
export class CustomerCareComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmit: boolean = false;
  pattern: any = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  email :string = '  info@mugdha.co'
  constructor(private fb: FormBuilder, private router: Router, private contactService: ContactService) { }

  get formControls() {
    return this.contactForm.controls;
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      lastname: ['', [Validators.required, Validators.minLength(1),,Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.pattern)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("[0-9]{1}[0-9]{9}")]],
      comments: ['']
    })
  }

  formSubmit() {
    this.isSubmit = true;
    if (this.contactForm.invalid)
      return
    // console.log(this.contactForm.value);
    this.contactService.sentContactFormData(this.contactForm.value).subscribe({
      next: resp => {
        // console.log(resp);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thanks for your comment',
          showConfirmButton: false,
          width: '500px',
          timer: 1000,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.router.navigate(['']);
      }
    })
  }

}
