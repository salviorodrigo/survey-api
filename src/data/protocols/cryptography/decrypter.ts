export interface Decrypter {
  decrypt (value: string | undefined): Promise<string | null>
}
