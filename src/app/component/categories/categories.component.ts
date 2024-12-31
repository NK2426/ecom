


import { Component, HostListener, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiserviceService } from '../../services/apiservice.service';
import { MatDialog } from '@angular/material/dialog';
import { MobileCategoryDialogComponent } from '../../layout/mobile-category-dialog/mobile-category-dialog.component';
import { CategoryList } from '../../model/categories';
import { SubcategoryService } from '../../services/subcategory.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit {
  @Output() subcategorySelected = new EventEmitter<string>();

  panelOpenState = false;
  activeLink: string = '';
  isFixed: boolean = false;
  // fixedPosition: number = 305; // Position from the top where the element becomes fixed
  // triggerPoint: number = 1500; // Scroll position where the element stops scrolling

  fixedPosition: number = 305;
  triggerPoint: number = 400;
  posts: any;
  listProduct?: any;

  @HostListener('window:scroll', [])
  onScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!this.isFixed && scrollPosition >= this.fixedPosition) {
      this.isFixed = true;
    } else if (this.isFixed && scrollPosition < this.fixedPosition) {
      this.isFixed = false;
    }
    if (this.isFixed && scrollPosition >= this.triggerPoint) {
      // const distanceToScroll = scrollPosition - 1300;
      const distanceToScroll = scrollPosition - 200;
      const fixedElement = document.getElementById('yourFixedElementId');
      if (fixedElement) {
        fixedElement.style.top = (this.fixedPosition - distanceToScroll) + 'px';
      }
    }
  }
  constructor(private apiService: ApiserviceService, public dialog: MatDialog, private subcategory: SubcategoryService) { }

  ngOnInit() {
    // this.list()
  }

  // list() {
  //   this.apiService.getCategories().subscribe(data => {
  //     this.posts = data
  //     console.log('Fetched data:', data);
  //     console.log(this.posts.data)
  //     this.listProduct = this.posts.data;
  //     console.log(this.listProduct);
  //   },
  //     error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }

  openDialog() {
    const dialogRef = this.dialog.open(MobileCategoryDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  getSubcatList(subcategoryId: any) {
    this.subcategorySelected.emit(subcategoryId);
    this.closeModal();
    // console.log(subcategoryId);
  }


  closeModal() {
    const closeButton = document.querySelector('#modalClosedButton') as HTMLButtonElement;
    if (closeButton) {
      closeButton.click();
    }
  }
}

