import { HttpErrorResponse } from "@angular/common/http";

export default function getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 500) {
      return 'There was a problem with a server. Please try again.'
    } else if (error.status === 0) {
      return 'Problem with internet connection or server. Please check your internet connection and try again.'
    } else {
      return error.error?.message || error.message;
    }
}