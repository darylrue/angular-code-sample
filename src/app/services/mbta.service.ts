import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {Route} from '../data_models/route';
import {map} from 'rxjs/operators';
import {Stop} from '../data_models/stop';
import {Schedule} from '../data_models/schedule';
import {Util} from '../util';


const ROUTE_FIELDS = 'color,description,direction_destinations,direction_names,fare_class,long_name,short_name,type';
const STOP_FIELDS = 'address,latitude,longitude,name,wheelchair_boarding';
const SCHEDULE_FIELDS = 'arrival_time,departure_time,direction_id';
const MBTA_DOMAIN = 'https://api-v3.mbta.com';


@Injectable({
  providedIn: 'root'
})
export class MbtaService {

  routes$ = new BehaviorSubject<Route[]>([]);
  routeInfo$ = new BehaviorSubject<Map<string, {[attr: string]: any}>>(new Map()); // {routeId : {attribute: value}}

  constructor(private http: HttpClient) {
    this.populateRoutes();
  }

  getStops(routeId: string): Observable<Stop[]> {
    return this.http.get(`${MBTA_DOMAIN}/stops?filter[route]=${routeId}&fields[stop]=${STOP_FIELDS}`).pipe(
      map(
        (response: any) => response.data.map(
          (stopJson: any) => new Stop(stopJson)
        )
      )
    );
  }

  getSchedules(routeId: string, stopId: string, directionId: number): Observable<[Schedule[], Stop]> {
    const paramStr = `filter[route]=${routeId}` +
      `&filter[stop]=${stopId}` +
      `&filter[direction_id]=${directionId}` +
      `&filter[min_time]=${Util.getCurrentTime()}` +
      `&fields[schedule]=${SCHEDULE_FIELDS}` +
      `&sort=arrival_time` +
      `&page[limit]=2`;
    const schedules = this.http.get(`${MBTA_DOMAIN}/schedules?${paramStr}`).pipe(
      map(
        (response: any) => response.data.map(
          (scheduleJson: any) => new Schedule(scheduleJson)
        )
      )
    );
    const stop = this.http.get(`${MBTA_DOMAIN}/stops/${stopId}?fields[stop]=name`).pipe(
      map((response: any) => new Stop(response.data))
    );
    return forkJoin([schedules, stop]);
  }

  private populateRoutes(): void {
    // Get only routes of type Light Rail (type = 0) or Heavy Rail (type = 1)
    this.http.get(`${MBTA_DOMAIN}/routes?filter[type]=0,1&fields[route]=${ROUTE_FIELDS}`).subscribe(
      (response: any) => {
        const routeInfo = new Map();
        const routes = response.data.map(
          (routeJson: any) => {
            const route = new Route(routeJson);
            const info = {color: `#${route.color}`, name: route.longName, directions: route.directionNames};
            routeInfo.set(route.id, info);
            return route;
          }
        );
        this.routeInfo$.next(routeInfo);
        this.routes$.next(routes);
      }
    );
  }

}
