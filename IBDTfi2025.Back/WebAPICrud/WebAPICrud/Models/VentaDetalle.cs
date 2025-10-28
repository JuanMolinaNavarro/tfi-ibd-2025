using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("ProductoId", Name = "IX_VD_Producto")]
[Index("VentaId", Name = "IX_VD_Venta")]
public partial class VentaDetalle
{
    [Key]
    public int VentaDetalleId { get; set; }

    public int VentaId { get; set; }

    public int ProductoId { get; set; }

    public int Cantidad { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal PrecioUnitario { get; set; }

    [Column(TypeName = "decimal(25, 4)")]
    public decimal? Subtotal { get; set; }

    [ForeignKey("ProductoId")]
    [InverseProperty("VentaDetalle")]
    public virtual Producto Producto { get; set; } = null!;

    [ForeignKey("VentaId")]
    [InverseProperty("VentaDetalle")]
    public virtual Venta Venta { get; set; } = null!;
}
