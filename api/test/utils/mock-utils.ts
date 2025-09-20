export class MockUtils {
  static generateValidCPF(): string {
    const randomDigit = () => Math.floor(Math.random() * 9) + 1;
    const cpf = Array.from({ length: 9 }, randomDigit);

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += cpf[i] * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    cpf.push(remainder === 10 ? 0 : remainder);

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += cpf[i] * (11 - i);
    }
    remainder = (sum * 10) % 11;
    cpf.push(remainder === 10 ? 0 : remainder);

    return cpf.join('');
  }
  static generateValidCNPJ(): string {
    const randomDigit = () => Math.floor(Math.random() * 9) + 1;
    const cnpj = Array.from({ length: 12 }, randomDigit);

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += cnpj[i] * weights1[i];
    }
    let remainder = sum % 11;
    cnpj.push(remainder < 2 ? 0 : 11 - remainder);

    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += cnpj[i] * weights2[i];
    }
    remainder = sum % 11;
    cnpj.push(remainder < 2 ? 0 : 11 - remainder);

    return cnpj.join('');
  }

  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `test-${timestamp}-${randomSuffix}@example.com`;
  }
}
