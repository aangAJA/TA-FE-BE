// app/types.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    profile_picture?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }