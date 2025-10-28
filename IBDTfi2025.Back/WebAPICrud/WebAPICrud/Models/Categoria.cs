using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

[Index("Nombre", Name = "UQ__Categori__75E3EFCFC17A7317", IsUnique = true)]
public partial class Categoria
{
    [Key]
    public int CategoriaId { get; set; }

    [StringLength(80)]
    public string Nombre { get; set; } = null!;

    public bool Activo { get; set; }

    public DateTime FechaAlta { get; set; }

    [InverseProperty("Categoria")]
    public virtual ICollection<Producto> Producto { get; set; } = new List<Producto>();
}
