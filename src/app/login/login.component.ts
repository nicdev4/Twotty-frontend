import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LoadingComponent} from "../loading/loading.component";
import {ConfigData, Err, User} from "../Utils";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HttpClientModule, ReactiveFormsModule, NgIf, LoadingComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(private auth: AuthService, private http: HttpClient, private cookie: CookieService, private router: Router) {
  }
  config = new ConfigData();
  loading: boolean = false;
  error = new Err();
  login_form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  onSubmit(){
    this.loading = true;
    const body = {'email': this.login_form.value.email, 'password': this.login_form.value.password};
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(this.config.server_uri+"/login/", JSON.stringify(body), {headers: headers}).subscribe({
      next: (data: any) => {
        let status: string = data.status;
        switch (status){
          case "ok":
            this.cookie.set('AUTH_TOKEN', data.content.token);
            let user = new User();
            user.id = data.content.user.id;
            user.username = data.content.user.username;
            user.photo_url = data.content.user.photo_url;
            this.router.navigate(['']);
            this.auth.emitIsAuthChange(true);
            this.auth.emitTokenChange(data.content.token);
            this.auth.emitUserChange(user);
            break;
          case "err":
            this.error.text = data.content.text;
            this.error.enabled = true;
            break;
        }
        this.loading = false;
      }
    })
  }
  ngOnInit() {
    if(this.cookie.get('AUTH_TOKEN') != ""){
      this.router.navigate(['']);
    }
  }
}
