import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import { Skeleton } from "./ui/skeleton";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2
});

const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

const ListarProductos = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${appsettings.apiUrl}productos/listar`);
      if (res.status === 404) {
        setData([]);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      Swal.fire("Error", "No se pudieron cargar los productos.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const totalProductos = useMemo(() => data.length, [data]);

  const confirmarEliminar = async (productoId) => {
    const producto = data.find((p) => p.productoId === productoId);
    const result = await Swal.fire({
      title: "Eliminar producto",
      text: `Confirma eliminar '${producto?.nombre || "producto"}'? Esta accion no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingId(productoId);
      const response = await fetch(`${appsettings.apiUrl}productos/${productoId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo eliminar el producto.");
      }

      Swal.fire("OK", "Producto eliminado correctamente.", "success");
      await cargar();
    } catch (error) {
      Swal.fire("Error", String(error.message || error), "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Productos</h2>
          <p className="text-sm text-muted-foreground">
            Administra el catalogo y mantiene la informacion siempre al dia.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{totalProductos} activos</Badge>
          <Button asChild>
            <Link to="/nuevo">Agregar producto</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Listado general</CardTitle>
            <CardDescription>
              Todos los productos activos disponibles para la venta.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={cargar} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {skeletonRows.map((row) => (
                <div key={row} className="grid grid-cols-[80px,1fr,1fr,140px,120px] gap-4">
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted p-10 text-center">
              <h3 className="text-lg font-medium">Todavia no hay productos</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Crea tu primer producto para comenzar a operar con el catalogo online y sincronizar los datos del sistema.
              </p>
              <Button asChild>
                <Link to="/nuevo">Crear producto</Link>
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead className="min-w-[120px]">SKU</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead className="w-[140px] text-right">Precio</TableHead>
                    <TableHead className="w-[160px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((producto) => (
                    <TableRow key={`${producto.productoId}-${producto.sku}`}>
                      <TableCell>{producto.productoId}</TableCell>
                      <TableCell className="font-medium text-foreground">{producto.sku}</TableCell>
                      <TableCell className="text-foreground">{producto.nombre}</TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {currencyFormatter.format(Number(producto.precio || 0))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/editar/${producto.productoId}`}>Editar</Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmarEliminar(producto.productoId)}
                            disabled={deletingId === producto.productoId}
                          >
                            {deletingId === producto.productoId
                              ? "Eliminando..."
                              : "Eliminar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableCaption>{totalProductos} productos encontrados</TableCaption>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListarProductos;
