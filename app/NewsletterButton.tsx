"use client";

import React from 'react';

export default function NewsletterButton() {
  return (
    <button 
      type="button" 
      className="btn-primary" 
      style={{ padding: '0 1rem' }}
      onClick={() => alert('¡Gracias por suscribirte al Bootcamp de VigorNova!')}
    >
      UNIRME
    </button>
  );
}
