import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
import {User} from "./Utils";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  private tokenChangeSource = new BehaviorSubject<string>('');
  getToken(){
    return this.tokenChangeSource.asObservable();;
  }

  private userChangeSource = new BehaviorSubject<User>(new User());
  getUser(){
    return this.userChangeSource.asObservable();
  }

  private isAuthChangeSource = new BehaviorSubject<boolean>(false);
  getIsAuth(){
    return this.isAuthChangeSource.asObservable();
  }

  emitTokenChange(token: string){
    this.tokenChangeSource.next(token);
  }

  emitUserChange(user: User){
    this.userChangeSource.next(user);
  }

  emitIsAuthChange(is_auth: boolean){
    this.isAuthChangeSource.next(is_auth);
  }
}
