export interface IUser {
  id?: string
  username: string
  password: string
  courses: ICourse[]
  numApproved?: number
  numQuestions?: number
}

export interface ICourse {
  oid: string
  code: string
  role: UserRoles
}


export enum UserRoles {
  Student = 'Student',
  Instructor = 'Instructor',
}
