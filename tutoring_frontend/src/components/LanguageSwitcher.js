import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div style={{ display: 'flex', gap: '10px' }}>
      <select
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        value={i18n.language}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          backgroundColor: "#f9fafb",
          fontWeight: "600",
          fontSize: "0.9rem",
          color: "#374151",
          cursor: "pointer",
        }}
      >
        <option value="en">EN</option>
        <option value="ka">KA</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
