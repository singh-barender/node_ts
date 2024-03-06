import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '@root/globals/helpers/error-handlers';
import { findAndUpdateById } from '@root/features/auth/services/auth.service';
import { generateHashPassword, verifyResetPasswordToken } from '@root/globals/jwt/services';

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const isValidToken = await verifyResetPasswordToken(req.body.token);
  if (!isValidToken || typeof isValidToken !== 'object' || !('_id' in isValidToken)) {
    throw new BadRequestError('Invalid token request');
  }
  const { _id: userId } = isValidToken as { _id: string };
  const newPassword = await generateHashPassword(req.body.password);
  // Update user with new password and remove token
  await findAndUpdateById(userId, { token: null, expires: null, isActive: true, password: newPassword });
  res.status(StatusCodes.OK).json({ message: 'Account password updated.' });
};

export default resetPassword;