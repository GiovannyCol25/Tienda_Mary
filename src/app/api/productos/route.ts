import { NextResponse } from 'next/server';
import { ProductService } from '@/server/services/product.service';
import { CreateProductSchema } from '@/server/dtos/product.dto';

const productService = new ProductService();

// GET: Listar productos con filtros opcionales
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = {
      query: searchParams.get('query') || searchParams.get('q') || undefined,
      categoria: searchParams.get('categoria') || undefined,
      proveedor: searchParams.get('proveedor') || undefined,
    };

    const products = await productService.getAllProducts(filters);
    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST: Crear un nuevo producto
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validamos los datos con el DTO antes de pasar al Service
    const validatedData = CreateProductSchema.parse(body);

    const newProduct = await productService.createProduct(validatedData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    // Si Zod falla o el Service lanza un error de negocio
    return NextResponse.json({ error: error.message || 'Datos invalidos' }, { status: 400 });
  }
}
