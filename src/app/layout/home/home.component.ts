import { Component, EventEmitter, HostListener, Input, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ConformationdialogComponent } from 'src/app/component/conformationdialog/conformationdialog.component';
import { Bridal } from 'src/app/model/bridalcollection';
import { Category, CategoryList } from 'src/app/model/categories';
import { Exclusive } from 'src/app/model/exclusive';
import { Newarrivals } from 'src/app/model/newarrivals';
import { Reels } from 'src/app/model/reels';
import { Store } from 'src/app/model/stores';
import { Tag, TagsList } from 'src/app/model/tags';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { LoginService } from 'src/app/services/login.service';
import { OffersService } from 'src/app/services/offers.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {

  section: any
  testimonialsarray: any = []
  selectedSubcategoryId!: string;
  offers: any;
  id: any;
  slideConfig2: any;
  slideConfig3: any;

  slideConfig4: any;
  slideConfigTag: any;
  slideConfigTags: any;
  slideConfig5: any;
  slidesToShow: number;
  slidesToShow3: number;
  slidesToShow4: number;
  slidesToShow6: number;
  slideConfig6: any;
  slidesToTag: number;
  slidesToTags: number;
  slidesToShow5: any;
  listTrendingReels: Reels[] = [];
  // listbridalCollection: any;
  listgetHomePageSubcategories: any;
  listCategoriesFetch: Category[] = [];
  listTags: Tag[] = [];
  listReels: Reels[] = [];
  bridalCollectionList: Bridal[] = [];
  exclusiveCollectionList: Exclusive[] = [];
  newArrivalsList: Newarrivals[] = [];
  listBanner: any;

  email: string = '';

  listStore: Store[] = [];
  listBrides: any;
  listTestimonial: any;
  addToCartClicked: boolean = false;
  emailForm!: FormGroup;
  couponList: any[] = [];
  pattern: any = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  isSubmit: boolean = false;
  onSubcategorySelected(subcategoryId: string) {
    this.selectedSubcategoryId = subcategoryId;
    // console.log(this.selectedSubcategoryId);

  }
  isCoupon: any = ''
  @ViewChild('slickModal2') slickModal2: any;
  @ViewChild('slickModal3') slickModal3: any;
  @ViewChild('slickModal6') slickModal6: any;
  @ViewChild('slickModal4') slickModal4: any;
  slideConfig = {
    slidesToShow: 1, slidesToScroll: 1, autoplay: true, // This enables autoplay
    autoplaySpeed: 2000
  };
  constructor(private offer: OffersService, private route: Router, private apiService: ApiserviceService, private wishlist: WishlistService, private fb: FormBuilder,
    private cd: ChangeDetectorRef, private cartService: CartService, private router: Router, private checkout: CheckoutService, private loginService: LoginService,
    private dialog: MatDialog) {
    this.slidesToShow = window.innerWidth < 576 ? 1 : window.innerWidth < 769 ? 3 : window.innerWidth <= 1024 ? 3 : window.innerWidth < 1350 ? 5 : 5;
    this.slidesToShow3 = window.innerWidth < 576 ? 3 : 5;
    this.slidesToShow6 = window.innerWidth < 576 ? 3 : 4;
    this.slidesToShow4 = window.innerWidth < 450 ? 1 : window.innerWidth < 769 ? 2 : window.innerWidth < 1023 ? 2 : window.innerWidth < 1350 ? 5 : 6;
    this.slidesToTag = window.innerWidth < 250 ? 1 : window.innerWidth < 320 ? 2 : window.innerWidth < 769 ? 2 : window.innerWidth < 1023 ? 3 : 4;
    this.slideConfig5 = window.innerWidth < 576 ? 3 : 5;
    this.slidesToTags = window.innerWidth < 250 ? 1 : window.innerWidth < 320 ? 2 : window.innerWidth < 769 ? 2 : window.innerWidth < 1023 ? 6 : 12;
    this.slideConfig2 = {
      slidesToShow: this.slidesToShow,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true
    };

    this.slideConfig3 = {
      slidesToShow: this.slidesToShow3,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true,

    };
    this.slideConfig6 = {
      slidesToShow: this.slidesToShow6,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true,

    };


    this.slideConfig4 = {
      slidesToShow: this.slidesToShow4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true,
      prevArrow: '<button type="button" class="slick-prev" style="background-color: #a91be9;">Previous</button>',
      nextArrow: '<button type="button" class="slick-next" style="background-color: #a91be9;">Next</button>'
    };

    this.slideConfig5 = {
      slidesToShow: this.slidesToShow5,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true
    }

    this.slideConfigTag = {
      slidesToShow: this.slidesToTag,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true
    }
    this.slideConfigTags = {
      slidesToShow: this.slidesToTags,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000, // Speed in milliseconds (2000ms = 2s)
      dots: true,
      infinite: true,
      speed: 300,
      pauseOnHover: true
    }
  }
  navigateTo(route: string, type: string) {
    if (type === 'Tag') {
      this.router.navigate([`/tag/${route}`])
    } else if (type === 'Group') {
      this.router.navigate([`/product-list/${route}`])
    } else {
      this.router.navigate([`/product/${route}`])
    }
  }
  ngOnInit() {
    // this.homeBanner();
    this.getCategoriesFetch();

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.pattern)]],
      status: ['1'],
    });

    const isPopupShown = sessionStorage.getItem('isPopupShown');
    // if (!isPopupShown) {
    //   const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal')!, {});
    //   newsletterModal.show();
    //   sessionStorage.setItem('isPopupShown', 'true');
    // }
    this.homeBanner()
    this.isCoupon = localStorage.getItem('coupon')
  }

  navigate(uuid: any) {
    this.id = this.route.navigate([`/offers/${uuid}`])
  }
  get formControls() {
    return this.emailForm.controls;
  }
  
  homeBanner() {
    let tagcount = 0
 
    this.apiService.getHomeBanner().subscribe((data: any) => {
      // console.log(data.data.rows);
      this.section = data.data;
      this.section.forEach((section:any,index:any)=>{
       if(section.type =='Tags'){       
        tagcount ++
        debugger
        if(tagcount > 1) this.section.splice(index,1)
       } 
      })
      

      

      // console.log(this.section);
      this.cd.detectChanges();
    });
  }
  testimonials() {
    this.apiService.testimonials().subscribe((data: any) => {
      // console.log(data.data.rows);
      this.testimonialsarray = data.data;
      // console.log(this.section);
      this.cd.detectChanges();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.slidesToShow = (event.target as Window).innerWidth < 576 ? 3 : 5;
    this.slideConfig2 = { slidesToShow: this.slidesToShow, slidesToScroll: this.slidesToShow };
    this.slidesToShow3 = (event.target as Window).innerWidth < 576 ? 3 : 5;
    this.slideConfig3 = { slidesToShow: this.slidesToShow3, slidesToScroll: this.slidesToShow3 };
    this.slidesToShow4 = (event.target as Window).innerWidth < 576 ? 3 : 5;
    this.slideConfig4 = { slidesToShow: this.slidesToShow4, slidesToScroll: this.slidesToShow4 };
    this.slidesToShow5 = (event.target as Window).innerWidth < 576 ? 3 : 5;
    this.slideConfig5 = { slidesToShow: this.slidesToShow5, slidesToScroll: this.slidesToShow5 };
    this.slidesToTag = (event.target as Window).innerWidth < 576 ? 2 : 4;
    this.slideConfigTag = { slidesToShow: this.slidesToTag, slidesToScroll: this.slidesToTag };
    this.slideConfigTags = { slidesToShow: this.slidesToTags, slidesToScroll: this.slidesToTags };
    this.slidesToShow6 = (event.target as Window).innerWidth < 576 ? 6 : 12;
    this.slideConfig6 = { slidesToShow: this.slidesToShow6, slidesToScroll: this.slidesToShow6 };
  }

  //bridal collection
  bridalCollection() {
    this.apiService.bridalCollection().subscribe({
      next: (resp: any) => {
        // console.log('Bridal Collection', resp.data);
        this.bridalCollectionList = resp.data;
        this.cd.detectChanges();
      },
    });
  }

  // Exclusive collection
  exclusiveCollection() {
    this.apiService.exclusiveCollection().subscribe({
      next: (resp: any) => {
        // console.log(resp.data);
        this.exclusiveCollectionList = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  // New arrivals
  newArrivals() {
    this.apiService.newArrivalApi().subscribe({
      next: (resp: any) => {
        // console.log('New Arrivals', resp.data);
        this.newArrivalsList = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  //shop by saree type
  // getHomePageSubcategories(){
  //   this.apiService.getHomePageSubcategories().subscribe({
  //     next: (resp) => {
  //       // console.log(resp);
  //       this.listgetHomePageSubcategories = resp;
  //     },
  //   });
  // }

  //shop by categories
  getCategoriesFetch() {
    this.apiService.getCategoriesFetch().subscribe({
      next: (resp) => {
        // console.log(resp);
        this.listCategoriesFetch = resp?.data?.categories;
        // console.log(this.listCategoriesFetch);
        this.cd.detectChanges();
      },
    });
  }

  // Get all tags
  tags() {
    this.apiService.getAllTags().subscribe({
      next: resp => {
        // console.log(resp?.data?.datas);
        this.listTags = resp?.data?.datas;
        this.cd.detectChanges();
      }
    })
  }

  // Get all reels
  trendingRells() {
    this.apiService.getTrendingReels().subscribe({
      next: (resp: any) => {
        // console.log(resp?.data?.datas);
        this.listTrendingReels = resp?.data?.datas;
        // if (this.listTrendingReels.length === 5) {
        //   this.listTrendingReels = [...this.listTrendingReels, ...this.listTrendingReels];
        // }
        this.cd.detectChanges();
      },
    });
  }

  //get store
  getStore() {
    this.apiService.getStore().subscribe({
      next: (resp) => {
        // console.log(resp.data);
        this.listStore = resp.data;
        // if (this.listStore.length === 4) {
        //   this.listStore = [...this.listStore, ...this.listStore];
        // }
        this.cd.detectChanges();
      },
    });
  }

  //Brides Of Mugdha
  getBridesOfMugdha() {
    this.apiService.getBridesOfMugdha().subscribe({
      next: (resp) => {
        // console.log(resp);
        this.listBrides = resp;
      },
    });
  }

  // //Testimonials
  // getTestimonials(){
  //   this.apiService.getTestimonials().subscribe({
  //     next: (resp) => {
  //       console.log(resp);
  //       this.listTestimonial = resp;
  //     },
  //   });
  // }

  //category click

  categoryClick(catId: any) {
    // console.log(catId);
    this.route.navigate(['/product-list/category/' + catId])
  }

  playVideo(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.play();
    video.controls = false;
  }

  pauseVideo(event: Event): void {
    const video = event.target as HTMLVideoElement;
    video.pause();
    video.controls = false;
  }

  getSubcategory(uuid: any, type: any, title: any) {


    if (type === 'Group') {
      this.route.navigate(['/product-list/' + uuid])
    }
    if (type === 'Category') {
      this.route.navigate(['/category/' + uuid + '/' + title])
    }
    if (type === 'Tag') {
      this.route.navigate(['/tag/' + uuid])
    }

    // this.route.navigate(['/subcategory/' + uuid]);
    this.cd.detectChanges();
  }

  // Store List
  goToStoreList(id: any) {
    this.route.navigate(['/stores/' + id]);
    this.cd.detectChanges();
  }

  // Get tag with uuid
  getTagWithUUID(uuid: any) {
    // console.log(uuid);
    this.route.navigate(['/tag/' + uuid])
    this.cd.detectChanges();
    // this.apiService.getTagWithUUID(uuid).subscribe({
    //   next: resp => {
    //     console.log(resp);
    //   }
    // })
  }
  // Get tag with uuid
  getBlogWithUUID(uuid: any) {
    // console.log(uuid);
    this.route.navigate(['/blogs/' + uuid])
    this.cd.detectChanges();
    // this.apiService.getTagWithUUID(uuid).subscribe({
    //   next: resp => {
    //     console.log(resp);
    //   }
    // })
  }
  getEventWithUUID(event: any) {
    // console.log(event);
    this.route.navigate(['/live-events'])
    this.cd.detectChanges();
    // this.apiService.getTagWithUUID(uuid).subscribe({
    //   next: resp => {
    //     console.log(resp);
    //   }
    // })
  }
  getSingleProduct(uuid: any) {
    this.route.navigate(['/product/' + uuid])
    this.cd.detectChanges();
  }


  toggleWishlist(productId: any, type: any) {
    // Add logic here to handle adding/removing from wishlist
    // console.log(`Toggling wishlist status for product ID: ${productId}`);
    let token = localStorage.getItem('token');
    // console.log(uuid);
    if (token) {
      this.wishlist.addToWishlist(productId.uuid).subscribe((data) => {
        // console.log(data);
        this.wishlist.getWishlist().subscribe((data: any) => {
          // console.log(data.data);
          this.wishlist.addToWishlistCount(data.data.length);
          this.wishlist.setWishlistCount(data.data.length);
        });
        if (type === 'exclusive') this.exclusiveCollection()
        else if (type === 'bridal') this.bridalCollection()
        else this.newArrivals()
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
      this.trendingRells();
    } else {
      this.route.navigate(['/login']);
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
  }

  cart: any = [];
  count: any;
  addToCart(productId: any, itemsuuid: any, quantity: any) {
    const token = localStorage.getItem('token');
    if (token) {
      this.cartService.addToCart(productId, itemsuuid, quantity).subscribe(() => {
        // console.log('Product added to cart');
        this.cartService.cartItemAdded.emit();
        this.addToCartClicked = true;
        // this.cart.cartCount$.subscribe((count: any) => {
        //   this.count = count;

        // });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Added to Cart Successfully',
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
        this.trendingRells()
        // this.listTrendingReels = [...this.listTrendingReels];
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


  isCouponActive = false;
  toggleCoupon() {
    this.isCouponActive = !this.isCouponActive;
  }


  submitemail() {
    this.isSubmit = true;
    if (this.emailForm.invalid) {
      return
    }
    this.loginService.email(this.emailForm.value).subscribe({
      next: (data) => {
        if (data.status === 'error') {
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: data.message,
            showConfirmButton: false,
            width: '500px',
            timer: 2000,
            customClass: {
              popup: 'large-sa-popup',
            },
          });

        } else if (data.status === 'success') {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Subscribe successfully!',
            showConfirmButton: false,
            width: '500px',
            timer: 2000,
            customClass: {
              popup: 'large-sa-popup',
            },
          })
          // console.log('Subscribed with email:', this.email);
          const newsletterModal = bootstrap.Modal.getInstance(document.getElementById('newsletterModal')!);
          newsletterModal?.hide();
        }
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  getCoupon() {
    this.loginService.getCoupon().subscribe({
      next: resp => {
        // console.log('Coupon =>', resp.data);
        this.couponList = resp.data;
        this.cd.detectChanges();
      }
    })
  }

  deleteCartItem(item_uuid?: string) {
    const token = localStorage.getItem('token');
    if (token) {
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
            this.cartService.deleteCartItem(item_uuid).subscribe({
              next: resp => {
                console.log(resp);
                this.cartService.cartItemAdded.emit();
                this.addToCartClicked = true;
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: `${resp.message}`,
                  showConfirmButton: false,
                  width: '500px',
                  timer: 2000,
                  customClass: {
                    popup: 'large-sa-popup',
                  },
                });
              },
              error: err => {
                console.log(err);
              }
            })
            this.trendingRells();
          }
        });
      }
    }
    else {
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
}
