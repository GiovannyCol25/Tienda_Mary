import { z } from 'zod';

const OptionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === '' ? undefined : value));

export const CreateProductSchema = z.object({
  nombre_producto: z.string().trim().min(3).max(150),
  descripcion: OptionalTextSchema,
  categoria: OptionalTextSchema,
  precio_venta: z.number().positive(),
  precio_costo: z.number().positive(),
  unidades_disponibles: z.number().int().nonnegative(),
  proveedor: OptionalTextSchema,
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
