import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { PrismaService } from '../prismaC/prisma.service';
@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    console.log(userId, bookmarkId);
    return this.prisma.bookmark.findFirst({
      where: {
        id: Number(bookmarkId),
        userId: userId,
      },
    });
  }

  async createBookmark(userId: number, createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...createBookmarkDto,
      },
    });
    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get the bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: Number(bookmarkId),
        userId: Number(userId),
      },
    });
    if (!bookmark) {
      throw new ForbiddenException('Bookmark not found');
    }

    return this.prisma.bookmark.update({
      where: {
        id: Number(bookmarkId),
        userId: Number(userId),
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: Number(bookmarkId),
        userId: Number(userId),
      },
    });
    if (!bookmark) {
      throw new ForbiddenException('Bookmark not found');
    }

    await this.prisma.bookmark.delete({
      where: {
        id: Number(bookmarkId),
        userId: Number(userId),
      },
    });
  }
}
