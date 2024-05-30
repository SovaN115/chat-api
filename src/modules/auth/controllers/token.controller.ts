import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { AccessTokenService } from '../services/access-token.service';
import { TokenDataService } from '../services/token-data.service';

@Controller('token')
export class TokenController {
    constructor(
        private readonly tokenService: AccessTokenService,
        private readonly tokenDataService: TokenDataService
    ) {}

    @Get('get-tokens')
    async getTokens(
        @Req() req: Request
    ) {
        const token = this.tokenService.getTokenFromHeader(req);
        return await this.tokenDataService.getTokensByAuthUserUUID(token.authUserUUID);
    }

    @Post('delete-token')
    async deleteToken(
        @Body() body: { tokenUUID: string },
    ) {
        return await this.tokenDataService.deleteTokenByTokenUUID(body.tokenUUID);
    }

    @Post('delete-all-tokens')
    async deleteAllTokens(
        @Req() req: Request
    ) {
        const token = this.tokenService.getTokenFromHeader(req);
        return await this.tokenDataService.deleteAllTokensByAuthUserUUID(token.authUserUUID);
    }
    
}
