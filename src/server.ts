import app from './app';
import { connectDB, PORT } from './config';

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
