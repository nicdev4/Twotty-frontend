import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfigData, Err, User} from "../Utils";
import {NgIf} from "@angular/common";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  constructor(private router: Router, private auth: AuthService, private http: HttpClient, private cookie: CookieService, private formBuilder: FormBuilder) {
  }
  config = new ConfigData();
  form_error = new Err();
  input_errors = {
    username: new Err(),
    email: new Err(),
    first_name: new Err(),
    last_name: new Err()
  };


  signup_form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
    username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
    first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]+$')]],
    last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]+$')]],
    password: ['', []]
  });

  ngOnInit() {
    this.cookie.delete('AUTH_TOKEN');
  }

  onSubmit(){
    if(this.signup_form.invalid){
      this.form_error.text = "Не все поля заполнены корректно.";
      this.form_error.enabled = true;
      if(this.signup_form.get('username')?.invalid){
        this.input_errors.username.enabled = true;
        this.input_errors.username.text = "Ник введен некорректно. Используйте только латинские буквы и цифры.";
      }
      if(this.signup_form.get('email')?.invalid){
        this.input_errors.email.enabled = true;
        this.input_errors.email.text = "Почта введена некорректно. Пример: mymail@email.com";
      }
      if(this.signup_form.get('first_name')?.invalid){
        this.input_errors.first_name.enabled = true;
        this.input_errors.first_name.text = "Имя введено некорректно. Используйте только буквы.";
      }
      if(this.signup_form.get('last_name')?.invalid){
        this.input_errors.last_name.enabled = true;
        this.input_errors.last_name.text = "Фамилия введена некорректно. Используйте только буквы.";
      }
    } else {
      const body = {username: this.signup_form.get('username')?.value,
        email: this.signup_form.get('email')?.value,
        first_name: this.signup_form.get('first_name')?.value,
        last_name: this.signup_form.get('last_name')?.value,
        password: this.signup_form.get('password')?.value};
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(this.config.server_uri+'/signup/', JSON.stringify(body), {headers: headers}).subscribe({
        next: (data: any) => {
          if(data.status === "err"){
            this.form_error.enabled = true;
            this.form_error.text = data.content.text;
          } else {
            this.auth.emitIsAuthChange(true);
            this.auth.emitTokenChange(data.content.token);
            let user = new User();
            user.id = data.content.user.id;
            user.username = data.content.user.username;
            user.first_name = data.content.user.first_name;
            user.last_name = data.content.user.last_name;
            user.photo_url = data.content.user.photo_url;
            this.auth.emitUserChange(user);
            this.cookie.set('AUTH_TOKEN', data.content.token);
            this.router.navigate(['']);
          }
        }
      });
    }
  }
}
