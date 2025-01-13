import { Component, EventEmitter, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartProductData, CartProducts } from 'src/app/model/cart-items';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import Swal from 'sweetalert2';
import { ConformationdialogComponent } from '../conformationdialog/conformationdialog.component';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})

export class ViewCartComponent implements OnInit {

  cartBagSubscription!: Subscription;
  addtobagcount: any;
  quantity: number = 1;

  showCheckoutButton: boolean = true;

  token = localStorage.getItem('token')
  cartItems: any = CartProducts;
  count: any;
  constructor(private cartService: CartService, private order: CheckoutService, private route: Router, private dialog: MatDialog) {
    this.cartBagSubscription = this.cartService.cartBagEvent$.subscribe((data: any) => {
      // Handle data received from the event
      // console.log('Cart Event Data:', data);
      this.addtobagcount = data
      this.cartItems = data
      // You can perform any action with the data received from the event here
    });
  }
  ngOnInit(): void {
    if (this.token) {
      this.getAll()
    }
  }
  showCheckout: boolean = true
  public getAll() {
    this.cartService.getAll().subscribe((data) => {
      this.cartItems = data;
      this.showCheckout = this.allValuesSame(this.cartItems, 'qty');
      console.log(this.cartItems);
      
      this.showCheckoutButton = this.cartItems.some((item: any) => item.qty == 0);


      

      console.log(this.showCheckoutButton);
      

      
      // console.log('Product fetched >>>>>>>>>>>>>>>>>>>>>>>>>>', this.allValuesSame(this.cartItems, 'qty'));
    });
  }
  allValuesSame(array: any[], key: string): boolean {
    if (array.length === 0) return true; // Edge case for empty array

    const firstValue = array[0][key];
    return array.every(item => item[key] === firstValue);
  }

  deleteCartItem(item_uuid?: string) {
    if (item_uuid) {
      // Open the confirmation dialog
      const dialogRef = this.dialog.open(ConformationdialogComponent, {
        width: '500px',
        data: { message: 'Are you sure you want to delete this item from the cart?' }
      });

      // Subscribe to the dialog afterClosed event to get the user's response
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // If user clicks Yes, proceed with deletion
          this.cartService.deleteCartItem(item_uuid).subscribe(() => {
            // console.log('Item deleted successfully');
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Item deleted successfully',
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              customClass: {
                popup: 'large-sa-popup',
              },
            });
            this.cartService.cartItemAdded.emit();
            this.getAll();
          });
        }
      });
    }
  }


  getTotalPrice(): string {
    let totalPrice = 0;
    for (const item of this.cartItems) {
      totalPrice += item.qty * item.amount;
    }
    // Round the total price to two decimal places and convert it to a string
    return totalPrice.toFixed(2);
  }

  getTotalMrp(): string {
    let totalMrp = 0;
    for (const item of this.cartItems) {
      totalMrp += item.mrp * item.qty
    }
    // Round the total price to two decimal places and convert it to a string
    return totalMrp.toFixed(2);
  }

  getDiscount() {
    const totalMrp = parseFloat(this.getTotalMrp());
    const totalPrice = parseFloat(this.getTotalPrice());
    const discount = totalMrp - totalPrice;
    return discount.toFixed(2);
  }

  increaseQuantity(item: any) {
    // console.log(this.cartItems);
    // const cartItem = this.cartItems.find((cartItem: any) => cartItem.item_uuid === item.item_uuid);
    // console.log(cartItem);
    // console.log(item);
    if (item.maxqty == item.qty) {
      // console.log('reached maximum', item.qty);
      // Swal.fire({
      //   position: 'top-end',
      //   icon: 'warning',
      //   title: 'Reached Maximum Quantity',
      //   showConfirmButton: false,
      //   width: '500px',
      //   timer: 1000,
      //   customClass: {
      //     popup: 'large-sa-popup',
      //   },
      // });
    }
    else {
      item.qty++;
      // console.log(item.qty)
      this.cartService.addToCart(item.item_uuid, item.itemslist_uuid, item.qty).subscribe(() => {
        // console.log('Product added to cart');
        this.cartService.cartItemAdded.emit();
        this.cartService.cartCount$.subscribe((count: any) => {
          this.count = count;

        });
      })
    }

  }

  decreaseQuantity(item: any) {
    if (item.qty == 1) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Reached minimum quantity',
        showConfirmButton: false,
        width: '500px',
        timer: 1000,
        customClass: {
          popup: 'large-sa-popup',
        },
      })
    }
    else {
      if (item.qty > 1) {
        item.qty--;
        this.cartService.addToCart(item.item_uuid, item.itemslist_uuid, item.qty).subscribe(() => {
          // console.log('Product added to cart');
          this.cartService.cartCount$.subscribe((count: any) => {
            this.count = count;

          });
          this.cartService.cartItemAdded.emit();
        })
      }
    }
  }

  orderSummary() {
    // const outOfStockItems = this.cartItems?.filter((item: any) => item.qty === '0');
    // if (outOfStockItems && outOfStockItems.length > 0) {
    //   this.order.placeorder().subscribe((data: any) => {
    //     // console.log(data.data.orderID);
    //     this.route.navigate(['/checkout/' + data.data.orderID]);
    //   });
    // }

    this.order.placeorder().subscribe((data: any) => {
      // console.log(data.data.orderID);
      this.route.navigate(['/checkout/' + data.data.orderID]);
    })
  }


}
