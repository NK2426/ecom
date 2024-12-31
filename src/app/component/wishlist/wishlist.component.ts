import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartProductData } from 'src/app/model/cart-items';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';
import { ConformationdialogComponent } from '../conformationdialog/conformationdialog.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishlistItems: any = [];
  isShow: boolean = false;
  cartItems: any = CartProductData;
  cartBagSubscription!: Subscription;
  addtobagcount: any;
  count: any;

  constructor(private wishlist: WishlistService, private apiservice: ApiserviceService, private route: Router, private cartService: CartService, private dialog: MatDialog) {
    this.cartBagSubscription = this.cartService.cartBagEvent$.subscribe(data => {
      // Handle data received from the event
      // console.log('Cart Event Data:', data);
      this.addtobagcount = data
      this.cartItems = data
      // You can perform any action with the data received from the event here
    });
  }
  token = localStorage.getItem('token')
  ngOnInit() {
    if (this.token) {

      this.getWishlist();
    }
  }

  addToCart(productId: any, itemsuuid: any, quantity: any) {
    const token = localStorage.getItem('token');
    if (token) {
      this.cartService.addToCart(productId, itemsuuid, quantity).subscribe(() => {
        // console.log('Product added to cart');
        this.cartService.cartItemAdded.emit();
        this.cartService.cartCount$.subscribe((count: any) => {
          this.count = count;

        });
        this.wishlist.addToWishlist(productId).subscribe(data => {
          // console.log(data);
          this.getWishlist();
        });

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added to Cart',
          showConfirmButton: false,
          width: '300px',
          timer: 1000,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
      });
    } else {

      this.route.navigate(['/login']);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Login to Access the App',
        showConfirmButton: false,
        width: '300px',
        timer: 1000,
        customClass: {
          popup: 'large-sa-popup',
        },
      });
    }
  }

  getWishlist() {
    this.wishlist.getWishlist().subscribe((data: any) => {
      // console.log(data);
      this.wishlistItems = data.data
      // console.log(this.wishlistItems);
      this.wishlist.addToWishlistCount(data.data.length);
      this.wishlist.setWishlistCount(data.data.length);

    })
  }

  viewProduct(uuid: any) {
    this.route.navigate(['/product/' + uuid])
  }

  removeWishlist(uuid: any) {
    // Open a confirmation dialog
    const dialogRef = this.dialog.open(ConformationdialogComponent, {
      data: {
        width: '350px',
        message: 'Are you sure you want to remove this item from the wishlist?'
      }
    });

    // Handle dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // console.log(uuid);
        this.wishlist.addToWishlist(uuid).subscribe(data => {
          // console.log(data);
          this.getWishlist();
        });
      }
    });
  }

}
