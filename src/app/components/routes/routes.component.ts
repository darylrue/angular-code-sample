import {Component, OnDestroy, OnInit} from '@angular/core';
import { MbtaService } from '../../services/mbta.service';
import { Route } from '../../data_models/route';
import { Router } from '@angular/router';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit, OnDestroy {

  dataReceived = false;
  routes: Route[] | undefined;
  routesSub$: Subscription | undefined;

  constructor(private router: Router, private mbtaService: MbtaService) { }

  ngOnInit(): void {
    this.routesSub$ = this.mbtaService.routes$.subscribe(
      data => {
        this.routes = data;
        this.dataReceived = true;
      },
      err => {
        this.dataReceived = true;
        console.error(err);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.routesSub$) {
      this.routesSub$.unsubscribe();
    }
  }

  navToStops(routeId: string): void {
    const navigationExtras = { queryParams: { route: routeId } };
    this.router.navigate(['stops'], navigationExtras).then();
  }

}
