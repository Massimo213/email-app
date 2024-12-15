import React from "react";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAurinkoAuthUrl } from "@/lib/aurinko";
interface AccountSwitcherProps {
  isCollapsed: boolean;
}
export const AccountSwitcher = ({ isCollapsed }: AccountSwitcherProps) => {
  const { data } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  if (!data) return null;
  return (
    <>
      <Select defaultValue={accountId} onValueChange={setAccountId}>
        <SelectTrigger className={cn(
            "flex w-full flex-1 items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
            isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
          )}
          aria-label="Select account">
            <SelectValue placeholder='Select an account'>
              <span className={cn({'hidden':isCollapsed})}>
               {data.find(account=> account.id === accountId)?.emailAddress[0]} 
              </span>
              <span className={cn({'hidden':isCollapsed,'m1-2':true})}>
                {data.find(account=> account.id === accountId)?.emailAddress}
              </span>
            </SelectValue>
            <SelectContent>
              {data.map((account)=>{
                return(
                  <SelectItem key={account.id} value={account.id}></SelectItem>
                )
              })}
              <div onClick ={async ()=>{
                const authUrl =await getAurinkoAuthUrl('Google')
                window.location.href= authUrl
              }} className=" ">
                <Plus className=" size-4 mr-1"/>
                Add account 
              </div>
            </SelectContent>
          </SelectTrigger>
      </Select>
    </>
  );
};
