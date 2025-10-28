using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebAPICrud.Models;

namespace WebAPICrud.Data;

public partial class InventarioDbContext : DbContext
{
    public InventarioDbContext()
    {
    }

    public InventarioDbContext(DbContextOptions<InventarioDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Almacen> Almacen { get; set; }

    public virtual DbSet<Aud_Inventario> Aud_Inventario { get; set; }

    public virtual DbSet<Categoria> Categoria { get; set; }

    public virtual DbSet<Cliente> Cliente { get; set; }

    public virtual DbSet<Inventario> Inventario { get; set; }

    public virtual DbSet<MovimientoStock> MovimientoStock { get; set; }

    public virtual DbSet<Producto> Producto { get; set; }

    public virtual DbSet<Proveedor> Proveedor { get; set; }

    public virtual DbSet<Venta> Venta { get; set; }

    public virtual DbSet<VentaDetalle> VentaDetalle { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {

    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Almacen>(entity =>
        {
            entity.HasKey(e => e.AlmacenId).HasName("PK__Almacen__022A08765DC9E81B");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Aud_Inventario>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__Aud_Inve__A17F2398EF417BC0");

            entity.Property(e => e.Accion).IsFixedLength();
            entity.Property(e => e.Fecha).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.CategoriaId).HasName("PK__Categori__F353C1E5530EE41A");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.ClienteId).HasName("PK__Cliente__71ABD08746FED309");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Inventario>(entity =>
        {
            entity.HasKey(e => e.InventarioId).HasName("PK__Inventar__FB8A24D760911B9E");

            entity.ToTable(tb => tb.HasTrigger("TR_Inventario_AUD"));

            entity.Property(e => e.UmbralRepos).HasDefaultValue(5);

            entity.HasOne(d => d.Almacen).WithMany(p => p.Inventario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventario_Almacen");

            entity.HasOne(d => d.Producto).WithMany(p => p.Inventario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Inventario_Producto");
        });

        modelBuilder.Entity<MovimientoStock>(entity =>
        {
            entity.HasKey(e => e.MovimientoId).HasName("PK__Movimien__BF923C2CAC5F789C");

            entity.Property(e => e.Fecha).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Tipo).IsFixedLength();

            entity.HasOne(d => d.Almacen).WithMany(p => p.MovimientoStock)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mov_Almacen");

            entity.HasOne(d => d.Producto).WithMany(p => p.MovimientoStock)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Mov_Producto");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.ProductoId).HasName("PK__Producto__A430AEA3FD37B94D");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Producto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Producto_Categoria");

            entity.HasOne(d => d.Proveedor).WithMany(p => p.Producto)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Producto_Proveedor");
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.ProveedorId).HasName("PK__Proveedo__61266A59F8E0DBD3");

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.CUIT).IsFixedLength();
            entity.Property(e => e.FechaAlta).HasDefaultValueSql("(sysdatetime())");
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.VentaId).HasName("PK__Venta__5B4150AC8AFAF791");

            entity.Property(e => e.Estado).HasDefaultValue((byte)1);
            entity.Property(e => e.Fecha).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.Cliente).WithMany(p => p.Venta)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Venta_Cliente");
        });

        modelBuilder.Entity<VentaDetalle>(entity =>
        {
            entity.HasKey(e => e.VentaDetalleId).HasName("PK__VentaDet__2DF62C370564DDFC");

            entity.Property(e => e.Subtotal).HasComputedColumnSql("(CONVERT([decimal](12,2),[Cantidad])*[PrecioUnitario])", true);

            entity.HasOne(d => d.Producto).WithMany(p => p.VentaDetalle)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_VD_Producto");

            entity.HasOne(d => d.Venta).WithMany(p => p.VentaDetalle).HasConstraintName("FK_VD_Venta");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
