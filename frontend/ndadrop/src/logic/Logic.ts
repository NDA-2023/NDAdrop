import { DateTime } from "luxon";

export function formatTime(timestamp: DateTime): string {
    // let timeString: string = ""
    // timeString += String(timestamp.getHours()).padStart(2, '0');
    // timeString += ":"
    // timeString += String(timestamp.getMinutes()).padStart(2, '0');
    // return timeString
    return timestamp.toLocaleString(DateTime.TIME_24_SIMPLE);
  }