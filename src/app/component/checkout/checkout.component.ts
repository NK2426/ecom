import { Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { data, event } from 'jquery';
import { Subscription } from 'rxjs';
import { CartData, CartProductData, CartProducts } from 'src/app/model/cart-items';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ExternalLibraryService } from 'src/app/services/utils.service';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';


declare var Razorpay: any

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmit: boolean = false;
  cartItems: any[] = [];
  razorpay: any;
  isAddressSelected: boolean = false;
  isOptionSelected: boolean = false;

  // @ViewChild('exampleModal', {static:false}) exampleModal!: ElementRef;
  // @ViewChild('exampleModal') exampleModal!: ElementRef;


  isShown: boolean = false;
  isAdd: boolean = true;
  isNotAvail: boolean = true;
  address: any;
  uuid: any;
  notavailable: any;
  orderID: any
  optionspay: any
  selectedAddressIndex: number | null = null;
  // buttonDisabledState: boolean[] = [];
  buttonDisabledStates: boolean[] = [];
  selectedPaymentMethod: string = '';
  deliverycharges = 50;
  checkoutdetails: any
  checkout: any

  response: any
  razorpayResponse: any;
  RAZORPAY_OPTIONS: any
  delivernote: boolean = false;


  couponCode: string = '';
  couponMessage: string = '';

  couponApllied: boolean = false
  coupons: any = [];


  constructor(private order: CheckoutService, private fb: FormBuilder, private cartService: CartService,
    private routes: ActivatedRoute, private route: Router, private razorpayService: ExternalLibraryService,
    private cd: ChangeDetectorRef,private location: Location) {
    this.RAZORPAY_OPTIONS = {};
  }

  private isReloadConfirmed: boolean = false;

  convertToUpper() {
    this.couponCode = this.couponCode.toUpperCase();
  }

  @HostListener('window:keydown', ['$event'])
  disableF5(event: KeyboardEvent) {
    if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
      event.preventDefault();
      alert('Page reload is disabled!');
    }
  }

  @HostListener('window:beforeunload', ['$event'])
unloadNotification($event: any): void {
  $event.preventDefault();
  $event.returnValue = '';  // Shows the confirmation dialog
  sessionStorage.setItem('reloadFlag', 'true'); // Store a flag to detect page reload
}

  ngOnInit(): void {
    this.orderID = this.routes.snapshot.params['orderID']
    this.getAll();
    this.fetchAddress();
    this.CheckoutDetails(false);
    const reloadFlag = sessionStorage.getItem('reloadFlag');
    if (reloadFlag === 'true') {
      sessionStorage.removeItem('reloadFlag');  
      this.route.navigate(['/']);  
    }

    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['Work', [Validators.required, Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(15)
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

    // this.order.createsession(this.orderID).subscribe((data: any) => {
    //   // console.log(data.data);
    //   this.optionspay = data.data;
    //   this.cd.detectChanges();
    // })

    // this.cd.detectChanges();
  }

  options = [
    { label: 'Work Address', value: 'Work' },
    { label: 'Home Address', value: 'Home' },
  ]

  pay = [
    { label: 'Cash On Delivery', value: 'cahondelivery' },
    { label: 'Pay Online', value: 'payonline' },
  ]

  get formControl() {
    return this.profileForm.controls;
  }


  mobileNumberValidator(event: any) {
    const input = event.target.value;
    if (input.length > 15) {
      event.target.value = input.slice(0, 15);
    }
  }

  validateNumber(event: KeyboardEvent) {
    if (event.charCode >= 48 && event.charCode <= 57) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  limitInputLength(event: any, maxLength: number) {
    const input = event.target.value;
    if (input.length > maxLength) {
      event.target.value = input.slice(0, maxLength);
    }
  }

  resetMyForm() {
    this.profileForm.reset();
  }

  postelcode(event: any) {
    const postalCode = event.target.value;

    // Check if the postal code length is 6
    if (postalCode.length === 6) {
      // Call the API to get data based on the postal code
      this.order.postelcode(postalCode).subscribe(data => {
        if (data.status === 'success') {
          this.isNotAvail = true;
          this.profileForm.get('city')?.setValue(data.data.cityname);

          // Get the state data
          this.order.state().subscribe((state: any) => {
            const stateData = state.data;
            const stateMatch = stateData.find((el: any) => el.id === data.data.state_id);

            if (stateMatch) {
              this.profileForm.get('state')?.setValue(stateMatch.name);
            }
          });

        } else if (data.status === 'error') {
          this.isNotAvail = false;
          // console.log('Currently we are not delivering to this pincode');

          // Clear the city and state fields if not available
          this.profileForm.get('city')?.setValue('');
          this.profileForm.get('state')?.setValue('');
        }
      });
    }
  }


  getCoupon() {
    return this.checkout.coupon_value
  }
  totalPriceOnly: any
  getTotalPrice(): any {
    let totalPrice = 0;
    for (const item of this.orderItems) {
      totalPrice += item.qty * item.price;
      this.totalPriceOnly = totalPrice;
      // productTotalAmount
    }
    // console.log(totalPrice)

    if (totalPrice < 500) {
      totalPrice = totalPrice + this.deliverycharges;
    }

    if (this.selectedPaymentMethod === 'cahondelivery') {
      totalPrice += 50; // Add delivery charge
    }

    if (this.couponApllied) {
      // console.log(totalPrice)
      let discountPrice = this.totalPriceOnly * (this.coupons.discount / 100);
      // console.log(discountPrice);
      totalPrice = totalPrice - discountPrice
      // console.log(discountPrice);
    }
    // console.log(totalPrice)

    return this.checkout.totalamount
  }


  getAll() {
    this.cartService.getAll().subscribe((data) => {
      this.cartItems = data;
      // console.log('Product fetched', data);
      this.cd.detectChanges();
    });
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
    this.profileForm.reset();
  }


  formSubmit() {
    this.isSubmit = true; // Set isSubmit flag to true when form is submitted
    if (this.profileForm.valid) { // Check if the form is valid
      if (this.uuid) {
        // console.log("update data")
        // console.log(this.profileForm);
        this.order.editedAddress(this.profileForm.value, this.uuid).subscribe(
          (data) => {
            // console.log("saved successfully")
            this.profileForm.reset();
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
        // console.log(this.profileForm);
        this.order.saveAddress(this.profileForm.value).subscribe(
          (data) => {
            // console.log("saved successfully")
            this.profileForm.reset();
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


  closeModal() {
    var model = document.getElementById('exampleModal2');
    // console.log(model)
    if (model) {
      model.style.display = 'none';
    }
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }

  fetchAddress() {
    this.order.fetchAddress().subscribe((data: any) => {
      // console.log(data);
      if (data.data.length > 0) {
        this.address = data.data;
        this.isShown = true;
        this.buttonDisabledStates = new Array(this.address.length).fill(false);
        this.cd.detectChanges();
        // if (data.data.length == 2) {
        //   this.isAdd = false;
        // }
      } else {
        this.isShown = false;
      }
    })
  }


  editAddress(uuid: any) {
    this.order.fetchParticularAddress(uuid).subscribe((data: any) => {
      // console.log(data.data);
      this.uuid = data.data.uuid;
      this.profileForm.get('name')?.setValue(data.data.name)
      this.profileForm.get('email')?.setValue(data.data.email)
      this.profileForm.get('mobile')?.setValue(data.data.mobile)
      this.profileForm.get('zipcode')?.setValue(data.data.zipcode)
      this.profileForm.get('city')?.setValue(data.data.city)
      this.profileForm.get('state')?.setValue(data.data.state)
      this.profileForm.get('address')?.setValue(data.data.address)
      this.profileForm.get('type')?.setValue(data.data.type)
    })
  }

  deleteAddress(uuid: string) {
    this.order.deleteAddress(uuid).subscribe((data: any) => {
      // console.log(data, "Deleted Successfully");
      this.fetchAddress();
    })
  }

  placeOrder() {
    if (this.address) {
      // console.log("order placed");
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your order placed',
        showConfirmButton: false,
        width: '300px',
        timer: 3000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
    }
    else {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'please give your delivery address first',
        showConfirmButton: false,
        width: '300px',
        timer: 3000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
      // console.log("please fill address first");
    }
  }


  //shipping charges and Order Items

  orderItems: any;
  productTotalAmount: any;
  CheckoutDetails(coupon: any) {
    this.order.orderCheckout(this.orderID, coupon).subscribe((data: any) => {
      // console.log(data);
      // console.log(data.amount);
      this.checkout = data
      this.productTotalAmount = data.amount;
      // console.log(data.shipcharge);
      this.checkoutdetails = data.shipcharge
      // console.log(this.checkoutdetails);
      this.orderItems = data.orderitems
      this.cd.detectChanges()
    })
  }


  onKeyPress(event: KeyboardEvent) {
    // Get the input value and check if it's a number or a special character
    const inputChar = event.key;
    if (!isNaN(Number(inputChar)) || /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(inputChar)) {
      // Prevent default behavior if the input is a number or a special character
      event.preventDefault();
    }
  }

  selectDeliveryAddress(uuid: any, index: number) {
    // console.log(uuid);
    let data = { "uuid": uuid, "order_uuid": this.orderID }
    this.delivernote = true
    this.order.selectDeliveryAddress(data).subscribe(data => {
      // console.log(data);
      this.isAddressSelected = true;
      this.selectedAddressIndex = index;
      this.fetchAddress()
    })
  }

  disableAddress(index: number) {
    this.buttonDisabledStates.fill(true);
    this.buttonDisabledStates[index] = false;
  }

  setAt(i: number) {
    // console.log(i);
  }

  paymentCallback(response: any): void {
    // console.log('Payment successful:', response.razorpay_payment_id);
    let datas = {
      orderID: this.orderID,
      razorpay: response.razorpay_payment_id
    }
    this.order.orderStatusOnline(response.razorpay_payment_id).subscribe((data: any) => {
      // console.log(data);
      if (data.message == 'Confirmed') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your Order Placed Successfully',
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.route.navigate(['/orderstatus'])
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Your Order Not Placed',
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
      }
    })
    // Handle successful payment response here
  }
  payOnline() {
    // console.log("Pay Online");
    this.order.createsession(this.orderID).subscribe((data: any) => {
      // console.log(data.data);
      if (data.status == 'success') {
        this.optionspay = data.data;
        this.razorpayService
          .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
          .subscribe();
        // console.log(this.optionspay)

        this.RAZORPAY_OPTIONS = this.optionspay
        // console.log(this.RAZORPAY_OPTIONS);
        this.RAZORPAY_OPTIONS['modal'] = {
          ondismiss: this.razorPayFailureHandler.bind(this)
        };
        this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
        let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
        razorpay.open()
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Order not placed',
          showConfirmButton: false,
          width: '300px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
      }
    })

  }


  razorPayFailureHandler(response: any) {
    // console.log("Payment failed:", response);
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Your Order Not Placed',
      showConfirmButton: false,
      width: '300px',
      timer: 1500,
      customClass: {
        popup: 'large-sa-popup',
      },
    });
    this.route.navigate(['/cart'])

    // Perform any actions you want to take on payment failure
  }
  razorPaySuccessHandler(response: any) {
    this.order.orderStatusOnline(response.razorpay_payment_id).subscribe((data: any) => {
      // console.log(data);
      if (data.message == 'Confirmed') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your Order Placed Successfully',
          showConfirmButton: false,
          width: '500px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.route.navigate(['/orderstatus'])
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Your Order Not Placed',
          showConfirmButton: false,
          width: '500px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.route.navigate(['/cart'])
      }
    })
    // console.log(response);
    this.razorpayResponse = `Razorpay Response`;
  }

  applyCoupon() {
    if (this.couponCode) {
      // Simulate a coupon validation call
      this.validateCoupon(this.couponCode);
    }
  }

  validateCoupon(code: string) {

    let order = {
      orderID: this.orderID
    }
    this.order.getcoupons(order, code).subscribe((data: any) => {
      // console.log(data);
      this.coupons = data.data
      if (data.status == 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Coupon is applied',
          showConfirmButton: false,
          width: '500px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.couponApllied = true
        this.couponCode = code

        this.CheckoutDetails(true)
        // this.order.createsession(this.orderID).subscribe((data: any) => {
        //   // console.log(data.data);
        //   this.optionspay = data.data;
        // })


        this.checkout.couponAvailable = 0
        localStorage.setItem('coupon', '');

      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data.message,
          showConfirmButton: false,
          width: '500px',
          timer: 1500,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
        this.couponApllied = false
      }
    })
  }
}
