import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const languages = {
    en: 'English',
    es: 'Español',
    ar: 'العربية'
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" size="sm" id="language-switcher">
        {languages[i18n.language] || 'Language'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.entries(languages).map(([code, name]) => (
          <Dropdown.Item 
            key={code}
            onClick={() => changeLanguage(code)}
            active={i18n.language === code}
          >
            {name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
