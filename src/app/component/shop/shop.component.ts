import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { GroupItems,Products } from 'src/app/model/grouplist';
import {ApiserviceService} from 'src/app/services/apiservice.service'

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

grupItems!: Products[];
products!: Products[];
currentPage = 0;
pageSize = 20;
count = 0;
pageSizes = [20];
eventData: Boolean = true

constructor(private group: ApiserviceService, private router : Router, private route: ActivatedRoute, private cd: ChangeDetectorRef){}

ngOnInit(){
this.getGroups()
}

getGroups(){
  this.group.productsList().subscribe((data)=>{
      if (data.data.totalItems) {
        this.count = data.data.totalItems;
      }
      if (data.data.totalItems == 0) this.eventData = false
   
    this.products = data.data.datas  
    this.cd.detectChanges()
  })
}


getProducts(slug:any){
  this.router.navigate(['/product/'+ slug])
}
handlePageChange(event: any): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  this.currentPage = event.pageIndex;

  let params: any = {
    page: this.currentPage,
  };

  const uuid = this.route.snapshot.paramMap.get('id');
  this.group.PaginationProducts( this.currentPage).subscribe({
    next: resp => {
      this.grupItems = resp.data.datas;
      if (resp.data.totalItems) {
        this.count = resp.data.totalItems;
      }
      if (resp.data.totalItems == 0) this.eventData = false
      // this.applySorting(); // Reapply sorting after getting new data
    }
  });
}

}
