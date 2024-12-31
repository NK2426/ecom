import { Component, ElementRef, OnDestroy, Renderer2, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router, Event } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import * as bootstrap from 'bootstrap';
import { filter } from 'rxjs';
import { CustomService } from 'src/app/services/custom.service';
import { ProductListComponent } from 'src/app/component/product-list/product-list.component';
import { TagWithIdComponent } from 'src/app/component/tag-with-id/tag-with-id.component';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnDestroy {

  private navigationSubscription: any;

  searchProduct: any
  searchProducts!: any[];
  bootstrap: any;


  constructor(private router: Router, private search: SearchService, private renderer: Renderer2, private el: ElementRef, public clickedStateService: CustomService, private productList: ProductListComponent, private cd: ChangeDetectorRef, private tagComponent: TagWithIdComponent) {
    this.navigationSubscription = this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Route change detected, close the modal
      this.closeModal();
    });

    this.renderer.listen('window', 'click', (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.className !== 'search-results') {
        this.clearSearchInput();
      }
    });
  }

  onSearchChange(event: any) {
    const searchTerm = event.trim();
    if (searchTerm !== '') {
      this.searchInput(searchTerm);
    } else {
      this.searchProducts = [];
      // console.log(this.searchProducts);
    }
  }

  refresh() {
    if (this.router.url === '/') {
      window.location.reload();
    }
  }
  onEnterPressed() {
    if (this.searchProduct.trim()) {
      this.router.navigate(['/search-results'], { queryParams: { search: this.searchProduct } });
      this.clearSearchInput(); // Clear the input and results after redirecting
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

    this.searchProduct = '';
    this.searchProducts = [];
    const closeButton = document.querySelector('#modalCloseButton') as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }


  searchInput(value: string) {
    this.search.search(value).subscribe(resp => {
      // console.log(resp);
      this.searchProducts = resp.data;
    }, error => {
      console.error(error);
    });
  }
  ngOnDestroy() {
    // Ensure to unsubscribe from the router events to prevent memory leaks
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  closeModal() {
    // Simulate modal close event
    const closeButton = document.querySelector('#modalCloseButton') as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }

  }




}
