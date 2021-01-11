import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MbtaService } from '../../services/mbta.service';
import { Schedule } from '../../data_models/schedule';
import { Util } from '../../util';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  dataReceived = false;
  color: string | undefined;
  routeName: string | undefined;
  stopName: string | undefined;
  direction: string | undefined;
  nextLabel: string | undefined;
  nextDay: string | undefined;
  nextTime: string | undefined;
  followingLabel: string | undefined;
  followingDay: string | undefined;
  followingTime: string | undefined;
  routeInfoSub$: Subscription | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private mbtaService: MbtaService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const routeId = params.route;
      const stopId = params.stop;
      const directionId = params.directionId;
      if (routeId && stopId && directionId != null) {
        this.routeInfoSub$ = this.mbtaService.routeInfo$.subscribe(infoMap => {
          const info = infoMap.get(routeId);
          if (info) {
            this.color = info.color;
            this.routeName = info.name;
            this.direction = info.directions[directionId];
          }
        });
        this.mbtaService.getSchedules(routeId, stopId, directionId).subscribe(
          data => {
            this.populateFields(data[0]);
            this.stopName = data[1].name;
            this.dataReceived = true;
          },
          err => {
            this.dataReceived = true;
            console.error(err);
          }
        );
      } else {
        this.router.navigate(['routes']).then(); // page visited without routeId, stopId, and direction. Go back to routes page.
      }
    });
  }

  private populateFields(schedules: Schedule[]): void {
    if (!schedules || schedules.length === 0) {
      return;
    }
    const next = schedules[0];
    const nextActionText = next.arrivalTime ? 'arrive' : 'depart'; // arrival time or departure time can be null
    this.nextLabel = `The next train will ${nextActionText}`;
    const nextTimeStr = next.arrivalTime ? next.arrivalTime : next.departureTime;
    this.nextDay = Util.parseDay(nextTimeStr);
    this.nextTime = `at ${Util.parseTime(nextTimeStr)}`;
    if (schedules.length > 1) {
      const following = schedules[1];
      const followingActionText = following.arrivalTime ? 'arrive' : 'depart'; // arrival time or departure time can be null
      this.followingLabel = `The following train will ${followingActionText}`;
      const followingTimeStr = following.arrivalTime ? following.arrivalTime : following.departureTime;
      this.followingDay = Util.parseDay(followingTimeStr);
      this.followingTime = `at ${Util.parseTime(followingTimeStr)}`;
    }
  }

}
