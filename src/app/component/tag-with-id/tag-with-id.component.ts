import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, AfterContentChecked, AfterContentInit, DoCheck, OnChanges, Injectable, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, Subscription, takeUntil } from 'rxjs';
import { ProductDetails } from 'src/app/model/products';
import { Tag } from 'src/app/model/tags';
import { ApiserviceService } from 'src/app/services/apiservice.service';
import { TagService } from 'src/app/services/tags.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tag-with-id',
  templateUrl: './tag-with-id.component.html',
  styleUrls: ['./tag-with-id.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable({
  providedIn: 'root'
})
export class TagWithIdComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private tagService: TagService, private wishlist: WishlistService,
    private apiService: ApiserviceService,
  ) {
  }

  listTag: Tag[] = [];
  tagName: string = '';
  uuid: any = '';

  // Accordian-----------
  tabName = "new";
  productName!: string;
  totalItems: number = 0;
  page: number = 0;
  size: number = 20;
  sizes = [20];
  pageFilter = {} as any;
  private routeSubscription$!: Subscription;
  tagItemUUID!: any;
  tagPageProductResponse!: any;
  filterResponse!: any;
  private unsubscribe$ = new Subject();

  variants: any;
  parameter: any;
  pricefilter: any;
  discount: any;
  brands: any;
  rating: any;
  filterClear: boolean = false;

  selectedVariants: number[] = [];
  selectedPrices: number[] = [];
  selectedDiscounts: number[] = [];
  selectedBrands: number[] = [];
  selectedParameters: number[] = [];
  selectedFilter: number[] = [];

  listProduct?: ProductDetails[];
  count = 0;

  showFilters: boolean = false;

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('id');
    // console.log(this.uuid);
    this.getTagWithUUID(this.uuid);
    this.getColorFilter(this.uuid);
    console.log(this.uuid)
    // this.cd.detectChanges();
  }

  get startItemIndex(): number {
    return (this.page) * this.size + 1;
  }

  get endItemIndex(): number {
    const endIndex = (this.page + 1) * this.size;
    return endIndex > this.totalItems ? this.totalItems : endIndex;
  }

  allFilters: any;
  getColorFilter(uuid: any) {
    this.tagService.getColorsVariantsTag(uuid).subscribe({
      next: data => {
        console.log(data);
        this.allFilters = data.data
        if (data.data.variant) {
          this.variants = data?.data?.variant?.map((item: any) => {
            item.productvariantvalues = item.productvariantvalues.map((val: any) => ({
              ...val,
              selected: false
            }));
            console.log(this.variants)
            return item;
          });
        }

        if (data.data.parameter) {
          this.parameter = data.data.parameter.map((item: any) => {
            item.parametervalues = item.parametervalues.map((val: any) => ({
              ...val,
              selected: false
            }));
            return item;
          });
        }

        if (data.data.pricefilter) {
          this.pricefilter = data.data.pricefilter.map((item: any) => ({
            ...item,
            selected: false
          }));
        }

        if (data.data.discount) {
          // console.log(this.pricefilter);
          this.discount = data.data.discount.map((item: any) => ({
            ...item,
            selected: false
          }));
        }

        if (data.data.brands) {
          this.brands = data.data.brands.map((item: any) => ({
            ...item,
            selected: false
          }));
        }

        if (data.data.rating) {
          this.rating = data.data.rating.map((item: any) => ({
            ...item,
            selected: false
          }));
        }

        // console.log(this.variants);
      }
    });
  }

  clearFilter() {
    // this.variants.forEach((variant: { productvariantvalues: any[]; }) => {
    //   variant.productvariantvalues.forEach((value: { selected: boolean; }) => value.selected = false);
    // });
    // this.parameter.forEach((param: { parametervalues: any[]; }) => {
    //   param.parametervalues.forEach((value: { selected: boolean; }) => value.selected = false);
    // });

    this.pricefilter.forEach((price: { selected: boolean; }) => price.selected = false);

    this.discount.forEach((discount: { selected: boolean; }) => discount.selected = false);

    // this.brands.forEach((brand: { selected: boolean; }) => brand.selected = false);
    this.defaultSortOption = 'pop'

    this.rating.forEach((rate: { selected: boolean; }) => rate.selected = false);

    // Call update function to reflect changes
    this.updateSelectedValues();
  }

  isFilterApplied(): boolean {
    return this.pricefilter?.some((price: { selected: any; }) => price.selected) ||
           this.discount?.some((discount: { selected: any; }) => discount.selected) ||
           this.rating?.some((rate: { selected: any; }) => rate.selected);
  }
  

  filterClicked: boolean = false;
  variant_id: any = [];
  defaultSortOption: string | null = 'pop';
  currentPage = 0;
  eventData: Boolean = true
  updateSelectedValues(): void {
    this.filterClear = true;
    this.filterClicked = true;
    this.selectedVariants = this.getSelectedValues(this.variants, 'productvariantvalues');
    this.selectedParameters = this.getSelectedValues(this.parameter, 'parametervalues');
    this.selectedPrices = this.getSelectedValues(this.pricefilter, undefined, true);
    this.selectedDiscounts = this.getSelectedValues(this.discount, undefined, true);
    this.selectedBrands = this.getSelectedValues(this.brands, undefined, true);

    let params = new URLSearchParams();

    if (this.selectedVariants.length) {
      params.set('variant', this.selectedVariants.join(','));
      params.set('variant_id', this.variant_id.join(','));
    }

    if (this.selectedPrices.length) {
      params.set('price', this.selectedPrices.join(','));
    }

    if (this.selectedDiscounts.length) {
      params.set('discount', this.selectedDiscounts.join(','));
    }

    if (this.selectedBrands.length) {
      params.set('brands', this.selectedBrands.join(','));
    }

    if (this.selectedParameters.length) {
      params.set('parameter', this.selectedParameters.join(','));
    }

    // Add sort option to params
    if (this.defaultSortOption) {
      params.set('sortby', this.defaultSortOption);
    }

    if (this.filterClicked) {
      this.currentPage = 0;
      params.set('page', this.currentPage.toString());
    } else {
      params.set('page', this.currentPage.toString());
    }

    // Add currentPage to params


    const urlparam = this.route.snapshot.paramMap.get('id');
    this.tagService.getFilteredProductsbtTag(urlparam, params).subscribe((data: any) => {
      console.log(data);
      this.listTag = data?.data;
      this.count = data.data.totalItems || 0;
      this.cd.detectChanges()
      this.eventData = true;
    });
  }


  getSelectedValues(filterArray: any[], valueKey?: string, isPriceOrDiscount: boolean = false): number[] {
    let selectedValues: number[] = [];
    filterArray?.forEach(filter => {
      if (isPriceOrDiscount) {
        // Handle price and discount arrays
        if (filter.selected) {
          selectedValues.push(filter.price || filter.discount ); // Use the appropriate property
        }
      } else {
        // Handle variants and parameters
        if (valueKey) {
          this.variant_id.push(filter.id)
          filter[valueKey].forEach((value: any) => {
            if (value.selected) {
              selectedValues.push(value.id || value.value); // Adjust according to your data structure
            }
          });
        } else {
          if (filter.selected) {
            selectedValues.push(filter.id || filter.value); // Adjust according to your data structure
          }
        }
      }
    });
    return selectedValues;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSortChange(event: any) {
    console.log(event.target.value)
    // Swal.fire({
    //   position: 'top-end',
    //   icon: 'success',
    //   title: `Filtered Successfully`,
    //   showConfirmButton: false,
    //   width: '500px',
    //   timer: 500,
    //   customClass: {
    //     popup: 'large-sa-popup',
    //   },
    // });
    this.defaultSortOption = event.target.value;
    // this.applySorting();
    this.updateSelectedValues()
    this.paginator.firstPage();
  }

  handlePageChange(event: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = event.pageIndex;

    let params: any = {
      page: this.currentPage,
    };

    const uuid = this.route.snapshot.paramMap.get('id');
    this.apiService.getPaginationProducts(uuid, this.currentPage).subscribe({
      next: resp => {
        this.listProduct = resp.data.datas;
        if (resp.data.totalItems) {
          this.count = resp.data.totalItems;
        }

        this.applySorting(); // Reapply sorting after getting new data
      }
    });
  }

  applySorting(): void {
    // console.log(this.selectedSubcategoryId);
    let params: any = {
      page: this.currentPage,
    };
    if (this.defaultSortOption) {
      // Map the sort option to the correct API parameter
      if (this.defaultSortOption === 'priceLH') {
        params.sortby = 'priceLH';
      } else if (this.defaultSortOption === 'priceHL') {
        params.sortby = 'priceHL';
      } else if (this.defaultSortOption === 'new') {
        params.sortby = 'new'; // Assuming 'new' is a valid sort option for your API
      }
    }
    let urlparam = this.route.snapshot.paramMap.get('id')
    // this.subcategory.getSubSortCategories(urlparam, params).subscribe((data: any) => {
    //   this.listProduct = data.data.datas;
    //   if (data.data.totalItems) {
    //     this.count = data.data.totalItems;
    //   }
    // })
  }











  convertObjectToQueryParam(): string {
    if (!Object.keys(this.pageFilter).length) return '';
    return Object.keys(this.pageFilter).map(key => {
      return `&${key}=${this.pageFilter[key].join(',')}`;
    }).join('');
  }


  getFilterResponse() {
    if (this.filterResponse) return Object.keys(this.filterResponse).length;
    else return null;
  }

  addProperties(response: any): void {
    if (!response) {
      return response;
    }

    // Add properties to productvariantvalues

    response["variant"]?.forEach((param: any) => {
      param.productvariantvalues?.forEach((paramValue: any) => {
        paramValue['name'] = paramValue['value'];
        paramValue['apiKey'] = 'variant';
      });
    });

    // Add properties to parametervalues
    response["parameter"]?.forEach((param: any) => {
      param.parametervalues?.forEach((paramValue: any) => {
        paramValue['name'] = paramValue['value'];
        paramValue['apiKey'] = 'parameter';
      });
    });

    // Add properties to pricefilter
    response["pricefilter"]?.forEach((price: any) => {
      price['id'] = price['price'];
      price['apiKey'] = 'price';
    });

    // Add properties to discount
    response["discount"]?.forEach((discount: any) => {
      discount['id'] = discount['discount'];
      discount['apiKey'] = 'discount';
    });

    // Add properties to brands
    response["brands"]?.forEach((brand: any) => {
      brand['id'] = brand['bid'];
      brand['apiKey'] = 'brands';
    });

    // Add properties to rating
    response["rating"]?.forEach((rating: any) => {
      rating['id'] = rating['rating'];
      rating['apiKey'] = 'rating';
    });

    return response;
  }

  resetPagination() {
    this.page = 0;
    this.size = 20;
    this.totalItems = 0;
  }

  getTagWithUUID(uuid: any) {
    // this.uuid = this.route.snapshot.paramMap.get('id');
    // console.log(this.uuid);
    this.tagService.getTagWithUUID(uuid).subscribe({
      next: (resp: any) => {
        // console.log(resp)
        this.listTag = resp.data;
        this.tagName = resp.name;
        console.log(this.tagName)
        this.cd.detectChanges();
      }
    })
    // this.cd.detectChanges();
  }

  // ngAfterViewInit(): void {
  //   this.uuid = this.route.snapshot.paramMap.get('id');
  //   console.log(this.uuid);
  //   this.tagService.getTagWithUUID(this.uuid).subscribe({
  //     next: (resp: any) => {
  //       this.listTag = resp.data;
  //       this.tagName = resp.name;
  //       console.log(this.listTag);
  //       this.cd.detectChanges();
  //     }
  //   })
  //   // this.cd.detectChanges();
  // }

  productDetails(uuid: any) {
    // console.log(uuid);
    this.router.navigate(['/product/' + uuid]);
    this.cd.detectChanges();
  }
  toggleWishlist(productId: any) {
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
        this.getTagWithUUID(this.uuid);
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
  }

}
