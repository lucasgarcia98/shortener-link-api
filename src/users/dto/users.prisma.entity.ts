import { Prisma } from 'generated/prisma';

export class UsersCreateEntity implements Prisma.UserCreateInput {
  id?: string | undefined;
  email: string;
  password: string;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
}

export class UsersUpdateEntity implements Prisma.UserUpdateInput {
  id?: string | Prisma.StringFieldUpdateOperationsInput | undefined;
  email?: string | Prisma.StringFieldUpdateOperationsInput | undefined;
  password?: string | Prisma.StringFieldUpdateOperationsInput | undefined;
  createdAt?:
    | string
    | Date
    | Prisma.DateTimeFieldUpdateOperationsInput
    | undefined;
  updatedAt?:
    | string
    | Date
    | Prisma.DateTimeFieldUpdateOperationsInput
    | undefined;
  UrlShortener?: Prisma.UrlShortenerUpdateManyWithoutUserNestedInput;
}
