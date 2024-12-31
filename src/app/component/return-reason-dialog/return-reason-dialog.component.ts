import { Component, Inject, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-return-reason-dialog',
  templateUrl: './return-reason-dialog.component.html',
  styleUrls: ['./return-reason-dialog.component.css']
})
export class ReturnReasonDialogComponent {
  form: FormGroup;
  selectedFile!: File;
  uuid: string;
  dialogWidth: string = '50%'; // Initial dialog width

  constructor(
    public dialogRef: MatDialogRef<ReturnReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uuid = data.uuid; // Assuming uuid is passed in the data object

    // Initialize the form group with form controls
    this.form = new FormGroup({
      comments: new FormControl('', [Validators.required, Validators.minLength(10)]), // Form control with validation
      image: new FormControl(null, Validators.required) // Form control for image
    });

    this.adjustDialogWidth(); // Set the initial dialog width
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustDialogWidth();
  }

  adjustDialogWidth(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 600) {
      this.dialogWidth = '90%';
    } else if (screenWidth < 960) {
      this.dialogWidth = '70%';
    } else {
      this.dialogWidth = '50%';
    }

    this.dialogRef.updateSize(this.dialogWidth);
  }

  // Handling file selection
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Check if the form control exists before setting its value
      const imageControl = this.form.get('image');
      if (imageControl) {
        this.selectedFile = file;
        imageControl.setValue(file);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    // console.log(this.form.valid);
    if (this.form.valid) {
      const commentsControl = this.form.get('comments');
      if (commentsControl) {
        const formData = new FormData();
        formData.append('comments', commentsControl.value || ''); // Handle possible null value
        formData.append('reason', "1"); // Example reason
        formData.append('uuid', this.uuid);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile);
        }
        // Close the dialog and pass the formData back
        formData.forEach((value, key) => {
          // console.log(`${key}: ${value}`);
        });
        this.dialogRef.close(formData);
      }
    }
  }

  get image() {
    return this.form.get('image');
  }

  get comments() {
    return this.form.get('comments');
  }
}
