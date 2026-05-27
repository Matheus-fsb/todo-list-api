import type { UserRole } from '../../generated/prisma/enums.js';

export type ValidationEmailUserDTO = { id: string; name: string; email: string; role: UserRole };

export type CreateValidationTokenDTO = { token: string; userId: string; expiresAt: Date };

export type UpdateValidationTokenDTO = Partial<{ token: string; expiresAt: Date }>;
