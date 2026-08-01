# Aventura Numérica Diaria

Para una niña de 6 años, la aplicación debe ser muy visual, intuitiva y con botones grandes. La estructura ideal para este tipo de contenido (que abarca matemáticas básicas, tiempo y secuencias) es un "Juego de Misiones Diarias" dividido en mini-módulos.

Que tenga los temas de Destrezas de Aprendizaje Matemático



Direccionalidad; hacia la derecha, hacia la izquierda, hacia abajo y hacia arriba.



Representar, contar y 80. escribir números del 51



Reconocimiento de números antes y después.



Secuencia numérica.



Decenas y unidades.



Sumas y restas verticales y horizontales.



Fracciones:



Entero.



Un medio.



- Un cuarto.



- Un octavο.



El reloj:



Hora en punto.



- Hora y media.



Mañana, medio día, tarde y noche.



Mayor que y menor que.



Conjuntos:



Unión



- Pertenencia

Te describo la estructura, interfaz y funcionamiento que debería tener la app para que la puedas diseñar o programar:



📱 Nombre del Proyecto: "El Mundo de los Números" (o con su nombre)

🎨 1. Interfaz y Pantalla Principal

Diseño: Un mapa con un camino estilo "juego de mesa" o tablero de aventuras.



Personaje/Mascota: Un avatar que avanza por el camino cada vez que completa un tema.



Menú con 5 Estaciones (Niveles):



🧭 Camino Fantasma (Direccionalidad)



🔢 Cueva de los Números (51 al 80, decenas/unidades)



🍕 La Pizzería (Fracciones)



⏰ La Torre del Tiempo (El reloj y momentos del día)



🐊 El Cocodrilo Hambriento (Mayor/Menor y Conjuntos)



🕹️ 2. Descripción de las Mecánicas por Módulo

Módulo A: La Pizzería de las Fracciones

Pantalla: Muestra el pedido de un cliente en la parte superior (ej. "Quiero  

2

1

​

  de pizza").



Mecánica: En la mesa aparece una pizza completa. Al tocar la pizza, esta se divide con una animación limpia.



Interacción: Ella debe arrastrar con el dedo la cantidad requerida ( 

2

1

​

 ,  

4

1

​

  u 1 entero) hasta la caja del cliente.



Módulo B: El Cocodrilo Comelón (Mayor / Menor que)

Pantalla: Aparecen dos tarjetas con números entre el 51 y el 80 (ej. 58 y 72). En el centro hay un cocodrilo con la boca abierta.



Mecánica: Ella debe arrastrar el símbolo del cocodrilo (> o <) o tocar hacia qué número se debe girar la boca del personaje.



Feedback: Si acierta, el cocodrilo "se come" el número más grande con un efecto de sonido divertido.



Módulo C: El Reloj Mágico

Pantalla: Un reloj análogo grande y una tarjeta con la hora escrita (ej. "Hora en punto: 4:00" o "Hora y media: 6:30").



Mecánica: Las manecillas (horaria y minutero) se pueden arrastrar libremente en pantalla.



Validación: La app detecta cuando la aguja grande apunta al 12 (para "en punto") o al 6 (para "y media") y desbloquea una estrella.



Módulo D: El Constructor de Números (Decenas y Unidades)

Pantalla: Muestra un número meta entre el 51 y el 80 (ej. 64).



Mecánica: A un lado hay un montón de paquetes de 10 bloques (decenas) y bloques sueltos (unidades).



Acción: Ella arrastra 6 paquetes de diez y 4 bloques individuales a la zona central. Un contador dinámico va sumando: 10,20,30...60,61,62,63,64.



🏆 3. Sistema de Recompensas y Progreso

Estrellas: Cada respuesta correcta otorga de 1 a 3 estrellas.



Barra de Progreso Diaria: Un indicador simple en la parte superior que muestra cuántos ejercicios ha resuelto hoy (ej. "5 de 10 misiones").



Premios Visuales: Al juntar estrellas, desbloquea ropa o accesorios para vestir a su avatar dentro de la app.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clever-kid-missions.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a13bb878-0730-4c03-9bcf-e41b60f7181a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
