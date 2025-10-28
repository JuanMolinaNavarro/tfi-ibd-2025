USE InventarioDB;
GO

/* ============================================================
   Procedimiento Almacenado Transaccional
   ------------------------------------------------------------
   Nombre: SP_ConfirmarVenta
   Objetivo:
     - Confirmar una venta del sistema de Inventario.
     - Asegurar la consistencia de datos en:
         * Tabla Inventario (descuento de stock)
         * Tabla MovimientoStock (registro del movimiento)
         * Tabla Venta (actualiza estado y total)
   ------------------------------------------------------------
   Características:
     - Usa BEGIN TRAN / COMMIT / ROLLBACK
     - Usa TRY/CATCH con XACT_ABORT
     - Manipula datos en al menos dos tablas dependientes
============================================================ */
CREATE OR ALTER PROCEDURE dbo.SP_ConfirmarVenta
    @VentaId   INT,       -- ID de la venta a confirmar
    @AlmacenId INT        -- ID del almacén donde se descuenta el stock
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    /* ===== VALIDACIONES PREVIAS ===== */
    IF NOT EXISTS (SELECT 1 FROM dbo.Venta WHERE VentaId = @VentaId)
        THROW 50001, 'La venta no existe.', 1;

    IF EXISTS (SELECT 1 FROM dbo.Venta WHERE VentaId = @VentaId AND Estado = 2)
        THROW 50002, 'La venta ya fue confirmada.', 1;

    IF EXISTS (SELECT 1 FROM dbo.Venta WHERE VentaId = @VentaId AND Estado = 3)
        THROW 50003, 'La venta está anulada.', 1;

    IF NOT EXISTS (SELECT 1 FROM dbo.Almacen WHERE AlmacenId = @AlmacenId)
        THROW 50004, 'El almacén especificado no existe.', 1;

    /* ===== VALIDACIÓN DE STOCK ===== */
    IF EXISTS (
        SELECT 1
        FROM dbo.VentaDetalle vd
        JOIN dbo.Inventario i
          ON i.ProductoId = vd.ProductoId AND i.AlmacenId = @AlmacenId
        WHERE vd.VentaId = @VentaId
          AND i.Stock < vd.Cantidad
    )
        THROW 50005, 'Stock insuficiente para uno o más productos.', 1;

    /* ===== INICIO DE LA TRANSACCIÓN ===== */
    BEGIN TRY
        BEGIN TRAN;

        /* 1. Actualiza stock en Inventario */
        UPDATE i
        SET i.Stock = i.Stock - vd.Cantidad
        FROM dbo.Inventario i
        JOIN dbo.VentaDetalle vd
          ON vd.ProductoId = i.ProductoId
        WHERE vd.VentaId = @VentaId
          AND i.AlmacenId = @AlmacenId;

        /* 2. Inserta movimientos de salida (OUT) */
        INSERT INTO dbo.MovimientoStock (AlmacenId, ProductoId, Tipo, Cantidad, Referencia)
        SELECT @AlmacenId, vd.ProductoId, 'OUT', vd.Cantidad, CONCAT(N'Venta:', vd.VentaId)
        FROM dbo.VentaDetalle vd
        WHERE vd.VentaId = @VentaId;

        /* 3. Recalcula el total de la venta */
        UPDATE v
        SET Total = d.Suma
        FROM dbo.Venta v
        CROSS APPLY (
            SELECT SUM(Subtotal) AS Suma
            FROM dbo.VentaDetalle vd
            WHERE vd.VentaId = v.VentaId
        ) d
        WHERE v.VentaId = @VentaId;

        /* 4. Cambia el estado a "Confirmada" */
        UPDATE dbo.Venta
        SET Estado = 2, Fecha = SYSDATETIME()
        WHERE VentaId = @VentaId;

        COMMIT;

        PRINT 'Venta confirmada correctamente.';
        SELECT 'OK' AS Estado, @VentaId AS VentaProcesada, @AlmacenId AS AlmacenUsado;

    END TRY
    BEGIN CATCH
        /* Si ocurre un error, se revierte todo */
        IF XACT_STATE() <> 0 ROLLBACK;

        DECLARE @msg NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @num INT = ERROR_NUMBER();
        THROW @num, @msg, 1;
    END CATCH
END;
GO
