import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent {
  id: any;
  storeListByState: any;

  constructor(private apiservice: ApiserviceService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.getStoresByState();
  }

  getStoresByState() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.apiservice.getStoreByState(this.id).subscribe((data: any) => {
      // console.log(data);
      this.storeListByState = data.data
    })
  }

  viewStoreProducts(storeId:any){
    this.router.navigate(['/store-products/'+storeId]);
  }

}
