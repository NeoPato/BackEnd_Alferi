import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma"

export async function registerUsers (app: FastifyInstance) {
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/users', {
        schema: {
            body: z.object({
                name: z.string().min(1),
                cpf: z.string().max(14),
                email: z.string().email(),  
                dateOfBirth: z.string(),                
                phone: z.string().max(9),
                password: z.string().min(5),
            }),
            
            response: {
                201: z.object({
                    userId: z.number(),
                })
            },
        },
    }, async (request, reply) => {

        
        
        const {
            name,
            cpf,
            email,
            dateOfBirth,
            phone,
            password} = request.body
            
            const clientVerfEmail = await prisma.user.findUnique({
                where: {
                  email: email,
                },
              });
              
            
            if (clientVerfEmail !== null){
                throw new Error ('This e-mail is already')
            }

            const clientVerfCpf = await prisma.user.findUnique({
                where: {
                  cpf: cpf,
                },
              });
              
            
            if (clientVerfCpf !== null){
                throw new Error ('This cpf is already registered')
            }

            const users = await prisma.user.create({
                data: {
                    name: name, 
                    cpf: cpf,
                    email:  email,
                    dateOfBirth: dateOfBirth,
                    phone: phone,
                    password: password,
                },
            })

        return reply.status(201).send({userId: users.id})
    })
}