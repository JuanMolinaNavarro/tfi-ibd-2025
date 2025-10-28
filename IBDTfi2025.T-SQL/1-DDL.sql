/* ===== 1) CREACIÓN DE BD Y SCHEMA ===== */
IF DB_ID('InventarioDB') IS NULL
BEGIN
    CREATE DATABASE InventarioDB;
END
GO
USE InventarioDB;
GO

/* ===== 2) TABLAS ===== */

/* Catálogo */
CREATE TABLE dbo.Categoria (
    CategoriaId     INT IDENTITY PRIMARY KEY,
    Nombre          NVARCHAR(80) NOT NULL UNIQUE,
    Activo          BIT NOT NULL CONSTRAINT DF_Categoria_Activo DEFAULT 1,
    FechaAlta       DATETIME2 NOT NULL CONSTRAINT DF_Categoria_FechaAlta DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Proveedor (
    ProveedorId     INT IDENTITY PRIMARY KEY,
    RazonSocial     NVARCHAR(120) NOT NULL,
    CUIT            CHAR(11) NOT NULL,
    Email           NVARCHAR(120) NULL,
    Telefono        NVARCHAR(30) NULL,
    Activo          BIT NOT NULL CONSTRAINT DF_Proveedor_Activo DEFAULT 1,
    FechaAlta       DATETIME2 NOT NULL CONSTRAINT DF_Proveedor_FechaAlta DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_Proveedor_CUIT UNIQUE (CUIT),
    CONSTRAINT CK_Proveedor_CUIT_Digits CHECK (CUIT NOT LIKE '%[^0-9]%')
);

CREATE TABLE dbo.Producto (
    ProductoId      INT IDENTITY PRIMARY KEY,
    SKU             NVARCHAR(50) NOT NULL,
    Nombre          NVARCHAR(120) NOT NULL,
    CategoriaId     INT NOT NULL,
    ProveedorId     INT NOT NULL,
    Precio          DECIMAL(12,2) NOT NULL CONSTRAINT CK_Producto_Precio CHECK (Precio >= 0),
    Activo          BIT NOT NULL CONSTRAINT DF_Producto_Activo DEFAULT 1,
    FechaAlta       DATETIME2 NOT NULL CONSTRAINT DF_Producto_FechaAlta DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_Producto_SKU UNIQUE (SKU),
    CONSTRAINT FK_Producto_Categoria FOREIGN KEY (CategoriaId) REFERENCES dbo.Categoria(CategoriaId),
    CONSTRAINT FK_Producto_Proveedor FOREIGN KEY (ProveedorId) REFERENCES dbo.Proveedor(ProveedorId)
);

CREATE TABLE dbo.Almacen (
    AlmacenId       INT IDENTITY PRIMARY KEY,
    Nombre          NVARCHAR(80) NOT NULL UNIQUE,
    Ubicacion       NVARCHAR(120) NULL,
    Activo          BIT NOT NULL CONSTRAINT DF_Almacen_Activo DEFAULT 1,
    FechaAlta       DATETIME2 NOT NULL CONSTRAINT DF_Almacen_FechaAlta DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Inventario (
    InventarioId    INT IDENTITY PRIMARY KEY,
    AlmacenId       INT NOT NULL,
    ProductoId      INT NOT NULL,
    Stock           INT NOT NULL CONSTRAINT CK_Inventario_Stock CHECK (Stock >= 0),
    UmbralRepos     INT NOT NULL CONSTRAINT DF_Inventario_Umbral DEFAULT 5,
    CONSTRAINT FK_Inventario_Almacen  FOREIGN KEY (AlmacenId)  REFERENCES dbo.Almacen(AlmacenId),
    CONSTRAINT FK_Inventario_Producto FOREIGN KEY (ProductoId) REFERENCES dbo.Producto(ProductoId),
    CONSTRAINT UQ_Inventario_Alm_Prod UNIQUE (AlmacenId, ProductoId)
);

CREATE TABLE dbo.Cliente (
    ClienteId       INT IDENTITY PRIMARY KEY,
    Nombre          NVARCHAR(120) NOT NULL,
    Email           NVARCHAR(120) NULL,
    Telefono        NVARCHAR(30) NULL,
    Activo          BIT NOT NULL CONSTRAINT DF_Cliente_Activo DEFAULT 1,
    FechaAlta       DATETIME2 NOT NULL CONSTRAINT DF_Cliente_FechaAlta DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Cliente_EmailFmt CHECK (Email IS NULL OR Email LIKE '%@%.%')
);

CREATE TABLE dbo.Venta (
    VentaId         INT IDENTITY PRIMARY KEY,
    Fecha           DATETIME2 NOT NULL CONSTRAINT DF_Venta_Fecha DEFAULT SYSDATETIME(),
    ClienteId       INT NOT NULL,
    Total           DECIMAL(14,2) NOT NULL CONSTRAINT DF_Venta_Total DEFAULT 0,
    Estado          TINYINT NOT NULL CONSTRAINT DF_Venta_Estado DEFAULT 1
        /* 1=Borrador, 2=Confirmada, 3=Anulada */,
    CONSTRAINT FK_Venta_Cliente FOREIGN KEY (ClienteId) REFERENCES dbo.Cliente(ClienteId),
    CONSTRAINT CK_Venta_Total CHECK (Total >= 0)
);

CREATE TABLE dbo.VentaDetalle (
    VentaDetalleId  INT IDENTITY PRIMARY KEY,
    VentaId         INT NOT NULL,
    ProductoId      INT NOT NULL,
    Cantidad        INT NOT NULL CONSTRAINT CK_VD_Cantidad CHECK (Cantidad > 0),
    PrecioUnitario  DECIMAL(12,2) NOT NULL CONSTRAINT CK_VD_Precio CHECK (PrecioUnitario >= 0),
    Subtotal AS (CAST(Cantidad AS DECIMAL(12,2)) * PrecioUnitario) PERSISTED,
    CONSTRAINT FK_VD_Venta    FOREIGN KEY (VentaId)    REFERENCES dbo.Venta(VentaId) ON DELETE CASCADE,
    CONSTRAINT FK_VD_Producto FOREIGN KEY (ProductoId) REFERENCES dbo.Producto(ProductoId)
);

CREATE TABLE dbo.MovimientoStock (
    MovimientoId    INT IDENTITY PRIMARY KEY,
    Fecha           DATETIME2 NOT NULL CONSTRAINT DF_Mov_Fecha DEFAULT SYSDATETIME(),
    AlmacenId       INT NOT NULL,
    ProductoId      INT NOT NULL,
    Tipo            CHAR(3) NOT NULL,   /* 'IN' o 'OUT' */
    Cantidad        INT NOT NULL,
    Referencia      NVARCHAR(60) NULL,  /* p.ej. 'Venta:12' */
    CONSTRAINT FK_Mov_Almacen  FOREIGN KEY (AlmacenId)  REFERENCES dbo.Almacen(AlmacenId),
    CONSTRAINT FK_Mov_Producto FOREIGN KEY (ProductoId) REFERENCES dbo.Producto(ProductoId),
    CONSTRAINT CK_Mov_Tipo CHECK (Tipo IN ('IN','OUT')),
    CONSTRAINT CK_Mov_Cant CHECK (Cantidad > 0)
);

/* ===== 3) ÍNDICES NO AGRUPADOS ===== */

/* Índice compuesto para búsquedas y JOIN por almacén y producto.
   Justificación: consultas frecuentes de stock por almacén y producto,
   además de JOIN con UQ (al acelerar búsqueda exacta y rangos). */
CREATE NONCLUSTERED INDEX IX_Inventario_Almacen_Producto
ON dbo.Inventario(AlmacenId, ProductoId) INCLUDE(Stock);

/* Índice por fecha y cliente para listados y filtros.
   Justificación: consultas por rango de fechas y por cliente con ordenación reciente. */
CREATE NONCLUSTERED INDEX IX_Venta_Fecha_Cliente
ON dbo.Venta(Fecha DESC, ClienteId);

-- Adicionales útiles
CREATE NONCLUSTERED INDEX IX_VD_Venta ON dbo.VentaDetalle(VentaId);
CREATE NONCLUSTERED INDEX IX_VD_Producto ON dbo.VentaDetalle(ProductoId);

