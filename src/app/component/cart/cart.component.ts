import { Component, Injectable, OnInit, ChangeDetectorRef, AfterViewInit, Input, EventEmitter, Output, DoCheck, AfterContentInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartProductData, CartProducts } from 'src/app/model/cart-items';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { ConformationdialogComponent } from '../conformationdialog/conformationdialog.component';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent implements OnInit, AfterViewInit {
  count!: any;
  items: any = CartProducts;
  public total!: number;
  updateCart: boolean = true;
  private cartItemAddedSubscription!: Subscription;
  cartShow: boolean = false;

  private user !: any;
  private cartSubscription!: Subscription;
  constructor(private cartService: CartService, private authService: AuthService, private cart: CartService,
    private routes: ActivatedRoute, private route: Router, private dialog: MatDialog, private cd: ChangeDetectorRef) { }
  token = localStorage.getItem('token');

  ngOnInit() {
    if (this.token) {
      this.getAll();
    }
    const segments = this.routes.snapshot.url.map(segment => segment.path);
    // console.log(segments);
    if (segments[0] === 'checkout') {
      this.cartShow = true;
    }
  }

  navigateProduct(prodID: any) {
    // console.log(prodID);
    this.route.navigate(['/product/' + prodID])
  }

  ngAfterViewInit(): void {
    this.cartItemAddedSubscription = this.cartService.cartItemAdded.subscribe(() => {
      this.getAll();
    });
  }

  public getAll() {
    let token = localStorage.getItem('token');
    if (token) {
      this.cartService.getAll().subscribe((data) => {
        this.items = data;
        let newcount = 0;
        if (this.items.length == 0) {
          this.count = 0
          // console.log(this.count);
          this.cart.addToCartCount(this.count);
          this.cd.detectChanges();
        } else {
          this.items.forEach((ele: any) => {
            newcount = ele.qty + newcount;
            this.items.totalqty = newcount;
          });
          this.count = this.items.totalqty
          this.cd.detectChanges();
        }
        // console.log("cart", this.items);
        this.cart.addToBagCount(data);
        // console.log('Product fetched', this.items);
        if (this.items.length == 0) {
          this.items.totalqty = 0
          // console.log(this.count);
          this.cart.addToCartCount(this.count);
          this.cd.detectChanges();
        }
      });
    }
    // this.cd.detectChanges();
  }

  deleteCartItem(item_uuid?: string) {
    if (item_uuid) {
      // Open the confirmation dialog
      const dialogRef = this.dialog.open(ConformationdialogComponent, {
        width: '350px',
        data: { message: 'Are you sure you want to delete this item from the cart?' }
      });
      // Subscribe to the dialog afterClosed event to get the user's response
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // If user clicks Yes, proceed with deletion
          this.cartService.deleteCartItem(item_uuid).subscribe(() => {
            // console.log('Item deleted successfully',item_uuid);
            this.getAll();
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    this.cartItemAddedSubscription.unsubscribe();
  }

}
