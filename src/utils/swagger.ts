import { Express } from "express";
import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "../config";

const localUrl = config.url.local;
const forwardedUrl = config.url.forward;

const options: Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title:
        "OneEC",
      description: "API Documentaion",
      version: "2.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        apiKeyAuth: {
          type: "apiKey",
          name: "x-api-key",
          in: "header",
        },
      },
    },
    security: [
      {
        apiKeyAuth: [],
      },
      {
        bearerAuth: [],
      },
    ],
    // servers: [
    //   {
    //     url: localUrl, // Base URL for your API
    //     description: "Local development server",
    //   },
    //   {
    //     url: forwardedUrl, // Base URL for your API
    //     description: "Port Forward Url",
    //   },
    // ],
  },
  apis: ["src/routers/*/*.{js,ts}", "dist/routers/*/*.{js,ts}"],
};

const spec = swaggerJsDoc(options);

const swagger = (app: Express) => {
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      customCssUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css",
    })
  );
};

export default swagger;