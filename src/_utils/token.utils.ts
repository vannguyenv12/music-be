import { JwtService } from '@nestjs/jwt';

export const generateToken = (user: any, jwtService: JwtService) => {
  const payload = {
    _id: user._id,
    username: user.username,
    name: user.name,
    role: user.role,
    profilePicture: user.profilePicture,
  };

  return jwtService.signAsync(payload);
};
