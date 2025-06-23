export interface User {
  user_id: string;
  name: string;
  nickname: string;
  firstname: string;
  lastname: string;
  country: string;
  city: string;
  date_of_birth: string;
  registred_at: string;
  gender: string;
  balance?: number
}