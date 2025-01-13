import { Component, Injectable, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiserviceService } from '../../services/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetails, Data, Product } from '../../model/products';
import { Subcategory, SubcategoryList } from '../../model/subcategories';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs/internal/Subscription';
import { Subject } from 'rxjs';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';

// @Injectable({providedIn:'root'})

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

@Injectable({
  providedIn: 'root'
})

export class ProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private cd: ChangeDetectorRef, private productService: ProductsService, private route: Router, private router: ActivatedRoute, private wishlist: WishlistService,) { }

  listAllProudct: ProductDetails[] = [];
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

  filterClicked: boolean = false;
  variant_id: any = [];
  defaultSortOption: string | null = 'pop';
  currentPage = 0;
  eventData: Boolean = true
  count = 0;

  showFilters: boolean = false;
  id!: any;
  tagName: string = '';
  uuid: any = '';
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


  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');


    this.getall(this.id);
    this.getColorFilter()
    this.cd.detectChanges();
  }


  getall(id: any) {
    this.productService.getAllProudctList(id).subscribe({
      next: resp => {
        // console.log(resp);
        this.listAllProudct = resp.data?.datas;
        this.cd.detectChanges();
      }
    })
  }
  get startItemIndex(): number {
    return (this.page) * this.size + 1;
  }

  get endItemIndex(): number {
    const endIndex = (this.page + 1) * this.size;
    return endIndex > this.totalItems ? this.totalItems : endIndex;
  }


  allFilters: any;
  getColorFilter() {
    this.productService.getColorsVariantsTag().subscribe({
      next: data => {
        console.log(data);
        this.allFilters = data.data


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
    this.productService.getFilteredProductsbtTag(urlparam, params).subscribe((data: any) => {
      console.log(data);
      this.listAllProudct = data?.data.datas;
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
          selectedValues.push(filter.price || filter.discount); // Use the appropriate property
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

    const uuid = this.router.snapshot.paramMap.get('id');
    this.productService.getPaginationProducts(uuid, this.currentPage).subscribe({
      next: resp => {
        this.listAllProudct = resp.data.datas;
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
    let urlparam = this.router.snapshot.paramMap.get('id')
    // this.subcategory.getSubSortCategories(urlparam, params).subscribe((data: any) => {
    //   this.listProduct = data.data.datas;
    //   if (data.data.totalItems) {
    //     this.count = data.data.totalItems;
    //   }
    // })
  }


  getAllStores(slug: any) {
    this.productService.getAllProudctList(slug).subscribe({
      next: resp => {
        // console.log(resp);
        this.listAllProudct = resp.data?.datas;
        this.cd.detectChanges();
      }
    })
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
        this.getall(this.id);
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

  productDetails(uuid: any) {
    // console.log(uuid);
    this.route.navigate(['/product/' + uuid]);
    this.cd.detectChanges();
  }
}
