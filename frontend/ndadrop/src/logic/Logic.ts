export function formatTime(timestamp: Date): string {
    let timeString: string = ""
    timeString += String(timestamp.getHours()).padStart(2, '0');
    timeString += ":"
    timeString += String(timestamp.getMinutes()).padStart(2, '0');
    return timeString
  }