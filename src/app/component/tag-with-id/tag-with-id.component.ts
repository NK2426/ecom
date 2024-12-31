import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, AfterContentChecked, AfterContentInit, DoCheck, OnChanges, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tag } from 'src/app/model/tags';
import { TagService } from 'src/app/services/tags.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tag-with-id',
  templateUrl: './tag-with-id.component.html',
  styleUrls: ['./tag-with-id.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
@Injectable({
  providedIn: 'root'
})
export class TagWithIdComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private cd: ChangeDetectorRef, private tagService: TagService, private wishlist: WishlistService,) {
  }

  listTag: Tag[] = [];
  tagName: string = '';
  uuid: any = '';

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('id');
    // console.log(this.uuid);
    this.getTagWithUUID(this.uuid);
    // this.cd.detectChanges();
  }

  getTagWithUUID(uuid: any) {
    // this.uuid = this.route.snapshot.paramMap.get('id');
    // console.log(this.uuid);
    this.tagService.getTagWithUUID(uuid).subscribe({
      next: (resp: any) => {
        this.listTag = resp.data;
        this.tagName = resp.name;
        // console.log(this.listTag);
        this.cd.detectChanges();
      }
    })
    // this.cd.detectChanges();
  }


  // ngAfterViewInit(): void {
  //   this.uuid = this.route.snapshot.paramMap.get('id');
  //   console.log(this.uuid);
  //   this.tagService.getTagWithUUID(this.uuid).subscribe({
  //     next: (resp: any) => {
  //       this.listTag = resp.data;
  //       this.tagName = resp.name;
  //       console.log(this.listTag);
  //       this.cd.detectChanges();
  //     }
  //   })
  //   // this.cd.detectChanges();
  // }

  productDetails(uuid: any) {
    // console.log(uuid);
    this.router.navigate(['/product/' + uuid]);
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
        this.getTagWithUUID(this.uuid);
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
      this.router.navigate(['/login']);
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

}
