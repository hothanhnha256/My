import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prismaC/prisma.service';
import { User } from '@prisma/client';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async editProfile(userID: number, edituserdto: EditUserDto) {
    const response = await this.prisma.user.update({
      where: { id: userID },
      data: { ...edituserdto },
    });
    delete response.password;
    return response;
  }
}
