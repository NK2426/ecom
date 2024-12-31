import { Component, HostListener, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-review-popup',
  templateUrl: './review-popup.component.html',
  styleUrls: ['./review-popup.component.css']
})
export class ReviewPopupComponent {
  form: FormGroup;
  selectedFile!: File;
  uuid: string;
  dialogWidth: string = '50%'; // Initial dialog width
  rating: any;

  constructor(
    public dialogRef: MatDialogRef<ReviewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uuid = data.uuid; // Assuming uuid is passed in the data object

    this.rating = data.rating
    // Initialize the form group with form controls
    this.form = new FormGroup({
      review: new FormControl('', [Validators.required, Validators.minLength(10)]), // Form control with validation
      rating: new FormControl('') // Form control for image
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
  
    if (this.form.valid) {
      const commentsControl = this.form.get('review');
      if (commentsControl) {
        const formData = new FormData();
        formData.append('review', commentsControl.value || ''); // Handle possible null value
        formData.append('rating', this.rating);
        formData.append('uuid', this.uuid);
        // console.log(formData);
        this.dialogRef.close(formData);
      }
    }
  }

  get comments() {
    return this.form.get('review');
  }
}
