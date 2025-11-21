import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getActiveVideos, getAllVideos, createVideo, updateVideo, deleteVideo,
  getMissions, getMissionById, getExperiencePosts
} from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Video routes
  videos: router({
    list: publicProcedure.query(async () => {
      return getActiveVideos();
    }),
    listAll: adminProcedure.query(async () => {
      return getAllVideos();
    }),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().nullable().optional(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().nullable().optional(),
        fileKey: z.string(),
        duration: z.number().nullable().optional(),
        displayOrder: z.number().default(0),
        isActive: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return createVideo({
          ...input,
          description: input.description ?? null,
          thumbnailUrl: input.thumbnailUrl ?? null,
          duration: input.duration ?? null,
        });
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        fileKey: z.string().optional(),
        duration: z.number().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateVideo(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteVideo(input.id);
        return { success: true };
      }),
  }),

  // Mission routes
  missions: router({
    list: publicProcedure.query(async () => {
      return getMissions();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getMissionById(input.id);
      }),
  }),

  // Experience routes
  experience: router({
    list: publicProcedure.query(async () => {
      return getExperiencePosts();
    }),
  }),
});

export type AppRouter = typeof appRouter;
