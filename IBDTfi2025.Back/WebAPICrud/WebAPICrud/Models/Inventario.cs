using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("AlmacenId", "ProductoId", Name = "IX_Inventario_Almacen_Producto")]
[Index("AlmacenId", "ProductoId", Name = "UQ_Inventario_Alm_Prod", IsUnique = true)]
public partial class Inventario
{
    [Key]
    public int InventarioId { get; set; }

    public int AlmacenId { get; set; }

    public int ProductoId { get; set; }

    public int Stock { get; set; }

    public int UmbralRepos { get; set; }

    [ForeignKey("AlmacenId")]
    [InverseProperty("Inventario")]
    public virtual Almacen Almacen { get; set; } = null!;

    [ForeignKey("ProductoId")]
    [InverseProperty("Inventario")]
    public virtual Producto Producto { get; set; } = null!;
}
