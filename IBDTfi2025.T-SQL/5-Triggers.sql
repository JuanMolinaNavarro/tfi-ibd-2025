USE InventarioDB;
GO

/* ============================================================
   6) PROGRAMACIÓN AUTOMÁTICA (TRIGGER)
   Tabla clave: dbo.Inventario
   Objetivos:
     a) Crear un TRIGGER AFTER INSERT/UPDATE/DELETE.
     b) Usar INSERTED/DELETED para:
        - Auditoría de cambios (stock y umbral).
        - Validación automática: NO permitir stock < 0.
============================================================ */

-- 1) TABLA DE AUDITORÍA
IF OBJECT_ID('dbo.Aud_Inventario') IS NULL
BEGIN
    CREATE TABLE dbo.Aud_Inventario (
        AuditId        INT IDENTITY PRIMARY KEY,
        Fecha          DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        Usuario        SYSNAME    NULL,
        HostName       NVARCHAR(128) NULL,
        Accion         CHAR(1)    NOT NULL,     -- 'I','U','D'
        AlmacenId      INT        NULL,
        ProductoId     INT        NULL,
        Stock_Old      INT        NULL,
        Stock_New      INT        NULL,
        Umbral_Old     INT        NULL,
        Umbral_New     INT        NULL
    );
END
GO

-- 2) TRIGGER AFTER I/U/D CON AUDITORÍA + VALIDACIÓN
CREATE OR ALTER TRIGGER dbo.TR_Inventario_AUD
ON dbo.Inventario
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    /* ---------- Validación de negocio ----------
       Si la operación resultó en registros con Stock < 0, se revierte.
       Nota: funciona en operaciones multi-fila.
    */
    IF EXISTS (SELECT 1 FROM inserted WHERE Stock < 0)
        THROW 60001, 'No se permite Stock negativo en Inventario.', 1;

    /* ---------- Auditoría ----------
       Se construye un set unificado con INSERTED y DELETED.
       - I: fila existe solo en INSERTED
       - U: fila existe en INSERTED y DELETED
       - D: fila existe solo en DELETED
    */
    ;WITH C AS (
        SELECT
            COALESCE(i.InventarioId, d.InventarioId)     AS InventarioId,
            COALESCE(i.AlmacenId,    d.AlmacenId)        AS AlmacenId,
            COALESCE(i.ProductoId,   d.ProductoId)       AS ProductoId,
            d.Stock      AS Stock_Old,
            i.Stock      AS Stock_New,
            d.UmbralRepos AS Umbral_Old,
            i.UmbralRepos AS Umbral_New,
            CASE
                WHEN i.InventarioId IS NOT NULL AND d.InventarioId IS NULL THEN 'I'
                WHEN i.InventarioId IS NOT NULL AND d.InventarioId IS NOT NULL THEN 'U'
                WHEN i.InventarioId IS NULL     AND d.InventarioId IS NOT NULL THEN 'D'
            END AS Accion
        FROM inserted i
        FULL OUTER JOIN deleted d
            ON i.InventarioId = d.InventarioId
    )
    INSERT INTO dbo.Aud_Inventario
        (Usuario, HostName, Accion, AlmacenId, ProductoId,
         Stock_Old, Stock_New, Umbral_Old, Umbral_New)
    SELECT
        SUSER_SNAME(), HOST_NAME(), c.Accion, c.AlmacenId, c.ProductoId,
        c.Stock_Old, c.Stock_New, c.Umbral_Old, c.Umbral_New
    FROM C c;
END
GO

INSERT INTO dbo.Aud_Inventario (Accion, AlmacenId, ProductoId, Stock_New, Umbral_New)
VALUES ('I', 1, 1, 10, 5);


-- Ver auditoría
SELECT * FROM dbo.Aud_Inventario ORDER BY AuditId DESC;
