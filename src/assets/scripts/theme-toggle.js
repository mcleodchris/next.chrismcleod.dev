const storageKey = 'theme-preference';
const lightLabel = '{{ meta.themeSwitch.light }}';
const darkLabel = '{{ meta.themeSwitch.dark }}';
const themeColors = {
  dark: '{{ (designTokens.colors.items | where("name", "machiatto-base"))[0].value }}',
  light: '{{ (designTokens.colors.items | where("name", "latte-base"))[0].value }}'
};

const theme = {
  value: getColorPreference()
};

window.onload = () => {
  const lightThemeToggle = document.querySelector('#light-theme-toggle');
  const darkThemeToggle = document.querySelector('#dark-theme-toggle');
  const switcher = document.querySelector('[data-theme-switcher]');

  if (!switcher) {
    return;
  }

  reflectPreference();
  updateMetaThemeColor();

  lightThemeToggle.addEventListener('click', () => onClick('light'));
  darkThemeToggle.addEventListener('click', () => onClick('dark'));

  lightThemeToggle.setAttribute('aria-pressed', theme.value === 'light');
  darkThemeToggle.setAttribute('aria-pressed', theme.value === 'dark');
};

// Follow system changes until the visitor explicitly saves a light/dark preference.
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({matches: isDark}) => {
    if (localStorage.getItem(storageKey)) return;
    theme.value = isDark ? 'dark' : 'light';
    reflectPreference();
    updateMetaThemeColor();
  });

function onClick(themeValue) {
  theme.value = themeValue;
  document
    .querySelector('#light-theme-toggle')
    .setAttribute('aria-pressed', themeValue === 'light');
  document
    .querySelector('#dark-theme-toggle')
    .setAttribute('aria-pressed', themeValue === 'dark');
  setPreference();
  updateMetaThemeColor();
}

function getColorPreference() {
  if (localStorage.getItem(storageKey)) {
    return localStorage.getItem(storageKey);
  } else {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

function setPreference() {
  localStorage.setItem(storageKey, theme.value);
  reflectPreference();
  updateMetaThemeColor();
}

function reflectPreference() {
  document.firstElementChild.setAttribute('data-theme', theme.value);
  // document.querySelector('#light-theme-toggle')?.setAttribute('aria-label', lightLabel);
  // document.querySelector('#dark-theme-toggle')?.setAttribute('aria-label', darkLabel);
}

function updateMetaThemeColor() {
  const newColor = theme.value === 'dark' ? themeColors.dark : themeColors.light;
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach(meta => meta.setAttribute('content', newColor));
}

// set early so no page flashes / CSS is made aware
reflectPreference();
