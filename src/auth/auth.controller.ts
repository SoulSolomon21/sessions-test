import { Controller, Get, InternalServerErrorException, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { IsAuthenticatedGuard } from './guards/is-authenticated/is-authenticated.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() request: any, @Session() session: any) {
        console.log({ session });
        console.log({ request });

        return session;
    }

    @UseGuards(IsAuthenticatedGuard)
    @Post('logout')
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

    @UseGuards(IsAuthenticatedGuard)
    @Get('protected')
    protected() {
        return {
            message: 'This route is protected against unauthenticated users!',
        }
    }
}
