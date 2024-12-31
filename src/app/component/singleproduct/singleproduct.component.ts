import {
  Component,
  ViewChild,
  OnInit,
  SimpleChanges,
  OnChanges,
  HostListener, ChangeDetectionStrategy, ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ApiserviceService } from '../../services/apiservice.service';
import { CartService } from 'src/app/services/cart.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ToasterService } from 'src/app/services/toaster.service';
import Swal from 'sweetalert2';
import { WishlistService } from 'src/app/services/wishlist.service';
import { ProductDetails } from 'src/app/model/products';
import { ParameterService } from 'src/app/services/parameter.service';
import { SingleProduct, SingleProductData } from 'src/app/model/single-product';
import { SimilarProduct } from 'src/app/model/similarproduct';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MatTabGroup } from '@angular/material/tabs';
@Component({
  selector: 'app-singleproduct',
  templateUrl: './singleproduct.component.html',
  styleUrls: ['./singleproduct.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleproductComponent implements OnInit {
  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;
  @ViewChild('slickModal3') slickModal3!: SlickCarouselComponent;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;


  deletedItemId!: string;
  deletedItemIdSubscription!: Subscription;
  listrecomdProduct :SimilarProduct[] =[]
  sepparateProduct!: any[];
  id: any = '';
  productdata: any;
  listProduct: any;
  productVariants: any;
  images: any[] = [];
  showProduct: boolean = false;
  // unsubscribe$ = new Subject();
  listSimilarProduct: SimilarProduct[] = [];
  wishlistData: any;
  items: any;
  total!: number;
  cart: any = [];
  addToCartClicked: boolean = false;
  show: boolean = false;
  prodWeight: any
  slideConfig2: any;
  slidesToShow: number;
  activeWeight: any;

  currentVariantList: any;

  staticWeights: Array<{
    id: number, value: string
  }> = [
      {
        id: 1, value: "100g"
      },
      {
        id: 2, value: "250g"
      },
      {
        id: 3, value: "500g"
      },
      {
        id: 4, value: "1kg"
      }
    ]
  itemmoredetail: any;
  count: any;
  listvariants: any;
  currentRate: any;
  max = 5;

  isWeightMatched(staticWeight: string): boolean {
    return this.prodWeight.some((item: any) => item.weight === staticWeight);
  }
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiserviceService,
    private cartService: CartService,
    private checkout: CheckoutService,
    private toasterService: ToasterService,
    private wishlist: WishlistService,
    private router: Router,
    private parameterService: ParameterService, private cd: ChangeDetectorRef

  ) {
    this.slidesToShow = window.innerWidth < 576 ? 1 : 3;
    this.slideConfig2 = { slidesToShow: this.slidesToShow, slidesToScroll: 3 };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.slidesToShow = (event.target as Window).innerWidth < 576 ? 1 : 3;
    this.slideConfig2 = { slidesToShow: this.slidesToShow, slidesToScroll: this.slidesToShow };
  }

  ngOnInit() {
    let token = localStorage.getItem('token');
    this.id = this.route.snapshot.paramMap.get('id');
    this.list(this.id);
    // this.listProd(this.id)
    this.similarProducts();
    // this.getWeight();
    this.getParameter();
    if (token) {
      this.patchCartQty();
      // this.router.events.subscribe((event) => {
      //   if (event instanceof NavigationEnd) {
      //     // Call the patchCartQty method whenever there is a change in the URL
      //   }
      // });
    }
    // console.log(this.id);
    // console.log(this.cart);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // This code will execute whenever the route changes
        this.handleRouteChange();
      }
    });

    //this is for deleted item id get from the cart component
    this.deletedItemIdSubscription = this.cartService.getDeletedItemId().subscribe((itemId: any) => {
      // this.id = this.route.snapshot.paramMap.get('id');
      // console.log("itemId: ", itemId, "itemlist_uuid: ", this.listProduct?.itemslist_uuid);
      if (this.listProduct?.itemslist_uuid === itemId) {
        this.deletedItemId = itemId;
        // console.log('Item deleted:', itemId);
        this.addToCartClicked = false;
        this.quantity = 1;
      }
    });
  }

  ngOnDestroy(): void {
    this.deletedItemIdSubscription.unsubscribe();
  }

  isActiveWeight(weight: string): boolean {
    return this.activeWeight === weight;
  }

  getProductAvailable(uuid: any) {
    // console.log(uuid);
    const selectedWeight = this.prodWeight.find((item: any) => item.uuid === uuid);
    // console.log(selectedWeight.weight);
    this.activeWeight = selectedWeight.weight;
    this.router.navigate(['/product/' + uuid])
  }

  ngAfterViewInit() {
    let token = localStorage.getItem('token');
    if (token) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          // Call the patchCartQty method whenever there is a change in the URL
          this.patchCartQty();
          this.similarProducts();
          this.getParameter();
        }
      });
    }
  }

  // getWeight() {
  //   this.id = this.route.snapshot.paramMap.get('id');
  //   this.apiService.getWeight(this.id).subscribe({
  //     next: (data: any) => {
  //       // console.log(data);
  //       this.prodWeight = data.data
  //       // console.log(this.prodWeight);
  //       const selectedWeight = this.prodWeight.find((item: any) => item.uuid === this.id);
  //       // console.log(selectedWeight.weight);
  //       this.activeWeight = selectedWeight.weight;
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   })
  // }

  isAvailable(weight: string): boolean {
    return this.prodWeight.some((item: any) => item.weight === weight);
  }

  handleRouteChange() {
    this.id = this.route.snapshot.paramMap.get('id');
    // console.log('Route changed', this.id);
    this.list(this.id);
    // this.listProd(this.id);
  }


  // //single product api

  // cartData: any;
  // listProd(prodId: any) {
  //   this.apiService.getProduct(prodId).subscribe({
  //     next: (data: any) => {
  //       this.listProduct = data
  //       this.images = [this.listProduct[0]?.product_image, this.listProduct[0]?.product_image2, this.listProduct[0]?.product_image3];
  //       // // console.log(this.listProduct[0]?.product_image)
  //       // for (let i = 0; i <= this.listProduct?.length; i++) {
  //       //   // console.log("inside the loop")
  //       // }
  //       // console.log(this.images);
  //       this.cartService.getAll().subscribe((data: any) => {
  //         this.cartData = data;
  //         // console.log("<<<<<<<<<<<<<<<<<<<<< my Cart >>>>>>>>>>>>>>>>>>", this.cartData);
  //       const foundItem = this.cartData.find((item: any) => item.product_id === this.id);
  //       if (foundItem) {
  //         this.addToCartClicked = true;
  //       } else {
  //         this.addToCartClicked = false;
  //       }
  //       })
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   })
  // }

  list(prodId: any) {
    this.apiService.getProduct(prodId).subscribe({
      next: (data: any) => {
        if (data.status != 'error') {
          this.showProduct = true;
          this.productdata = data;
          // console.log(data.data.item.rating, data.data);
          this.currentRate = data.data.item.rating;
          this.listProduct = data?.data?.item;
          this.listvariants = data?.data?.listvariants
          // console.log(this.listvariants);

          this.productVariants = data?.data?.productvariants.map((variant: any) => {
            variant.productvariantvalues = variant.productvariantvalues.map((value: any) => {
              value.selected = value.selected === 'true';
              return value;
            });
            return variant;
          });

          this.images = []
          let getImages = this.productdata.data.images;
          getImages.forEach((image: any) => {
            this.images.push(image.path);
          });
          this.cd.detectChanges()
          this.wishlistData = this.productdata.data.wishlist
          // console.log(this.listProduct);

          if (this.productdata.data.cart == 1) {
            this.addToCartClicked = true;
          } else {
            this.addToCartClicked = false;
            this.quantity = 1
          }
          if (this.productdata.data.quantity <= 10 && this.productdata.data.quantity != 0)
            this.show = true;
          // console.log('Fetched data:', this.listProduct);
          // console.log('Fetched data:', this.images);
        } else if (data.status == "error") {
          // console.log("Product Not Get>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          this.showProduct = false;
        }
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
    });
  }



  //click variant start
  getVariant() {
    this.resetProductDetailData();
    const payload = {
      listvariants: this.currentVariantList,
      selectedvariant: {}
    };
    this.apiService.getProductVariant(this.id, payload).subscribe({
      next: (data: any) => {
        if (data.status !== 'error') {
          this.showProduct = true;
          this.productdata = data;
          this.listProduct = data.data.item;
          this.productVariants = data.data.productvariants.map((variant: any) => {
            variant.productvariantvalues = variant.productvariantvalues.map((value: any) => {
              value.selected = value.selected === 'true';
              if (value.selected) {
                this.currentVariantList[variant.id] = value.variantvalue_id;
              }
              return value;
            });
            return variant;
          });
          this.images = data.data.images.map((image: any) => image.path);
          this.wishlistData = data.data.wishlist;
          // console.log(this.wishlistData)
          this.addToCartClicked = data.data.cart === 1;
          this.show = data.data.quantity <= 10 && data.data.quantity !== 0;
          this.similarProducts();
          this.getParameter();
          this.cd.detectChanges();
        } else {
          this.showProduct = false;
        }
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });
  }


  handleVariantClick(variantId: any, valueId: any) {
    // console.log(this.listvariants, ">>>>>>>>>>>>>>");
    this.selectedProductPayload(this.listvariants, { [variantId]: valueId });
    // console.log(this.listvariants, "<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>");

    this.getVariant();
  }

  selectedProductPayload(existingVariantObj: any, newVariantObj = {}) {
    this.currentVariantList = { ...existingVariantObj, ...newVariantObj };
    this.listvariants = this.currentVariantList
  }

  resetProductDetailData() {
    this.listProduct = [];
    this.productVariants = [];
  }

  //click variant end

  slideConfig = { slidesToShow: 1, slidesToScroll: 1 };
  slideConfig3 = { slidesToShow: 1, slidesToScroll: 1 };

  activeSlide = 0;
  quantity: number = 1;

  goToSlide(index: number) {
    this.activeSlide = index;
    this.slickModal.slickGoTo(index);
    this.slickModal3.slickGoTo(index);
  }

  goToPrevSlide() {
    this.activeSlide =
      (this.activeSlide - 1 + this.images.length) % this.images.length;
    this.slickModal.slickPrev();
    this.slickModal3.slickPrev();
  }

  goToNextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.images.length;
    // console.log((this.activeSlide + 1) % this.images.length);
    this.slickModal.slickNext();
    this.slickModal3.slickNext();
  }

  increaseValue() {
    if (this.quantity >= this.productdata.data.item.quantity) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Reached Maximum Quantity',
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
      return
    } else {
      this.quantity++; // Increase the quantity by 1
    }
    this.addToCartClicked = false;
  }

  decreaseValue() {
    if (this.quantity > 1) {
      this.quantity--; // Decrease the quantity by 1, but ensure it doesn't go below 1
      this.addToCartClicked = false;
    }
  }

  // addToCart to service

  addToCart(productId: any, itemsuuid: any, quantity: any) {
    const token = localStorage.getItem('token');
    if (token) {
      this.cartService.addToCart(productId, itemsuuid, quantity).subscribe(() => {
        // console.log('Product added to cart');
        this.cartService.cartItemAdded.emit();
        this.addToCartClicked = true;
        this.cart.cartCount$.subscribe((count: any) => {
          this.count = count;

        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added to Cart',
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
      });
    } else {

      this.router.navigate(['/login']);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Login to Access the App',
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
  }

  buynow(productId: any, itemsuuid: any) {
    let params = {
      item_uuid: productId,
      itemslist_uuid: itemsuuid
    }
    this.checkout.buyNow(params).subscribe((data: any) => {
      // console.log(data.data.orderID);
      this.router.navigate(['/checkout/' + data.data.orderID]);
    })
  }

  getProduct(item: any) {
    // console.log("Product Id", item)
    this.router.navigate(['/product/' + item.slug])
  }

  patchCartQty() {
    this.cartService.getAll().subscribe((data) => {
      this.cart = data;
      // console.log(data, "<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>");
      // Check if the cart is not empty and is an array
      if (Array.isArray(this.cart) && this.cart.length > 0) {
        // Find the item in the cart based on the slug
        // console.log('Cart slugs:', this.cart.map((item: any) => item.slug));
        let item = this.cart.find((obj: any) => {
          // console.log('Comparing:', obj.slug, 'with', this.id);  // Debugging output
          return obj.slug === this.id;
        });


        if (item) {
          // If the item is found, check if the quantity is defined
          if (item.qty) {
            this.quantity = item.qty;
            // console.log('Quantity found:', this.quantity);
          } else {
            // console.log('Quantity not found for item with ID: ' + this.id);
          }
        } else {
          // console.log('Item not found with slug: ' + this.id);
        }
      } else {
        // console.log('Cart is empty or not an array');
      }
    }, (error) => {
      console.error('Error fetching cart data:', error);
    });
  }


  //add to wishlist
  addToWishlist(uuid: any) {
    let token = localStorage.getItem('token');
    // console.log(uuid);
    if (token) {
      this.wishlist.addToWishlist(uuid).subscribe((data) => {
        // console.log(data);
        this.wishlist.getWishlist().subscribe((data: any) => {
          // console.log(data.data);
          this.wishlist.addToWishlistCount(data.data.length);
          this.wishlist.setWishlistCount(data.data.length);
        });
        this.list(this.id);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${data.message}`,
          showConfirmButton: false,
          width: '500px',
          timer: 2000,
          customClass: {
            popup: 'large-sa-popup',
          },
        });
      });
    } else {
      this.router.navigate(['/login']);
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: `Login to Access the App`,
        showConfirmButton: false,
        width: '500px',
        timer: 2000,
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

    // this.cd.detectChanges();
  }

  similarProducts() {
    const queryParams = {
      page: 1,
    };
    this.apiService.getSimilar(this.id).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.listSimilarProduct = resp.data
        // this.getWeight();
        // this.cd.detectChanges();
      },
    });
  }


  readonlyRating: number = 4.8; // Default rating
  readonly: boolean = true; // Make the rating readonly
  // Optional: You can add a method to handle click events if needed
  setRating(rating: number) {
    // You can add custom logic here if needed
  }

  getParameter() {
    this.parameterService.getParameters(this.id).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.itemmoredetail = resp.data.parameters;
        // console.log(this.itemmoredetail);
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    })
  }

  objectEntries = Object.entries;


  scrollToReview() {
    const reviewElement = document.getElementById('mat-tab-label-0-2');
    if (reviewElement) {
      const elementPosition = reviewElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - (window.innerHeight / 2 - reviewElement.clientHeight / 2);
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else {
      console.error('Element #review is not found.');
    }
  }
  
  getRating(index: number) {
    // console.log(index)
    if (this.tabGroup) {
      // console.log(index, this.tabGroup)
      this.tabGroup.selectedIndex = index;
    }
    this.userRatings();
    this.scrollToReview();
  }

  userRatingData: any[] = [];
  userRatings() {
    this.apiService.getRating().subscribe({
      next: resp => {
        // console.log(resp.data);
        this.userRatingData = resp.data;
        this.cd.detectChanges();
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
    })
  }
}