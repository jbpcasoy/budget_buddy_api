import { Prisma, PrismaClient } from "@prisma/client";

async function create(values: Prisma.SessionCreateInput) {
  const prisma = new PrismaClient();

  const session = await prisma.session.upsert({
    create: {
      User: values.User,
    },
    update: {
      User: values.User,
    },
    where: {
      userId: values.User.connect?.id as string,
    },
  });

  await prisma.$disconnect();

  return session;
}

async function findById(id: string) {
  const prisma = new PrismaClient();

  const session = await prisma.session.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });

  await prisma.$disconnect();

  return session;
}

async function findByUserId(userId: string) {
  const prisma = new PrismaClient();

  const session = await prisma.session.findFirst({
    where: {
      userId: {
        equals: userId,
      },
    },
  });

  await prisma.$disconnect();

  return session;
}

async function remove(id: string) {
  const prisma = new PrismaClient();

  const session = await prisma.session.delete({
    where: {
      id,
    },
  });

  await prisma.$disconnect();

  return session;
}

const SessionService = {
  create,
  findById,
  findByUserId,
  remove,
};

export default SessionService;
