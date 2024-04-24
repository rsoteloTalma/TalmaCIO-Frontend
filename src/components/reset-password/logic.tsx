
import { callAPI } from "../../shared/network";

export async function resetPasswordUser(employeeId: string, handleType: boolean) {
  const data = await callAPI(
    {employeeId, handleType}, 
    "UserPasswordChangeRequest", "post");

  return data.data || {};
}
