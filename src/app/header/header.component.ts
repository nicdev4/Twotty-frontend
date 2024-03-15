import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {ConfigData, User} from "../Utils";
import {RouterLink} from "@angular/router";
import {config} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  config = new ConfigData();
  @Input() is_auth: boolean = false;
  @Input() user: User|undefined;
}
