
// noinspection DuplicatedCode
import {Util} from '../util';

export class Stop {

  id: string;
  addressLine1: string;
  addressLine2: string;
  latitude: number;
  longitude: number;
  name: string;
  wheelchairBoarding: string;
  wheelchairBoardingSymbol: string;

  constructor(json: any) {
    this.id = json.id;
    const addrLines = Util.parseAddress(json.attributes.address);
    this.addressLine1 = addrLines[0];
    this.addressLine2 = addrLines[1];
    this.latitude = json.attributes.latitude;
    this.longitude = json.attributes.longitude;
    this.name = json.attributes.name;
    const wheelchairBoardingValues = Stop.parseWheelchairBoarding(json.attributes.wheelchair_boarding);
    this.wheelchairBoarding = wheelchairBoardingValues[0];
    this.wheelchairBoardingSymbol = wheelchairBoardingValues[1];
  }

  private static parseWheelchairBoarding(value: number): string[] {
    switch (value) {
      case 1: return ['Yes', '✔'];
      case 2: return ['No', '✘'];
    }
    return ['Unknown', 'Unknown'];
  }

}
