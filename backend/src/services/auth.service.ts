import bcrypt from 'bcrypt';
import { findUserByEmail, createUser, UserRow } from '../repositories/auth.repository';
import { generateToken } from '../utils/jwt';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { AuthResponse } from '../types/auth.types';

export const registerUserService = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Cost minimum 12 as per assignment specs
  const hashedPassword = await bcrypt.hash(input.password, 12);
  
  const newUser = await createUser({
    ...input,
    password: hashedPassword,
  });

  const token = generateToken({ userId: newUser.id, email: newUser.email });

  return {
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  };
};

export const loginUserService = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await findUserByEmail(input.email);
  if (!user || (!user.password)) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};
