import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const exampleRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return {
        greeting: `hello to ${ctx.session.user?.name} by ${input.name}`,
      };
    }),
  fetchUser: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const retrievedUser = await ctx.prisma.user.findUnique({
        where: { username: input.username },
      });
      return retrievedUser;
    }),
  updateUsernameBio: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const requestingUser = ctx.session.user;
      if (!requestingUser)
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'User not authenticated',
        });
      const userToUpdate = await ctx.prisma.user.findUnique({
        where: { id: requestingUser.id },
      });
      if (!userToUpdate)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      const updatedUser = await ctx.prisma.user.update({
        where: { id: requestingUser.id },
        data: {
          username: input.username,
          bio: input.bio,
        },
      });
      return updatedUser;
    }),
});
