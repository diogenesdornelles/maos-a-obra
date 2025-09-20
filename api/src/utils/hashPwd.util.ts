import bcrypt from 'bcryptjs';

const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, 10);
};

export default hashPassword;
