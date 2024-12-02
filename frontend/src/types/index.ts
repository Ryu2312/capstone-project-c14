export interface Data {
  id?: number
  password: string
  role: string
  email: string
  age?: number
  name: string
}

export interface Result {
  success: number
  failed: {
    success: boolean,
    result: Failed
  }[]
}
export interface Failed {
  row?: number
  data: Data
  issues: Issues
}

export interface Issues {
  name?: string
  email?: string
  age?: string
}
