using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("CUIT", Name = "UQ_Proveedor_CUIT", IsUnique = true)]
public partial class Proveedor
{
    [Key]
    public int ProveedorId { get; set; }

    [StringLength(120)]
    public string RazonSocial { get; set; } = null!;

    [StringLength(11)]
    [Unicode(false)]
    public string CUIT { get; set; } = null!;

    [StringLength(120)]
    public string? Email { get; set; }

    [StringLength(30)]
    public string? Telefono { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaAlta { get; set; }

    [InverseProperty("Proveedor")]
    public virtual ICollection<Producto> Producto { get; set; } = new List<Producto>();
}
