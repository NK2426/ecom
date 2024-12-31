

export interface UserHttpResponse {
  status: string
  code: string
  message: string
  data: | any
}

export class User {
  userID: string
  name: string
  mobile: string
  userEmail: string
  UserPassword: string
  accessToken: string

  constructor(authData: any) {
    this.userID = authData.userID;
    this.name = authData.name || 'Guest';
    this.mobile = authData.mobile || '';
    this.accessToken = authData.accessToken;
    this.userEmail = authData.userEmail;
    this.UserPassword = authData.userPassword;
  }
}
