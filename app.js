document.addEventListener('DOMContentLoaded', () => {
  const lengthInput = document.getElementById('length');
  const uppercaseCheckbox = document.getElementById('uppercase');
  const lowercaseCheckbox = document.getElementById('lowercase');
  const numbersCheckbox = document.getElementById('numbers');
  const symbolsCheckbox = document.getElementById('symbols');
  const generateButton = document.getElementById('generate');
  const resultSpan = document.getElementById('result');
  const strengthBar = document.getElementById('strength-bar');
  const strengthText = document.getElementById('strength-text');
  const pwnedMessage = document.getElementById('pwned-message');
  const copyMessage = document.getElementById('copy-message');
  const toggleThemeButton = document.getElementById('toggle-theme');

  // Función para actualizar barra y texto de fuerza
  function updateStrength() {
    const length = parseInt(lengthInput.value) || 0;
    let typesCount = 0;
    if (uppercaseCheckbox.checked) typesCount++;
    if (lowercaseCheckbox.checked) typesCount++;
    if (numbersCheckbox.checked) typesCount++;
    if (symbolsCheckbox.checked) typesCount++;

    let strength = '';
    let color = '';
    let widthPercent = 0;

    if (length < 8 || typesCount === 0) {
      strength = 'Muy débil';
      color = 'red';
      widthPercent = 20;
    } else if (length < 12 || typesCount === 1) {
      strength = 'Débil';
      color = 'orange';
      widthPercent = 40;
    } else if (length < 16 || typesCount === 2) {
      strength = 'Medio';
      color = 'yellow';
      widthPercent = 60;
    } else if (length < 20 || typesCount === 3) {
      strength = 'Fuerte';
      color = 'lightgreen';
      widthPercent = 80;
    } else {
      strength = 'Muy fuerte';
      color = 'green';
      widthPercent = 100;
    }

    strengthBar.style.width = widthPercent + '%';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Fuerza: ${strength}`;
    strengthText.style.color = color;
  }

  // Función para verificar en HaveIBeenPwned
  async function checkPasswordPwned(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    if (!res.ok) throw new Error('Error al consultar la API');

    const text = await res.text();
    const lines = text.split('\n');

    for (const line of lines) {
      const [hashSuffix, count] = line.trim().split(':');
      if (hashSuffix === suffix) {
        return parseInt(count);
      }
    }
    return 0;
  }

  // Eventos para actualizar fuerza al cambiar inputs
  lengthInput.addEventListener('input', updateStrength);
  uppercaseCheckbox.addEventListener('change', updateStrength);
  lowercaseCheckbox.addEventListener('change', updateStrength);
  numbersCheckbox.addEventListener('change', updateStrength);
  symbolsCheckbox.addEventListener('change', updateStrength);

  // Generar contraseña y verificar filtración
  generateButton.addEventListener('click', async () => {
    const length = parseInt(lengthInput.value);
    const useUppercase = uppercaseCheckbox.checked;
    const useLowercase = lowercaseCheckbox.checked;
    const useNumbers = numbersCheckbox.checked;
    const useSymbols = symbolsCheckbox.checked;

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%&';

    let characters = '';
    if (useUppercase) characters += uppercaseChars;
    if (useLowercase) characters += lowercaseChars;
    if (useNumbers) characters += numberChars;
    if (useSymbols) characters += symbolChars;

    if (characters.length === 0) {
      resultSpan.textContent = 'Por favor, selecciona al menos un tipo de carácter.';
      strengthBar.style.width = '0%';
      strengthText.textContent = '';
      pwnedMessage.textContent = '';
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    resultSpan.textContent = password;

    pwnedMessage.textContent = '';
    pwnedMessage.style.color = '';

    updateStrength();

    try {
      const count = await checkPasswordPwned(password);
      if (count > 0) {
        pwnedMessage.textContent = `Esta contraseña ha sido filtrada ${count} veces ⚠️`;
        pwnedMessage.style.color = 'orange';
        strengthBar.style.backgroundColor = 'orange';
        strengthText.style.color = 'orange';
      } else {
        pwnedMessage.textContent = `No se ha encontrado esta contraseña en bases filtradas ✅`;
        pwnedMessage.style.color = 'green';
        updateStrength();
      }
    } catch (error) {
      console.error('Error al verificar la contraseña en HaveIBeenPwned:', error);
      pwnedMessage.textContent = 'No se pudo verificar la contraseña.';
      pwnedMessage.style.color = 'red';
    }
  });

  // Copiar con feedback visual
  document.getElementById('copy').addEventListener('click', () => {
    if (resultSpan.textContent === '') {
      alert('No hay contraseña para copiar');
      return;
    }
    navigator.clipboard.writeText(resultSpan.textContent)
      .then(() => {
        copyMessage.textContent = '✔ Contraseña copiada al portapapeles';
        copyMessage.classList.add('visible');
        setTimeout(() => {
          copyMessage.classList.remove('visible');
          copyMessage.textContent = '';
        }, 2500);
      })
      .catch(err => {
        console.error('Error al copiar la contraseña:', err);
        alert('Error al copiar la contraseña');
      });
  });

  // Modo oscuro con toggle botón que cambia ícono
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    toggleThemeButton.textContent = '🌙'; // icono para modo claro
  } else {
    toggleThemeButton.textContent = '☀️'; // icono para modo oscuro
  }

  toggleThemeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggleThemeButton.textContent = isDark ? '🌙' : '☀️';
  });

  // Inicializar fuerza al cargar
  updateStrength();
});
