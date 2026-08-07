import { NewsForm } from "@/components/admin/NewsForm";

export default function NuevaNoticiaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva noticia</h1>
        <p className="mt-1 text-sm text-muted">Completá los datos y guardá para publicar.</p>
      </div>
      <NewsForm />
    </div>
  );
}
