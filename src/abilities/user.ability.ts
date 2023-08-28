import { AbilityBuilder, PureAbility } from "@casl/ability";
import { PrismaQuery, Subjects, createPrismaAbility } from "@casl/prisma";
import { Profile, User } from "@prisma/client";

type UserSubjects = Subjects<{
  User: User;
  Profile: Profile;
}>;

export type UserAbility = PureAbility<[string, UserSubjects], PrismaQuery>;

export default function userAbility(user: User) {
  const { can, cannot, build } = new AbilityBuilder<UserAbility>(
    createPrismaAbility
  );

  can("read", "Profile");
  can("update", "Profile", {
    userId: {
      equals: user.id,
    },
  });
  can("delete", "Profile", {
    userId: {
      equals: user.id,
    },
  });
  can("read", "User", {
    id: {
      equals: user.id,
    },
  });
  can("connectUserToProfile", "User", {
    id: {
      equals: user.id,
    },
  });

  const ability = build();

  return ability;
}
