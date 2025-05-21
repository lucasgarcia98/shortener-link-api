import { Prisma } from '@prisma/client';

export class UrlShortenerCreateEntity
  implements Prisma.UrlShortenerUncheckedCreateInput
{
  code: string;
  clicks?: number | undefined;
  id?: string | undefined;
  urlOriginal: string;
  urlShort: string;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  userId?: string | null | undefined;
}

export class UrlShortenerUpdateEntity
  implements Prisma.UrlShortenerUncheckedUpdateInput
{
  code?: string | undefined;
  clicks?: number | undefined;
  id?: string | undefined;
  urlOriginal?: string | undefined;
  urlShort?: string | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
  deletedAt?: string | Date | null | undefined;
  userId?: string | null | undefined;
}
