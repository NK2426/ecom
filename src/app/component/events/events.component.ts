import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blogs } from 'src/app/model/blogs';
import { liveEvents } from 'src/app/model/event';
import { BlogService } from 'src/app/services/blog.service';
import { LiveEventsService } from 'src/app/services/live-events.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  eventsList: liveEvents[] = [];

  width: boolean = false
  constructor(private events: LiveEventsService, private router: Router) { }

  ngOnInit() {
    if (window.innerWidth > 768) {
      this.width = true
    }
    // console.log(window.innerWidth);
    this.getAllBlogs();
  }

  getAllBlogs() {
    this.events.getEvents().subscribe((data: any) => {
      this.eventsList = data.data.datas;
    })
  }

  navigateTo(route: string, type: string) {
    if (type == 'Tag') {
      this.router.navigate([`/tag/${route}`])
    } else if (type == 'Group') {
      this.router.navigate([`/product-list/${route}`])
    } else {
      this.router.navigate([`/product/${route}`])
    }
  }


}
