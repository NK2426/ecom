import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchQuery: string = '';
  searchResults: any[] = [];
  currentPage = 0;
  pageSize = 20;
  count = 0;
  page: number = 0;
  sizes = [20];
  size: number = 20;
  pageSizes = [20];
  eventData: boolean = true;
  filterClear: boolean = false;
  showFilters: boolean = false;
  allFilters: any;
  pricefilter: any;
  discount: any;
  brands: any;
  rating: any;
  selectedPrices: number[] = [];
  selectedDiscounts: number[] = [];
  filterClicked: boolean = false;
  variant_id: any[] = [];
  defaultSortOption: string | null = 'pop';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private router: Router,
    private wishlist: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'];
      this.performSearch(this.searchQuery);
    });
    this.getColorFilter();
  }

  performSearch(query: string) {
    this.searchService.searchlist(query).subscribe({
      next: (resp) => {
        this.searchResults = resp.data.datas;
        this.count = resp.data.totalItems || 0;
        this.eventData = this.count > 0;
      },
      error: (err) => {
        console.error('Error performing search:', err);
      },
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getColorFilter() {
    this.searchService.getfilter().subscribe({
      next: (data) => {
        this.allFilters = data.data;
        this.pricefilter = this.allFilters.pricefilter?.map((item: any) => ({
          ...item,
          selected: false,
        })) || [];
        this.discount = this.allFilters.discount?.map((item: any) => ({
          ...item,
          selected: false,
        })) || [];
        this.rating = this.allFilters.rating?.map((item: any) => ({
          ...item,
          selected: false,
        })) || [];
      },
      error: (err) => {
        console.error('Error fetching filters:', err);
      },
    });
  }

  clearFilter() {
    this.pricefilter.forEach((price: { selected: boolean }) => (price.selected = false));
    this.discount.forEach((discount: { selected: boolean }) => (discount.selected = false));
    this.rating.forEach((rate: { selected: boolean }) => (rate.selected = false));
    this.defaultSortOption = 'pop';
    this.updateSelectedValues();
  }

  isFilterApplied(): boolean {
    return (
      this.pricefilter?.some((price: { selected: any }) => price.selected) ||
      this.discount?.some((discount: { selected: any }) => discount.selected) ||
      this.rating?.some((rate: { selected: any }) => rate.selected)
    );
  }

  getProducts(slug: any) {
    this.router.navigate(['/product/' + slug]);
  }

  onSortChange(event: any) {
    this.defaultSortOption = event.target.value;
    this.updateSelectedValues();
    this.paginator.firstPage();
  }

  handlePageChange(event: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = event.pageIndex;

    let params: any = {
      search: this.searchQuery,
      page: this.currentPage,
    };

    this.searchService.PaginationProducts(params).subscribe({
      next: (resp) => {
        this.searchResults = resp.data.datas;
        this.count = resp.data.totalItems || 0;
        this.eventData = this.count > 0;
      },
      error: (err) => {
        console.error('Error with pagination:', err);
      },
    });
  }

  updateSelectedValues(): void {
    this.filterClear = true;
    this.filterClicked = true;
    this.selectedPrices = this.getSelectedValues(this.pricefilter, true);
    this.selectedDiscounts = this.getSelectedValues(this.discount, true);

    let params = new URLSearchParams();
    params.set('search', this.searchQuery);

    if (this.selectedPrices.length) {
      params.set('price', this.selectedPrices.join(','));
    }

    if (this.selectedDiscounts.length) {
      params.set('discount', this.selectedDiscounts.join(','));
    }

    if (this.defaultSortOption) {
      params.set('sortby', this.defaultSortOption);
    }

    params.set('page', this.currentPage.toString());

    this.searchService.getFilteredProducts(params).subscribe((data: any) => {
      this.searchResults = data?.data?.datas
      this.count = data.data.totalItems || 0;
      this.eventData = true;
    });
  }

  getSelectedValues(filterArray: any[], isPriceOrDiscount: boolean = false): number[] {
    let selectedValues: number[] = [];
    filterArray?.forEach((filter) => {
      if (isPriceOrDiscount) {
        if (filter.selected) {
          selectedValues.push(filter.price || filter.discount);
        }
      }
    });
    return selectedValues;
  }

  toggleWishlist(productId: any) {
    let token = localStorage.getItem('token');
    if (token) {
      this.wishlist.addToWishlist(productId.uuid).subscribe((data) => {
        this.wishlist.getWishlist().subscribe((data: any) => {
          this.wishlist.addToWishlistCount(data.data.length);
          this.wishlist.setWishlistCount(data.data.length);
        });
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${data.message}`,
          showConfirmButton: false,
          width: '500px',
          timer: 2000,
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
      });
    }
  }
}
