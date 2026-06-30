import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { transcribeAudio } from "./_core/voiceTranscription";
import { TRPCError } from "@trpc/server";
import { storageRouter } from "./storage-router";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  // Storage router for file uploads
  storage: storageRouter,

  // Voice transcription router
  voice: router({
    transcribe: publicProcedure
      .input(
        z.object({
          audioUrl: z.string().url("Audio URL must be a valid URL"),
          language: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          console.log('[tRPC] voice.transcribe called with:', {
            audioUrl: input.audioUrl.substring(0, 50) + '...',
            language: input.language,
            prompt: input.prompt?.substring(0, 50),
          });

          const result = await transcribeAudio({
            audioUrl: input.audioUrl,
            language: input.language,
            prompt: input.prompt,
          });

          // Check if result is an error
          if ('error' in result) {
            console.error('[tRPC] Transcription error:', result);
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: result.error,
              cause: result,
            });
          }

          console.log('[tRPC] Transcription successful:', {
            text: result.text.substring(0, 50) + '...',
            language: result.language,
            duration: result.duration,
            segmentCount: result.segments?.length || 0,
          });

          return {
            text: result.text,
            language: result.language,
            duration: result.duration,
            segments: result.segments || [],
          };
        } catch (error) {
          console.error('[tRPC] Unexpected error in voice.transcribe:', error);
          if (error instanceof TRPCError) {
            throw error;
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to transcribe audio',
            cause: error,
          });
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
