import express from 'express';
import swaggerUI from 'swagger-ui-express';
import openAPIDefinition from './openapi';

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDefinition));

app.listen(3000);
