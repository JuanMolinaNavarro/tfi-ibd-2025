namespace WebAPICrud.DTOs.Requests;

public record ProductRequest
{
    public string SKU { get; init; } = string.Empty;
    public string Nombre { get; init; } = string.Empty;
    public int CategoriaId { get; init; }
    public int ProveedorId { get; init; }
    public decimal Precio { get; init; }
}
