import { prisma } from '@/server/db/prisma';
import { CreateProductDTO } from '@/server/dtos/product.dto';

export class ProductRepository {
  /**
   * Obtiene todos los productos aplicando filtros opcionales.
   */
  async findAll(filters: { query?: string; categoria?: string; proveedor?: string }) {
    const { query, categoria, proveedor } = filters;

    return prisma.producto.findMany({
      where: {
        AND: [
          query ? { nombre_producto: { contains: query, mode: 'insensitive' } } : {},
          categoria ? { categoria: { equals: categoria } } : {},
          proveedor ? { proveedor: { equals: proveedor } } : {},
        ],
      },
      orderBy: { nombre_producto: 'asc' },
    });
  }

  /**
   * Busca un producto exacto por su ID
   */
  async findById(id: number) {
    // Usamos id_producto porque asi lo definimos en el SQL y Prisma
    return prisma.producto.findUnique({
      where: { id_producto: id },
    });
  }

  /**
   * Crea un nuevo producto
   */
  async create(data: CreateProductDTO) {
    return prisma.producto.create({ data });
  }

  /**
   * Actualiza datos de un producto existente
   */
  async update(id: number, data: Partial<CreateProductDTO>) {
    return prisma.producto.update({
      where: { id_producto: id },
      data,
    });
  }

  /**
   * Elimina un producto
   */
  async delete(id: number) {
    return prisma.producto.delete({
      where: { id_producto: id },
    });
  }
}
