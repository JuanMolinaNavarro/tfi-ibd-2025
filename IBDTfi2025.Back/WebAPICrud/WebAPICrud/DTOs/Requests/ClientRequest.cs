using System.ComponentModel.DataAnnotations;

namespace WebAPICrud.DTOs.Requests;

public class ClientRequest
{
    [Required]
    [StringLength(120)]
    public string Nombre { get; set; } = null!;

    [EmailAddress]
    [StringLength(120)]
    public string? Email { get; set; }

    [StringLength(30)]
    public string? Telefono { get; set; }
}

