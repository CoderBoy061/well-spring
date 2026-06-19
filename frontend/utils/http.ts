import axios from "axios";

export function extractErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
