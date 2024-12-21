import { z } from "zod";
//In tRPC, Zod is commonly used to define and validate the inputs to your procedures. It ensures that the data sent to your API is correct and prevents runtime errors caused by invalid or malformed data.
import { createTRPCRouter, privateProcedure } from "../trpc";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";


export const authoriseAccountAccess = async (accountId: string, userId: string) => {
  const account = await db.account.findFirst({
      where: {
          id: accountId,
          userId: userId,
      },
      select: {
          id: true, emailAddress: true, name: true, token: true
      }
  })
  if (!account) throw new Error("Invalid token")
  return account
}
const inboxFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  inboxStatus: true
})

const sentFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  sentStatus: true
})

const draftFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  draftStatus: true
})

//grouping all the routers together
export const accountRouter = createTRPCRouter({
  //get use account informations
  getAccounts: privateProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
      },
    });
  }),
  getNumThreads: privateProcedure.input(z.object({
    accountId: z.string(),
    tab: z.string()
})).query(async ({ ctx, input }) => {
    const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)
    let filter: Prisma.ThreadWhereInput = {}
    if (input.tab === "inbox") {
        filter = inboxFilter(account.id)
    } else if (input.tab === "sent") {
        filter = sentFilter(account.id)
    } else if (input.tab === "drafts") {
        filter = draftFilter(account.id)
    }
    return await ctx.db.thread.count({
        where: filter
    })
}),
getThreads: privateProcedure.input(z.object({
  accountId: z.string(),
  tab: z.string(),
  done: z.boolean()
})).query(async ({ ctx, input }) => {
  const account = await authoriseAccountAccess(input.accountId, ctx.auth.userId)

  let filter: Prisma.ThreadWhereInput = {}
  if (input.tab === "inbox") {
      filter = inboxFilter(account.id)
  } else if (input.tab === "sent") {
      filter = sentFilter(account.id)
  } else if (input.tab === "drafts") {
      filter = draftFilter(account.id)
  }

  filter.done = {
      equals: input.done
  }

  const threads = await ctx.db.thread.findMany({
      where: filter,
      include: {
          emails: {
              orderBy: {
                  sentAt: "asc"
              },
              select: {
                  from: true,
                  body: true,
                  bodySnippet: true,
                  emailLabel: true,
                  subject: true,
                  sysLabels: true,
                  id: true,
                  sentAt: true
              }
          }
      },
      take: 15,
      orderBy: {
          lastMessageDate: "desc"
      }
  })
  return threads
}),

    
});

/**
 * This module defines the `accountRouter` for tRPC, which provides API endpoints to manage 
 * and retrieve account-related data and threads. It includes:
 * 
 * - **Account Authorization**: Ensures users can only access their own accounts.
 * - **Filters and Queries**: Fetches thread counts and details based on filters (inbox, sent, drafts).
 * - **Endpoints**:
 *   1. `getAccounts`: Retrieves a user's accounts with basic details.
 *   2. `getNumThreads`: Fetches the count of threads for a specific account and tab.
 *   3. `getThreads`: Retrieves detailed thread information for a specific account and tab.
 * 
 * The code ensures secure access, validates inputs with Zod, and uses Prisma for database operations.
 */
