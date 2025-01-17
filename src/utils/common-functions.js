const months = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec',
};

export const formatDate = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const year = unformattedDate.slice(6, 10);
  const time = unformattedDate.slice(11);
  return `${year}-${month}-${day}T${time}+05:30`;
};

export const formatDateAbsolute = (unformattedDate) => {
  const day = unformattedDate.slice(0, 2);
  const month = unformattedDate.slice(3, 5);
  const time = unformattedDate.slice(11);
  return `${day} ${months[month]}, ${time.slice(0, 5)} IST`;
};

export const formatDateInMillis = (epochTime) => {
  const unformattedDate = new Date(epochTime + 5.5 * 3600000);
  const day = unformattedDate.getDate();
  let month = unformattedDate.getMonth() + 1;
  month = month < 10 ? '0' + month : month.toString();
  const year = unformattedDate.getFullYear();
  // const day = unformattedDate.getDate();
  // const day = unformattedDate.getDate();
  const hours = unformattedDate.getHours();
  const minutes =
    unformattedDate.getMinutes() < 10
      ? '0' + unformattedDate.getMinutes()
      : unformattedDate.getMinutes();

  return `${day} ${months[month]}, ${year} ${hours}:${minutes} IST`;
};
