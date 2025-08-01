
// Model Interface Student

export interface IStudentModel {
  firstname: string
  email: string
}

// Builder Interface Student

export interface IStudentBuilder {
  errorFirstname: boolean;
  errorEmail: boolean;
}