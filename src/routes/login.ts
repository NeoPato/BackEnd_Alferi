import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma"
import { z } from "zod";

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/login",
    {
      schema: {
        summary: "User login",
        tags: ["auth"],
        body: z.object({
          email: z.string().email(),
          password: z.string().min(8),
        }),
        response: {
          200: z.object({
            id: z.number(), // Defina o tipo de resposta para incluir o ID do usuário
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;

      try {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) {
          return reply
            .status(401)
            .send({ message: "Invalid email or password." });
        }

        // Compare passwords
        if (user.password !== password) {
          return reply
            .status(401)
            .send({ message: "Invalid email or password." });
        }

        // Password matches, login successful
        return reply.status(200).send({ id: user.id, message: "Login successful" });

      } catch (error) {
        console.error("Login error:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
