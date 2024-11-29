import { ZodIssue } from "zod";

export function formatIssues(errors: ZodIssue[]) {
  const errorList = errors.map((error) => [error.path, error.message]);
  return Object.fromEntries(errorList);
}