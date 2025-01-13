import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay } from 'rxjs';
import { LoaderService } from './helpers/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Mugdha';
  constructor(private router: Router,   private loaderService: LoaderService,) { }

  ngAfterViewInit() {
    this.loaderService.show()
     
  }
  ngOnInit(): void {
    // Subscribe to the NavigationEnd event of the Router

    localStorage.setItem('coupon', '');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the window
        window.scrollTo(0, 0);
      }
    });
  }
}
