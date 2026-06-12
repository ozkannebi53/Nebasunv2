import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeAI, formatAIResponse } from "./_core/ai-service";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // LIMA AI Router — OpenAI uyumlu stabil AI
  ai: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["system", "user", "assistant"]),
              content: z.string().max(4000),
            })
          ).max(20),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const content = await invokeAI(input.messages);
          return {
            content: formatAIResponse(content),
            error: null,
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Bilinmeyen hata";
          return {
            content: null,
            error: errorMsg,
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
