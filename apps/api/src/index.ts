import express from 'express';
import userRouter from './routes/user';
import creatorRouter from './routes/creator';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/user', userRouter);
app.use('/creators', creatorRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Somali Cameo API!' });
});

app.listen(PORT, () => {
  console.log(`Somali Cameo API running on port ${PORT}`);
});
