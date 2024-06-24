import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma"

export async function getUsersBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
    .get('/users/:userId/badge', {
        schema: {
            params: z.object({
                userId: z.string()
            }),
            response: {}
        }
    }, async (request, reply) => {
        const { userId } = request.params;

        const userIdNumber = parseInt(userId, 10);

        if (isNaN(userIdNumber)) {
            reply.code(400).send({ error: "Parâmetro userId inválido" });
            return;
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userIdNumber
            }
        });

        if (!user) {
            throw new Error('User not found.');
        }

        return reply.send({ user });
    });
}
