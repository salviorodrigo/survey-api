export interface HashComparer {
  compare (value: string, hash: string | undefined): Promise<boolean>
}
