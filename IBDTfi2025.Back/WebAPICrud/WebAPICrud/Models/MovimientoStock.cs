using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

public partial class MovimientoStock
{
    [Key]
    public int MovimientoId { get; set; }

    public DateTime Fecha { get; set; }

    public int AlmacenId { get; set; }

    public int ProductoId { get; set; }

    [StringLength(3)]
    [Unicode(false)]
    public string Tipo { get; set; } = null!;

    public int Cantidad { get; set; }

    [StringLength(60)]
    public string? Referencia { get; set; }

    [ForeignKey("AlmacenId")]
    [InverseProperty("MovimientoStock")]
    public virtual Almacen Almacen { get; set; } = null!;

    [ForeignKey("ProductoId")]
    [InverseProperty("MovimientoStock")]
    public virtual Producto Producto { get; set; } = null!;
}
