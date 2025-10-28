using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPICrud.Data;
using WebAPICrud.DTOs.Requests;
using WebAPICrud.Models;

namespace WebAPICrud.Controllers;

[Route("api/clientes")]
[ApiController]
public class ClientController : ControllerBase
{
    private readonly InventarioDbContext _context;

    public ClientController(InventarioDbContext context)
    {
        _context = context;
    }

    // ============================
    // GET: api/clientes/listar
    // ============================
    [HttpGet("listar")]
    public async Task<IActionResult> GetClientes()
    {
        var clientes = await _context.Cliente
            .AsNoTracking()
            .Where(c => c.Activo)
            .OrderBy(c => c.Nombre)
            .ToListAsync();

        if (clientes.Count == 0)
            return NotFound("No se encontraron clientes activos.");

        return Ok(clientes);
    }

    // ============================
    // GET: api/clientes/{id}
    // ============================
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetCliente(int id)
    {
        var cliente = await _context.Cliente
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.ClienteId == id);

        if (cliente == null)
            return NotFound($"No existe el cliente con ID {id}.");

        return Ok(cliente);
    }

    // ============================
    // POST: api/clientes
    // Body: ClientRequest
    // ============================
    [HttpPost]
    public async Task<IActionResult> CrearCliente([FromBody] ClientRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var emailRepetido = await _context.Cliente
                .AnyAsync(c => c.Email != null && c.Email.ToLower() == dto.Email!.ToLower());
            if (emailRepetido)
                return Conflict($"El email '{dto.Email}' ya esta registrado.");
        }

        var cliente = new Cliente
        {
            Nombre = dto.Nombre.Trim(),
            Email = dto.Email?.Trim(),
            Telefono = dto.Telefono?.Trim(),
            Activo = true,
            FechaAlta = DateTime.Now
        };

        _context.Cliente.Add(cliente);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCliente), new { id = cliente.ClienteId }, cliente);
    }

    // ============================
    // PUT: api/clientes/{id}
    // Body: ClientRequest
    // ============================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> ActualizarCliente(int id, [FromBody] ClientRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var cliente = await _context.Cliente.FirstOrDefaultAsync(c => c.ClienteId == id);
        if (cliente == null)
            return NotFound($"No existe el cliente con ID {id}.");

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var emailTomado = await _context.Cliente
                .AnyAsync(c => c.Email != null &&
                               c.Email.ToLower() == dto.Email!.ToLower() &&
                               c.ClienteId != id);
            if (emailTomado)
                return Conflict($"El email '{dto.Email}' ya esta siendo utilizado por otro cliente.");
        }

        cliente.Nombre = dto.Nombre.Trim();
        cliente.Email = dto.Email?.Trim();
        cliente.Telefono = dto.Telefono?.Trim();

        await _context.SaveChangesAsync();
        return Ok("Cliente actualizado correctamente.");
    }

    // ============================
    // DELETE: api/clientes/{id}
    // Eliminacion logica
    // ============================
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DesactivarCliente(int id)
    {
        var cliente = await _context.Cliente.FirstOrDefaultAsync(c => c.ClienteId == id);
        if (cliente == null)
            return NotFound($"No existe el cliente con ID {id}.");

        if (!cliente.Activo)
            return BadRequest("El cliente ya se encuentra desactivado.");

        cliente.Activo = false;
        await _context.SaveChangesAsync();

        return Ok("Cliente desactivado correctamente.");
    }
}
