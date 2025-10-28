import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const initial = {
  sku: "",
  nombre: "",
  categoriaId: 0,
  proveedorId: 0,
  precio: 0
};

const NuevoProducto = () => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ["categoriaId", "proveedorId", "precio"];
    setForm((current) => ({
      ...current,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const validar = () => {
    if (!form.sku.trim()) return "El SKU es obligatorio.";
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!(form.categoriaId > 0)) return "Categoria invalida.";
    if (!(form.proveedorId > 0)) return "Proveedor invalido.";
    if (!(form.precio > 0)) return "El precio debe ser mayor a cero.";
    return null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const error = validar();
    if (error) {
      Swal.fire("Atencion", error, "warning");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${appsettings.apiUrl}productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (response.status === 201) {
        Swal.fire("OK", "Producto creado correctamente.", "success");
        navigate("/");
        return;
      }

      const message = await response.text();
      if (response.status === 409) {
        Swal.fire("Conflicto", message || "El SKU ya existe.", "warning");
      } else if (response.status === 400) {
        Swal.fire("Validacion", message || "Datos invalidos.", "warning");
      } else {
        throw new Error(message || `HTTP ${response.status}`);
      }
    } catch (errorUnexpected) {
      Swal.fire("Error", String(errorUnexpected.message || errorUnexpected), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Nuevo producto</h2>
        <p className="text-sm text-muted-foreground">
          Carga los datos basicos del articulo para sumarlo al catalogo.
        </p>
      </div>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Informacion principal</CardTitle>
            <CardDescription>
              Completa los campos requeridos antes de publicar el producto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={form.sku}
                    onChange={onChange}
                    placeholder="SKU interno"
                    autoComplete="off"
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={onChange}
                    placeholder="Nombre comercial"
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
                    value={form.categoriaId}
                    onChange={onChange}
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
                    value={form.proveedorId}
                    onChange={onChange}
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
                  value={form.precio}
                  onChange={onChange}
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
                  {saving ? "Guardando..." : "Crear producto"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default NuevoProducto;
