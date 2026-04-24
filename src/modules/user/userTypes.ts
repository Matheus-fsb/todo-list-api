// Dados para criação de usuário
export type CreateUserDTO = {
  name: string;
  login: string;
  password: string;
};

// Dados para atualização (campos opcionais)
export type UpdateUserDTO = Partial<CreateUserDTO>;

// Dados que serão retornados pela API (sem senha)
export type UserResponseDTO = {
  id: string;
  name: string;
  login: string;
};
