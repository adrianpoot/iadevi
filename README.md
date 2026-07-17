# Registros

Aplicación web minimalista para guardar registros **diarios**, **semanales** y **mensuales**.
Funciona 100% en el navegador (sin servidor ni base de datos): tus datos se guardan en
`localStorage`.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para el diseño
- [date-fns](https://date-fns.org/) para el manejo de fechas
- Persistencia con `localStorage` del navegador

## Desarrollo

```bash
npm install     # instala dependencias
npm run dev     # servidor de desarrollo (http://localhost:5173)
npm run build   # build de producción en dist/
npm run preview # sirve el build de producción
npm run lint    # análisis estático con oxlint
```

> Requiere Node.js 20.19+ o 22.12+.

## Características

- Pestañas para vistas **Diario / Semanal / Mensual**.
- Crear, editar y eliminar registros.
- Los registros se agrupan por día, semana o mes según la vista.
- Modo claro / oscuro con preferencia recordada.
- Todo se guarda localmente; no se envía ningún dato a ningún servidor.

## Despliegue

Al ser una app estática, se puede desplegar en Vercel, Netlify, Cloudflare Pages o
GitHub Pages subiendo el contenido de `dist/`.
