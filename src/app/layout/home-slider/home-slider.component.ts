import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from 'src/app/services/apiservice.service';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.css'],
})
export class HomeSliderComponent implements OnInit {

  banners: any[] = [];
  slides: any[] = [];
  constructor(private banner: ApiserviceService, private router: Router, private cd: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.homeBanner();
    // this.homeBannerSlider()
  }


  slideConfig = {
    slidesToShow: 1, slidesToScroll: 1, autoplay: true, // This enables autoplay
    autoplaySpeed: 2000
  };

  homeBanner() {
    this.banner.getHomeBanner().subscribe((data: any) => {
      // console.log(data.data.rows);
      this.banners = data.data[0].sectionitems;
      this.cd.detectChanges();
    });

  }



  navigateTo(route: string, type: string) {
    if (type === 'Tag') {
      this.router.navigate([`/tag/${route}`])
    } else if (type === 'Group') {
      this.router.navigate([`/product-list/${route}`])
    }
  }


}
