import { login, requestPasswordChange } from "../../shared/auth-service";

export async function validateUser(user: string | null, password: string | null, isRecoverPassword: boolean, setMessage: (message: string | null) => void, setOpen: (open: boolean) => void) {

  let validationMessage = "";

  if (isRecoverPassword) {
    if (!user)
      validationMessage = "Ingrese su usuario";

  } else {
    if ((!user || user === "") && (!password || password === ""))
      validationMessage = "Ingrese su usuario y clave";
    else if (!user)
      validationMessage = "Ingrese su usuario";
    else if (!password)
      validationMessage = "Ingrese su clave";
  }

  if (validationMessage !== "") {
    setMessage(validationMessage);
    setOpen(true);
    return;
  }

  const result = await login(user as string, password as string, isRecoverPassword);

  if (result) {
    if (result.message === "Ok") {
      window.location.href = "/";
      return;
    }

    if (result.message === "resetPass") {
      window.location.href = `/resetPassword/${result.token}`;
      return;
    }

    setMessage(result.message);
    setOpen(true);
  }
}

export async function RecoveryPassword(user: string | null, isRecoverPassword: boolean, setMessage: (message: string | null) => void, setOpen: (open: boolean) => void) {
  const result = await requestPasswordChange(user as string, isRecoverPassword);

  if (result) {
    if(result.success) {
      const m = "Se envió un correo con las instrucciones a la siguiente dirección: " + result.email + ".";
      setMessage(m);
      setOpen(true);
    }
  }
}