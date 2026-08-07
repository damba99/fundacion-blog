export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted-bg">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted sm:px-6">
        © {new Date().getFullYear()} Fundación. Todos los derechos reservados.
      </div>
    </footer>
  );
}
