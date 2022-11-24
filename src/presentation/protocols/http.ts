export type HttpResponse = {
  statusCode: number
  body: any
}

export type HttpRequest = {
  accountId?: string
  body?: any
  headers?: any
  params?: any
}
