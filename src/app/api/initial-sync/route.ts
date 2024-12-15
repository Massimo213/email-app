import { NextRequest,NextResponse } from "next/server";
import Account from "@/lib/account";
import { db } from "@/server/db";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
 //this one is going to be for  creating an endpoint API
 export const POST =async (req: NextRequest)=>{
  const {accountId ,userId}=await req.json()
  if(!accountId ||!userId){
return NextResponse.json({error: "Missing accountIdcor userId"},{status:400})
  }
  const dbAccount =await db.account.findUnique({
where :{
  id:accountId,
  userId
}
  })
  if(!dbAccount)return NextResponse.json({error: "Account not Found"},{status:400})
  const account =new Account(dbAccount.accessToken)
  const response =await account.performInitialSync()
  if(!response){
    return NextResponse.json({error: "Failed to perfomr initial sync"},{status:500})
  }
  //array destruction :
  const{emails,deltaToken}=response
  console.log('emails',emails )
  //Keep Track of rthe latest delta token
// await db.account.update({
//   where :{
//     id:accountId
//   },
//   data:{
//     nextDeltaToken: deltaToken
//   }
// })  
 await syncEmailsToDatabase(emails,accountId)
return NextResponse.json({success:true},{status:200})
 }


