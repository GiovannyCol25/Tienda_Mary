import { z } from 'zod';

const OptionalTextSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === '' ? undefined : value));

const RequiredTextSchema = z.string().trim().min(3).max(150);

const PositiveNumberSchema = z.coerce.number().positive();
const NonNegativeIntSchema = z.coerce.number().int().nonnegative();

export const CreateProductSchema = z.object({
  nombre_producto: RequiredTextSchema,
  descripcion: OptionalTextSchema,
  categoria: OptionalTextSchema,
  precio_venta: PositiveNumberSchema,
  precio_costo: PositiveNumberSchema,
  unidades_disponibles: NonNegativeIntSchema,
  proveedor: OptionalTextSchema,
});

export const UpdateProductSchema = z.object({
  nombre_producto: RequiredTextSchema.optional(),
  descripcion: OptionalTextSchema,
  categoria: OptionalTextSchema,
  precio_venta: PositiveNumberSchema.optional(),
  precio_costo: PositiveNumberSchema.optional(),
  unidades_disponibles: NonNegativeIntSchema.optional(),
  proveedor: OptionalTextSchema,
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
