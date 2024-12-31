import { Component, OnDestroy, OnInit, Renderer2, ViewChild, ElementRef, Input, ChangeDetectionStrategy, ChangeDetectorRef, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WishlistService } from 'src/app/services/wishlist.service';
// import { SingleproductComponent } from 'src/app/component/singleproduct/singleproduct.component';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { SearchService } from 'src/app/services/search.service';
import { event } from 'jquery';
import Swal from 'sweetalert2';
import { TagWithIdComponent } from 'src/app/component/tag-with-id/tag-with-id.component';
import { ProductListComponent } from 'src/app/component/product-list/product-list.component';
import { ProductsService } from 'src/app/services/products.service';
import { Menu } from 'src/app/model/onlineShop';
import { EventService } from 'src/app/services/event.service';
import { STORE } from 'src/app/model/stores';
import { ProductsComponent } from 'src/app/component/products/products.component';
import { AuthGoogleService } from 'src/app/services/auth-google.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('elementClass', { static: true }) elementClass!: ElementRef;
  wishlistSubscription!: Subscription;

  returnUrl: string = '/'; // Default return URL
  currentRoute!: string;
  wishlistcount!: number;
  items: any;
  count!: number;
  searchProduct: string = '';
  searchProducts: any = [];
  showSearch: boolean = true;

  showResults: boolean = false;
  clearInputOnBlur: boolean = true;
  isCheckout: boolean = false;

  onlineShopMenu: Menu[] = [];
  store: STORE[] = [];

  @Input() Productlist: any;
  stores: any;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private wishlist: WishlistService, private cart: CartService, private eventService: EventService,
    private search: SearchService, private renderer: Renderer2, private ElementRef: ElementRef, private cd: ChangeDetectorRef, private tagComponent: TagWithIdComponent,
    private productList: ProductListComponent, private storeList: ProductsComponent, private productService: ProductsService,private google:AuthGoogleService) {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.wishlistSubscription = this.wishlist.wishlistEvent$.subscribe(data => {
      // Handle data received from the event
      // console.log('Wishlist Event Data:', data);
      this.wishlistcount = data
      // You can perform any action with the data received from the event here
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      if ((e.target as HTMLElement)?.className !== 'search-results') {
        this.clearSearchInput();
      }
    });
  }

  onEnterPressed() {
    if (this.searchProduct.trim()) {
      this.router.navigate(['/search-results'], { queryParams: { search: this.searchProduct } });
      this.clearSearchInput(); // Clear the input and results after redirecting
    }
  }
  refresh() {
    if (this.router.url === '/') {
      window.location.reload();
    }
  }
  token = localStorage.getItem('token');
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
    this.checkRoute();
    // console.log(localStorage.getItem('token'));
    this.isLoggedIn = this.token !== null || undefined ? true : false;
    // console.log(this.isLoggedIn)
    if (this.token) {
      this.wishlistCount();
      this.wishlist.wishlistCount$.subscribe(count => {
        this.wishlistcount = count;
      });
      this.cartCount();
    }
    this.onlineShop();
    this.getStore();
    // console.log("hi this is a new popup");
    var data = null;
  }

  getStore() {
    this.productService.getAllStore().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.store = resp.data;
        this.cd.detectChanges();
      }
    })
  }
  getStoreState() {
    this.productService.getAllStoreState().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.stores = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  groupClickEvent() {
    const eventData = { filter: true };
    this.eventService.emitEvent(eventData);
    // console.log("event", eventData.filter);
  }

  checkRoute(): void {
    const currentRoute = this.router.url;
    this.showSearch = !(currentRoute === '/login' || currentRoute === '/signup');
  }

  onlineShop() {
    this.productService.onlineShopMenus().subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.onlineShopMenu = resp?.data.menus;
        this.cd.detectChanges();
      }
    })
  }

  isCheckoutRoute(): boolean {
    return this.router.url.startsWith('/checkout/');
  }

  loginRoute() {
    this.currentRoute = this.route.snapshot.url.join('/');
    localStorage.removeItem('currentroute');
    localStorage.setItem('currentroute', `/${this.currentRoute}`);
    // console.log(this.currentRoute)
    this.router.navigate(["/login"])
  }

  logOut() {
    localStorage.clear();
    sessionStorage.removeItem('isPopupShown');
    // console.log("logged Out")
    this.isLoggedIn = false;
    var model = document.getElementById('exampleModal');
    // console.log(model)
    if (model) {
      model.style.display = 'none';
    }
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
    this.token = '';
  
    let google_token  = this.google.getToken()
    if(google_token){
      this.google.logout()
    } 
    this.google.logout()
    window.location.reload();
   
  }

  ngAfterViewInit() {
    // Check if the user is logged out
    const isLoggedIn = this.isLoggedIn;
    if (!isLoggedIn) {
      // Navigate to the home route after the page is reloaded
      window.onload = () => {
        this.router.navigate(['/']);
      };
    }
  }

  wishlistCount() {
    this.wishlist.getWishlist().subscribe((data: any) => {
      // console.log(data?.data?.length);
      this.wishlistcount = data?.data?.length;
      // console.log(this.wishlistcount);
      this.wishlist.setWishlistCount(this.wishlistcount);
      // this.cd.detectChanges();
    })
  }

  cartCount() {
    let token = localStorage.getItem('token');
    if (token) {
      this.cart.getAll().subscribe((data: any) => {
        this.items = data;
        // console.log('Product fetched', this.items);
        this.cart.cartCount$.subscribe(count => {
          this.count = count;

        });
        if (this.items?.length) {
          this.items.forEach((ele: any) => {
            this.count = ele.qty + this.count
          });
          // console.log(this.count);
          this.cart.addToCartCount(this.count)
          this.cart.cartCount$.subscribe(count => {
            this.count = count;

          });
        }
      });
    }
    // this.cd.detectChanges();
  }


  closeModal() {
    var model = document.getElementById('exampleModal');
    // console.log(model)
    if (model) {
      model.style.display = 'none';
    }

    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
    }
  }



  onSearchChange(event: any) {
    // console.log(event);
    const searchTerm = event.trim();
    if (searchTerm !== '') {
      this.searchInput(searchTerm);
    } else {
      this.searchProducts = [];
      // console.log(this.searchProducts);
    }
  }

  clearSearchInput() {
    this.searchProducts = [];
    this.searchProduct = ''; // Clear the input field
  }

  closeDropdown() {
    this.searchProducts = []; // Clear the search results
    this.searchProduct = '';
  }


  onResultSelected(item: any) {
    // console.log(item);
    if (item?.type == 'Group') {
      this.router.navigate(['/product-list/' + item.slug]);
      this.productList.getProductListUUID(item.slug);
      this.cd.detectChanges();
    }
    else if (item?.type === 'Tag') {
      this.router.navigate([`/tag/${item.slug}`]);
      this.tagComponent.getTagWithUUID(item.slug);
      this.cd.detectChanges();
    }
    else if (item?.type == 'Product') {
      this.router.navigate(['/product/' + item.slug])
    }
    this.cd.detectChanges();
  }

  goToProductList(uuid: any) {
    // console.log(uuid);
    this.router.navigate(['/product-list/' + uuid.slug]);
    this.productList.getProductListUUID(uuid.slug);
    this.groupClickEvent()
    this.isMenuOpen = false;
    this.isOnlineShopMenuOpen = false;
    // this.isStoreLocatorMenuOpen = false;
    this.cd.detectChanges();
  }
  // store-products

  goToStoreList(uuid: any) {
    this.router.navigate(['/store-products/' + uuid.slug]);
    // this.productList.getProductListUUID(uuid.slug);
    this.storeList.getAllStores(uuid.slug);
    this.groupClickEvent()
    this.isMenuOpen = false;
    // this.isOnlineShopMenuOpen = false;
    this.isStoreLocatorMenuOpen = false
    this.cd.detectChanges();
  }

  searchInput(value: string) {
    this.search.search(value).subscribe({
      next: resp => {
        // console.log(resp);
        this.searchProducts = resp.data;
        this.cd.detectChanges();
      },
      error(err) {
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: err,
          showConfirmButton: false,
          width: '500px',
          timer: 1000,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
      }
    })

  }
  isMenuOpen: boolean = false;
  isMenuOneOpen: boolean = false;
  isMenuTwoOpen: boolean = false;
  isOnlineShopMenuOpen: boolean = false;
  isStoreLocatorMenuOpen: boolean = false;
  isOnlineShopMenuOneOpen: boolean = false;
  isOnlineShopMenuTwoOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleMenuTwo() {
    this.isMenuTwoOpen = !this.isMenuTwoOpen;
  }

  toggleMenuOne() {
    this.isMenuOneOpen = !this.isMenuOneOpen;
  }

  toggleOnlineShopMenu() {
    this.isOnlineShopMenuOpen = !this.isOnlineShopMenuOpen;
  }
  toggleOnlineShopMenuTwo() {
    this.isOnlineShopMenuTwoOpen = !this.isOnlineShopMenuTwoOpen;
  }

  toggleOnlineShopMenuOne() {
    this.isOnlineShopMenuOneOpen = !this.isOnlineShopMenuOneOpen;
  }

  toggleOnlineShopMenuThree() {
    this.isStoreLocatorMenuOpen = !this.isStoreLocatorMenuOpen;
  }
  ngOnDestroy() {
    this.wishlistSubscription.unsubscribe();
  }

  navLinkActive: boolean = false;
  navClick() {
    this.navLinkActive = true;
    // this.cd.detectChanges();
    var data: any = document.getElementById('navLink');
    if (data?.style.display == 'block') {
      data.style.display = 'none';
      this.navLinkActive = false;
      // console.log('inside if')
    }
    else {
      this.navLinkActive = true;
      data.style.display = 'none';
      // console.log('else inside');
    }
  }
}
