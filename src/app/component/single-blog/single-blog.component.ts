import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-single-blog',
  templateUrl: './single-blog.component.html',
  styleUrls: ['./single-blog.component.css']
})
export class SingleBlogComponent {

  blogId: any;
  singleBlog: any;

constructor(private route: ActivatedRoute, private blogs: BlogService){}

ngOnInit(){
      this.getBlog();

}

getBlog(){
  this.blogId = this.route.snapshot.paramMap.get('id');
  this.blogs.getBlog(this.blogId).subscribe((data:any)=>{
    this.singleBlog = data.data
  })
}

}
