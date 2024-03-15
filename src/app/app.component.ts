import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {CookieService} from "ngx-cookie-service";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {ConfigData, User} from "./Utils";
import {AuthService} from "./auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthService, private cookie: CookieService, private http: HttpClient) {
  }
  config = new ConfigData();
  is_auth: boolean = false;
  auth_token: string = "";
  auth_user: User|undefined;

  ngOnInit() {
    this.auth.getIsAuth().subscribe(value => {
      this.is_auth = value;
    });
    this.auth.getToken().subscribe(value => {
      this.auth_token = value;
    });
    this.auth.getUser().subscribe(value => {
      this.auth_user = value;
    });
    if (this.cookie.get('AUTH_TOKEN') != "") {
      this.auth_token = this.cookie.get('AUTH_TOKEN');
      const headers = new HttpHeaders().set('Authorization', 'Bearer '+this.auth_token)
      let request = this.http.get(this.config.server_uri+'/session/', {headers: headers});
      request.subscribe({
        next: (data: any) => {
          let status: string = data.status;
          switch (status){
            case "ok":
              this.is_auth = true;
              let user = new User();
              user.id = data.content.id;
              user.username = data.content.username;
              user.first_name = data.content.first_name;
              user.last_name = data.content.last_name;
              user.photo_url = data.content.photo_url;
              this.auth_user = user;
              this.auth.emitIsAuthChange(this.is_auth);
              this.auth.emitUserChange(this.auth_user);
              this.auth.emitTokenChange(this.auth_token);
              break;
            default:
              this.is_auth = false;
              this.auth.emitIsAuthChange(false);
              this.auth.emitTokenChange("");
              this.auth.emitUserChange(new User());
              this.cookie.delete('AUTH_TOKEN');
              break;
          }
        }
      }).unsubscribe();
    }
  }
}
