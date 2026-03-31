# 🏨 MiHotel - Sistema de Gestión de Reservas

---

## 📌 Alcance del Proyecto
El presente proyecto es un sistema de gestión diseñado para un **Hotel Pequeño**. Su objetivo principal es digitalizar y automatizar los procesos fundamentales de recepción, permitiendo un control centralizado sobre el registro de huéspedes, la asignación de habitaciones, la verificación de disponibilidad en tiempo real y la gestión de ingresos y salidas (Check-in / Check-out) calculando recargos automáticos por mora.

## 🏗️ Arquitectura de Software
El sistema utiliza una arquitectura **Cliente-Servidor** fuertemente desacoplada, dividida en tres capas principales:

1. **Frontend (Cliente):** Desarrollado en HTML5, CSS3 (metodología BEM) y Vanilla JavaScript puro utilizando Módulos ES6. No depende de frameworks externos, optimizando la carga mediante el consumo asíncrono de la API REST.
2. **Backend (Servidor API REST):** Desarrollado en C# ASP.NET Core. Implementa Clean Architecture y principios SOLID, utilizando Inyección de Dependencias, el patrón Repositorio (Repository Pattern), Servicios de Lógica de Negocio y Data Transfer Objects (DTOs) para proteger las entidades del dominio.
3. **Base de Datos (Persistencia):** Base de datos relacional PostgreSQL alojada en la nube mediante Supabase, garantizando alta disponibilidad e integridad referencial.

![Diagrama de Arquitectura](/imagenes/arquitectura.png)

## 📖 Historias de Usuario Implementadas

El sistema abarca el ciclo completo de recepción del hotel. A continuación, se detallan las Historias de Usuario (HU) desarrolladas en este prototipo, junto con sus reglas de negocio integradas:

### 👤 HU-01: Registrar Huésped
* **Descripción:** Permite al recepcionista registrar los datos personales y de contacto de un nuevo cliente para agilizar futuras reservas.
* **Características Técnicas:**
  * Validación de campos obligatorios desde el frontend.
  * Verificación de unicidad en el backend: El sistema impide registrar dos huéspedes con el mismo Carnet de Identidad (CI) o Pasaporte, devolviendo un error controlado.

### 📅 HU-02: Crear y Validar Reserva
* **Descripción:** Permite asignar una habitación a un huésped para fechas específicas, garantizando que no existan conflictos lógicos ni de ocupación.
* **Características Técnicas (Reglas de Negocio Centrales):**
  * **Validación Cronológica:** El sistema rechaza la reserva si la fecha de salida es anterior o igual a la de ingreso.
  * **Control de Aforo:** Se valida que la cantidad total de ocupantes no exceda la capacidad máxima del tipo de habitación seleccionado.
  * **Anti-Overbooking:** Algoritmo de cruce de fechas que verifica las reservas existentes y bloquea la operación si la habitación ya está ocupada en el rango de fechas solicitado (ignorando reservas canceladas o finalizadas).

### 🛎️ HU-03: Gestión de Check-in y Check-out
* **Descripción:** Controla el ciclo de vida de la estadía, marcando el ingreso del huésped y su posterior salida, calculando costos adicionales si corresponde.
* **Características Técnicas:**
  * **Check-in:** Cambia el estado de la reserva a "En Curso" y registra la hora exacta de llegada.
  * **Check-out:** Finaliza la estadía, libera la habitación (cambiando su estado a "Disponible") y evalúa penalizaciones.
  * **Cálculo de Late Check-out:** Si el huésped realiza el check-out después de las 12:00 PM o en una fecha posterior a la pactada, el backend aplica automáticamente un recargo del 50% sobre el precio base de la habitación.

### 🛏️ HU-04: Visualizar Estado de Habitaciones
* **Descripción:** Provee una vista general de la infraestructura del hotel.
* **Características Técnicas:** * Lista todas las habitaciones cruzando datos con sus "Tipos" (Variaciones).
  * Muestra la capacidad máxima, el precio referencial y el estado en tiempo real (Disponible, Ocupada, Mantenimiento) mediante insignias visuales (badges).

### 📖 HU-05: Ver Directorio de Huéspedes
* **Descripción:** Un panel de consulta rápida para localizar información de los clientes del hotel.
* **Características Técnicas:**
  * Muestra una tabla con el nombre completo, CI, teléfono y correo electrónico.
  * Implementa avatares visuales auto-generados con las iniciales del huésped para una interfaz de usuario más profesional.

### 📋 HU-06: Panel de Control de Reservas
* **Descripción:** La pantalla principal de operaciones del recepcionista para hacer seguimiento a los ingresos del día.
* **Características Técnicas:**
  * Tabla dinámica que cruza la información de las entidades: Reserva + Huésped + Habitación + Tipo de Habitación.
  * Aplica filtros en el frontend para mostrar únicamente las reservas "Pendientes" y "En Curso", ocultando el historial viejo para mantener una vista limpia.
  * Botones de acción contextuales (Solo muestra "Check-in" si está pendiente, y "Check-out" si está en curso).

### 📞 HU-08: Directorio de Servicios Internos
* **Descripción:** Facilita la comunicación interna de los empleados de la recepción con otras áreas del hotel (Limpieza, Restaurante, Mantenimiento, etc.).
* **Características Técnicas:**
  * Extrae datos mediante múltiples `JOINs` (o su equivalente en el ORM) en el backend entre las tablas `servicios`, `contactoservicios` y `empleados`.
  * Muestra el nombre del servicio, el encargado responsable y su número de teléfono/interno.

--- 

## 🗄️ Modelo de Base de Datos
La persistencia de datos está estructurada relacionalmente con las siguientes tablas principales:
* `huespedes`: Almacena información personal y de contacto (PK: id_huesped).
* `tiposhabitacion`: Define categorías, precios base y capacidades máximas.
* `habitaciones`: Representa las entidades físicas y su estado de disponibilidad actual.
* `reservas`: Tabla transaccional central que vincula huéspedes, habitaciones, fechas lógicas y estados.
* `empleados` y `servicios`: Tablas de soporte para el directorio interno del hotel.

![Diagrama de Base de Datos](/imagenes/bdd.png)

## 📂 Estructura del Proyecto Ordenada
El código fuente está distribuido lógicamente para facilitar su escalabilidad y mantenimiento:

```text
MiHotel/
├── Backend/                             # ASP.NET Core API REST
│   ├── Controllers/                     # Puntos de entrada HTTP (Rutas)
│   ├── Data/                            # Contexto de Entity Framework (HotelDbContext)
│   ├── Models/
│   │   ├── Entities/                    # Modelos de mapeo a la Base de Datos
│   │   └── DTOs/                        # Objetos de Transferencia de Datos seguros
│   ├── Repositories/
│   │   ├── Interfaces/                  # Contratos de acceso a datos
│   │   └── Implementations/             # Lógica de acceso directo a base de datos
│   ├── Services/
│   │   ├── Interfaces/                  # Contratos de casos de uso
│   │   └── Implementations/             # Lógica de negocio pesada (ReservaService)
│   ├── Program.cs                       # Configuración de Inyección de Dependencias
│   └── appsettings.json                 # Cadena de conexión a Supabase
│
└── Frontend/                            # Interfaz de Usuario
    └── src/
        ├── api/                         # Módulo de conexión fetch con el Backend
        ├── components/
        │   ├── controllers/             # Lógica de los formularios y validaciones
        │   ├── views/                   # Vistas modulares que inyectan el HTML
        │   └── [ui-elements]/           # Carpetas CSS aisladas bajo convención BEM
        ├── utils/                       # Funciones de ayuda (formato de fechas, alertas)
        ├── index.html                   # Documento principal orquestador
        ├── main.css                     # Importador global de estilos
        └── main.js                      # Inicializador de módulos ES6
```

## 🚀 Instrucciones para Ejecutar el Sistema

### 1. Requisitos Previos
* Tener instalado **.NET 8.0 SDK** (o superior).
* Tener instalado **Visual Studio Code** con la extensión **Live Server**.

### 2. Levantar el Backend (API REST)
1. Abrir una terminal y navegar a la carpeta del servidor: `cd Backend`
2. Asegurarse de que el archivo `appsettings.json` contiene la cadena de conexión válida (`DefaultConnection`) hacia la base de datos PostgreSQL/Supabase.
3. Ejecutar el comando para compilar y levantar el servidor:
   ```bash
   dotnet run
   ```
4. El backend estará escuchando en `http://localhost:5036`. Se puede acceder a la documentación interactiva de la API navegando a `http://localhost:5036/swagger`.

### 3. Levantar el Frontend (Cliente)
1. Abrir Visual Studio Code en la raíz del proyecto.
2. Navegar hacia la carpeta `Frontend/src`.
3. Hacer clic derecho sobre el archivo `index.html` y seleccionar **"Open with Live Server"**.
4. El navegador se abrirá automáticamente (usualmente en el puerto `5500`).
