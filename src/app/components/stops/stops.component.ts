import {Component, OnDestroy, OnInit} from '@angular/core';
import { MbtaService } from '../../services/mbta.service';
import { Stop } from '../../data_models/stop';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stops',
  templateUrl: './stops.component.html',
  styleUrls: ['./stops.component.scss']
})
export class StopsComponent implements OnInit, OnDestroy {

  dataReceived = false;
  routeId: string | undefined;
  direction0: string | undefined;
  direction1: string | undefined;
  stops: Stop[] | undefined;
  color: string | undefined;
  routeName: string | undefined;
  routeInfoSub$: Subscription | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private mbtaService: MbtaService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.routeId = params.route;
      if (this.routeId) {
        const routeId = this.routeId;
        this.routeInfoSub$ = this.mbtaService.routeInfo$.subscribe(infoMap => {
          const info = infoMap.get(routeId);
          if (info) {
            this.color = info.color;
            this.routeName = info.name;
            this.direction0 = info.directions[0];
            this.direction1 = info.directions[1];
          }
        });
        this.mbtaService.getStops(this.routeId).subscribe(
          data => {
            this.stops = data;
            this.dataReceived = true;
          },
          err => {
            this.dataReceived = true;
            console.error(err);
          }
        );
      } else {
        this.router.navigate(['routes']).then(); // page visited without routeId and direction. Go back to routes page.
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeInfoSub$) {
      this.routeInfoSub$.unsubscribe();
    }
  }

  navToSchedule(stopId: string, directionId: number): void {
    const navigationExtras = { queryParams: { route: this.routeId, stop: stopId, directionId } };
    this.router.navigate(['schedule'], navigationExtras).then();
  }

}
