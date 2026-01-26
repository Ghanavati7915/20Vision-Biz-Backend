export interface TokenPayload {
  userName: string;
  firstName: string;
  lastName: string;
  title: string;
  avatar: any;
  permissions: string[];
  id: number;
  sub:number;
  isPersonal : boolean
}