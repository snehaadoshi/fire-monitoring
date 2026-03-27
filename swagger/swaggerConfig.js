// NEW FEATURE: Swagger API Documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fire Monitoring System API',
      version: '1.0.0',
      description: 'API documentation for Fire Monitoring System with ML integration'
    },
    servers: [
      {
        url: 'https://fire-monitoring.onrender.com',
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js', './swagger/apiDocs.js']
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));
  console.log('Swagger docs available at /api/docs');
}

module.exports = { setupSwagger };
