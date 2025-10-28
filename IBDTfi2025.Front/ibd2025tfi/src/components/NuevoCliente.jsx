import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { appsettings } from "../settings/appsettings";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const initial = {
  nombre: "",
  email: "",
  telefono: ""
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NuevoCliente = () => {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (form.email && !emailRegex.test(form.email)) return "Email invalido.";
    if (form.telefono && form.telefono.trim().length < 6) {
      return "Telefono invalido.";
    }
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
      const response = await fetch(`${appsettings.apiUrl}clientes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          nombre: form.nombre.trim(),
          email: form.email.trim() || null,
          telefono: form.telefono.trim() || null
        })
      });

      if (response.status === 201) {
        Swal.fire("OK", "Cliente creado correctamente.", "success");
        navigate("/clientes");
        return;
      }

      const message = await response.text();
      if (response.status === 409) {
        Swal.fire("Conflicto", message || "El email ya esta registrado.", "warning");
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
        <h2 className="text-2xl font-semibold tracking-tight">Nuevo cliente</h2>
        <p className="text-sm text-muted-foreground">
          Carga los datos basicos de contacto para registrar un cliente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informacion principal</CardTitle>
          <CardDescription>Todos los campos pueden editarse mas adelante.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                placeholder="Cliente SRL"
                disabled={saving}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  type="email"
                  placeholder="cliente@email.com"
                  disabled={saving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono</Label>
                <Input
                  id="telefono"
                  name="telefono"
                  value={form.telefono}
                  onChange={onChange}
                  placeholder="+54 9 11 5555 5555"
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
                {saving ? "Guardando..." : "Crear cliente"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NuevoCliente;

