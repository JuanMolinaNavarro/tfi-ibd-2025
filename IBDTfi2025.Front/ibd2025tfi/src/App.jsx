import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ListaProductos from "./components/ListarProductos";
import NuevoProducto from "./components/NuevoProducto";
import EditarProductos from "./components/EditarProductos";
import ListarClientes from "./components/ListarClientes";
import NuevoCliente from "./components/NuevoCliente";
import EditarCliente from "./components/EditarCliente";
import { Button } from "./components/ui/button";
import { Sidebar } from "./components/ui/sidebar";

const navigationItems = [
  { to: "/", label: "Productos", end: true },
  { to: "/clientes", label: "Clientes" }
];

function HeaderActions() {
  const location = useLocation();
  const isClientsSection = location.pathname.startsWith("/clientes");
  const isNewRoute =
    location.pathname === "/nuevo" || location.pathname === "/clientes/nuevo";
  const createPath = isClientsSection ? "/clientes/nuevo" : "/nuevo";
  const createLabel = isClientsSection ? "Nuevo cliente" : "Nuevo producto";

  return (
    <div className="flex items-center gap-2">
      <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground md:hidden">
        {navigationItems.map((item) => (
          <Button key={item.to} variant="ghost" size="sm" asChild>
            <Link to={item.to}>{item.label}</Link>
          </Button>
        ))}
      </nav>

      {!isNewRoute ? (
        <Button size="sm" asChild>
          <Link to={createPath}>{createLabel}</Link>
        </Button>
      ) : null}

      <div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
        <span className="rounded-md bg-muted px-3 py-1 font-medium text-foreground">
          {new Date().getFullYear()}
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex min-h-screen">
          <Sidebar
            title="Inventario"
            subtitle="Gestion general"
            items={navigationItems}
            footer="Selecciona el modulo a gestionar"
          />

          <div className="flex flex-1 flex-col">
            <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur">
              <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
                <Link to="/" className="text-lg font-semibold tracking-tight">
                  Panel de operaciones
                </Link>
                <HeaderActions />
              </div>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
              <Routes>
                <Route path="/" element={<ListaProductos />} />
                <Route path="/clientes" element={<ListarClientes />} />
                <Route path="/nuevo" element={<NuevoProducto />} />
                <Route path="/editar/:id" element={<EditarProductos />} />
                <Route path="/clientes/nuevo" element={<NuevoCliente />} />
                <Route path="/clientes/editar/:id" element={<EditarCliente />} />
              </Routes>
            </main>

            <footer className="border-t border-border bg-card/60">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-muted-foreground sm:px-6">
                <span>IBDT 2025 - Gestion de inventario</span>
                <span>Construido con React + Tailwind</span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
