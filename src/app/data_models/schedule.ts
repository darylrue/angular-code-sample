
export class Schedule {

  id: string;
  arrivalTime: string;
  departureTime: string;
  directionId: number;

  constructor(json: any) {
    this.id = json.id;
    this.arrivalTime = json.attributes.arrival_time;
    this.departureTime = json.attributes.departure_time;
    this.directionId = json.attributes.direction_id;
  }

}
