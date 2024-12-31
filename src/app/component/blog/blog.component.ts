import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blogs } from 'src/app/model/blogs';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {

  blogsList: Blogs[] = [];
  

  constructor(private blogs: BlogService, private router: Router) { }

  ngOnInit() {
    
    this.getAllBlogs();

  }

  getAllBlogs() {
    this.blogs.getBlogs().subscribe((data: any) => {
      this.blogsList = data.data.datas;
    })
  }

  viewBlog(id:any){
    this.router.navigate(['/blogs/'+ id])
  }

  

}
