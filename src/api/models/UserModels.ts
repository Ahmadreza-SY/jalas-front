export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public isAdmin: boolean
  ) {
  }
}

export class LoginResponse {
  constructor(
    public token: string,
    public type: string
  ) {
  }
}