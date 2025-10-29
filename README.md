# 💾 Trabajo Final Integrador — Implementación de Bases de Datos

### 🏫 Universidad Tecnológica Nacional — Facultad Regional Tucumán  
**Carrera:** Ingeniería en Sistemas de Información  
**Materia:** Implementación de Bases de Datos  
**Comisión:** 3K6  
**Año:** 2025  

---

## 📘 Descripción del Proyecto

Este trabajo corresponde al **Trabajo Práctico N° 6 (TP6)** de la materia *Implementación de Bases de Datos*, cuyo objetivo es **diseñar, implementar y conectar una base de datos funcional en SQL Server** con una aplicación externa (interfaz), demostrando el uso de **T-SQL avanzado**, **control transaccional** y **arquitectura multicapa**.

El sistema desarrollado busca representar un **sistema de gestión** completamente funcional, integrando todos los conceptos aprendidos a lo largo del curso.

---

## 🎯 Objetivos

- 🧱 Diseñar un modelo entidad-relación con al menos **4 tablas interconectadas**.  
- 💾 Implementar la base de datos en **SQL Server** con claves primarias, foráneas y restricciones de integridad.  
- ⚙️ Desarrollar procedimientos almacenados, triggers y consultas avanzadas.  
- 🌐 Conectar la base de datos con una **interfaz externa** (consola, web o escritorio).  
- 🧩 Demostrar el correcto funcionamiento de una **operación transaccional** entre múltiples tablas.

---

## 🧮 Contenidos del Trabajo

### 1️⃣ Modelo Entidad-Relación  
📊 Diagrama ER detallando entidades, relaciones y una relación N:M con tabla intermedia.

### 2️⃣ Script de Creación (DDL)  
- Creación de tablas con claves primarias y foráneas.  
- Restricciones `CHECK`.  
- Índices no agrupados en columnas de búsqueda o join.

### 3️⃣ Inserción de Datos (DML Inicial)  
Carga de **al menos 50 registros** distribuidos entre las tablas.

### 4️⃣ Consultas Avanzadas (DML y Subconsultas)  
Consultas que respondan a preguntas críticas del negocio utilizando:  
- Subconsultas escalares, correlacionadas o de conjunto.  
- Cláusulas `NOT EXISTS` para manejo correcto de registros nulos.

### 5️⃣ Procedimiento Almacenado Transaccional  
Creación de un `Stored Procedure` que manipule datos en **dos o más tablas** de forma dependiente, asegurando la **consistencia transaccional**.

### 6️⃣ Trigger (Programación Automática)  
Implementación de un `TRIGGER` con uso de las tablas especiales `INSERTED` o `DELETED` para realizar auditorías o validaciones automáticas.

### 7️⃣ Interfaz de Usuario (UI)  
Desarrollo de una pequeña aplicación que:  
- Se conecte a SQL Server.  
- Permita ejecutar operaciones básicas.  
- Llame al procedimiento almacenado principal mediante un botón o comando.

### 8️⃣ Demostración Funcional  
📸 Captura o video mostrando la operación transaccional completa (ej. registro de venta y reducción de stock).

---

## 👩‍💻 Integrantes del Grupo

| Nombre | Legajo |
|--------|--------|
| **Juan Martín Molina Navarro** | 52.640 |
| **Lautaro Castillo** | — |
| **Luisina Svaldi** | — |

---

## 🧠 Tecnologías Utilizadas

- 🗄️ **Microsoft SQL Server** — Base de datos relacional  
- 💻 **C# / Python / Node.js** — Interfaz externa (según implementación)  
- 🧰 **T-SQL** — Procedimientos, triggers y lógica de negocio  
- 🧮 **Modelo ER** — Diseño estructurado de entidades y relaciones  

---

## 🚀 Ejecución del Proyecto

1. Clonar el repositorio  
   ```bash
   git clone https://github.com/JuanMolinaNavarro/tfi-ibd-2025.git
   ```
2. Importar el script SQL (`TP6_Creacion_BD.sql`) en SQL Server.
3. Ejecutar los **scripts DML** para insertar los registros iniciales.  
4. Correr la aplicación externa (carpeta `/app` o `/frontend`) y establecer conexión con la base de datos.  
5. Probar el botón o comando que ejecuta el **Stored Procedure transaccional**.  

---

## 🏁 Resultado Esperado

✔️ Base de datos funcional  
✔️ Interfaz conectada correctamente  
✔️ Operación transaccional ejecutada con éxito  
✔️ Lógica de auditoría y consistencia de datos  

---

## 📅 Fecha de Entrega
📆 **29 de Octubre de 2025**
