import {Component, importProvidersFrom, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {LoadingComponent} from "../loading/loading.component";
import {ConfigData} from "../Utils";

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    RouterLink,
    HttpClientModule,
    NgForOf,
    JsonPipe,
    NgIf,
    LoadingComponent
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit{
  constructor(private http: HttpClient) {  }
  config = new ConfigData();
  posts: Post[] = [];
  loading = true;
  ngOnInit(): void {
    this.http.get(this.config.server_uri+"/index/")
      .subscribe(
        {
          next: (data: any) => {
            for(let el of data.content){
              let post: Post = new Post();
              post.text = el.twot.text;
              post.date = el.twot.creation_date;
              let userdata = new UserData();
              userdata.username = el.author.username;
              userdata.photo = el.author.photo;
              userdata.url = "/user?name="+el.author.username;
              post.from_user = userdata;
              this.posts.push(post);
            }
            this.loading = false;
          }
        }
      )
  }

}
class Post {
  from_user: UserData|undefined;
  text: string|undefined;
  date: string|undefined;
}

class UserData{
  username: string = "";
  photo: string = "";
  url: string = "/user?name="+this.username;
}
