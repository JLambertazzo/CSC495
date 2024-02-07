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
  role: Roles
}

enum Roles {
  Student = 'Student',
  Instructor = 'Instructor',
}
