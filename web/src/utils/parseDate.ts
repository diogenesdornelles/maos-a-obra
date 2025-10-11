import moment from 'moment';

export const parseDateToIso = (value?: string) => {
  if (!value) return undefined;
  const parsed = moment(value, 'DD/MM/YYYY', true);
  return parsed.isValid() ? parsed.toISOString() : undefined;
};
