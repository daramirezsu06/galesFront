import { customerType } from "./customerType";
import { UserStatus } from "./userStatus.enum";
import { Role } from "./usersRoles";

export interface IUser {
  id?: string;
  name: string;
  // lastname?: string,
  address?: string;
  customerType?: string;
  email: string;
  identification: string;
  image?: string;
  // password: string,
  phone: string;
  registerDate?: string;
  role: Role;
  status: string;
  website?: string;
  lat?: number;
  lng?: number;
}

export const initUser = {
  // id: '',
  name: "",
  // lastname: '',
  address: "",
  customerType: customerType.RETAIL,
  email: "",
  identification: "",
  // image: '',
  // password: '',
  phone: "+57",
  registerDate: "",
  role: Role.CUSTOMER,
  status: UserStatus.ACTIVE,
  // website: "",
};

export const initUserError = {
  id: "",
  name: "",
  lastname: "",
  address: "",
  customerType: "",
  email: "",
  identification: "",
  image: "",
  password: "",
  phone: "",
  registerDate: "",
  website: "",
};
