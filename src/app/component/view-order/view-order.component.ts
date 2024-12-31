import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrderstatusService } from 'src/app/services/orderstatus.service';
import { ToasterService } from 'src/app/services/toaster.service';
import Swal from 'sweetalert2';
import { CancelReasonDialogComponent } from '../cancel-reason-dialog/cancel-reason-dialog.component';
import { CancelOrderService } from 'src/app/services/cancel-order.service';
import { OrderTrackingService } from 'src/app/services/order-tracking.service';
import { ReturnReasonDialogComponent } from '../return-reason-dialog/return-reason-dialog.component';
import { ApiResponse } from 'src/app/model/orders';
import { ReviewPopupComponent } from '../review-popup/review-popup.component';
@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css'],
})
export class ViewOrderComponent implements OnInit {
  id: any = '';
  viewOrderItems!: any;
  uuid: any
  // viewOrderItems!: any
  showCancelBtn: boolean = false;
  refunddata: any;
  orderDetails: any;
  trackingSteps: any[] = [];
  rating: number = 0; // Initial rating
  ratingMessage: string = '';
  stars: number[] = [1, 2, 3, 4, 5];
  dateformate: any;

  constructor(
    private route: ActivatedRoute,
    private orderstatus: OrderstatusService,
    private toaster: ToasterService,
    public dialog: MatDialog,
    private cancelReason: CancelOrderService,
    private orderTrak: OrderTrackingService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.viewOrder();
    this.orderTraking();
  }

  viewOrder() {
    this.orderstatus.viewOrder(this.id).subscribe((data: any) => {
      // console.log(data.data);
      this.viewOrderItems = data.data;
      this.rating = this.viewOrderItems.rating
      // console.log(this.viewOrderItems);
      if (this.viewOrderItems.status === 'Cancel Request' || this.viewOrderItems.status === 'Cancel' || this.viewOrderItems.status === 'Return' || this.viewOrderItems.status === 'Return Request' || this.viewOrderItems.status === 'Delivered' || this.viewOrderItems.status === 'Refund') {
        this.showCancelBtn = true;
        this.orderstatus.refundDetails(this.id).subscribe((data: any) => {
          // console.log(data);
          this.refunddata = data.data
        })
      }
    });
  }

  downloadinvoice() {
    this.orderstatus.downloadInvoice(this.viewOrderItems.orderID).subscribe((data: any) => {
      // console.log(data);
      if (data.status == 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${data.message}`,
          showConfirmButton: false,
          width: '1000px',
          timer: 1000,
          customClass: {
            popup: 'large-sa-popup',
          },
        })
      }
    });
  }


  openCancelReasonDialog(): void {
    this.uuid = this.route.snapshot.paramMap.get('id');
    this.cancelReason.getReason(this.uuid).subscribe(data => {
      const dialogRef = this.dialog.open(CancelReasonDialogComponent, {
        data: { reasons: data }
      });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed with result:', result);
        // Handle the result here
        this.cancelReason.cancelReason(result.id, this.id).subscribe((data: any) => {
          // console.log(data);
          if (data.status == 'success') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${data.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
            animate__animated
            animate__fadeInUp
            animate__faster`
              },
              hideClass: {
                popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster`
              }
            })
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `${data.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
            animate__animated
            animate__fadeInUp
            animate__faster`
              },
              hideClass: {
                popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster`
              }
            })
          }
          this.viewOrder();

        })
      });
    });


  }



  getreturn() {
    this.uuid = this.route.snapshot.paramMap.get('id');

    const dialogRef = this.dialog.open(ReturnReasonDialogComponent, {
      data: { uuid: this.uuid },
      width: '50%'
    });
    dialogRef.afterClosed().subscribe((formData: FormData) => {
      if (formData) {
        // console.log(formData);
        // Handle the formData, e.g., send it to a server via a service
        this.cancelReason.return(formData, this.id).subscribe(data => {
          const response = data as ApiResponse
          // console.log('Response from server:', response);
          if (response.status === 'success') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${response.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
              animate__animated
              animate__fadeInUp
              animate__faster`
              },
              hideClass: {
                popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster`
              }
            });
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `${response.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
              animate__animated
              animate__fadeInUp
              animate__faster`
              },
              hideClass: {
                popup: `
              animate__animated
              animate__fadeOutDown
              animate__faster`
              }
            });
          }
          this.viewOrder();
        });
      }
    });
  }


  orderTraking() {
    this.orderTrak.getOrderTraking(this.id).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        this.orderDetails = resp.data


      },
      error: err => {
        // console.log(err);

      }
    })

  }

  rateOrder(star: number): void {
    this.rating = star;
    this.ratingMessage = `You rated this order ${star} star${star > 1 ? 's' : ''}`;

    // Optionally: Save the rating to a server or perform other logic
    this.saveRating(star);
  }

  saveRating(star: number): void {
    // Logic to save the rating, e.g., HTTP request to a backend service
    this.orderstatus.rateitem(this.viewOrderItems.item_uuid, this.rating).subscribe(data => {
      const response = data as ApiResponse
      // console.log('Response from server:', response);
      if (response.status === 'success') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${response.message}`,
          showConfirmButton: false,
          width: '500px',
          timer: 1000,
          showClass: {
            popup: `
          animate__animated
          animate__fadeInUp
          animate__faster`
          },
          hideClass: {
            popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster`
          }
        });
        this.openReviewPopup()
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `${response.message}`,
          showConfirmButton: false,
          width: '500px',
          timer: 1000,
          showClass: {
            popup: `
          animate__animated
          animate__fadeInUp
          animate__faster`
          },
          hideClass: {
            popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster`
          }
        });
      }
      this.viewOrder();
    });
    // console.log(`Rating saved: ${star}`);
  }
  openReviewPopup() {
    const dialogRef = this.dialog.open(ReviewPopupComponent, {
      data: { uuid: this.viewOrderItems.item_uuid, rating: this.rating },
      width: '50%'
    });
    dialogRef.afterClosed().subscribe((formData: FormData) => {
      if (formData) {
        // console.log(formData);
        // Handle the formData, e.g., send it to a server via a service
        this.orderstatus.rateitemWithReview(this.viewOrderItems.item_uuid, formData).subscribe(data => {
          const response = data as ApiResponse
          // console.log('Response from server:', response);
          if (response.status === 'success') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: `${response.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
               animate__animated
               animate__fadeInUp
               animate__faster`
              },
              hideClass: {
                popup: `
               animate__animated
               animate__fadeOutDown
               animate__faster`
              }
            });
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: `${response.message}`,
              showConfirmButton: false,
              width: '500px',
              timer: 1000,
              showClass: {
                popup: `
               animate__animated
               animate__fadeInUp
               animate__faster`
              },
              hideClass: {
                popup: `
               animate__animated
               animate__fadeOutDown
               animate__faster`
              }
            });
          }
          this.viewOrder();
        });
      }
    });
  }
}
