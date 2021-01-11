import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navToCuteKittens(): void {
    document.location.href = 'https://www.google.com/search?q=kittens&tbm=isch';
  }

  navToRoutes(): void {
    this.router.navigate(['/routes']).then();
  }

}
