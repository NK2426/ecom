import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CancelOrderService } from 'src/app/services/cancel-order.service';

@Component({
  selector: 'app-cancel-reason-dialog',
  templateUrl: './cancel-reason-dialog.component.html',
  styleUrls: ['./cancel-reason-dialog.component.css']
})
export class CancelReasonDialogComponent {
  selectedReason!: string;
  uuid: any;
  cancelreason: any[] = [];



  constructor(public dialogRef: MatDialogRef<CancelReasonDialogComponent>, private cancelReason: CancelOrderService, private router: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // console.log(this.selectedReason);
    
    this.dialogRef.close(this.selectedReason);
  }

}
