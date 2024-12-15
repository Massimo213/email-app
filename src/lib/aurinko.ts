'use server'
import { auth } from "@clerk/nextjs/server"
import axios from 'axios';
 
export const  getAurinkoAuthUrl =async (serviceType: 'Google'|'Office365') => {
  const {userId} =await auth()
  if(!userId) throw new Error ('Unauthorized')
const params = new URLSearchParams({
  clientId: process.env.AURINKO_CLIENT_ID as string,
  serviceType,
  scopes: "Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
  responseType:'code',
  returnUrl:`${process.env.NEXT_PUBLIC_URL }/api/aurinko/callback`   
})
//redirect to google content screen
return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}
//Create a method that is going to exchang the code into a token
export const exchangeCodeForAccessToken =async (code:string)=>{
  try{
    //this url may be incorrect 
const response =await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`,{}, {
  auth:{
    username:process.env.AURINKO_CLIENT_ID as string,
    password:process.env.AURINKO_CLIENT_SECRET as string,

  }
})
return response.data as {
  accountId: number,
  accessToken: string,
  userId: string,
  userSession: string
}
} catch (error){
  //if it's an axios error , it will be an instance of AxiosError
  if (axios.isAxiosError(error)) {
    console.error('Error fetching Aurinko token:', error.response?.data);
} else {
    console.error('Unexpected error fetching Aurinko token:', error);
}
}
}
//Create a Method that is going to get us the users data ( code -> token -> user data)
export const getAccountDetails = async (accessToken: string) => {
  try {
      const response = await axios.get('https://api.aurinko.io/v1/account', {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
      return response.data as {
          email: string,
          name: string
      };
  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error('Error fetching account details:', error.response?.data);
      } else {
          console.error('Unexpected error fetching account details:', error);
      }
      throw error;
  }
}
