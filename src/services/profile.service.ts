import { Prisma, PrismaClient } from "@prisma/client";

async function create(values: Prisma.ProfileCreateInput) {
  const prisma = new PrismaClient();
  const {
    User,
    barangay,
    city,
    country,
    firstName,
    lastName,
    province,
    street,
    zipCode,
    middleName,
  } = values;

  const profile = await prisma.profile.create({
    data: {
      barangay,
      city,
      country,
      firstName,
      lastName,
      province,
      street,
      zipCode,
      middleName,
      User,
    },
  });

  await prisma.$disconnect();

  return profile;
}

async function findMany(limit: number, page: number) {
  const prisma = new PrismaClient();

  const profiles = await prisma.profile.findMany({
    take: limit,
    skip: limit * page,
  });

  await prisma.$disconnect();

  return profiles;
}

async function findById(id: string) {
  const prisma = new PrismaClient();

  const profile = await prisma.profile.findFirst({
    where: {
      id: {
        equals: id,
      },
    },
  });

  await prisma.$disconnect();
  return profile;
}

async function findByUserId(userId: string) {
  const prisma = new PrismaClient();

  const profile = await prisma.profile.findFirst({
    where: {
      userId: {
        equals: userId,
      },
    },
  });

  await prisma.$disconnect();
  return profile;
}

async function update(id: string, values: Prisma.ProfileUpdateInput) {
  const prisma = new PrismaClient();
  const {
    barangay,
    city,
    country,
    firstName,
    lastName,
    middleName,
    province,
    street,
    zipCode,
  } = values;

  const profile = prisma.profile.update({
    data: {
      barangay,
      city,
      country,
      firstName,
      lastName,
      middleName,
      province,
      street,
      zipCode,
    },
    where: {
      id,
    },
  });

  await prisma.$disconnect();
  return profile;
}

async function remove(id: string) {
  const prisma = new PrismaClient();

  const profile = await prisma.profile.delete({
    where: {
      id,
    },
  });

  await prisma.$disconnect();
  return profile;
}

const ProfileService = {
  create,
  findMany,
  findById,
  findByUserId,
  update,
  remove,
};
export default ProfileService;
