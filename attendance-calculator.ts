export interface AttendanceCalcResult {
  status: "PRESENT" | "LATE" | "HALF_DAY" | "ABSENT";
  lateMinutes: number;
  totalMinutes: number;
  overtimeMinutes: number;
}

export function calculateAttendanceStatus(
  checkIn: Date,
  checkOut: Date | null,
  setting: {
    officeStartTime: string; // e.g. "09:00"
    officeEndTime: string;   // e.g. "17:00"
    graceMinutes: number;     // e.g. 15
    fullDayMinutes: number;   // e.g. 480
    halfDayMinutes: number;   // e.g. 240
    overtimeThresholdMinutes: number; // e.g. 540
    allowOvertime: boolean;
  }
): AttendanceCalcResult {
  // Parse office start time on check-in date
  const [startHour, startMinute] = setting.officeStartTime.split(":").map(Number);
  const scheduledStart = new Date(checkIn);
  scheduledStart.setHours(startHour, startMinute, 0, 0);

  // Late calculation
  const diffFromStartMs = checkIn.getTime() - scheduledStart.getTime();
  const diffFromStartMins = Math.floor(diffFromStartMs / (1000 * 60));
  
  let lateMinutes = 0;
  if (diffFromStartMins > setting.graceMinutes) {
    lateMinutes = diffFromStartMins;
  }

  // Total working minutes calculation
  let totalMinutes = 0;
  let overtimeMinutes = 0;

  if (checkOut) {
    const durationMs = checkOut.getTime() - checkIn.getTime();
    totalMinutes = Math.max(0, Math.floor(durationMs / (1000 * 60)));

    if (setting.allowOvertime && totalMinutes > setting.overtimeThresholdMinutes) {
      overtimeMinutes = totalMinutes - setting.overtimeThresholdMinutes;
    }
  }

  // Status determination
  let status: "PRESENT" | "LATE" | "HALF_DAY" | "ABSENT" = "PRESENT";

  if (lateMinutes > 0) {
    status = "LATE";
  }

  if (checkOut && totalMinutes < setting.halfDayMinutes) {
    status = "HALF_DAY";
  }

  return {
    status,
    lateMinutes,
    totalMinutes,
    overtimeMinutes,
  };
}
