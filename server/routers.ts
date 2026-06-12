import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

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

  // AKREP ZEKA AI Router
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
          // AKREP ZEKA'nın beyni: En güçlü model gpt-4o kullanılıyor
          const result = await invokeLLM({
            model: "gpt-4o",
            messages: input.messages,
            maxTokens: 1000,
          });

          let content = "";
          const messageContent = result.choices[0].message.content;
          
          if (typeof messageContent === 'string') {
            content = messageContent;
          } else if (Array.isArray(messageContent)) {
            content = messageContent
              .filter(part => 'type' in part && part.type === 'text')
              .map(part => (part as any).text)
              .join("");
          }

          return {
            content: content || "AKREP ZEKA şu an yanıt veremiyor, lütfen tekrar dene. 🦂",
          };
        } catch (error) {
          console.error("AKREP ZEKA AI Error:", error);
          throw new Error("AKREP ZEKA bağlantısında bir sorun oluştu.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
