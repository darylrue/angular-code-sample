
// noinspection DuplicatedCode
export class Route {

  id: string;
  color: string;
  description: string;
  directionDestinations: string[];
  directionNames: string[];
  fareClass: string;
  longName: string;
  shortName: string;
  type: string;

  constructor(json: any) {
    this.id = json.id;
    this.color = json.attributes.color;
    this.description = json.attributes.description;
    this.directionDestinations = json.attributes.direction_destinations;
    this.directionNames = json.attributes.direction_names;
    this.fareClass = json.attributes.fare_class;
    this.longName = json.attributes.long_name;
    this.shortName = json.attributes.short_name;
    this.type = Route.parseType(json.attributes.type);
  }

  private static parseType(value: number): string {
    switch (value) {
      case 0: return 'Light Rail';
      case 1: return 'Heavy Rail';
    }
    return 'Unknown';
  }

}
