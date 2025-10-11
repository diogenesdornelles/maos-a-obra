export function arrayOfErrors(error?: string | string[]): string {
  if (!error) return '';

  if (Array.isArray(error)) {
    return error.join('; ');
  }

  return error;
}
