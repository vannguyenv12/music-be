import { JwtService } from '@nestjs/jwt';

export const generateToken = (user: any, jwtService: JwtService) => {
  const payload = {
    _id: user._id,
    username: user.username,
    name: user.name,
    bio: user.bio ? user.bio : undefined,
    role: user.role ? user.role : undefined,
    profilePicture: user.profilePicture,
  };

  return jwtService.signAsync(payload);
};
