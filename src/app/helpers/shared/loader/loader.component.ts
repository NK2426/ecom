import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../loader.service'; // Create the LoaderService next

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent  implements OnInit{
  
  loading :boolean = true
  constructor(private loaderService: LoaderService,private cd: ChangeDetectorRef) {}
  

  
  ngOnInit() {
    this.loaderService.isLoading$.subscribe(isLoading => {
      this.loading = isLoading;
      // Manually trigger change detection only if necessary
      this.cd.detectChanges();
    });
  }
  
  
}
