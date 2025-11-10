import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
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
      return db.getActiveVideos();
    }),
    listAll: adminProcedure.query(async () => {
      return db.getAllVideos();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getVideoById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        fileKey: z.string(),
        duration: z.number().optional(),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return db.createVideo(input);
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
        await db.updateVideo(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteVideo(input.id);
        return { success: true };
      }),
  }),

  // Project routes
  projects: router({
    list: publicProcedure.query(async () => {
      return db.getPublishedProjects();
    }),
    listAll: adminProcedure.query(async () => {
      return db.getAllProjects();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProjectById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        clientName: z.string().optional(),
        storyboardImageUrl: z.string().optional(),
        loraTrainingDetails: z.string().optional(),
        workflowDescription: z.string().optional(),
        finalVideoUrl: z.string().optional(),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return db.createProject(input);
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        clientName: z.string().optional(),
        storyboardImageUrl: z.string().optional(),
        loraTrainingDetails: z.string().optional(),
        workflowDescription: z.string().optional(),
        finalVideoUrl: z.string().optional(),
        isPublished: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
  }),

  // Service routes
  services: router({
    list: publicProcedure.query(async () => {
      return db.getActiveServices();
    }),
    listAll: adminProcedure.query(async () => {
      return db.getAllServices();
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getServiceById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string(),
        features: z.string(), // JSON string
        priceDescription: z.string().optional(),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return db.createService(input);
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        features: z.string().optional(),
        priceDescription: z.string().optional(),
        isActive: z.boolean().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateService(id, data);
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteService(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
