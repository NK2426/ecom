import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoCallComponent } from 'src/app/component/video-call/video-call.component';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class OverlayComponent implements OnInit {
  constructor(private modalService: NgbModal, public dialog: MatDialog, private videoCall: VideoCallComponent) { }

  ngOnInit(): void {

  }

  videoCalling() {
    const dialog = this.dialog.open(VideoCallComponent, {
      width: '75%',
      height:'75%',
       panelClass: 'custom-dialog-container'
    })
  }

}
