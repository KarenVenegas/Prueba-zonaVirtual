#Descripción

El proyecto fue generado con Angular, permite la creación y edición de registros de facturación garantizando que no se repita el Trans_codigo, permite buscar los registros por nombre de usuario, email o numero de indentificacion, tambien se pueden organizar alfabéticamente.

NOTAS:
• No se realizó la consulta directamente a la API “http://pbiz.zonavirtual.com/api/Prueba/Consulta”, dado que tiene restricciones de los CORS, por lo tanto se clono la data mediante el servicio.
• Tener en cuenta que es un CRUD local, en caso de requerir visualizar los datos originales debe borrarse el localStorage y recargar la página o abrir "http://localhost:4200/" desde modo incógnito.

#Instrucciones

Clonar el repositorio en su máquina local "https://github.com/KarenVenegas/Prueba-zonaVirtual"
Abrir una terminal en la carpeta raíz del proyecto.
Ejecutar el comando "npm install" (Instala las dependencias del proyecto)
Ejectutar el comando "ng serve" (Inicializa el proyecto en el servidor local)
Visualizar el proyecto en "http://localhost:4200/"

#Requisitos

• Angular CLI: 16.2.0
• Node: 18.14.0
• Package Manager: npm 9.5.1
• Conexión a internet para inicializar el servidor local.
