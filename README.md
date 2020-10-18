# E-learning backend

## Pre-requisitos
- node\.js 12
- mysql 8

---------------------------

## Instalación
```bash
npm install
```
---------------------------

## Configuración
1. En la carpeta `docs/` se encuentra el modelo de la base de datos, con algunos valores por defecto\. Exportar su contenido en un script y ejecutarlo en su manejador de base de datos preferido en un entorno mysql\.
    > Si utilizas **MySQL Workbench** puedes hacerlo de esta forma\.
    >
    > Para exportar:
    > - File \> Export \> Forward Engineer SQL CREATE Script\.\.\.
    > - Seleccionas una ubicación en *Output SQL Script File*\.
    > - La opción *Generate INSERT Statements for Tables* debe estar marcada para que se inserten los valores por defecto\.
    > - Click en *Next*\.
    > - La opción *Export MySQL Table Objects* debe estar marcada\.
    > - Click en *Next*\.
    > - Click en *Finish*\.
    >
    > Para ejecutar el script:
    > - Crear una conexión *localhost* con un usuario y contraseña
    > - File \> Run SQL Script \(Seleccionar el archivo exportado previamente\)\.
    > - Click en *Run* \(Esperar que finalice\)\.
    > - Click en *Close*\.
    >
    > Si la tabla aun no aparece deberás actualizar los *Schemas*, puedes localizar el botón en la sección de *Schemas*\.

2. Crear un archivo `.env` en la raiz del proyecto, el cual contendrá las variables de entorno que utilizará el back-end\. Puedes ver las variables en el archivo `.env.example`, pero deberás insertar los valores correspondientes\. A continuación una explicación de como llenar el archivo *\.env* :
    - **MODE**: *development* en caso de ejecutar en localhost, *production* en caso de hacer un build al proyecto y montarlo en un servidor\.
    - Todas las variables que comienzan con **DB\_** se obtienen de la conexion al servidor de MySQL\.
        - **DB\_CLIENT**: tipo de base de datos, por defecto mysql \(no cambiar\)\.
        - **DB\_HOST**: host del servidor, *localhost* en caso de conexión local\.
        - **DB\_PORT**: puerto donde escucha el server de MySQL \(colocar *3306* en caso de usar el puerto por defecto de MySQL\)\.
        - **DB\_USER**: usuario de la conexión\.
        - **DB\_PASSWORD**: contraseña del usuario de la conexión\.
        - **DB\_SCHEMA**: nombre de la tabla, por defecto *e-learning-course*\.
    - **TOKEN\_SECRET**: Cadena de caracteres aleatorios para generar los token de seguridad \(no cambiar\)\.

---------------------------

## Ejecución
```bash
npm run server
```

---------------------------

## ¿Cómo comenzar?
1. Primero es necesario iniciar sesión como administrador para obtener un token de seguridad. Puedes iniciar sesión con el recurso [/user/signin](#POST-/user/signin) con las credenciales:
    - user: admin@admin.com
    - password: Admin1234
2. Algunos end-points requieren a un usuario de tipo profesor para su uso, por lo tanto con el token de administrador podrás crear profesores con el recurso [/user/professor](#POST-/user/professor).
3. Con el recurso [/user/signup](#POST-/user/signup) podrás crear cuentas de estudiante. Este recurso no requiere de un token.
4. Ya que tengas mínimo un token de profesor y uno de estudiante podrás experimentar con el resto de end-points.  
    Para los profesores te recomiendo que comiences con los siguientes recursos:
    - [/course](#POST-/course)
    - [/lesson](#POST-/lesson)
    - [/question](#POST-/question)

    Como estudiante te recomiendo comenzar por los siguientes recursos:
    - [/course/:courseId/join](#POST-/course/:courseId/join)
    - [/course/:courseId/available](#GET-/course/:courseId/available)
    - [/course/:courseId/status](#GET-/course/:courseId/status)
    - [/lesson/:lessonId/results?userId](#GET-/lesson/:lessonId/results?userId)
    - [/question/reply](#POST-/question/reply)

--------------------------

## API

### **POST** `/user/signup`
> #### Request Body
> ```js
> {
>   "email": String, 
>   "password": String,
>   "name": String
> }
> ```
> #### Response
> ```js
> {
>   "token": String
> }
> ```

### **POST** `/user/signin`
> #### Request Body
> ```js
> {
>   "email": String, 
>   "password": String
> }
> ```
> #### Response
> ```js
> {
>   "token": String
> }
> ```

### **POST** `/user/professor`
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "email": String, 
>   "password": String,
>   "name": String
> }
> ```
> #### Response
> ```js
> {
>   "token": String
> }
> ```

### **POST** `/course`
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "courses": [
>     {
>       "name": String
>     }
>   ]
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **DELETE** `/course`
  El parametro `correlative` es opcional. Si su valor es `true` se borraran todos los cursos correlativos asociados al `courseId`, por defecto es `false` y se borrará un solo curso.
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "courseId": Number,
>   "correlative": Boolean
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **GET** `/course`
Obtención de la lista de todos los cursos, agrupados por cursos correlativos.
> #### Authorization
> - Bearer token
> 
> #### Response
> ```js
> [
>   [
>     {
>       "course_id": Number,
>       "name": String,
>       "next_course": Number
>     }
>   ]
> ]
> ```

### **POST** `/course/:courseId/join`
> #### Authorization
> - Bearer token
>
> #### Parameters
> ```js
> courseId: Number
> ```
>
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **GET** `/course/:courseId/available`
> #### Authorization
> - Bearer token
>
> #### Parameters
> ```js
> courseId: Number
> ```
>
> #### Response
> ```js
> [
>   {
>     "lesson_id": Number,
>     "approval": Number,
>     "title": String,
>     "next_lesson": Number
>   }
> ]
> ```

### **GET** `/course/:courseId/status`
Obtener el estado del curso indicado en `courseId`. El parametro `average` indica el promedio general hasta el momento. En `results` se pueden encontrar los resultados de todas las lecciones relacionadas al curso y que pertenecen al usuario indicado con `userId`. El `score` de cada lección indica la calificación obtenida, pero igual podría contener un mensaje en caso que la lección no haya sido tomada por el usuario.
> #### Authorization
> - Bearer token
>
> #### Parameters
> ```js
> courseId: Number
> ```
>
> #### Response
> ```js
> {
>   "userId": Number,
>   "courseId": Number,
>   "average": Number,
>   "results": [
>     {
>       "userId": Number,
>       "approved": Boolean,
>       "score": [Number, String],
>       "lessonId": Number
>     }
>   ]
> }
> ```

### **POST** `/lesson`
El parámetro `approval` indica la calificación con la que se aprueba la lección.
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "courseId": Number,
>   "lessons": [
>     {
>       "approval": Number,
>       "title": String
>     }
>   ]
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **DELETE** `/lesson`
  El parametro `correlative` es opcional. Si su valor es `true` se borraran todas las lecciones correlativas asociadas al `courseId`, por defecto es `false` y se borrará una sola lección.
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "lessonId": Number,
>   "correlative": Boolean
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **GET** `/lesson?courseId`
Obtención de la lista de todas las lecciones, agrupadas por lecciones correlativas.
> #### Authorization
> - Bearer token
> 
> #### Query
> ```js
> courseId: Number
> ```
>
> #### Response
> ```js
> {
>   "courseId": Number,
>   "lessons": [
>     [
>       {
>         "lesson_id": Number,
>         "approval": Number,
>         "title": String,
>         "next_lesson": Number
>       }
>     ]
>   ],
> }
> ```

### **GET** `/lesson/:lessonId/results?userId`
Obtener los resultados de la lección de un usuario. El parámetro query `userId` es opcional. Si no se proporciona `userId` se obtendrá el resultado del usuario que hace la solicitud.
> #### Authorization
> - Bearer token
> 
> #### Parameters
> ```js
> lessonId: Number
> ```
>
> #### Query
> ```js
> userId: Number
> ```
>
> #### Response
> ```js
> {
>   "userId": Number,
>   "approved": Boolean,
>   "score": Number
> }
> ```

### **POST** `/question`
Creación de preguntas con opciones y respuestas. Existen algunas reglas para crear una pregunta, se explicará con detalle los parámetros:
- **question**: texto de la pregunta.
- **type**: \[opcional\] indica el tipo de pregunta que se creará, existen 4 tipos de preguntas: *one*, *boolean*, *multiple*, *full*. Por defecto *one*. El tipo de pregunta es relevante en el método de calificación y en la creación de las preguntas.
    - *one* : una sola opción es una respuesta correcta.
    - *boolean* : la respuesta solo tiene como valores `true` o `false`.
    - *multiple* : existen varias opciones consideradas como respuesta correcta. La calificación se promedia con las respuestas correctas, en caso de elegir una incorrecta el resultado es 0.
    - *full* : existen varias opciones consideradas como respuesta correcta. Todas las respuestas correctas se deberán responder, en caso de faltar alguna o exista una respuesta incorrecta el resultado es 0.
- **answer**: \[opcional\] únicamente se utiliza cuando **type** es *boolean*, en otros casos este parámetro es ignorado. Indica el resultado de la pregunta de tipo *boolean*. Por defecto la respuesta es `false`.
- **option**: este parámetro es ignorado cuando el tipo de pregunta es de tipo *boolean*. Arreglo que contiene las opciones disponibles de la pregunta. Cada opción es un objeto, los cuales se comportan de manera distinta dependiendo el tipo de pregunta. Estos son los parámetros de los objetos y sus comportamientos:
    - **option**: texto de la opción.
    - **answer**: \[opcional\] indica la opción que será la respuesta a la pregunta. Es necesario por lo menos 1 opción con este parámetro con valor `true`. Cuando el tipo de pregunta es *one* solo se puede colocar este parámetro a una opción. Por defecto `false`.
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "lessonId": Number,
>   "questions": [
>     {
>       "question": String,
>       "type": "one" | "boolean" | "multiple" | "full",
>       "answer": Boolean,
>       "option": [
>         {
>           "option": String,
>           "answer": Boolean
>         }
>       ],
>     }
>   ],
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **DELETE** `/question`
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "questionIds": Number[]
> }
> ```
> #### Response
> ```js
> {
>   "message": "Ok"
> }
> ```

### **GET** `/question?lessonId`
> #### Authorization
> - Bearer token
> 
> #### Query
> ```js
> lessonId: Number
> ```
>
> #### Response
> ```js
> [
>   {
>     "question_id": Number,
>     "question": String,
>     "type": String,
>     "options": [
>       {
>         "option_id": Number,
>         "option": String
>       }
>     ],
>   }
> ]
> ```

### **POST** `/question/reply`
End-point para responder preguntas. Se requiere mandar las respuestas de todas las preguntas de la lección.
> #### Authorization
> - Bearer token
> 
> #### Request Body
> ```js
> {
>   "lessonId": Number,
>   "replies": [
>     {
>       "questionId": Number,
>       "optionIds": Number[]
>     }
>   ]
> }
>
> ```
> #### Response
> ```js
> [
>   {
>     "answer_id": Number,
>     "user_id": Number,
>     "lesson_id": Number,
>     "question_id": Number,
>     "answers": String,
>     "score": Number
>   }
> ]
> ```