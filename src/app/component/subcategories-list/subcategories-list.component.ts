import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subcategory, SubcategoryData } from 'src/app/model/subcategories';
import { SubcategoryService } from 'src/app/services/subcategory.service';

@Component({
  selector: 'app-subcategories-list',
  templateUrl: './subcategories-list.component.html',
  styleUrls: ['./subcategories-list.component.css']
})
export class SubcategoriesListComponent implements OnInit{

  id:any;
  categoryName?:string;
  listSubcategories: SubcategoryData[] = [];
  constructor(private subcategory: SubcategoryService, private route: ActivatedRoute, private router: Router){}

  ngOnInit(){
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSubcategoriesByCatId()
  }

  //get the subcategories by category id
  getSubcategoriesByCatId(){
    this.subcategory.getSubCategory(this.id).subscribe((data:any)=>{
      // console.log(data);    
      this.listSubcategories = data?.data?.groups
      this.categoryName = data?.data?.name
      // console.log(this.listSubcategories);
      
    })
  }

  //send subcat id to url, for get subcat products

  forGettingSubcatPrducts(subcat_id:any){
    this.router.navigate(['/product-list/'+subcat_id])
  }



}
