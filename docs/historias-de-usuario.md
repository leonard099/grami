# Grami — Historias de usuario
Sistema de seguimiento de muestras en bacteriología  
Versión: 1.0 | Norma ATB: CLSI / WHONET | Acceso: web multi-usuario

---

## Convenciones

- **Core**: debe estar en v1
- **v2**: puede diferirse a una segunda iteración
- **★** en criterios indica agregado o modificado respecto al relevamiento inicial
- Roles disponibles: `admin`, `bioquimico`, `senior` (bioquímico con permisos ampliados), `derivante`

---

## EPIC-01 — Gestión de muestras: ingreso y recepción

---

### US-01 — Ingreso de nuevo cultivo

**Rol:** bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero registrar una nueva muestra desde la solicitud médica o planilla de derivación, para iniciar el seguimiento del cultivo en el sistema.

**Criterios de aceptación:**

- El usuario debe estar autenticado con usuario y contraseña creados por un administrador.
- Al ingresar el DNI, el sistema busca al paciente y muestra sus datos si existe; si no, crea el perfil automáticamente.
- El formulario incluye: DNI, nombre/apellido, fecha de nacimiento, obra social (opcional), centro derivante (lista configurable), observaciones de muestra (estado anómalo, esquema antibiótico del paciente, etc.) y tipo de estudio.
- El tipo de estudio se selecciona de una lista configurable por el admin (urocultivo, hemocultivo, exudado vaginal, esputo, miniBAL, estudio microbiológico general, etc.).
- Al seleccionar "estudio microbiológico general", se despliega un selector obligatorio de tipo de muestra (ej. líquido ascítico, líquido pleural, material de tornillo, etc.).
- Al confirmar, se genera un ID único alfanumérico para el cultivo y un código de barras asociado.
- El sistema registra automáticamente fecha, hora e identidad del bioquímico que ingresó la muestra.

---

### US-02 — Check-in y rotulado de muestra

**Rol:** bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero confirmar la recepción física de la muestra y generar su identificador imprimible, para asegurar la trazabilidad desde el inicio.

**Criterios de aceptación:**

- Al generarse un cultivo, aparece en la bandeja de "pendientes de recepción" con su ID y datos del paciente.
- El sistema permite imprimir una etiqueta con el ID legible (ej. GR-20250624-0042) y su código de barras equivalente.
- El ID y el código de barras están relacionados semánticamente: el código de barras es el ID codificado, permitiendo escanear para identificar la muestra física.
- El operador marca "muestra recepcionada" mediante un checkbox; el sistema registra hora y usuario.
- El estado del cultivo cambia de "pendiente" a "recepcionado".

---

### US-03 — Lista de materiales para siembra

**Rol:** bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero ver la lista de medios de cultivo necesarios para sembrar las muestras del día, para preparar el material antes de ir a la mesada.

**Criterios de aceptación:**

- Al iniciar la jornada, el sistema muestra los cultivos recepcionados pendientes de siembra.
- Al seleccionar uno o varios cultivos, el sistema genera una lista consolidada de medios necesarios (configurada por tipo de estudio en la sección de determinaciones).
- La lista agrupa medios repetidos (ej. "2× agar sangre, 1× agar MacConkey") para evitar duplicar preparación.
- El operador confirma la siembra y el estado del cultivo cambia a "sembrado".

---

### US-03b — Dictado por voz en el formulario de ingreso de muestra ★

**Rol:** bioquimico  
**Prioridad:** v2

**Historia:**  
Como bioquímico, quiero dictar los datos del paciente y la muestra mientras leo la solicitud médica en papel, para ingresar información sin alternar entre el papel y el teclado.

**Criterios de aceptación:**

- El formulario de ingreso tiene un botón de micrófono global que activa el modo dictado.
- El sistema reconoce enunciados del tipo: "DNI 28345678", "paciente Juan Pérez", "servicio Hospital Central", "urocultivo con observación paciente con amoxicilina".
- Los campos se completan en tiempo real mientras el bioquímico dicta; los campos ya completados no se sobreescriben si no se mencionan.
- El profesional revisa visualmente el formulario completo antes de confirmar; ningún dato se guarda hasta la confirmación explícita.
- La funcionalidad es opcional; todos los campos siempre pueden completarse manualmente.
- Implementación: Web Speech API (Chrome/Edge) con Whisper API como fallback para mayor precisión en terminología médica.

---

## EPIC-02 — Lectura de placas y registro de resultados

---

### US-04 — Panel de cultivos en curso

**Rol:** bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero ver al entrar al sistema la lista de cultivos activos del día, para organizar mi trabajo de lectura rápidamente.

**Criterios de aceptación:**

- La pantalla principal muestra cultivos abiertos ordenados por fecha de siembra (más antiguos primero).
- Cada cultivo muestra: ID, nombre del paciente, tipo de estudio, centro derivante, días transcurridos y estado actual.
- Hay un buscador por nombre, DNI o ID de cultivo.
- Hay un filtro por fecha que al activarse muestra también cultivos cerrados.
- Por defecto solo se muestran cultivos abiertos; los cerrados solo aparecen con búsqueda activa o filtro de fecha.
- Los cultivos sembrados hace más de 72 hs sin cierre muestran una alerta visual para no olvidar el registro de "sin desarrollo".
- Indicadores visuales de estado: pendiente, recepcionado, sembrado, en lectura, cerrado.

---

### US-05 — Registro dinámico de lectura con plantillas y voz

**Rol:** bioquimico  
**Prioridad:** Core (plantillas) / v2 (voz)

**Historia:**  
Como bioquímico, quiero registrar los hallazgos de lectura usando plantillas predefinidas y entrada por voz, para minimizar la escritura repetitiva y trabajar sin interrumpir el flujo en la mesada.

**Criterios de aceptación:**

- Al abrir un cultivo, se despliega un modal con los datos del paciente, tipo de estudio y observaciones previas.
- El modal permite agregar uno o más gérmenes identificados (muestras polimicrobianas). Cada germen tiene su propio hilo de datos independiente.
- Para cada germen se puede registrar: morfología (cocos, bacilos, etc.), tinción de Gram, características de colonia, pruebas bioquímicas seleccionables desde lista y antibiograma.
- El antibiograma usa plantillas de protocolo pre-cargadas (ej. "ATB urinario", "ATB respiratorio"). Al seleccionar la plantilla, el sistema carga automáticamente los antibióticos correspondientes.
- Al ingresar el halo en mm, el sistema calcula S/I/R según los puntos de corte CLSI configurados. El bioquímico puede corregir la interpretación antes de guardar.
- El modal muestra la lista de materiales adicionales necesarios para la etapa de lectura (reactivos, discos ATB, etc.) según el tipo de estudio.
- Campo de observaciones libres por germen.
- ★ El modal incluye un botón de micrófono para activar dictado por voz durante la lectura. El bioquímico puede dictar halos (ej. "ampicilina 14 mm"), resultados de pruebas bioquímicas u observaciones, y el sistema mapea al campo correspondiente.
- ★ La transcripción de voz queda visible para revisión antes de confirmar; ningún dato de voz se guarda sin validación explícita del profesional.

---

### US-06 — Cierre de cultivo e informe digital

**Rol:** bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero cerrar un cultivo y generar su informe digital, para que el centro derivante pueda consultarlo directamente en el sistema.

**Criterios de aceptación:**

- El botón "cerrar cultivo" está disponible en el modal de lectura una vez registrado al menos un resultado (incluido "sin desarrollo").
- Al cerrar, se genera un informe digital con: datos del paciente, estudio solicitado, fecha de ingreso y cierre, bioquímico responsable, gérmenes identificados (o "sin desarrollo" si corresponde), antibiograma con interpretaciones S/I/R y observaciones.
- El informe es accesible para el centro derivante desde su login con estado visible en tiempo real ("en proceso" / "resultado disponible").
- El informe puede exportarse como PDF para carga en sistemas externos (LIS institucional u otros).
- El estado del cultivo pasa a "cerrado" y solo es visible con búsqueda activa o filtro por fecha.
- Los cultivos asistidos por IA en algún paso quedan marcados como tal en el informe para auditoría y transparencia.

---

### US-06b — Reapertura de cultivo cerrado

**Rol:** senior  
**Prioridad:** Core

**Historia:**  
Como bioquímico senior, quiero poder reabrir un cultivo cerrado para corregir o ampliar resultados antes de emitir el informe definitivo.

**Criterios de aceptación:**

- El botón "reabrir cultivo" solo es visible para usuarios con rol `senior` o `admin`.
- Al reabrir, el sistema solicita obligatoriamente un motivo de reapertura (campo de texto libre, mínimo 10 caracteres).
- El estado del cultivo vuelve a "en lectura" y el cultivo reaparece en el panel de cultivos activos.
- El informe anterior queda invalidado automáticamente y marcado como "anulado" en el historial.
- El derivante ve el estado del cultivo como "en proceso" nuevamente hasta que se genere un nuevo cierre.
- Queda registrado en la auditoría del cultivo: quién reabrió, cuándo y el motivo ingresado.
- Al volver a cerrar, se genera un nuevo informe que indica que es una versión revisada del original.

---

## EPIC-03 — Configuración de determinaciones y protocolos

---

### US-07 — Creación y edición de tipos de estudio

**Rol:** admin, bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico o admin, quiero crear y editar los tipos de estudio disponibles, para adaptar el sistema al catálogo real del laboratorio.

**Criterios de aceptación:**

- Desde el menú lateral, navegar a "Determinaciones → Tipos de estudio".
- Cada tipo de estudio tiene: nombre, flag "requiere tipo de muestra" (sí/no), medios de cultivo asociados, protocolos ATB aplicables, campo de observaciones y **tiempo estimado de resolución en días**.
- El tiempo estimado de resolución define cuándo se activa la alerta visual en el panel de cultivos activos: el sistema alerta cuando un cultivo abierto supera ese plazo sin ser cerrado. Ejemplos: urocultivo = 2 días, cultivo micológico = 30 días, cultivo de anaerobios = 7 días.
- La alerta se muestra como borde de color en la fila del cultivo y se suma al contador "Cultivos con alerta" del dashboard. El umbral es por tipo de estudio, no un valor global fijo.
- Los tipos de estudio pueden activarse o desactivarse sin eliminarse.
- Cualquier cambio en un tipo de estudio (incluido el tiempo estimado) no afecta cultivos ya registrados (datos históricos inmutables).

---

### US-08 — Configuración de protocolos de antibiograma con base CLSI/WHONET ★

**Rol:** admin, bioquimico  
**Prioridad:** Core

**Historia:**  
Como bioquímico, quiero crear y gestionar protocolos de antibiograma usando como referencia las recomendaciones de WHONET/CLSI, para que el sistema interprete halos automáticamente sin cargar los puntos de corte manualmente desde cero.

**Criterios de aceptación:**

- Desde "Determinaciones → Protocolos ATB", crear protocolos con nombre, antibióticos y puntos de corte.
- ★ El sistema viene con un catálogo de antibióticos pre-cargado basado en los paneles recomendados por WHONET/CLSI, organizados por tipo de muestra (urinario, respiratorio, hemocultivo, etc.). El bioquímico selecciona del catálogo en lugar de tipear cada antibiótico.
- ★ Para cada antibiótico del catálogo, los puntos de corte CLSI vienen pre-cargados como sugerencia editable. El laboratorio puede ajustarlos si usa criterios locales.
- Cada antibiótico del protocolo tiene: nombre, abreviatura, punto de corte S (≥ mm), punto de corte R (≤ mm) y norma de referencia (CLSI / EUCAST / local).
- El orden de los antibióticos dentro del protocolo es editable por arrastre.
- Los protocolos pueden activarse o desactivarse sin eliminarse.
- ★ El admin puede exportar los resultados acumulados del laboratorio en formato compatible con WHONET (.wln) para análisis epidemiológico externo, sin necesidad de pertenecer a la red WHONET.

---

## EPIC-04 — Gestión de usuarios y centros derivantes

---

### US-09 — Acceso de centros derivantes a informes

**Rol:** derivante  
**Prioridad:** Core

**Historia:**  
Como representante de un centro derivante, quiero ingresar al sistema con mis credenciales para consultar los resultados de mis pacientes, sin acceder a funciones del laboratorio.

**Criterios de aceptación:**

- El admin crea un usuario por centro derivante con rol "derivante" (permisos de solo lectura sobre informes).
- Al loguearse, el derivante solo ve los cultivos de sus propios pacientes.
- Puede ver el estado del cultivo en tiempo real: "en proceso" o "resultado disponible".
- Solo puede ver el informe completo cuando el cultivo está cerrado.
- Puede descargar el informe en PDF.
- No puede crear, editar, ni cerrar cultivos.

---

### US-10 — Gestión de usuarios (admin)

**Rol:** admin  
**Prioridad:** Core

**Historia:**  
Como administrador, quiero crear y gestionar los usuarios del sistema, para controlar quién accede y con qué permisos.

**Criterios de aceptación:**

- El admin puede crear usuarios con los roles: `admin`, `bioquimico`, `senior`, `derivante`.
- Los usuarios de rol `derivante` se asocian obligatoriamente a un centro derivante.
- El admin puede activar, desactivar o cambiar el rol de cualquier usuario sin eliminarlo.
- Los usuarios desactivados no pueden iniciar sesión pero sus registros históricos se conservan.
- El admin puede gestionar la lista de centros derivantes disponibles (crear, editar, activar/desactivar).

---

## EPIC-05 — Funcionalidades avanzadas (v2)

---

### US-11 — Sugerencia de identificación por IA con base bibliográfica propia ★

**Rol:** bioquimico  
**Prioridad:** v2

**Historia:**  
Como bioquímico, quiero que la IA sugiera gérmenes probables y valide patrones de resistencia consultando tanto su conocimiento base como bibliografía cargada por el laboratorio, para obtener sugerencias contextualizadas a nuestra práctica.

**Criterios de aceptación:**

- Al ingresar pruebas bioquímicas en la lectura de placa, el sistema consulta la API de IA (Anthropic/Claude) y sugiere 1 a 3 gérmenes probables con nivel de confianza estimado.
- La IA detecta patrones de resistencia relevantes (ej. posible BLEE, MR) a partir del antibiograma ingresado.
- ★ Usuarios con rol `admin` o `senior` pueden cargar archivos bibliográficos de referencia en PDF (fichas CLSI, guías de identificación, protocolos internos del laboratorio). Estos documentos se indexan como base de conocimiento que la IA consulta al generar sugerencias (implementación RAG).
- ★ Al hacer una sugerencia, el sistema indica si se basó en conocimiento general o en algún documento cargado por el laboratorio, para trazabilidad.
- ★ Los archivos cargados tienen un panel de gestión: se pueden ver, reemplazar o desactivar. Un archivo desactivado deja de consultarse sin eliminarse del historial.
- Toda sugerencia de IA es orientativa. El bioquímico acepta, modifica o descarta antes de guardar.
- Las identificaciones asistidas por IA quedan marcadas como tal en el informe final para auditoría.

---

### US-12 — Entrada de datos por comando de voz (lectura de placas)

**Rol:** bioquimico  
**Prioridad:** v2

**Historia:**  
Como bioquímico, quiero dictar los resultados de lectura con mi voz mientras trabajo en la mesada, para no tener que escribir con guantes o interrumpir el flujo de trabajo.

**Criterios de aceptación:**

- El modal de lectura tiene un botón de micrófono para activar dictado por voz.
- El sistema reconoce y mapea enunciados del tipo: "halo de ampicilina 15 mm", "catalasa positivo", "observación muestra hemolizada".
- El bioquímico revisa la transcripción y confirma antes de guardar.
- Implementación: Web Speech API (Chrome/Edge) con Whisper API como fallback para mayor precisión en terminología médica y nombres de antibióticos.
- La funcionalidad es opcional; todos los campos pueden completarse manualmente.

---

## Resumen de historias

| ID | Historia | Rol | Prioridad |
|---|---|---|---|
| US-01 | Ingreso de nuevo cultivo | bioquimico | Core |
| US-02 | Check-in y rotulado de muestra | bioquimico | Core |
| US-03 | Lista de materiales para siembra | bioquimico | Core |
| US-03b | Dictado por voz en ingreso de muestra | bioquimico | v2 |
| US-04 | Panel de cultivos en curso | bioquimico | Core |
| US-05 | Registro de lectura con plantillas y voz | bioquimico | Core / v2 |
| US-06 | Cierre de cultivo e informe digital | bioquimico | Core |
| US-06b | Reapertura de cultivo cerrado | senior / admin | Core |
| US-07 | Creación y edición de tipos de estudio | admin / bioquimico | Core |
| US-08 | Protocolos ATB con base CLSI/WHONET | admin / bioquimico | Core |
| US-09 | Acceso de centros derivantes | derivante | Core |
| US-10 | Gestión de usuarios | admin | Core |
| US-11 | Sugerencia de identificación por IA | bioquimico / senior | v2 |
| US-12 | Dictado por voz en lectura de placas | bioquimico | v2 |
