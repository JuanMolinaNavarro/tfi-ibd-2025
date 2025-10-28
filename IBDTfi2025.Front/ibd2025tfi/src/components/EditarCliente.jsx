import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";

const initialCliente = {
  nombre: "",
  email: "",
  telefono: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(initialCliente);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const response = await fetch(`${appsettings.apiUrl}clientes/${id}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        setCliente({
          nombre: data.nombre ?? "",
          email: data.email ?? "",
          telefono: data.telefono ?? ""
        });
      } catch {
        Swal.fire("Error", "No se pudo cargar el cliente.", "error");
        navigate("/clientes");
      } finally {
        setLoading(false);
      }
    };

    cargarCliente();
  }, [id, navigate]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setCliente((current) => ({ ...current, [name]: value }));
  };

  const validar = () => {
    if (!cliente.nombre.trim()) return "El nombre es obligatorio.";
    if (cliente.email && !emailRegex.test(cliente.email)) return "Email invalido.";
    if (cliente.telefono && cliente.telefono.trim().length < 6) {
      return "Telefono invalido.";
    }
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
      const response = await fetch(`${appsettings.apiUrl}clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cliente,
          nombre: cliente.nombre.trim(),
          email: cliente.email.trim() || null,
          telefono: cliente.telefono.trim() || null
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo actualizar el cliente.");
      }

      Swal.fire("OK", "Cliente actualizado correctamente.", "success");
      navigate("/clientes");
    } catch (errorUnexpected) {
      Swal.fire("Error", String(errorUnexpected.message || errorUnexpected), "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-44" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-64" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Editar cliente</h2>
        <p className="text-sm text-muted-foreground">
          Actualiza la informacion de contacto y guardala en el padron.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion general</CardTitle>
          <CardDescription>
            Verifica los datos antes de guardar los cambios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={guardar}>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={cliente.nombre}
                onChange={onChange}
                disabled={saving}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={cliente.email}
                  onChange={onChange}
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={onChange}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/clientes")}
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
    </div>
  );
};

export default EditarCliente;

