import { Component, EventEmitter, inject, Injectable, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ApiserviceService } from '../../services/apiservice.service';


@Component({
  selector: 'app-mobile-category-dialog',
  templateUrl: './mobile-category-dialog.component.html',
  styleUrls: ['./mobile-category-dialog.component.css']
})
export class MobileCategoryDialogComponent {

  posts: any;
  listProduct: any;
  panelOpenState = false;

  @Output() subcategorySelected = new EventEmitter<string>();

  constructor(private apiService: ApiserviceService, public dialog: MatDialog, private dialogRef: MatDialogRef<MobileCategoryDialogComponent>) { }

  ngOnInit() {
    // this.list()
  }

  // list(){
  //   this.apiService.getCategories().subscribe(data => {
  //     this.posts = data
  //     console.log('Fetched data:', data);
  //     console.log(this.posts.data)
  //     this.listProduct = this.posts.data;
  //     console.log(this.listProduct);

  //   },
  //   error => {
  //     console.error('Error fetching data:', error);
  //   });
  // }

  getSubcatList(subcategoryId: any) {
    this.subcategorySelected.emit(subcategoryId);
    // console.log(subcategoryId);
    this.dialogRef.close();
  }

}
