import { ForbiddenError, subject } from "@casl/ability";
import { accessibleBy } from "@casl/prisma";
import { Prisma, PrismaClient, Profile, User } from "@prisma/client";
import { UserAbility } from "../abilities/user.ability";

export default class ProfileService {
  constructor(private ability: UserAbility) {}

  create = async (values: Prisma.ProfileCreateInput) => {
    const user = values.User.connect;
    ForbiddenError.from(this.ability).throwUnlessCan(
      "connectUserToProfile",
      subject("User", user as User)
    );

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
  };

  findMany = async (limit: number, page: number) => {
    const prisma = new PrismaClient();

    const profiles = await prisma.profile.findMany({
      take: limit,
      skip: limit * page,
      where: {
        AND: [accessibleBy(this.ability).Profile],
      },
    });

    await prisma.$disconnect();

    return profiles;
  };

  findById = async (id: string) => {
    const prisma = new PrismaClient();

    const profile = await prisma.profile.findFirstOrThrow({
      where: {
        AND: [
          accessibleBy(this.ability).Profile,
          {
            id: {
              equals: id,
            },
          },
        ],
      },
    });

    await prisma.$disconnect();
    return profile;
  };

  findByUserId = async (userId: string) => {
    const prisma = new PrismaClient();

    const profile = await prisma.profile.findFirstOrThrow({
      where: {
        AND: [
          accessibleBy(this.ability).Profile,
          {
            userId: {
              equals: userId,
            },
          },
        ],
      },
    });

    await prisma.$disconnect();
    return profile;
  };

  update = async (id: string, values: Prisma.ProfileUpdateInput) => {
    const profile = await this.findById(id);

    ForbiddenError.from(this.ability).throwUnlessCan(
      "update",
      subject("Profile", profile)
    );

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

    const updatedProfile = prisma.profile.update({
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
    return updatedProfile;
  };

  remove = async (id: string) => {
    const profile = await this.findById(id);

    ForbiddenError.from(this.ability).throwUnlessCan(
      "delete",
      subject("Profile", profile as Profile)
    );
    const prisma = new PrismaClient();

    const deletedProfile = await prisma.profile.delete({
      where: {
        id,
      },
    });

    await prisma.$disconnect();
    return deletedProfile;
  };
}
