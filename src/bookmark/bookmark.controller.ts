import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkService } from './bookmark.service';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { HttpCode } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}
  @Get()
  getBookmark(@GetUser('id') userID: number) {
    return this.bookmarkService.getBookmarks(userID);
  }

  @Get(':id')
  getBoorkmarkById(
    @GetUser('id') userID: number,
    @Param('id') bookmarkId: number,
  ) {
    console.log(userID, bookmarkId);
    return this.bookmarkService.getBookmarkById(userID, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUser('id') userID: number,
    @Body() createBookmarkDto: CreateBookmarkDto,
  ) {
    return this.bookmarkService.createBookmark(userID, createBookmarkDto);
  }

  @Patch(':id')
  EditBookmark(
    @GetUser('id') userID: number,
    @Param('id') bookmarkId: number,
    @Body() editBookmark: EditBookmarkDto,
  ) {
    return this.bookmarkService.editBookmarkById(
      userID,
      bookmarkId,
      editBookmark,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmark(
    @GetUser('id') userID: number,
    @Param('id') bookmarkId: number,
  ) {
    return this.bookmarkService.deleteBookmarkById(userID, bookmarkId);
  }
}
