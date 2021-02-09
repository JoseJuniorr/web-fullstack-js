import { AccountSettings } from "ms-commons/api/clients/emailService";
import { AccountStatus } from "./accountsStatus";

export interface IAccount {
  id?: number;
  name: string;
  email: string;
  password: string;
  status?: AccountStatus;
  domain: string;
  settings?: AccountSettings;
}
