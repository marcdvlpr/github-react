import bcrypt from 'bcrypt';

export const generatePasswordHash = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (password: string, passwordHash: string) => {
  return bcrypt.compare(password, passwordHash);
};
