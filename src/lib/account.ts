import axios from "axios";
import { EmailMessage, SyncResponse, SyncUpdatedResponse } from "./type";

const API_BASE_URL='https://api.aurinko.io/v1';
export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }
  private async startSync() {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );
    return response.data;
  }
  //this function is to the update emails :
  async getUpdatedEmails({ deltaToken, pageToken }: { deltaToken?: string, pageToken?: string }): Promise<SyncUpdatedResponse> {
    // console.log('getUpdatedEmails', { deltaToken, pageToken });
    let params: Record<string, string> = {};
    if (deltaToken) {
        params.deltaToken = deltaToken;
    }
    if (pageToken) {
        params.pageToken = pageToken;
    }
    const response = await axios.get<SyncUpdatedResponse>(
        `${API_BASE_URL}/email/sync/updated`,
        {
            params,
            headers: { Authorization: `Bearer ${this.token}` }
        }
    );
    return response.data;
}
  //We need to create a private function that is gonna fetch response :
  async performInitialSync() {
    try {
      //start the sync process :
      let syncResponse = await this.startSync(); // Sync emails from the last 7 days
      const daysWithin = 3
     

      // Wait until the sync is ready
      while (!syncResponse.ready) {
        await new Promise<void>(resolve => setTimeout(resolve, 1000)); // Specify <void> to clarify resolve's parameter
        syncResponse = await this.startSync();
    }
    let storedDeltaToken: string = syncResponse.syncUpdatedToken;
let updatedResponse = await this.getUpdatedEmails({ deltaToken: storedDeltaToken });
if (updatedResponse.nextDeltaToken) {
  storedDeltaToken = updatedResponse.nextDeltaToken
}
let allEmails: EmailMessage[] = updatedResponse.records;

// Fetch all pages if there are more
while (updatedResponse.nextPageToken) {
  updatedResponse = await this.getUpdatedEmails({ pageToken: updatedResponse.nextPageToken });
  allEmails = allEmails.concat(updatedResponse.records);
  if (updatedResponse.nextDeltaToken) {
      storedDeltaToken = updatedResponse.nextDeltaToken
  }
}
return {
  emails: allEmails,
  deltaToken: storedDeltaToken,
}
    } catch (error) {
    if(axios.isAxiosError(error)){
      console.error(JSON.stringify(error.response?.data,null,2))
    }else{
      console.error(error)
    }
    }
  }
}

export default Account;
