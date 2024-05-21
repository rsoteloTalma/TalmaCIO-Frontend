import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode("Yh2k7QSu4l8CZg5p6X3Pna9L0Miy4D3Bvt0JVr87UcOj69Kqw5R2Nmf4FWs03Hdx");

const validateToken = async (token: any) => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    if(!payload){ return false; }

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        console.log("El token ha expirado");
        return false;
    }
    return true;

  } catch (error) {
    return false;
  }
};

export default validateToken;
