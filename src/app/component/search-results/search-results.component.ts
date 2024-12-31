import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';

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
  pageSizes = [20];
  eventData: Boolean = true
  constructor(private route: ActivatedRoute, private searchService: SearchService, private router: Router,) { }

  ngOnInit(): void {
    // console.log('inside search');
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'];
      this.performSearch(this.searchQuery);
    });
  }

  performSearch(query: string) {
    this.searchService.searchlist(query).subscribe({
      next: (resp) => {
        this.searchResults = resp.data.datas;
        if (resp.data.totalItems) {
          this.count = resp.data.totalItems;
        }
        if (resp.data.totalItems == 0) this.eventData = false
      },
      error: (err) => {
        // console.error(err);
      }
    });
  }
  getProducts(slug: any) {
    this.router.navigate(['/product/' + slug])
  }
  handlePageChange(event: any): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.currentPage = event.pageIndex;

    let params: any = {
      search: this.searchQuery,
      page: this.currentPage,
    };

    this.searchService.PaginationProducts(params).subscribe({
      next: resp => {
        this.searchResults = resp.data.datas;
        if (resp.data.totalItems) {
          this.count = resp.data.totalItems;
        }
        if (resp.data.totalItems == 0) this.eventData = false
        // this.applySorting(); // Reapply sorting after getting new data
      }
    });
  }
}
