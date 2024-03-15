import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import {UserComponent} from "./user/user.component";
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./signup/signup.component";
import {LogoutComponent} from "./logout/logout.component";

export const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'user', component: UserComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'logout', component: LogoutComponent}
];
