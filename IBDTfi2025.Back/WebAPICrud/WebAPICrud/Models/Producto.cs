using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("SKU", Name = "UQ_Producto_SKU", IsUnique = true)]
public partial class Producto
{
    [Key]
    public int ProductoId { get; set; }

    [StringLength(50)]
    public string SKU { get; set; } = null!;

    [StringLength(120)]
    public string Nombre { get; set; } = null!;

    public int CategoriaId { get; set; }

    public int ProveedorId { get; set; }

    [Column(TypeName = "decimal(12, 2)")]
    public decimal Precio { get; set; }

    public bool Activo { get; set; } = true;

    public DateTime FechaAlta { get; set; }

    [ForeignKey("CategoriaId")]
    [InverseProperty("Producto")]
    public virtual Categoria Categoria { get; set; } = null!;

    [InverseProperty("Producto")]
    public virtual ICollection<Inventario> Inventario { get; set; } = new List<Inventario>();

    [InverseProperty("Producto")]
    public virtual ICollection<MovimientoStock> MovimientoStock { get; set; } = new List<MovimientoStock>();

    [ForeignKey("ProveedorId")]
    [InverseProperty("Producto")]
    public virtual Proveedor Proveedor { get; set; } = null!;

    [InverseProperty("Producto")]
    public virtual ICollection<VentaDetalle> VentaDetalle { get; set; } = new List<VentaDetalle>();
}
