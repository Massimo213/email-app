//this page is connected to aurinko.ts as we call the functions
 import {waitUntil} from '@vercel/functions'
import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  //Check if the user is logged in ,if not throw an error
  if (!userId)
    return NextResponse.json({ message: "unauthorized" }, { status: 400 });
  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status != "success")
    return NextResponse.json(
      { message: "Failes to Link the account" },
      { status: 400 },
    );
  //now we need the code to exchange it for the access token:
  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "No code provided" }, { status: 400 });

  const token = await exchangeCodeForAccessToken(code);
  if (!token)
    return NextResponse.json(
      { message: "Failed to get the token" },
      { status: 400 },
    );
//axios call to get the account details then make sure we have it pushed to prisma and push eveything into the database and mae the prismaClientError

    const accountDetails = await getAccountDetails(token.accessToken)
    await db.account.upsert({
        where: { id: token.accountId.toString() },
        create: {
            id: token.accountId.toString(),
            userId,
            accessToken: token.accessToken,
            emailAddress: accountDetails.email,
            name: accountDetails.name
        },
        update: {
            accessToken: token.accessToken,
        }
    })
    //What it is for is to redirect the user directly without having to wait for the page to load for 30s and getting stuck
    waitUntil(

      axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { accountId: token.accountId.toString(), userId }).then((res) => {
          console.log(res.data)
      }).catch((err) => {
          console.log(err.response.data)
      })
  )
  return NextResponse.redirect(new URL('/mail',req.url));
};

export default GET;
