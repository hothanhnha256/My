import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing'; // Corrected import
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prismaC/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { randomUUID } from 'crypto';
import { EditUserDto } from 'src/users/dto/edit-user.dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from 'src/bookmark/dto/edit-bookmark.dto';

describe('App e2e', () => {
  let APP: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // Corrected usage
      imports: [AppModule],
    }).compile();
    APP = moduleRef.createNestApplication();
    APP.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await APP.init();
    prisma = APP.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3000');
  });
  afterAll(() => {
    if (APP) {
      // Check if APP is defined
      APP.close();
    }
  });
  let a = null;
  describe('Auth', () => {
    const dto: AuthDto = {
      email: randomUUID().substring(0, 8) + '@gmail.com',
      password: randomUUID().substring(0, 8),
    };
    a = dto.email;
    describe('SignUp', () => {
      it('should sign up a new user', async () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(dto)
          .expectStatus(201);
      });
    });
    describe('SignIn', () => {
      it('should sign in a user', async () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withJson(dto)
          .expectStatus(200)
          .stores('authToken', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get Profile', () => {
      it('should get profile of user', async () => {
        return pactum
          .spec()
          .get('/users/profile')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit Profile', () => {
      it('should get profile of user', async () => {
        const dto2: EditUserDto = {
          firstName: 'John',
          lastName: 'Doe',
          email: a,
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .withBody(dto2)
          .expectStatus(200)
          .expectBodyContains(dto2.firstName)
          .expectBodyContains(dto2.lastName);
      });
    });
  });
  describe('Bookmarks', () => {
    describe('Get Empty Book', () => {
      it('should get empty book', async () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create Bookmark', () => {
      it('should create a bookmark', async () => {
        const dto3: CreateBookmarkDto = {
          title: 'Test',
          description: 'Test',
          link: 'http://test.com',
        };
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .withBody(dto3)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });
    describe('Get Book', () => {
      it('should get book', async () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(200);
      });
    });
    describe('Get Book by ID', () => {
      it('should get book', async () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(200)
          .inspect();
      });
    });
    describe('Edit Bookmark', () => {
      it('should Edit a bookmark', async () => {
        const dto3: EditBookmarkDto = {
          title: 'Teasdfasdfst',
          description: 'Testasdfasdf',
          link: 'http://test.casdfasdfom',
        };
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .withBody(dto3)
          .expectStatus(200)
          .expectBodyContains(dto3.title)
          .expectBodyContains(dto3.description)
          .expectBodyContains(dto3.link);
      });
    });
    describe('Delete Bookmark', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(204);
      });
      it('should get empty book', async () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({
            Authorization: 'Bearer $S{authToken}',
          })
          .expectStatus(200);
      });
    });
  });
});
