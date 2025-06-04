# 🔐 Generador de Contraseñas Seguras

Este proyecto es una aplicación web que genera contraseñas seguras, evalúa su fuerza y verifica si han sido comprometidas utilizando la API de [Have I Been Pwned](https://haveibeenpwned.com/). También incluye soporte para modo oscuro 🌙☀️.

## 🚀 Características

- Generación de contraseñas aleatorias con opciones de:
  - Letras mayúsculas
  - Letras minúsculas
  - Números
  - Símbolos
- Evaluación visual de la fuerza de la contraseña
- Verificación de si la contraseña ha sido filtrada en bases de datos públicas (HIBP API)
- Copiar contraseña al portapapeles con retroalimentación visual
- Soporte para **modo oscuro** con cambio dinámico y persistencia con `localStorage`

## 🖼️ Vista previa

![preview-light](./preview-light.png)
![preview-dark](./preview-dark.png)

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- API de [HaveIBeenPwned](https://haveibeenpwned.com/API/v3#SearchingPwnedPasswordsByRange)

## 📦 Cómo usar

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/generador-contrasenas.git
   cd generador-contrasenas

2. Abre el archivo index.html en tu navegador:
    open index.html

🌗 Modo Oscuro
Haz clic en el botón de luna 🌙 o sol ☀️ en la esquina superior derecha para cambiar entre modo claro y oscuro. Tu preferencia se guarda localmente para la próxima visita.

🔒 Seguridad
La verificación de contraseñas se realiza mediante el modelo K-Anonymity de Have I Been Pwned. Solo se envían los primeros 5 caracteres del hash SHA-1, manteniendo la privacidad total de la contraseña generada.

Hecho por Yahir Lope