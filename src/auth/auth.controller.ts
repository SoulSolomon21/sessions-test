import { Controller, Get, InternalServerErrorException, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IsAuthenticatedGuard } from './guards/is-authenticated/is-authenticated.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

@Controller('auth')
export class AuthController {

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Req() request: any, @Session() session: any) {
        console.log({ session });
        console.log({ request });

        return request.user;
    }

    @Post('logout')
    @UseGuards(IsAuthenticatedGuard)
    async logout(@Req() request: Request) {
        const logoutError = await new Promise((resolve) =>
            request.logOut({ keepSessionInfo: false }, (error) =>
                resolve(error),
            ),
        );

        if (logoutError) {
            console.error(logoutError);

            throw new InternalServerErrorException('Could not log out user');
        }

        return {
            logout: true,
        };
    }

    @Get('protected')
    @UseGuards(IsAuthenticatedGuard)
    protected() {
        return {
            message: 'This route is protected against unauthenticated users!',
        }
    }
}
