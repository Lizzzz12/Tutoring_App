import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import Backend from 'i18next-fs-backend';
import routes from './routes.js';

dotenv.config();

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'ka',
    preload: ['ka', 'en'],
    backend: {
      loadPath: './locales/{{lng}}/translation.json'
    },
    detection: {
      order: ['querystring', 'header'],
      caches: false
    }
  });

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

app.use(middleware.handle(i18next));
app.use('/api', routes);

// 404 Not Found handler (translated)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: req.t('error.route_not_found')
  });
});

// Global error handler (translated)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: req.t('error.internal_server')
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
