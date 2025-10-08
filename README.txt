PoliTech - Proyecto Front-end (Entrega 2 / Entrega Final)
-------------------------------------------------------

Contenido del paquete:
 - index.html, servicios.html, detalle.html, login.html, admin.html
 - css/, js/, assets/, data/ (services.json, users.json)
 - Funcionalidad: inicializa datos desde data/services.json si localStorage está vacío.
 - CRUD en admin.html persiste en localStorage (cada navegador lo guarda por separado).

Despliegue en GitHub Pages:
1. Crear repositorio e iniciar con README.md
2. Subir todos los archivos (git add, commit, push)
3. En Settings > Pages habilitar branch main y root
4. Acceder a https://<tu-usuario>.github.io/<tu-repo>/

Notas importantes:
 - GitHub Pages sirve archivos estáticos y permite leer JSON (fetch), pero no escribirlos.
 - Para persistencia compartida necesitarán un backend (Node/PHP) o Firebase.
 - Si quieres, puedo preparar un ejemplo de backend sencillo (Node + Express + archivo JSON).
