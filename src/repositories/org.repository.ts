import prisma from "../config/database.ts";

export const findMembershipByUserId = async (userId: number) => {
  return await prisma.orgMember.findFirst({
    where: {
      userId,
    },
  });
};
