import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    res.render('index');
  }

  @Get('create-playlist')
  async createPlaylist(
    @Res() res: Response,
    @Query() body: { board: string; threadId: string },
  ) {
    const viewInfo = await this.appService.getThreadVideos(
      body.board,
      body.threadId,
    );

    res.render('playlist', viewInfo);
  }
}
