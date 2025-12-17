import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { AdminBooksTab } from "./admin-books-tab";
import { AdminAuthorsTab } from "./admin-authors-tab";
import { AdminEditorialsTab } from "./admin-editorials-tab";
import { AdminGendersTab } from "./admin-genders-tab";
import { AddBookModal } from "./add-book-modal";
import { api } from "~/trpc/react";

export function AdminCatalogTabs() {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const utils = api.useUtils();

  const handleRefresh = () => {
    void utils.books.getAllAdmin.invalidate();
  };

  return (
    <div className="w-full">
      {/* Header: Title + Description on left, Button on right */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="text-berkeley-blue h-6 w-6" />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Catálogo</h1>
            <p className="text-muted-foreground text-sm">
              Administra el catálogo de libros de la biblioteca
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddBookModal(true)}
          className="bg-berkeley-blue hover:bg-berkeley-blue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar Libro
        </Button>
      </div>

      <Tabs defaultValue="books" className="w-full">
        <TabsList className="mb-6 grid grid-cols-4 w-full">
          <TabsTrigger value="books">Libros</TabsTrigger>
          <TabsTrigger value="authors">Autores</TabsTrigger>
          <TabsTrigger value="editorials">Editoriales</TabsTrigger>
          <TabsTrigger value="genders">Géneros</TabsTrigger>
        </TabsList>
        <TabsContent value="books">
          <AdminBooksTab />
        </TabsContent>
        <TabsContent value="authors">
          <AdminAuthorsTab />
        </TabsContent>
        <TabsContent value="editorials">
          <AdminEditorialsTab />
        </TabsContent>
        <TabsContent value="genders">
          <AdminGendersTab />
        </TabsContent>
      </Tabs>

      <AddBookModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
