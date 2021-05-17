import fs from 'fs';

export const createDirectory = (directory: string) => {
  try {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory);

    return true;
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
  }
};
