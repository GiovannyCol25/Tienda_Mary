import { ProductRepository } from '@/server/repositories/product.repository';
import { CreateProductDTO, UpdateProductDTO } from '@/server/dtos/product.dto';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * Obtiene la lista de productos con filtros opcionales
   */
  async getAllProducts(filters: { query?: string; categoria?: string; proveedor?: string }) {
    return await this.repository.findAll(filters);
  }

  /**
   * Obtiene un producto por ID y lanza un error si no lo encuentra
   */
  async getProductById(id: number) {
    const product = await this.repository.findById(id);

    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  /**
   * Crea un producto validando regla de negocio de rentabilidad
   */
  async createProduct(data: CreateProductDTO) {
    if (data.precio_venta <= data.precio_costo) {
      throw new Error('El precio de venta debe ser mayor al precio de costo para asegurar rentabilidad.');
    }

    return await this.repository.create(data);
  }

  /**
   * Actualiza un producto verificando primero su existencia
   */
  async updateProduct(id: number, data: UpdateProductDTO) {
    const current = await this.getProductById(id);

    const nextPrecioVenta =
      data.precio_venta !== undefined ? data.precio_venta : Number(current.precio_venta);
    const nextPrecioCosto =
      data.precio_costo !== undefined ? data.precio_costo : Number(current.precio_costo);

    if (nextPrecioVenta <= nextPrecioCosto) {
      throw new Error('El precio de venta debe ser mayor al precio de costo para asegurar rentabilidad.');
    }

    return await this.repository.update(id, data);
  }

  /**
   * Elimina un producto verificando primero su existencia
   */
  async deleteProduct(id: number) {
    await this.getProductById(id);
    return await this.repository.delete(id);
  }
}
