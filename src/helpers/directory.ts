import fs from 'fs';

export const createImagesDirectory = () => {
  const directory = process.env.NODE_ENV === 'development' ? './src/images' : './dist/images';

  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
      console.log('Directory is created');
    }

    console.log('Directory already exists');
  } catch (error) {
    console.error(error);
  }
};
