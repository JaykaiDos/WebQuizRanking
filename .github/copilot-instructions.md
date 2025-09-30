# Copilot Instructions for WebQuizRanking

## Visión General
Este proyecto es una aplicación web de ranking de quiz que utiliza Firebase Firestore como backend para almacenar y recuperar los puntajes de los usuarios. El frontend es una SPA simple compuesta por archivos estáticos (`index.html`, `ranking.css`, `ranking.js`).

## Estructura y Componentes Clave
- `index.html`: Página principal, contiene el contenedor donde se muestra el ranking.
- `ranking.js`: Lógica principal de la app. Se encarga de:
  - Inicializar Firebase y Firestore.
  - Consultar la colección `ranking` en Firestore, ordenando por `puntaje` descendente y `timestamp` ascendente (para desempates).
  - Renderizar el ranking en una tabla HTML, mostrando posición, usuario, puntaje y fecha.
  - Mostrar medallas (🥇🥈🥉) para los tres primeros lugares.
- `ranking.css`: Estilos para la tabla de ranking y mensajes de error.

## Integraciones y Dependencias
- **Firebase**: Se importa desde CDN (`firebase-app.js`, `firebase-firestore.js`, `firebase-analytics.js`).
- **Firestore**: La colección principal es `ranking` con campos esperados: `nombreUsuario`, `puntaje`, `timestamp`.

## Convenciones y Patrones
- El acceso a Firestore es solo de lectura en este frontend.
- El ranking muestra máximo 10 usuarios, ordenados por puntaje y fecha.
- Si no hay datos, se muestra un mensaje de advertencia amigable.
- Los errores de carga se muestran en el DOM con detalles para depuración.
- Los usuarios sin nombre aparecen como "Anónimo".
- El formato de fecha es local (`es-ES`).

## Flujos de Desarrollo
- No hay build ni test automatizados: los archivos JS/CSS/HTML se editan y recargan directamente en el navegador.
- Para depuración, usar la consola del navegador y revisar los mensajes de error en el DOM.
- Para cambiar la consulta de ranking, modificar la función `loadRanking` en `ranking.js`.

## Ejemplo de Consulta Firestore
```js
const q = query(
  collection(db, 'ranking'),
  orderBy('puntaje', 'desc'),
  orderBy('timestamp', 'asc'),
  limit(10)
);
```

## Buenas Prácticas Específicas
- Mantener la compatibilidad con la versión de Firebase usada en los imports.
- No exponer credenciales sensibles en el frontend (la configuración actual es pública, pero no debe usarse para operaciones críticas).
- Validar siempre la existencia de campos antes de mostrarlos en el DOM.

## Referencias
- Lógica principal: `ranking.js`
- Estructura HTML: `index.html`
- Estilos: `ranking.css`

---

¿Falta algún flujo, convención o integración importante? Indica si necesitas detalles sobre la estructura de datos, despliegue o integración con otros sistemas.