import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-conformationdialog',
  templateUrl: './conformationdialog.component.html',
  styleUrls: ['./conformationdialog.component.css']
})
export class ConformationdialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConformationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
