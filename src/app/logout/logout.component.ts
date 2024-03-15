import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {User} from "../Utils";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit{
  constructor(private auth: AuthService, private cookie: CookieService, private router: Router) {
  }
  ngOnInit() {
    this.cookie.delete('AUTH_TOKEN');
    this.auth.emitIsAuthChange(false);
    this.auth.emitUserChange(new User());
    this.auth.emitTokenChange("");
    window.location.href = "/";
  }
}
