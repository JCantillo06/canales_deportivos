# ⚽ StreamX - Hub de Canales y Eventos Deportivos

Plataforma interactiva para la visualización, consulta y reproducción de eventos deportivos y transmisiones en vivo en tiempo real.

---

## 📋 Descripción

**StreamX Deportes** es una aplicación web ligera impulsada por un servidor Node.js que sincroniza de forma periódica las agendas deportivas desde fuentes remotas en formato JSON, ofreciendo una interfaz moderna, responsiva y personalizable con reproducción embebida de transmisiones.

---

## ✨ Características Principales

- 🔄 **Sincronización Automática en Tiempo Real**: Servidor backend en Node.js que consulta la agenda remota periódicamente y maneja caché para optimizar la velocidad y disponibilidad.
- 🕒 **Conversión Inteligente de Zona Horaria**: Detección automática de la hora local del usuario y conversión horaria de eventos usando [Luxon](https://moment.github.io/luxon/).
- 🔴 **Detección de Estado de Eventos**: Clasificación visual dinámica en eventos *En Vivo*, *Próximos* y *Finalizados*.
- 🔍 **Búsqueda y Filtros Avanzados**:
  - Filtro interactivo por categorías / deportes (Fútbol, Baloncesto, Tenis, Motor, etc.).
  - Búsqueda en vivo por nombre de equipo, evento o torneo.
  - Identificación por banderas e idiomas de transmisión.
- 📺 **Múltiples Fuentes / Canales**: Cada evento agrupa sus canales disponibles con accesos directos e indicadores.
- 🎬 **Reproductor Integrado**:
  - Panel de reproducción embebido con control de recarga y cierre.
  - Opción de abrir la transmisión en pestaña independiente.
  - Botón rápido para copiar enlace directo de transmisión.
- 🎨 **Interfaz de Usuario Moderna**: Diseño oscuro (Dark Mode), animaciones fluidas, notificaciones flotantes (toasts) y compatibilidad total con dispositivos móviles y escritorio.
- ⚡ **Cero Dependencias Externas en Node**: El servidor utiliza únicamente módulos nativos de Node.js (`http`, `https`, `fs`, `path`, `child_process`).

---

## 📁 Estructura del Proyecto

```text
canales_deportes/
│
├── index.html            # Interfaz web, estilos CSS y lógica de cliente
├── server.js             # Servidor HTTP/HTTPS nativo, API Proxy y servidor de estáticos
├── iniciar_servidor.bat  # Script para iniciar rápidamente el servidor en Windows
├── .gitignore            # Archivos y carpetas ignoradas por Git
└── README.md             # Documentación del proyecto
```

---

## 🚀 Requisitos e Instalación

### Requisitos Previos
- [Node.js](https://nodejs.org/) (versión 14 o superior recomendada).

### Puesta en Marcha

#### Opción 1: En Windows (Inicio Rápido)
Haz doble clic sobre el archivo:
```bash
iniciar_servidor.bat
```
El script iniciará el servidor en Node.js y abrirá automáticamente tu navegador web predeterminado en `http://localhost:3000`.

#### Opción 2: Desde la Terminal / Consola
1. Abre tu terminal en el directorio del proyecto:
   ```bash
   node server.js
   ```
2. Accede en tu navegador a:
   ```text
   http://localhost:3000
   ```

*(Si el puerto 3000 está ocupado, el servidor detectará automáticamente el siguiente puerto libre disponible).*

---

## 🔌 Endpoints del Servidor

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/` o `/index.html` | Sirve la interfaz web del reproductor y agenda. |
| `GET` | `/api/agenda` | Devuelve la lista en caché en formato JSON con todos los eventos deportivos actualizados. |
| `GET` | `/json/agenda550.json` | Endpoint alternativo de compatibilidad para la agenda. |

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 Vanilla (Variables CSS, Flexbox/Grid, Glassmorphism), JavaScript (ES6+), [FontAwesome](https://fontawesome.com/), [Luxon](https://moment.github.io/luxon/).
- **Backend**: Node.js (Módulos nativos: `http`, `https`, `fs`, `path`, `child_process`).

---

## 📄 Licencia

Este proyecto está disponible para uso personal y educativo
