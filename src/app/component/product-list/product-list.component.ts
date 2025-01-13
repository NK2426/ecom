



import { Component, Injectable, Input, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiserviceService } from '../../services/apiservice.service';
import { ProductDetails } from '../../model/products';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';
import { OffersService } from 'src/app/services/offers.service';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { MatPaginator } from '@angular/material/paginator';
import { ProductsService } from 'src/app/services/products.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SubcategoryData } from 'src/app/model/subcategories';
import Swal from 'sweetalert2';
import { EventService } from 'src/app/services/event.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class ProductListComponent implements OnInit {

  selectedSubcategoryId!: string;
  listProduct?: ProductDetails[];
  id!: any;
  subCategory_name: any;
  search = '';
  currentPage = 0;
  pageSize = 20;
  count = 0;
  pageSizes = [20];
  showFilters: boolean = false;
  subcat!: string;
  listCatgoryFilter: SubcategoryData[] = [];

  selectedVariants: number[] = [];
  selectedPrices: number[] = [];
  selectedDiscounts: number[] = [];
  selectedBrands: number[] = [];
  selectedParameters: number[] = [];
  selectedFilter: number[] = [];

  private eventSubscription!: Subscription;
  filterClicked: boolean = false;
  private routerSubscription!: Subscription;
  variants: any;
  parameter: any;
  pricefilter: any;
  discount: any;
  brands: any;


  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiserviceService, private offer: OffersService, private wishlist: WishlistService,
    private route: Router, private router: ActivatedRoute, private subcategory: SubcategoryService, private productsservice: ProductsService,
    private cd: ChangeDetectorRef, private eventService: EventService) { }

  onSubcategorySelected(subcategoryId: string) {
    this.selectedSubcategoryId = subcategoryId;
    // console.log(this.selectedSubcategoryId);
    // this.listSubCatProd();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedSubcategoryId']) {
      // this.listSubCatProd();
    }
  }

  getRequestParams(search: string, currentPage: number, pageSize: number): any {
    let params = { 'search': '', 'currentPage': currentPage, 'pageSize': pageSize };
    if (search)
      params['search'] = search;
    if (currentPage)
      params['currentPage'] = currentPage;
    if (pageSize)
      params['pageSize'] = pageSize;
    return params;
  }

  ngOnInit(): void {
    this.eventSubscription = this.eventService.getEvent().subscribe((data) => {
      this.handleEvent(data);
    });
    this.id = this.router.snapshot.paramMap.get('id');
    // console.log(this.id);
    this.list(this.id);
    this.getColorFilter(this.id)
    this.router.url.subscribe((urlSegments: any) => {
      // Check if the route matches '/offers/someid'
      if (urlSegments.length > 0 && urlSegments[0].path === 'offers' && this.router.snapshot.paramMap.has('id')) {
        this.subCategory_name = 'Offer Products'
        // this.getOfferItems();
      }
    });

    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Reset the default sort option when the route changes
        this.defaultSortOption = '';
      }
    });
  }

  subcategoryName: string = '';
  getProductListUUID(uuid: any) {
    this.filterClicked = false;
    this.getColorFilter(uuid)
    this.apiService.getSubcatProducts(uuid).subscribe({
      next: resp => {
        // console.log(resp);

        this.subcategoryName = resp?.data.name;
        // console.log(this.subcategoryName)
        this.listProduct = resp?.data?.datas;
        // console.log(this.listProduct);
        if (resp.data.totalItems) {
          this.count = resp.data.totalItems;
        }
        if (resp.data.totalItems == 0) this.eventData = false
        this.subCategory_name = resp.data.datas[0].subCategory
      }
    })
    this.cd.detectChanges();
  }



  ngAfterViewInit(): void {
    this.router.url.subscribe((urlSegments: any) => {
      // Check if the route matches '/offers/someid'
      if (urlSegments.length > 0 && urlSegments[0].path === 'offers' && this.router.snapshot.paramMap.has('id')) {
        this.subCategory_name = 'Offer Products'
        // this.getOfferItems();
      }
    });

    this.route.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Reset the default sort option when the route changes
        this.defaultSortOption = '';
      }
    });

  }

  defaultSortOption: string | null = 'pop';
  // defaultSortOption: string = ''; 
  sortProducts(event: MatSelectChange): void {
    this.defaultSortOption = event.value;
    this.currentPage = 1;
    this.applySorting();
    this.paginator.firstPage();
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
  toggleWishlist(productId: any) {
    // Add logic here to handle adding/removing from wishlist
    // console.log(`Toggling wishlist status for product ID: ${productId}`);
    let token = localStorage.getItem('token');
    // console.log(uuid);
    if (token) {
      this.wishlist.addToWishlist(productId).subscribe((data) => {
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
    let urlparam = this.router.snapshot.paramMap.get('id')
    this.subcategory.getSubSortCategories(urlparam, params).subscribe((data: any) => {
      this.listProduct = data.data.datas;
      if (data.data.totalItems) {
        this.count = data.data.totalItems;
      }
    })
  }

  allFilters: any;

  getColorFilter(uuid: any) {
    this.apiService.getColorsVariants(uuid).subscribe({
      next: data => {
        // console.log(data);
        this.allFilters = data.data
        this.variants = data.data.variant.map((item: any) => {
          item.productvariantvalues = item.productvariantvalues.map((val: any) => ({
            ...val,
            selected: false
          }));
          return item;
        });

        this.parameter = data.data.parameter.map((item: any) => {
          item.parametervalues = item.parametervalues.map((val: any) => ({
            ...val,
            selected: false
          }));
          return item;
        });

        this.pricefilter = data.data.pricefilter.map((item: any) => ({
          ...item,
          selected: false
        }));

        // console.log(this.pricefilter);
        this.discount = data.data.discount.map((item: any) => ({
          ...item,
          selected: false
        }));

        this.brands = data.data.brands.map((item: any) => ({
          ...item,
          selected: false
        }));

        // console.log(this.variants);
      }
    });
  }

  clearFilter() {
    // Reset all filters to false or null
    this.variants.forEach((variant: { productvariantvalues: any[]; }) => {
      variant.productvariantvalues.forEach((value: { selected: boolean; }) => value.selected = false);
    });

    this.parameter.forEach((param: { parametervalues: any[]; }) => {
      param.parametervalues.forEach((value: { selected: boolean; }) => value.selected = false);
    });

    this.pricefilter.forEach((price: { selected: boolean; }) => price.selected = false);

    this.discount.forEach((discount: { selected: boolean; }) => discount.selected = false);

    this.brands.forEach((brand: { selected: boolean; }) => brand.selected = false);
    this.defaultSortOption = 'pop'

    // Call update function to reflect changes
    this.updateSelectedValues();
  }
  isFilterApplied(): boolean {
    return this.variants?.some((variant: { productvariantvalues: any[]; }) => 
      variant.productvariantvalues.some((value: { selected: any; }) => value.selected)) ||
      this.parameter?.some((param: { parametervalues: any[]; }) => 
        param.parametervalues.some((value: { selected: any; }) => value.selected)) ||
      this.pricefilter?.some((price: { selected: any; }) => price.selected) ||
      this.discount?.some((discount: { selected: any; }) => discount.selected) 
  }

  filterClear: boolean = false;
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

    

    const urlparam = this.router.snapshot.paramMap.get('id');
    this.apiService.getFilteredProducts(urlparam, params).subscribe((data: any) => {
      // console.log(data);
      this.listProduct = data?.data?.datas || [];
      this.count = data.data.totalItems || 0;
      this.cd.detectChanges()
      this.eventData = true;
    });
  }

  variant_id: any = []
  getSelectedValues(filterArray: any[], valueKey?: string, isPriceOrDiscount: boolean = false): number[] {
    let selectedValues: number[] = [];

    filterArray.forEach(filter => {
      if (isPriceOrDiscount) {
        // Handle price and discount arrays
        if (filter.selected) {
          selectedValues.push(filter.price || filter.discount || filter.bid); // Use the appropriate property
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




  handlePageChange(event: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = event.pageIndex;

    let params: any = {
      page: this.currentPage,
    };

    const uuid = this.router.snapshot.paramMap.get('id');
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

  eventData: Boolean = true

  handleEvent(data: any): void {
    // Handle the event data here
    this.eventData = data.filter
    // console.log('Received event data:', data.filter);
  }
  list(id: any) {
    if (this.id) {
      this.apiService.getSubcatProducts(id).subscribe({
        next: resp => {
          // console.log(resp);
          this.subcategoryName = resp?.data.name;
          this.listProduct = resp?.data?.datas;
          if (resp.data.totalItems) {
            this.count = resp.data.totalItems;
            // console.log(this.count);
          }

          if (resp.data.totalItems == 0) this.eventData = false
          this.subCategory_name = resp.data.datas[0].subCategory
        }
      })
      // console.log("event", this.eventData);
    } else {
      const params = this.getRequestParams(this.search, this.currentPage, this.pageSize)
      this.apiService.getProducts(params).subscribe({

        next: resp => {
          // console.log(resp);
          this.listProduct = resp.data.datas;
          if (resp.data.totalItems) {
            this.count = resp.data.totalItems;
            // console.log(this.count);
          }
        }
      })
      this.subCategory_name = 'All Products'
    }
  }

  //sepperate product (single product)
  getProduct(item: any) {
    this.route.navigate(['/product/' + item])
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

}
