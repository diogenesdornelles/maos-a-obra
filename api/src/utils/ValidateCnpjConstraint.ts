import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateCnpj', async: false })
export class ValidateCnpjConstraint implements ValidatorConstraintInterface {
  validate(cnpj: string): boolean {
    return validateCNPJ(cnpj);
  }

  defaultMessage(): string {
    return 'CNPJ inválido';
  }
}

export function validateCNPJ(cnpj: string): boolean {
  const cleanedCNPJ = cnpj.replace(/\D/g, '');

  if (cleanedCNPJ.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(cleanedCNPJ)) {
    return false;
  }

  const calculateDigit = (cnpjPart: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnpjPart.charAt(i), 10) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weightsFirst = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const firstDigit = calculateDigit(cleanedCNPJ.substring(0, 12), weightsFirst);

  if (firstDigit !== parseInt(cleanedCNPJ.charAt(12), 10)) {
    return false;
  }

  const weightsSecond = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondDigit = calculateDigit(
    cleanedCNPJ.substring(0, 13),
    weightsSecond,
  );

  if (secondDigit !== parseInt(cleanedCNPJ.charAt(13), 10)) {
    return false;
  }

  return true;
}
