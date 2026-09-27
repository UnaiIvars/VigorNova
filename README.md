# VigorNova

> Plataforma web de entrenamiento y nutrición para gestionar rutinas, registrar sesiones y realizar un seguimiento del progreso.

VigorNova es una plataforma web completa diseñada para centralizar la gestión del entrenamiento y ayudar al usuario a realizar un seguimiento de su evolución.

La aplicación combina gestión de rutinas, registro de sesiones, seguimiento del progreso, funcionalidades sociales y un asistente de inteligencia artificial en una única plataforma.

##  Funcionalidades

* **Gestión de rutinas** — Creación y organización de rutinas de entrenamiento.
* **Seguimiento del progreso** — Visualización de la evolución del usuario.
* **Registro de sesiones** — Registro de los entrenamientos realizados.
* **Autenticación** — Gestión de usuarios y acceso a la plataforma.
* **Funcionalidades sociales** — Interacción y conexión entre usuarios.
* **Asistente de IA** — Asistencia inteligente dentro de la plataforma.
* **Nutrición** — Funcionalidades relacionadas con el seguimiento y gestión de la nutrición.

## Tecnologías

| Tecnología     | Uso                                    |
| -------------- | -------------------------------------- |
| **TypeScript** | Lenguaje principal del proyecto        |
| **Next.js**    | Framework de desarrollo web            |
| **Supabase**   | Backend, base de datos y autenticación |
| **CSS**        | Estilos e interfaz                     |
| **Vercel**     | Despliegue de la aplicación            |

## Arquitectura

VigorNova utiliza una arquitectura basada en **Next.js y TypeScript**, con **Supabase** como plataforma backend y de persistencia de datos.

```text
┌─────────────────────┐
│      Next.js        │
│   TypeScript + CSS  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      Supabase       │
│                     │
│  • Database         │
│  • Authentication   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│       Vercel        │
│     Deployment      │
└─────────────────────┘
```

## Demo

🔗 **[Ver VigorNova](#)**

> Añade aquí la URL de tu aplicación desplegada en Vercel.

## Capturas

<!-- Añade aquí capturas de la aplicación -->

### Dashboard

![VigorNova Dashboard](docs/images/dashboard.png)

### Entrenamientos

![VigorNova Training](docs/images/training.png)

### Progreso

![VigorNova Progress](docs/images/progress.png)

## ⚙️ Instalación

### Requisitos

* Node.js
* npm

### 1. Clonar e
