export const toTimestamp = (date: string) => {
  const [day, month, year] = date.split("/").map((part) => Number(part));
  const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));
  return {
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
  };
};
