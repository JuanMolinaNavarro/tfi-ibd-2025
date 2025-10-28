USE InventarioDB;
GO

/* ============================================================
   a) CONSULTA COMPLEJA DEL NEGOCIO
   Subconsultas escalares y correlacionadas
   ------------------------------------------------------------
   Objetivo:
   - Listar productos cuyo precio sea MAYOR que el promedio de su categoría
   - Además, cuyo stock total (en todos los almacenes) esté por debajo del umbral total.
============================================================ */
SELECT
    p.ProductoId,
    p.Nombre,
    c.Nombre AS Categoria,
    pr.RazonSocial AS Proveedor,
    p.Precio,
    /* Subconsulta escalar: obtiene el promedio de precios por categoría */
    (SELECT AVG(p2.Precio)
     FROM dbo.Producto p2
     WHERE p2.CategoriaId = p.CategoriaId) AS PromedioCategoria,
    /* Subconsulta escalar: total de stock por producto */
    (SELECT SUM(i.Stock)
     FROM dbo.Inventario i
     WHERE i.ProductoId = p.ProductoId) AS StockTotal,
    /* Subconsulta escalar: umbral total por producto */
    (SELECT SUM(i.UmbralRepos)
     FROM dbo.Inventario i
     WHERE i.ProductoId = p.ProductoId) AS UmbralTotal
FROM dbo.Producto p
JOIN dbo.Categoria c  ON c.CategoriaId = p.CategoriaId
JOIN dbo.Proveedor pr ON pr.ProveedorId = p.ProveedorId
WHERE
    p.Precio >
        (SELECT AVG(p3.Precio)
         FROM dbo.Producto p3
         WHERE p3.CategoriaId = p.CategoriaId)
    AND (SELECT SUM(i.Stock)
         FROM dbo.Inventario i
         WHERE i.ProductoId = p.ProductoId)
        <
        (SELECT SUM(i.UmbralRepos)
         FROM dbo.Inventario i
         WHERE i.ProductoId = p.ProductoId);
-- Resultado: productos más caros que el promedio de su categoría
-- y con stock total inferior a su umbral total de reposición.


/* ============================================================
   b) CONSULTA CRÍTICA DEL NEGOCIO CON NOT EXISTS
   ------------------------------------------------------------
   Objetivo:
   - Mostrar clientes que NO hayan realizado ninguna venta confirmada.
   - Uso de NOT EXISTS (evita problemas de NULLs en NOT IN).
============================================================ */
SELECT
    c.ClienteId,
    c.Nombre,
    c.Email
FROM dbo.Cliente c
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.Venta v
    WHERE v.ClienteId = c.ClienteId
      AND v.Estado = 2   -- 2 = Confirmada
);
-- Resultado: clientes sin ventas confirmadas.
-- NOT EXISTS es más seguro que NOT IN porque ignora posibles NULLs.


/* ============================================================
   OPCIONAL: EQUIVALENTE CON NOT IN (no recomendado sin NULL check)
============================================================ */
SELECT
    c.ClienteId,
    c.Nombre,
    c.Email
FROM dbo.Cliente c
WHERE c.ClienteId NOT IN (
    SELECT v.ClienteId
    FROM dbo.Venta v
    WHERE v.Estado = 2
      AND v.ClienteId IS NOT NULL  -- evita ambigüedad con NULL
);
