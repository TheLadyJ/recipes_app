import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  constructor(private authService:AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogIn(){
    this.authService.login();
    this.router.navigateByUrl('/recipes/tabs/explore');
  }

}
