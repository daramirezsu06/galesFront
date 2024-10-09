import { Role } from "@/utils/types/users/usersRoles";
import { UserStatus } from "@/utils/types/users/userStatus.enum";


export interface User {
  address: string;
  email: string;
  id: string;
  identification: string;
  registerDate: Date | null; // Usa Date si esperas un objeto Date, o string si es una fecha en formato string.
  name: string;
  phone: string;
  status: UserStatus;
  role: Role;
  sellerId: string;
}

const initialUser: User = {
  address: "",
  email: "",
  id: "",
  identification: "",
  registerDate: null,
  name: "",
  phone: "",
  status: UserStatus.ACTIVE,
  role: Role.CUSTOMER,
  sellerId: "",
};

