USE InventarioDB;
GO

/* DATOS SEMILLA (≥ 50 filas totales) ===== */

-- Categorías (5)
INSERT INTO dbo.Categoria (Nombre) VALUES
(N'Ferretería'),(N'Electricidad'),(N'Pintura'),(N'Construcción'),(N'Seguridad');

-- Proveedores (6)
INSERT INTO dbo.Proveedor (RazonSocial,CUIT,Email,Telefono) VALUES
(N'Provac SA','20300111222','contacto@provac.com','11223344'),
(N'ElectroMax SRL','27333444555','ventas@electromax.com','11445566'),
(N'Colorin SA','30555666777','info@colorin.com','11778899'),
(N'AceroPlus SA','30777888999','comercial@aceroplus.com','11339977'),
(N'SegurPro SRL','27999111222','ventas@segurpro.com','11666111'),
(N'MultiInsumos SA','30700123456','hola@multiinsumos.com','11888999');

-- Almacenes (3)
INSERT INTO dbo.Almacen (Nombre,Ubicacion) VALUES
(N'Central',N'San Martin 600'),
(N'Depósito Sur',N'General Paz 700'),
(N'Depósito Norte',N'Monteagudo 550');

-- Productos (10)
INSERT INTO dbo.Producto (SKU,Nombre,CategoriaId,ProveedorId,Precio) VALUES
(N'SKU-0001',N'Tornillo 1"',1,1,10.50),
(N'SKU-0002',N'Taco plástico',1,1,5.20),
(N'SKU-0003',N'Cinta aisladora',2,2,3.90),
(N'SKU-0004',N'Llave térmica 20A',2,2,45.00),
(N'SKU-0005',N'Esmalte sintético 1L',3,3,28.70),
(N'SKU-0006',N'Rodillo 9"',3,3,12.00),
(N'SKU-0007',N'Cemento 50kg',4,4,22.00),
(N'SKU-0008',N'Arena fina m3',4,4,18.00),
(N'SKU-0009',N'Casco seguridad',5,5,35.00),
(N'SKU-0010',N'Guantes nitrilo',5,5,7.50);

-- Clientes (10)
INSERT INTO dbo.Cliente (Nombre,Email,Telefono) VALUES
(N'Juan Pérez','juan@example.com','1100001'),
(N'Ana Gómez','ana@example.com','1100002'),
(N'Luis Díaz','luis@example.com','1100003'),
(N'María Ruiz','maria@example.com','1100004'),
(N'Pedro López','pedro@example.com','1100005'),
(N'Sofía García','sofia@example.com','1100006'),
(N'Carlos Soto','carlos@example.com','1100007'),
(N'Lucía Vidal','lucia@example.com','1100008'),
(N'Pablo Ríos','pablo@example.com','1100009'),
(N'Rocío Paz','rocio@example.com','1100010');

-- Inventario: 10 productos x 3 almacenes = 30 filas
INSERT INTO dbo.Inventario (AlmacenId, ProductoId, Stock, UmbralRepos)
SELECT a.AlmacenId, p.ProductoId,
       CASE WHEN a.AlmacenId = 1 THEN 100
            WHEN a.AlmacenId = 2 THEN 40
            ELSE 60 END,
       5
FROM dbo.Almacen a
CROSS JOIN dbo.Producto p;


-- Ventas de ejemplo (5) + detalles (10)
DECLARE @v1 INT, @v2 INT, @v3 INT, @v4 INT, @v5 INT;

INSERT INTO dbo.Venta (ClienteId,Estado)
VALUES (1,2),(2,2),(3,2),(4,2),(5,2);

SELECT @v1 = MIN(VentaId) FROM dbo.Venta;
SET @v2 = @v1 + 1; SET @v3 = @v1 + 2; SET @v4 = @v1 + 3; SET @v5 = @v1 + 4;

INSERT INTO dbo.VentaDetalle (VentaId,ProductoId,Cantidad,PrecioUnitario) VALUES
(@v1,1,10,10.50),(@v1,3,5,3.90),
(@v2,7,2,22.00),(@v2,10,8,7.50),
(@v3,4,1,45.00),(@v3,5,2,28.70),
(@v4,9,3,35.00),(@v4,6,4,12.00),
(@v5,2,20,5.20),(@v5,8,1,18.00);


-- Recalcula totales de ventas según detalles
UPDATE v
SET Total = d.Suma
FROM dbo.Venta v
CROSS APPLY (
    SELECT SUM(Subtotal) AS Suma
    FROM dbo.VentaDetalle vd
    WHERE vd.VentaId = v.VentaId
) d;

-- Movimientos de stock coherentes con ventas (10 filas)
INSERT INTO dbo.MovimientoStock (AlmacenId, ProductoId, Tipo, Cantidad, Referencia)
SELECT 1, vd.ProductoId, 'OUT', vd.Cantidad, CONCAT(N'Venta:', vd.VentaId)
FROM dbo.VentaDetalle vd;


/* ===== Conteo rápido (debería superar 50) =====
   Categoria:5, Proveedor:6, Almacen:3, Producto:10, Cliente:10, Inventario:30,
   Venta:5, VentaDetalle:10, MovimientoStock:10  -> Total > 80
*/
