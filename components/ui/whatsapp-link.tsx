"use client";

import { OverlayLink } from "./overlay-link";

interface WhatsAppLinkProps {
  phoneNumber: string;
  message: string;
  className?: string;
  children: React.ReactNode;
  showOnClick?: boolean;
}

export function WhatsAppLink({
  phoneNumber,
  message,
  className = "",
  children,
  showOnClick = false,
}: WhatsAppLinkProps) {
  // Emoji de corazón rosa: 💖
  const heartEmoji = "%F0%9F%92%96";

  // Construir el mensaje completo con el emoji
  const fullMessage = `${heartEmoji}%20${message}`;

  // Construir la URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${fullMessage}`;

  return (
    <OverlayLink
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      showOnClick={showOnClick}
    >
      {children}
    </OverlayLink>
  );
}
