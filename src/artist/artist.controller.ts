import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { ResponseArtistDto } from './dto/artist-response.dto';
import { UserProfilePictureInterceptor } from 'src/user/interceptors/user-avatar.interceptor';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { AuthGuard } from 'src/_core/guards/auth.guard';

@Controller('artists')
@TransformDTO(ResponseArtistDto)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.artistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.artistService.remove(id);
  }

  @Get(':artistId/follows')
  async getArtistFollowCount(@Param('artistId') artistId: string) {
    return this.artistService.getArtistFollowCount(artistId);
  }

  @Post('upload-profile-picture')
  @UseInterceptors(UserProfilePictureInterceptor)
  @UseGuards(AuthGuard)
  async uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user,
  ) {
    if (!file) {
      throw new BadRequestException(
        'Invalid file format. Only JPEG and PNG are allowed.',
      );
    }
    return this.artistService.uploadProfilePicture(file.filename, user);
  }
}
