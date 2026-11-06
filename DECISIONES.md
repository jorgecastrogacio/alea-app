# Registro de Decisiones de Arquitectura y Diseño - ALEA

Este documento registra todas las decisiones técnicas y de diseño tomadas durante la construcción del prototipo de **ALEA**, garantizando estricta adherencia a la directiva de **Coste Cero (0,00€)**, privacidad para menores y máxima excelencia de experiencia de usuario.

---

## 1. Stack Tecnológico y Coste Cero
- **Framework:** Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- **Coste de Infraestructura:** 0,00€. Preparado para despliegue estático/serverless gratuito en Vercel o Cloudflare Pages (`npm run build` optimizado y verificado sin errores).
- **Sin Base de Datos de Pago:**
  - Desarrollo local e inicial mediante `data/books.mock.json` enriquecido con las obras representadas en los mockups (Matilda, Wonder, El Principito, Harry Potter, Tintín, El diario de Greg, Invisible, etc.).
  - Conector headless preparado en `lib/api.ts` (`getBooksFromGoogleSheets`) para sincronizar con Google Sheets publicado como CSV (0€/mes, editable por el cliente sin programar).
- **Sin APIs de Pago de Catálogo:** Cero uso de DILVE (ahorro de 400€/año) o ISBNdb.
- **Imágenes y Recursos Gráficos:**
  - Integración de los recursos e ilustraciones exactos aportados por el cliente en `public/assets/mascot/`, `public/assets/worlds/` y `public/assets/books/`.
  - Mascota mágica en cada pantalla respondiendo a la temática del momento (de pie con libro resplandeciente, recostada leyendo sobre libros, volando con halo de luz, abrazando el libro de la estrella, y en vuelo triunfal de celebración).

## 2. Privacidad y Seguridad (Diseñado para Menores)
- Cero recolección de datos sensibles: sin correos electrónicos, sin contraseñas, sin geolocalización, sin tracking de analítica invasiva.
- Onboarding solicita únicamente un alias o apodo lector (por defecto *Daniela*) y edad para calibrar recomendaciones.
- Toda la persistencia reside en el `LocalStorage` del navegador del usuario (`alea_user_profile` y `alea_library_state`).

## 3. Filosofía de Producto: El Libro Físico como Protagonista
- Cero mecánicas adictivas: sin rachas ("streaks") de lectura, sin notificaciones push agresivas, sin comparativas sociales competitivas.
- Experiencia estética: Portadas con presencia física, efecto lomo y acabados editoriales.
- Enfoque "Buscar en Biblioteca Pública": Barra flotante *"Encuentra tu libro cerca de ti (Bibliotecas y librerías)"* y modal accesible con ISBN y orientación para préstamo gratuito en cualquier biblioteca de España o consulta directa en catálogos públicos (Rebiun/eBiblio).

## 4. UI/UX: Adaptación Estética a los Mockups
- **Paleta de Color:** Gradiente lavanda y crepúsculo (`#EAEBF9` a `#F4F5FD`), tarjetas en blanco puro con bordes suaves (`alea-card`), sombras mágicas sutiles y tipografía en azul índigo profundo (`#26245C`).
- **Layout Adaptable:**
  - En escritorio y tablet: Barra lateral izquierda con logotipo `ALEA✦`, accesos directos (*Inicio*, *Explorar*, *Mi biblioteca*, *Mis logros*) y selector de perfil de usuario en la parte inferior.
  - En móviles: Bottom Tab Bar flotante con bordes redondeados y estilo visual cristalino.
- **Pantalla "Descubre":**
  - Banner superior mágico con la mascota y el libro flotante iluminado: *"¡Hola, Daniela! Tu universo lector ya está listo. ¿Qué quieres hacer hoy?"*
  - Sección *"Tus mundos"* con tarjetas ilustradas (*Aventuras y fantasía*, *Naturaleza y animales*, *Planetas y galaxias*, *+ Añadir intereses*) y botón *"Editar intereses"*.
  - Sección *"Recomendado para ti"* con tarjetas completas y botón *"Añadir"* que guarda el libro directamente en la biblioteca del usuario.

## 5. Reglas de Validación Quirúrgica en el Onboarding
Implementado en `store/useOnboardingStore.ts` y renderizado en `app/onboarding/page.tsx`:
1. **¿Qué te gustaría encontrar en una historia? / ¿Qué protagonistas te gustan? / ¿Qué tipo de libros?:** Selección múltiple con **bloqueo estricto a un máximo de 3 opciones**.
2. **¿Cómo te gustan las historias?:** Selección Única obligatoria (*¡Que pasen cosas!* / *Que me atrapen poco a poco.* / *Depende de la historia.*).
3. **Formato con Excepción Quirúrgica:**
   - Selección múltiple de máximo 3 opciones.
   - Si el usuario selecciona *"Me da igual el formato si la historia es buena"*, todas las demás opciones de formato se desmarcan automáticamente.
   - Si el usuario selecciona cualquier formato específico teniendo activo *"Me da igual..."*, esta última se retira de inmediato.
4. **Pantalla de Libros Favoritos:** Cuadrícula de 6 títulos icónicos con opciones rápidas *"No conozco ninguno de estos"* y *"Prefiero descubrir algo nuevo"*.
5. **Pantalla Final de Celebración:** Muestra la mascota en vuelo, el resumen de mundos y recomendaciones iniciales con el botón *"Explorar mi universo"*.
