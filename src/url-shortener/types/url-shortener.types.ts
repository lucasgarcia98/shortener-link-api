import { UrlShortener, User } from 'generated/prisma';

export type UrlShortenerWithUser = UrlShortener & {
  user?: User;
};
