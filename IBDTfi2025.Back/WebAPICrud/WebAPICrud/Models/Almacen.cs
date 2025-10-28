using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("Nombre", Name = "UQ__Almacen__75E3EFCFF5ACAA8C", IsUnique = true)]
public partial class Almacen
{
    [Key]
    public int AlmacenId { get; set; }

    [StringLength(80)]
    public string Nombre { get; set; } = null!;

    [StringLength(120)]
    public string? Ubicacion { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaAlta { get; set; }

    [InverseProperty("Almacen")]
    public virtual ICollection<Inventario> Inventario { get; set; } = new List<Inventario>();

    [InverseProperty("Almacen")]
    public virtual ICollection<MovimientoStock> MovimientoStock { get; set; } = new List<MovimientoStock>();
}
