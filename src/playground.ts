import { db } from "./server/db"

 await db.user.create({
  data: {
    emailAddress: "test@gmail.com",
    firstName: "Sync",
    lastName: "Alan",
    id: "123456"
  }
 })
 console.log("done");