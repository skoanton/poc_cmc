import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllCustomers() {
  return await prisma.customer.findMany();
}

export async function getCustomerById(id: string) {
  return await prisma.customer.findUnique({
    where: { id },
  });
}

export async function addMedia(media: Prisma.MediaCreateInput) {
  return await prisma.media.create({
    data: media,
  });
}
