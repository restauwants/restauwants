import moment from "moment";

export const fromNow = (date: Date | string): string => {
  return moment(date).fromNow();
};
