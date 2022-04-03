export const isEmptyString = (value: string) => {
  return (value ?? "").trim().length === 0;
}