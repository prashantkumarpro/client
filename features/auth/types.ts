export interface LoginResponse {
  message: string
}

export interface LoginCredentials {
  email: string,
  password: string
}

export interface User {
  name: string,
  email: string
}