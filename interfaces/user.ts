export interface UserLogin {
  email: string;
  password: string;
}
export interface BodyUpdate {
  email: string;
  username: string;
  description: string;
  avatar?: string;
}

// export interface TokenInteface {
//   setToken: (token: string, id: string) => void;
// }
