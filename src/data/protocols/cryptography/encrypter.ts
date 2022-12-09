export interface Encrypter {
  encrypt (value: string | undefined): Promise<string>
}
