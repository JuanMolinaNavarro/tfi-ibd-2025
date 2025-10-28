using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace WebAPICrud.Models;

public partial class Aud_Inventario
{
    [Key]
    public int AuditId { get; set; }

    public DateTime Fecha { get; set; }

    [StringLength(128)]
    public string? Usuario { get; set; }

    [StringLength(128)]
    public string? HostName { get; set; }

    [StringLength(1)]
    [Unicode(false)]
    public string Accion { get; set; } = null!;

    public int? AlmacenId { get; set; }

    public int? ProductoId { get; set; }

    public int? Stock_Old { get; set; }

    public int? Stock_New { get; set; }

    public int? Umbral_Old { get; set; }

    public int? Umbral_New { get; set; }
}
