import { UrlShortener, User } from '@prisma/client';

export type UrlShortenerWithUser = UrlShortener & {
  user?: User;
};
