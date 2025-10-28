using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

public partial class Cliente
{
    [Key]
    public int ClienteId { get; set; }

    [StringLength(120)]
    public string Nombre { get; set; } = null!;

    [StringLength(120)]
    public string? Email { get; set; }

    [StringLength(30)]
    public string? Telefono { get; set; }

    public bool Activo { get; set; }

    public DateTime FechaAlta { get; set; }

    [InverseProperty("Cliente")]
    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
