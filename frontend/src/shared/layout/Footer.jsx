const whatsapp = import.meta.env.VITE_WHATSAPP_SOPORTE;

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Órbita · Paraná, Entre Ríos</p>
      {/* CU-20: contacto rápido por WhatsApp en el pie de página (RF-22) */}
      {whatsapp && (
        <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
          Soporte por WhatsApp
        </a>
      )}
    </footer>
  );
}
