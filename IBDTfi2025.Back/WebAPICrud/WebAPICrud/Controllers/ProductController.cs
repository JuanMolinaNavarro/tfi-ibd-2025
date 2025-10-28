using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPICrud.Data;
using WebAPICrud.Models;
using WebAPICrud.DTOs.Requests;

namespace WebAPICrud.Controllers;

[Route("api/productos")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly InventarioDbContext _context;

    public ProductController(InventarioDbContext context)
    {
        _context = context;
    }

    // ============================
    // GET: api/productos/listar
    // ============================
    [HttpGet("listar")]
    public async Task<IActionResult> GetProductos()
    {
        var productos = await _context.Producto
            .AsNoTracking()
            .Where(p => p.Activo == true)
            .ToListAsync();

        if (productos.Count == 0)
            return NotFound("No se encontraron productos activos.");

        return Ok(productos);
    }

    // ============================
    // GET: api/productos/5
    // ============================
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProducto(int id)
    {
        var producto = await _context.Producto
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductoId == id);

        if (producto == null)
            return NotFound($"No existe el producto con ID {id}.");

        return Ok(producto);
    }

    // ============================
    // POST: api/productos
    // Body: ProductRequest
    // ============================
    [HttpPost]
    public async Task<IActionResult> CrearProducto([FromBody] ProductRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Opcional: validar SKU único
        var skuExiste = await _context.Producto.AnyAsync(p => p.SKU == dto.SKU);
        if (skuExiste)
            return Conflict($"El SKU '{dto.SKU}' ya existe.");

        var producto = new Producto
        {
            SKU = dto.SKU,
            Nombre = dto.Nombre,
            CategoriaId = dto.CategoriaId,
            ProveedorId = dto.ProveedorId,
            Precio = dto.Precio,
            Activo = true,
            FechaAlta = DateTime.Now
        };

        _context.Producto.Add(producto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoId }, producto);
    }

    // ============================
    // PUT: api/productos/5
    // Body: ProductRequest
    // ============================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarProducto(int id, [FromBody] ProductRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var producto = await _context.Producto.FirstOrDefaultAsync(p => p.ProductoId == id);
        if (producto == null)
            return NotFound($"No existe el producto con ID {id}.");

        // Opcional: validar SKU único para otro producto
        var skuTomado = await _context.Producto
            .AnyAsync(p => p.SKU == dto.SKU && p.ProductoId != id);
        if (skuTomado)
            return Conflict($"El SKU '{dto.SKU}' ya está usado por otro producto.");

        // Mapear campos editables
        producto.SKU = dto.SKU;
        producto.Nombre = dto.Nombre;
        producto.CategoriaId = dto.CategoriaId;
        producto.ProveedorId = dto.ProveedorId;
        producto.Precio = dto.Precio;
        producto.Activo = true;

        await _context.SaveChangesAsync();
        return Ok("Producto actualizado correctamente.");
    }

    // ============================
    // DELETE: api/productos/5
    // Eliminación lógica
    // ============================
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> EliminarProducto(int id)
    {
        var producto = await _context.Producto.FirstOrDefaultAsync(p => p.ProductoId == id);
        if (producto == null)
            return NotFound($"No existe el producto con ID {id}.");

        if (!producto.Activo)
            return BadRequest("El producto ya se encuentra desactivado.");

        producto.Activo = false;
        await _context.SaveChangesAsync();

        return Ok("Producto desactivado correctamente.");
    }
}
