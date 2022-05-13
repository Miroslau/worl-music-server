import {ForbiddenException, Injectable} from "@nestjs/common";
import {UserService} from "./user.service";
import {JwtService} from "@nestjs/jwt";
import {AuthResponseDto} from "../dto/auth-response.dto";
import {User} from "../model/users.model";
import {nanoid} from "nanoid";


@Injectable()
export class TokensService {
    constructor(private readonly userService: UserService,
                private jwtService: JwtService) {}

    async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
        try {
            const verifiedToken = this.jwtService.verify(refreshToken, {
                secret: 'test-app-refResh-token-secret'
            });

            const { userId, refreshTokenId } = verifiedToken;

            const user = await this.userService.getById(userId);

            const now = new Date();

            if (!user || user.tokenId !== refreshToken || now > user.tokenExpire) {
                throw new ForbiddenException('Token is expired');
            }

            const tokens = await this.getTokens(user)

            return {
                id: user.id,
                email: user.email,
                ...tokens,
            }

        } catch (error) {
            throw new ForbiddenException();
        }
    }

    async getTokens(user: User) {
        const accessToken = this.jwtService.sign(
            {email: user.email, id: user.id, roles: user.roles},
            {secret: 'test-app-access-token-secret', expiresIn: 1000 * 60 * 15},
        );

        const refreshTokenId = nanoid();

        const expire = 1000 * 60 * 24 * 15;

        const refreshToken = this.jwtService.sign(
            {email: user.email, id: user.id, roles: user.roles, refreshTokenId},
            {
                secret: 'test-app-refResh-token-secret',
                expiresIn: expire,
            },
        );

        user.tokenId = refreshTokenId;
        const expiration = new Date();
        expiration.setTime(expiration.getTime() + expire);
        user.tokenExpire = expiration;

        await this.userService.update(user, user.id);

        return { accessToken, refreshToken };
    }
}