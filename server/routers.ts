import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeGemini } from "./_core/gemini";

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

  // AKREP ZEKA AI Router - Gemini API Powered
  ai: router({
    chat: publicProcedure
      .input(
        z.object({
          messages: z.array(
            z.object({
              role: z.enum(["system", "user", "assistant"]),
              content: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // AKREP ZEKA'nın beyni: Gemini 1.5 Flash kullanılıyor
          const content = await invokeGemini(input.messages);

          return {
            content: content || "AKREP ZEKA şu an derin düşüncelerde, lütfen tekrar dene. 🦂",
          };
        } catch (error) {
          console.error("AKREP ZEKA Gemini Error:", error);
          return {
            content: "Bağlantımda bir sorun oluştu ama AKREP ZEKA her zaman burada. Lütfen tekrar dener misin? 🦂",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
