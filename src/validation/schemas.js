const { z } = require('zod');

const idParamsSchema = z.object({
  id: z.coerce.number().int().positive('O ID deve ser um número inteiro positivo.')
}).strict();

const email = z.string().trim().toLowerCase().email('Informe um e-mail válido.').max(160, 'O e-mail deve ter no máximo 160 caracteres.');
const password = z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.').max(128, 'A senha deve ter no máximo 128 caracteres.');
const name = z.string().trim().min(2, 'O nome deve ter no mínimo 2 caracteres.').max(120, 'O nome deve ter no máximo 120 caracteres.');

const signupSchema = z.object({ nome_completo: name, email, senha: password }).strict();
const loginSchema = z.object({ email, senha: z.string().min(1, 'A senha é obrigatória.') }).strict();
const userUpdateSchema = z.object({
  nome_completo: name.optional(),
  email: email.optional(),
  senha: password.optional(),
  perfil: z.enum(['P01', 'P02'], { errorMap: () => ({ message: 'O perfil deve ser P01 ou P02.' }) }).optional()
}).strict().refine(value => Object.keys(value).length > 0, { message: 'Informe ao menos um campo para alterar.' });

const score = z.coerce.number().int().nonnegative('O placar deve ser um inteiro maior ou igual a zero.');
const matchCreateSchema = z.object({
  time_casa: z.string().trim().min(1, 'Informe o time da casa.').max(100),
  time_fora: z.string().trim().min(1, 'Informe o time visitante.').max(100),
  data_jogo: z.coerce.date({ invalid_type_error: 'Informe uma data de jogo válida.' }),
  placar_casa: score.default(0),
  placar_fora: score.default(0),
  status: z.enum(['Agendado', 'Em andamento', 'Finalizado', 'Cancelado']).default('Agendado')
}).strict();
const matchUpdateSchema = matchCreateSchema.partial().refine(value => Object.keys(value).length > 0, { message: 'Informe ao menos um campo para alterar.' });
const matchesQuerySchema = z.object({
  status: z.enum(['Agendado', 'Em andamento', 'Finalizado', 'Cancelado']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50)
}).strict();
const denunciaCreateSchema = z.object({
  relato_usuario: z.string().trim().min(10, 'O relato deve ter no mínimo 10 caracteres.').max(5000, 'O relato deve ter no máximo 5000 caracteres.')
}).strict();

module.exports = {
  idParamsSchema,
  signupSchema,
  loginSchema,
  userUpdateSchema,
  matchCreateSchema,
  matchUpdateSchema,
  matchesQuerySchema,
  denunciaCreateSchema
};
