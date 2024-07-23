import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto/edit-user.dto';
import { UsersService } from './users.service';
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return user;
  }

  @Patch()
  async editProfile(
    @GetUser('id') userID: number,
    @Body() edituserdto: EditUserDto,
  ) {
    return await this.userService.editProfile(userID, edituserdto);
  }
}
