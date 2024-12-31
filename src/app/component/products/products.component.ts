import { Component, EventEmitter, Injectable, Input, OnInit, Output, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ApiserviceService } from '../../services/apiservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetails, Data, Product } from '../../model/products';
import { Subcategory, SubcategoryList } from '../../model/subcategories';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { ProductsService } from 'src/app/services/products.service';

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

export class ProductsComponent implements OnInit, AfterViewInit {
  constructor(private cd: ChangeDetectorRef, private productService: ProductsService, private route: Router, private router: ActivatedRoute) { }

  listAllProudct: ProductDetails[] = [];
  id!: any;

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    this.productService.getAllProudctList(this.id).subscribe({
      next: resp => {
        // console.log(resp);
        this.listAllProudct = resp.data?.datas;
        this.cd.detectChanges();
      }
    })
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.productService.getAllProudctList(this.id).subscribe({
      next: resp => {
        // console.log(resp);
        this.listAllProudct = resp.data?.datas;
        this.cd.detectChanges();
      }
    })
    this.cd.detectChanges();
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

  productDetails(uuid: any) {
    // console.log(uuid);
    this.route.navigate(['/product/' + uuid]);
    this.cd.detectChanges();
  }
}
