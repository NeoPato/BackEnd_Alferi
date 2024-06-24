import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { registerUsers } from "./routes/register-users.js";
import { getUsersBadge } from "./routes/get-users-badge.js";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifySwagger from "@fastify/swagger";
import fastifyCors from "@fastify/cors"
import { errorHandler } from "./error-handler.js";
import { login } from "./routes/login.js";

const app = fastify();

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token'],
});

app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "hotel.api",
      description: "API specifications for the hotel application back-end.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});

app.get("/", () => {
  return "Hotel api";
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(registerUsers);
app.register(getUsersBadge);
app.register(login)

app.setErrorHandler(errorHandler);

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running on port 3333!');
});
