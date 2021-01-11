export class Util {

  /**
   * Returns current time in the format HH:MM
   */
  public static getCurrentTime(date: Date = new Date()): string {
    const hour = (date.getHours() < 10 ? '0' : '') + date.getHours();
    const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    return `${hour}:${minute}`;
  }

  /**
   * Returns [address_line_1, address_line_2]
   * @param address - a string with a full comma-separated mailing address
   */
  public static parseAddress(address: string): string[] {
    if (address) {
      const firstCommaIndex = address.indexOf(',');
      if (firstCommaIndex !== -1) {
        return [
          address.substring(0, firstCommaIndex),
          address.substring(firstCommaIndex + 1, address.length).trim()
        ];
      }
    }
    return [address, ''];
  }

  /**
   * Returns descriptive text for the day of a timestamp. Ex 'Today' or 'on 1/12/2021'
   * @param timestamp - a string in the form '2021-01-10T15:41:00-05:00'
   * @param today - a Date object for today's date
   */
  public static parseDay(timestamp: string, today: Date = new Date()): string {
    if (timestamp == null) { return ''; }
    const timestampDate = new Date(timestamp);
    const timestampDateStr = timestampDate.toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0];
    const todayDateStr = today.toLocaleString('en-US', { timeZone: 'America/New_York' }).split(',')[0];
    if (timestampDateStr === todayDateStr) {
      return 'Today';
    }
    return `On ${timestampDateStr}`;
  }

  /**
   * Returns a time string in the form '5:30 PM'
   * @param timestamp - a string in the form '2021-01-10T15:41:00-05:00'
   */
  public static parseTime(timestamp: string): string {
    if (timestamp == null) { return ''; }
    const timeStr = timestamp.split('T')[1].split('-')[0];
    const hms = timeStr.split(':');
    const hour = parseInt(hms[0], 10);
    const minute = parseInt(hms[1], 10);
    const suffix = hour < 12 ? 'AM' : 'PM';
    const naiveHour = hour > 12 ? hour - 12 : hour !== 0 ? hour : 12;
    return `${naiveHour}:${(minute < 10 ? '0' : '') + minute} ${suffix}`;
  }

}
