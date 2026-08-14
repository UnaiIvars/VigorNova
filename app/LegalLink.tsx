"use client";

import React from 'react';
import Link from 'next/link';

interface LegalLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function LegalLink({ href, children }: LegalLinkProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link 
      href={href} 
      style={{ 
        color: isHovered ? 'var(--accent-primary)' : 'var(--text-muted)', 
        textDecoration: 'none', 
        transition: 'color 0.2s' 
      }} 
      onMouseOver={() => setIsHovered(true)} 
      onMouseOut={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
}
