import {Util} from './util';

describe('getCurrentTime() returns correctly formatted current time', () => {

  it('should return 2 digit hour and 2 digit minute', () => {
    expect(Util.getCurrentTime(new Date(2021, 1, 1, 0, 0))).toEqual('00:00');
    expect(Util.getCurrentTime(new Date(2021, 1, 1, 0, 1))).toEqual('00:01');
    expect(Util.getCurrentTime(new Date(2021, 1, 1, 1, 0))).toEqual('01:00');
    expect(Util.getCurrentTime(new Date(2021, 1, 1, 13, 9))).toEqual('13:09');
    expect(Util.getCurrentTime(new Date(2021, 1, 1, 23, 59))).toEqual('23:59');
  });

});

describe('parseAddress() returns a correctly formatted 2-line address', () => {

  it('should handle comma-separated full address', () => {
    expect(Util.parseAddress('1 Adams St, Milton, MA 02186')).toEqual(['1 Adams St', 'Milton, MA 02186']);
    expect(Util.parseAddress('1 Adams St')).toEqual(['1 Adams St', '']);
  });

});

describe('parseDay() correctly converts a timestamp string into text describing the day', () => {

  it('should recognize when the date is today', () => {
    expect(Util.parseDay('2021-01-10T15:41:00-05:00', new Date('2021-01-10T23:41:00-05:00'))).toEqual('Today');
    expect(Util.parseDay('2021-01-10T15:41:00-05:00', new Date('2021-01-10T00:41:00-05:00'))).toEqual('Today');
    expect(Util.parseDay('2021-01-10T15:41:00-05:00', new Date('2021-01-11T00:41:00-04:00'))).toEqual('Today');
    expect(Util.parseDay('2021-01-10T15:41:00-05:00', new Date('2021-01-11T00:41:00-06:00'))).toEqual('On 1/10/2021');
  });

});

describe('parseTime() correctly converts timestamp strings to a user-readable time', () => {

  it('should correctly parse AM times', () => {
    expect(Util.parseTime('2021-01-10T3:41:12-05:00')).toEqual('3:41 AM');
    expect(Util.parseTime('2021-01-10T00:00:00-05:00')).toEqual('12:00 AM');
    expect(Util.parseTime('2021-01-10T11:59:59-05:00')).toEqual('11:59 AM');
  });

  it('should correctly parse PM times', () => {
    expect(Util.parseTime('2021-01-10T15:41:00-05:00')).toEqual('3:41 PM');
    expect(Util.parseTime('2021-01-10T23:59:59-05:00')).toEqual('11:59 PM');
    expect(Util.parseTime('2021-01-10T12:01:00-05:00')).toEqual('12:01 PM');
  });

});
