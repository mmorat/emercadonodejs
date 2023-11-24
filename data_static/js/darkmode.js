/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

(() => {
  'use strict'

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const setTheme = theme => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme());
 
 function getTheme(){
    const htmlElement = document.querySelector('html');
    return htmlElement.getAttribute('data-bs-theme');
    }


  const switchBackgroundClasses = (fromClass, toClass) => {
    const elements = document.querySelectorAll(`.${fromClass}`);
    
    elements.forEach(element => {
      element.classList.remove(fromClass);
      element.classList.add(toClass);
    });
  };



  function darkmodeDinamico() {
    
    const tema = getTheme();
  
    if (tema === 'dark') {
      
      switchBackgroundClasses('bg-light', 'bg-dark');
      switchBackgroundClasses('btn-light', 'btn-dark');
      
      if ((window.location.pathname.endsWith('index.html')) && window.innerWidth < "768px"){
        const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
        indexBanner = 'url(img/cover_back_dark_chiquito.png)'
      } else if ((window.location.pathname.endsWith('index.html')) && window.innerWidth > "768px"){
        const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
        indexBanner = 'url(img/cover_back_dark.png)'
      }
  
    } else if (tema === 'light'){
      switchBackgroundClasses('bg-dark', 'bg-light');
    switchBackgroundClasses('btn-dark', 'btn-light');
      if ((window.location.pathname.endsWith('index.html')) && window.innerWidth < "768px"){
        const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
        indexBanner = 'url(img/cover_back_chiquito.png)'
      } else if ((window.location.pathname.endsWith('index.html')) && window.innerWidth > "768px"){
        const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
        indexBanner = 'url(img/cover_back.png)'
      }
    };
  }

  const btnL = document.getElementById("btn-light");
  const btnD = document.getElementById("btn-dark");
  
  btnL.addEventListener("click", (e) => {
    e.stopPropagation();
    switchBackgroundClasses('bg-dark', 'bg-light');
    switchBackgroundClasses('btn-dark', 'btn-light');
    if ((window.location.pathname.endsWith('index.html')) && window.innerWidth < "768px"){
      const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
      indexBanner = 'url(img/cover_back_chiquito.png)'
    } else if ((window.location.pathname.endsWith('index.html')) && window.innerWidth > "768px"){
      const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
      indexBanner = 'url(img/cover_back.png)'
    }
  });

  btnD.addEventListener("click", (e) => {
    e.stopPropagation();
    switchBackgroundClasses('bg-light', 'bg-dark');
    switchBackgroundClasses('btn-light', 'btn-dark');
    
    if ((window.location.pathname.endsWith('index.html')) && window.innerWidth < "768px"){
      const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
      indexBanner = 'url(img/cover_back_dark_chiquito.png)'
    } else if ((window.location.pathname.endsWith('index.html')) && window.innerWidth > "768px"){
      const indexBanner = document.querySelector('.jumbotron').style.backgroundImage;
      indexBanner = 'url(img/cover_back_dark.png)'
    }
  });


  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text');
    const activeThemeIcon = document.querySelector('.theme-icon-active use');
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href');
    
    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }


  // Evitar la propagación del clic en el botón de cambio de tema
  const themeButton = document.getElementById("bd-theme");
  themeButton.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())
    darkmodeDinamico();

    document.querySelectorAll('[data-bs-theme-value]')
      .forEach(toggle => {
        toggle.addEventListener('click', () => {
          const theme = toggle.getAttribute('data-bs-theme-value')
          setStoredTheme(theme)
          setTheme(theme)
          showActiveTheme(theme, true)
        })
      })
  })
})()