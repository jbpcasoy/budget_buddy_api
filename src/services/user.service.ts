import { Prisma, PrismaClient } from "@prisma/client";

async function create(values: Prisma.UserCreateInput) {
  const prisma = new PrismaClient();

  const { email, googleId, name } = values;

  const user = await prisma.user.create({
    data: {
      email,
      googleId,
      name,
    },
  });

  await prisma.$disconnect();

  return user;
}

async function findById(id: string) {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });

  await prisma.$disconnect();

  return user;
}

async function findByGoogleId(googleId: string) {
  const prisma = new PrismaClient();

  const user = await prisma.user.findFirst({
    where: {
      googleId: {
        equals: googleId,
      },
    },
  });

  await prisma.$disconnect();

  return user;
}

const UserService = {
  create,
  findById,
  findByGoogleId,
};

export default UserService;
