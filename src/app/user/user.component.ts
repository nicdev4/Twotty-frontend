import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ConfigData, Err, IUser, Twot, User} from "../Utils";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../auth.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {LoadingComponent} from "../loading/loading.component";
import {config} from "rxjs";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    HttpClientModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    LoadingComponent,
    RouterLink
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  config = new ConfigData();
  loading = true;
  username: string = "NaN";
  user:User = new User();
  twots:Twot[] = [];
  is_owner:boolean = false;
  owner_token:string = "";
  constructor(private auth: AuthService, private route: ActivatedRoute, private http: HttpClient) {
  }

  post_form = new FormGroup({
    text: new FormControl('')
  });
  post_form_error = new Err();

  postSubmit(){
    this.loading = true;
    const body = {
      text: this.post_form.value.text
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer '+this.owner_token)
    this.http.post(this.config.server_uri+'/send/', body, {headers: headers}).subscribe({
      next: (data: any) => {
        if(data.status === "ok"){
          let twot = new Twot();
          twot.user = this.user;
          twot.text = data.content.twot.text;
          twot.date = data.content.twot.date;
          this.twots.unshift(twot);
          this.post_form.get('text')?.reset();
        } else {
          this.post_form_error.enabled = true;
          this.post_form_error.text = data.content.text;
        }
        this.loading = false;
      }
    })
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['name'];
    });
    this.http.get(this.config.server_uri+'/user/'+this.username).subscribe({
      next: (data: any) => {
        this.user.first_name = data.first_name;
        this.user.last_name = data.last_name;
        this.user.photo_url = data.photo_url;
        this.user.id = data.id;
      }
    });
    this.http.get(this.config.server_uri+'/user/'+this.username+'/twots').subscribe({
      next: (data: any) => {
        for(let post of data.content){
          let twot = new Twot();
          twot.user = this.user;
          twot.date = post.date;
          twot.text = post.text;
          twot.id = post.id;
          this.twots.push(twot);
        }
        this.loading = false;
      }
    });
    this.auth.getUser().subscribe(data => {
      if(data.username === this.username){
        this.is_owner = true;
      }
    });
    this.auth.getToken().subscribe(
      data => {
        this.owner_token = data;
      }
    );
  }
}
