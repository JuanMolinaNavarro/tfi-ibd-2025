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

const skeletonRows = Array.from({ length: 6 }, (_, index) => index);

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "medium"
});

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${appsettings.apiUrl}clientes/listar`);
      if (response.status === 404) {
        setClientes([]);
        return;
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const totalClientes = useMemo(() => clientes.length, [clientes]);

  const confirmarEliminar = async (clienteId) => {
    const cliente = clientes.find((c) => c.clienteId === clienteId);
    const result = await Swal.fire({
      title: "Eliminar cliente",
      text: `Confirma eliminar a '${cliente?.nombre || "cliente"}'? Esta accion no se puede deshacer.`,
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
      setDeletingId(clienteId);
      const response = await fetch(`${appsettings.apiUrl}clientes/${clienteId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "No se pudo eliminar el cliente.");
      }

      Swal.fire("OK", "Cliente eliminado correctamente.", "success");
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
          <h2 className="text-2xl font-semibold tracking-tight">Clientes</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona el padron de clientes y mantenelo actualizado.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={cargar} disabled={loading}>
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
          <Button asChild>
            <Link to="/clientes/nuevo">Nuevo cliente</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Listado general</CardTitle>
          <CardDescription>
            Informacion basica de contacto de los clientes activos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {skeletonRows.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[80px,1.2fr,1fr,1fr,120px] gap-4"
                >
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                  <Skeleton className="h-6 rounded-md" />
                </div>
              ))}
            </div>
          ) : clientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-muted p-10 text-center">
              <h3 className="text-lg font-medium">Todavia no hay clientes activos</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                Registra clientes para comenzar a emitir ventas y llevar un historial de contacto.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead className="w-[150px] text-right">Alta</TableHead>
                    <TableHead className="w-[160px] text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.clienteId}>
                      <TableCell>{cliente.clienteId}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {cliente.nombre}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cliente.email || "Sin dato"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cliente.telefono || "Sin dato"}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {cliente.fechaAlta
                          ? dateFormatter.format(new Date(cliente.fechaAlta))
                          : "Sin dato"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/clientes/editar/${cliente.clienteId}`}>
                              Editar
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmarEliminar(cliente.clienteId)}
                            disabled={deletingId === cliente.clienteId}
                          >
                            {deletingId === cliente.clienteId
                              ? "Eliminando..."
                              : "Eliminar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TableCaption>{totalClientes} clientes activos</TableCaption>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListarClientes;
