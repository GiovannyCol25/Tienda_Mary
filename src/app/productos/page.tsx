'use client';

import { useState, useEffect } from 'react';
import { Search, Package, Plus, Trash2, Edit3, Loader2, X, Save, AlertTriangle, Filter } from 'lucide-react';

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCat, setFiltroCat] = useState('');
  const [filtroProv, setFiltroProv] = useState('');
  const [cargando, setCargando] = useState(false);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);
  const [errorCarga, setErrorCarga] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState('');

  // Estado inicial del formulario (Basado en tu DTO)
  const [formData, setFormData] = useState({
    nombre_producto: '',
    descripcion: '',
    categoria: '',
    precio_venta: 0,
    precio_costo: 0,
    unidades_disponibles: 0,
    proveedor: ''
  });

  const resetFormData = () => ({
    nombre_producto: '',
    descripcion: '',
    categoria: '',
    precio_venta: 0,
    precio_costo: 0,
    unidades_disponibles: 0,
    proveedor: ''
  });

  const fetchProductos = async () => {
    setCargando(true);
    setErrorCarga('');
    const params = new URLSearchParams();
    if (busqueda) params.append('q', busqueda);
    if (filtroCat) params.append('categoria', filtroCat);
    if (filtroProv) params.append('proveedor', filtroProv);

    try {
      const queryString = params.toString();
      const res = await fetch(`/api/productos${queryString ? `?${queryString}` : ''}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Error al obtener productos');
      setProductos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(error);
      setProductos([]);
      setErrorCarga(error?.message || 'No fue posible cargar productos');
    }
    finally { setCargando(false); }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchProductos(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda, filtroCat, filtroProv]);

  // Manejador de cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes('precio') || name === 'unidades_disponibles' ? Number(value) : value
    });
  };

  // Funcion para guardar
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setGuardando(true);
    setFormError('');

    try {
      const isEditing = Boolean(productoSeleccionado?.id_producto);
      const url = isEditing ? `/api/productos/${productoSeleccionado.id_producto}` : '/api/productos';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || 'Error al guardar');

      // Exito: Limpiar, cerrar y refrescar
      setIsModalOpen(false);
      setProductoSeleccionado(null);
      setFormData(resetFormData());
      fetchProductos();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const handleDeleteClick = (prod: any) => {
    setProductoSeleccionado(prod);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productoSeleccionado?.id_producto) return;
    setProcesandoId(productoSeleccionado.id_producto);
    try {
      const res = await fetch(`/api/productos/${productoSeleccionado.id_producto}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Error al eliminar');
      setIsDeleteModalOpen(false);
      setProductoSeleccionado(null);
      fetchProductos();
    } catch (err: any) {
      setErrorCarga(err.message || 'Error al eliminar');
    } finally {
      setProcesandoId(null);
    }
  };

  const handleEdit = (prod: any) => {
    setProductoSeleccionado(prod);
    setFormError('');
    setFormData({
      nombre_producto: prod.nombre_producto ?? '',
      descripcion: prod.descripcion ?? '',
      categoria: prod.categoria ?? '',
      precio_venta: Number(prod.precio_venta ?? 0),
      precio_costo: Number(prod.precio_costo ?? 0),
      unidades_disponibles: Number(prod.unidades_disponibles ?? 0),
      proveedor: prod.proveedor ?? ''
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setProductoSeleccionado(null);
    setFormError('');
    setFormData(resetFormData());
    setIsModalOpen(true);
  };

  const categoriasDisponibles = Array.from(
    new Set(productos.map((prod: any) => (prod.categoria || '').trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  const proveedoresDisponibles = Array.from(
    new Set(productos.map((prod: any) => (prod.proveedor || '').trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex min-h-screen flex-col bg-[#ECCFEC] lg:h-screen lg:flex-row lg:overflow-hidden relative">
      
      {/* SIDEBAR */}
      <aside className="w-full bg-[#C59EC7] p-5 text-white flex items-center justify-between shadow-xl lg:w-1/5 lg:flex-col lg:items-stretch lg:justify-start lg:p-8">
        <div className="flex items-center gap-3 lg:mb-10">
          <Package size={28} />
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Inventario</h1>
        </div>
        <div className="bg-[#B185B4] p-3 rounded-xl shadow-inner lg:mb-4 lg:p-4">
          <p className="text-xs">Total Productos</p>
          <p className="text-xl font-bold lg:text-2xl">{productos.length}</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto">
        <header className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#B185B4] sm:text-3xl">Gestion de Productos</h2>
            <p className="text-sm text-[#9a709d] sm:text-base">Panel de administracion Mary</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B185B4] px-6 py-3 text-white shadow-lg transition-all active:scale-95 hover:bg-[#9a709d] sm:w-auto"
          >
            <Plus size={20} /> Nuevo Producto
          </button>
        </header>

        {/* BARRA DE FILTROS */}
        <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl bg-white/50 p-4 backdrop-blur-sm md:grid-cols-3 lg:mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B185B4]" size={20} />
            <input
              type="text"
              id="busqueda_productos"
              name="busqueda_productos"
              aria-label="Buscar productos por nombre"
              placeholder="Buscar por nombre..."
              value={busqueda}
              className="w-full rounded-2xl border-none py-3 pl-12 pr-4 shadow-sm outline-none focus:ring-2 focus:ring-[#B185B4] sm:py-4"
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B185B4]" size={18} />
            <select
              id="filtro_categoria"
              name="filtro_categoria"
              value={filtroCat}
              className="w-full appearance-none rounded-2xl border-none bg-white py-3 pl-12 pr-4 text-gray-600 shadow-sm outline-none focus:ring-2 focus:ring-[#B185B4] sm:py-4"
              onChange={(e) => setFiltroCat(e.target.value)}
            >
              <option value="">Todas las categorias</option>
              {categoriasDisponibles.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#B185B4]" size={18} />
            <select
              id="filtro_proveedor"
              name="filtro_proveedor"
              value={filtroProv}
              className="w-full appearance-none rounded-2xl border-none bg-white py-3 pl-12 pr-4 text-gray-600 shadow-sm outline-none focus:ring-2 focus:ring-[#B185B4] sm:py-4"
              onChange={(e) => setFiltroProv(e.target.value)}
            >
              <option value="">Todos los proveedores</option>
              {proveedoresDisponibles.map((proveedor) => (
                <option key={proveedor} value={proveedor}>{proveedor}</option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLA */}
        <div className="min-h-[400px] rounded-3xl bg-[#FFE7FF] p-3 shadow-inner sm:p-4 lg:p-6">
          {errorCarga && (
            <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
              {errorCarga}
            </div>
          )}
          {cargando ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#B185B4]" size={40} /></div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[640px] w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[#B185B4] text-xs font-bold uppercase tracking-widest px-4">
                    <th className="p-3 sm:p-4">Producto</th>
                    <th className="p-3 sm:p-4">Stock</th>
                    <th className="p-3 sm:p-4 text-right">Venta</th>
                    <th className="p-3 sm:p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((prod: any) => (
                    <tr key={prod.id_producto} className="group rounded-xl bg-white shadow-sm hover:bg-[#fdf0fd]">
                      <td className="rounded-l-xl p-3 sm:p-4">
                        <div className="font-medium">{prod.nombre_producto}</div>
                        <div className="text-xs text-gray-400">{prod.categoria || '-'} - {prod.proveedor || '-'}</div>
                      </td>
                      <td className="p-3 text-center sm:p-4">{prod.unidades_disponibles}</td>
                      <td className="p-3 text-right font-bold text-[#B185B4] sm:p-4">${Number(prod.precio_venta).toLocaleString()}</td>
                      <td className="rounded-r-xl p-3 text-center sm:p-4">
                        <div className="flex justify-center gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(prod)}
                            disabled={procesandoId === prod.id_producto}
                            className="rounded-lg p-2 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prod)}
                            disabled={procesandoId === prod.id_producto}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL DE REGISTRO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm animate-in fade-in duration-200 sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between bg-[#B185B4] p-4 text-white sm:p-6">
              <div className="flex items-center gap-2">
                <Plus size={22} />
                <h3 className="text-lg font-bold sm:text-xl">
                  {productoSeleccionado ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto p-4 sm:space-y-6 sm:p-8">
              {formError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 italic">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                {/* Nombre - Full Width */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="nombre_producto" className="text-xs font-bold text-[#9a709d] uppercase">Nombre del Producto *</label>
                  <input
                    id="nombre_producto"
                    required
                    name="nombre_producto"
                    value={formData.nombre_producto}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                    placeholder="Ej: Vestido Lavanda Floral"
                  />
                </div>

                {/* Descripcion */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="descripcion" className="text-xs font-bold text-[#9a709d] uppercase">Descripcion</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none h-20"
                    placeholder="Detalles del producto..."
                  />
                </div>

                {/* Precios y Stock */}
                <div className="space-y-2">
                  <label htmlFor="precio_costo" className="text-xs font-bold text-[#9a709d] uppercase">Precio Costo</label>
                  <input
                    id="precio_costo"
                    type="number"
                    name="precio_costo"
                    value={formData.precio_costo}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="precio_venta" className="text-xs font-bold text-[#9a709d] uppercase">Precio Venta</label>
                  <input
                    id="precio_venta"
                    type="number"
                    name="precio_venta"
                    value={formData.precio_venta}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="unidades_disponibles" className="text-xs font-bold text-[#9a709d] uppercase">Stock Disponible</label>
                  <input
                    id="unidades_disponibles"
                    type="number"
                    name="unidades_disponibles"
                    value={formData.unidades_disponibles}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="categoria" className="text-xs font-bold text-[#9a709d] uppercase">Categoria</label>
                  <input
                    id="categoria"
                    name="categoria"
                    placeholder="Categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="proveedor" className="text-xs font-bold text-[#9a709d] uppercase">Proveedor</label>
                  <input
                    id="proveedor"
                    name="proveedor"
                    placeholder="Proveedor"
                    value={formData.proveedor}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#B185B4] outline-none"
                  />
                </div>
              </div>

              {/* Botones de Accion */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:gap-4 sm:pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setProductoSeleccionado(null);
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#B185B4] text-white font-bold hover:bg-[#9a709d] transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  {guardando ? <Loader2 className="animate-spin" /> : <><Save size={20} /> {productoSeleccionado ? 'Actualizar Producto' : 'Guardar Producto'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Eliminar producto</h3>
            <p className="mt-2 text-gray-500">
              Esta accion no se puede deshacer. Borraras a <b>{productoSeleccionado?.nombre_producto}</b>.
            </p>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setProductoSeleccionado(null);
                }}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={procesandoId === productoSeleccionado?.id_producto}
                className="flex-1 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg shadow-red-200 disabled:opacity-60"
              >
                {procesandoId === productoSeleccionado?.id_producto ? 'Eliminando...' : 'Si, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
