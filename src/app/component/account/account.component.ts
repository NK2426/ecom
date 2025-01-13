import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  NgForm,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderData } from 'src/app/model/orders';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';
import { ConformationdialogComponent } from '../conformationdialog/conformationdialog.component';
import { Address } from 'src/app/model/orderview';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AccountComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  accountForm!: FormGroup;
  wishlistItems: any = [];
  address: Address[] = [];
  isSubmit: boolean = false;
  uuid: any;
  orderItems!: OrderData;
  isNotAvail: boolean = true;
  notavailable: any;
  isShown: boolean = false;
  nameValidator = /^[a-zA-Z\s'-]+$/;
  gmailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  buttonDisabledStates: boolean[] = [];
  @ViewChild('exampleModal4') yourModal!: ElementRef;
  @ViewChild('addressForm', { static: true }) addressForms!: NgForm;
  @ViewChild('modal') modal: any;
  @ViewChild('nameInput') nameInput!: ElementRef;


  constructor(
    private order: CheckoutService,
    private fb: FormBuilder,
    private cartService: CartService,
    private routes: ActivatedRoute,
    private route: Router,
    private wishlist: WishlistService,
    private apiservice: ApiserviceService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initiateAddressForm();
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(this.nameValidator)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.gmailValidator)]],
      mobile: ['', [Validators.required]],
    })
    this.profileForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(15),
          Validators.pattern('[a-zA-Zs]*$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]],
    });

    this.order.allOrders().subscribe(
      (data: any) => {
        // console.log(data);
        this.orderItems = data.data;
        // console.log(this.orderItems.totalItems);
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );

    this.order.fetchAddress().subscribe((data: any) => {
      // console.log(data.data);
      if (data.data.length > 0) {
        this.address = data.data;
      }
    })
    this.getWishlist();
    this.getProfile();
  }

  resetMyForm() {
    this.initiateAddressForm()
  }

  initiateAddressForm() {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(this.nameValidator)]],
      type: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.gmailValidator)]],
      mobile: ['', [
        Validators.required,
        this.mobileNumberValidator()
      ]],
      zipcode: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern(/^[0-9]{6}$/)
      ]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required]
    })
  }
  getWishlist() {
    this.wishlist.getWishlist().subscribe((data: any) => {
      // console.log(data);
      this.wishlistItems = data.data
      // console.log(this.wishlistItems);
      this.wishlist.addToWishlistCount(data.data.length);

    })
  }

  openModal(): void {
    // Reset the form when opening the modal
    this.addressForm.reset();
    // Or clear any form errors
    // this.myForm.setErrors(null);
    // Open the modal
    this.modal.open();
  }


  getProfile() {
    this.apiservice.getProfile().subscribe((data: any) => {
      // console.log(data.data);
      this.accountForm.get('mobile')?.setValue(data.data.mobile)
      this.accountForm.get('name')?.setValue(data.data.name)
      this.accountForm.get('email')?.setValue(data.data.email)

      console.log(data.data.mobile.length);

      if (
        (data.data.mobile.length >= 7 && data.data.mobile.length <= 15))
        this.accountForm.get('mobile')?.disable()
    })
  }

  get formControls() {
    return this.profileForm.controls;
  }

  resetForm() {
    // console.log('Reset Form.....');
    let nameInput = document.getElementById('name') as HTMLInputElement;
    let emailInput = document.getElementById('email') as HTMLInputElement;
    let mobileInput = document.getElementById('mobile') as HTMLInputElement;
    let zipcodeInput = document.getElementById('zipcode') as HTMLInputElement;
    let stateInput = document.getElementById('state') as HTMLInputElement;
    let cityInput = document.getElementById('city') as HTMLInputElement;
    let addressInput = document.getElementById('address') as HTMLInputElement;
    let typeInput = document.getElementById('type') as HTMLInputElement;
    // console.log(nameInput);

    if (nameInput) {
      nameInput.classList.remove('is-invalid');
    }
    if (emailInput) {
      emailInput.classList.remove('is-invalid');
    }
    if (mobileInput) {
      mobileInput.classList.remove('is-invalid');
    }
    if (zipcodeInput) {
      zipcodeInput.classList.remove('is-invalid');
    }
    if (stateInput) {
      stateInput.classList.remove('is-invalid');
    }
    if (cityInput) {
      cityInput.classList.remove('is-invalid');
    }
    if (addressInput) {
      addressInput.classList.remove('is-invalid');
    }
    if (typeInput) {
      typeInput.classList.remove('is-invalid');
    }
    this.addressForm.reset();
  }




  get formControl() {
    return this.addressForm.controls;
  }
  get accountFormControl() {
    return this.accountForm.controls;
  }

  options = [
    { label: 'Work Address', value: 'Work' },
    { label: 'Home Address', value: 'Home' },
  ]

  mobileNumberValidator(): any {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && !/^\d{7,15}$/.test(value)) {
        return { 'invalidMobileNumber': true };
      }
      return null;
    };
  }

  onInputChange(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 15) {
      event.target.value = inputValue.slice(0, 15);
    }
  }

  validateNumber(event: any): void {
    const inputValue = event.target.value;
    if (inputValue.length > 15) {
      event.target.value = inputValue.slice(0, 15);
    }
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

  deleteAddress(uuid: string) {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConformationdialogComponent, {
      width: '500px',
      data: { message: 'Are you sure you want to delete this address?' }
    });
    // Subscribe to the dialog afterClosed event to get the user's response
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // If user clicks Yes, proceed with deletion
        this.order.deleteAddress(uuid).subscribe((data: any) => {
          // console.log(data, "Deleted Successfully");
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Address deleted successfully',
            showConfirmButton: false,
            width: '500px',
            timer: 1000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });
          this.fetchAddress();
        });
      }
    });
  }


  viewProduct(uuid: any) {
    this.route.navigate(['/product/' + uuid])
  }

  removeWishlist(uuid: any) {
    // console.log(uuid);
    this.wishlist.addToWishlist(uuid).subscribe(data => {
      // console.log(data);
      this.getWishlist();
    })
  }

  editAddress(uuid: any) {
    this.order.fetchParticularAddress(uuid).subscribe((data: any) => {
      // console.log(data.data);
      this.uuid = data.data.uuid;
      this.addressForm.get('name')?.setValue(data.data.name)
      this.addressForm.get('email')?.setValue(data.data.email)
      this.addressForm.get('mobile')?.setValue(data.data.mobile)
      this.addressForm.get('zipcode')?.setValue(data.data.zipcode)
      this.addressForm.get('city')?.setValue(data.data.city)
      this.addressForm.get('state')?.setValue(data.data.state)
      this.addressForm.get('address')?.setValue(data.data.address)
      this.addressForm.get('type')?.setValue(data.data.type)
    })
  }

  limitInputLength(event: any, maxLength: number) {
    const input = event.target.value;
    if (input.length > maxLength) {
      event.target.value = input.slice(0, maxLength);
    }
  }


  postelcode(event: any) {
    const postalCode = event.target.value;

    // Check if the postal code length is 6
    if (postalCode.length === 6) {
      // Call the API to get data based on the postal code
      this.order.postelcode(postalCode).subscribe(data => {
        if (data.status === 'success') {
          this.isNotAvail = true;
          this.addressForm.get('city')?.setValue(data.data.cityname);

          // Get the state data
          this.order.state().subscribe((state: any) => {
            const stateData = state.data;
            const stateMatch = stateData.find((el: any) => el.id === data.data.state_id);

            if (stateMatch) {
              this.addressForm.get('state')?.setValue(stateMatch.name);
            }
          });

        } else if (data.status === 'error') {
          this.isNotAvail = false;
          // console.log('Currently we are not delivering to this pincode');

          // Clear the city and state fields if not available
          this.addressForm.get('city')?.setValue('');
          this.addressForm.get('state')?.setValue('');
        }
      });
    }
  }

  accountFormSubmit() {
    this.isSubmit = true;
    if (this.accountForm.invalid) {
      return;
    }
    this.apiservice.updateProfile(this.accountForm.value).subscribe((data: any) => {
      // console.log(data);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Profile Updated SuccessFully',
        showConfirmButton: false,
        width: '500px',
        timer: 1000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
    })
  }

  formSubmit() {

    console.log(this.addressForm);

    this.isSubmit = true; // Set isSubmit flag to true when form is submitted
    if (this.addressForm.valid) { // Check if the form is valid
      if (this.uuid) {
        // console.log("update data")
        // console.log(this.addressForm);
        this.order.editedAddress(this.addressForm.value, this.uuid).subscribe(
          (data) => {
            // console.log("saved successfully")
            this.addressForm.reset();
            this.closeModal();
            this.fetchAddress();
            this.isSubmit = false; // Reset isSubmit flag when form is successfully submitted
          },
          (error) => {
            // console.error("Error updating address:", error);
            // Handle error here, e.g., display error message to the user
          }
        );
      } else {
        // console.log(this.addressForm);
        this.order.saveAddress(this.addressForm.value).subscribe(
          (data) => {
            // console.log("saved successfully")
            this.addressForm.reset();
            this.closeModal();
            this.fetchAddress();
            this.isSubmit = false; // Reset isSubmit flag when form is successfully submitted
          },
          (error) => {
            // console.error("Error saving address:", error);
            // Handle error here, e.g., display error message to the user
          }
        );
      }
    } else {
      let nameInput = document.getElementById('name') as HTMLInputElement;
      let emailInput = document.getElementById('email') as HTMLInputElement;
      let mobileInput = document.getElementById('mobile') as HTMLInputElement;
      let zipcodeInput = document.getElementById('zipcode') as HTMLInputElement;
      let stateInput = document.getElementById('state') as HTMLInputElement;
      let cityInput = document.getElementById('city') as HTMLInputElement;
      let addressInput = document.getElementById('address') as HTMLInputElement;
      let typeInput = document.getElementById('type') as HTMLInputElement;
      // console.log(nameInput);

      if (!nameInput.value && (this.isSubmit && this.formControl['name'].errors)) {
        nameInput.classList.add('is-invalid');
      }
      if (!emailInput.value && (this.isSubmit && this.formControl['email'].errors)) {
        emailInput.classList.add('is-invalid');
      }
      if (!mobileInput.value && (this.isSubmit && this.formControl['mobile'].errors)) {
        mobileInput.classList.add('is-invalid');
      }
      if (!zipcodeInput.value && (this.isSubmit && this.formControl['zipcode'].errors)) {
        zipcodeInput.classList.add('is-invalid');
      }
      if (!stateInput.value && (this.isSubmit && this.formControl['state'].errors)) {
        stateInput.classList.add('is-invalid');
      }
      if (!cityInput.value && (this.isSubmit && this.formControl['city'].errors)) {
        cityInput.classList.add('is-invalid');
      }
      if (!addressInput.value && (this.isSubmit && this.formControl['address'].errors)) {
        addressInput.classList.add('is-invalid');
      }
      if (!typeInput.value && (this.isSubmit && this.formControl['type'].errors)) {
        typeInput.classList.add('is-invalid');
      }
      // console.log("Form is invalid!!!");
    }
  }




  onKeyPress(event: KeyboardEvent) {
    // Get the input value and check if it's a number or a special character
    const inputChar = event.key;
    if (!isNaN(Number(inputChar)) || /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(inputChar)) {
      // Prevent default behavior if the input is a number or a special character
      event.preventDefault();
    }
  }

  closeModal() {
    var model = document.getElementById('exampleModal4');
    // console.log(model)
    if (model) {
      model.style.display = 'none';
    }
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    this.resetForm()
  }

  fetchAddress() {
    this.order.fetchAddress().subscribe((data: any) => {
      // console.log(data.data);
      if (data.data.length > 0) {
        this.address = data.data;
        this.isShown = true;
        this.buttonDisabledStates = new Array(this.address.length).fill(false);
        // if (data.data.length == 2) {
        //   this.isAdd = false;
        // }
      } else {
        this.isShown = false;
      }
    })
  }
}
