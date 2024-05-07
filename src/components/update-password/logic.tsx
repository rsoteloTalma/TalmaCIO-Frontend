import { SERVICE_URLS } from "../../shared/constants";
import axios from "axios";

export async function changePasswordUser(password: string, setMessage: (message: string | null) => void, setOpen: (open: boolean) => void, key: string) {
  const parameters = {
    password: password,
    passwordChangeKey: key
  }

  try {

    const response = await axios.post(
      SERVICE_URLS.ROOT + "Authenticator/PasswordChange",
      JSON.stringify(parameters), {
      headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
      }
    });

    if (response.status === 200) {
      setMessage("Clave cambiada correctamente");
      setOpen(true);
      setTimeout(
        function () {
          window.location.href = "/";
        },
        3000);
    }
    else {
      setMessage("Ocurrio un problema con su cambio de clave. Valide con el área de tecnología.");
      setOpen(true);
    }
  } catch (error) {
    setMessage("Error en cambio de clave.");
    setOpen(true);
  }

  return null;
}
