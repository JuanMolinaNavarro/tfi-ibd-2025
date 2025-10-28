import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const initialProducto = {
  sku: "",
  nombre: "",
  categoriaId: 0,
  proveedorId: 0,
  precio: 0
};

const EditarProductos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(initialProducto);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}productos/${id}`);
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setProducto({
          sku: data.sku ?? "",
          nombre: data.nombre ?? "",
          categoriaId: Number(data.categoriaId ?? 0),
          proveedorId: Number(data.proveedorId ?? 0),
          precio: Number(data.precio ?? 0)
        });
      } catch {
        Swal.fire("Error", "No se pudo cargar el producto.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (["precio", "categoriaId", "proveedorId"].includes(name)) {
      setProducto((current) => ({ ...current, [name]: Number(value) }));
      return;
    }
    setProducto((current) => ({ ...current, [name]: value }));
  };

  const validar = () => {
    if (!producto.sku.trim()) return "El SKU es obligatorio.";
    if (!producto.nombre.trim()) return "El nombre es obligatorio.";
    if (!Number.isInteger(producto.categoriaId) || producto.categoriaId <= 0) {
      return "Categoria invalida.";
    }
    if (!Number.isInteger(producto.proveedorId) || producto.proveedorId <= 0) {
      return "Proveedor invalido.";
    }
    if (!(producto.precio > 0)) return "El precio debe ser mayor a cero.";
    return null;
  };

  const guardar = async (event) => {
    event.preventDefault();
    const error = validar();
    if (error) {
      Swal.fire("Atencion", error, "warning");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${appsettings.apiUrl}productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Error al actualizar.");
      }

      Swal.fire("OK", "Producto actualizado correctamente.", "success");
      navigate("/");
    } catch (errorUnexpected) {
      Swal.fire("Error", String(errorUnexpected.message || errorUnexpected), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Editar producto</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza la informacion del articulo y mantene consistente el catalogo.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-72" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Informacion general</CardTitle>
            <CardDescription>Revisa los campos antes de confirmar los cambios.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={guardar}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={producto.sku}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={producto.nombre}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoriaId">Categoria (ID)</Label>
                  <Input
                    id="categoriaId"
                    name="categoriaId"
                    type="number"
                    min={1}
                    value={producto.categoriaId}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proveedorId">Proveedor (ID)</Label>
                  <Input
                    id="proveedorId"
                    name="proveedorId"
                    type="number"
                    min={1}
                    value={producto.proveedorId}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="space-y-2 sm:max-w-xs">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  min={0}
                  value={producto.precio}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EditarProductos;

