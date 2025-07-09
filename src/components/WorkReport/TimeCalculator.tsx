
export const calculateWorkingHours = (startTime: string, endTime: string, breakMinutes: number = 0) => {
  const startDate = new Date(`2000-01-01T${startTime}`);
  const endDate = new Date(`2000-01-01T${endTime}`);
  const diffMs = endDate.getTime() - startDate.getTime();
  const totalHours = Math.max(0, diffMs / (1000 * 60 * 60));
  const breakHours = breakMinutes / 60;
  return Math.max(0, totalHours - breakHours);
};

export const formatTime = (hours: number) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours}h ${minutes}m`;
};
