using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("Fecha", "ClienteId", Name = "IX_Venta_Fecha_Cliente", IsDescending = new[] { true, false })]
public partial class Venta
{
    [Key]
    public int VentaId { get; set; }

    public DateTime Fecha { get; set; }

    public int ClienteId { get; set; }

    [Column(TypeName = "decimal(14, 2)")]
    public decimal Total { get; set; }

    public byte Estado { get; set; }

    [ForeignKey("ClienteId")]
    [InverseProperty("Venta")]
    public virtual Cliente Cliente { get; set; } = null!;

    [InverseProperty("Venta")]
    public virtual ICollection<VentaDetalle> VentaDetalle { get; set; } = new List<VentaDetalle>();
}
