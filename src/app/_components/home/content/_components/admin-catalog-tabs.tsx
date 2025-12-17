import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { AdminBooksTab } from "./admin-books-tab";
import { AdminAuthorsTab } from "./admin-authors-tab";
import { AdminEditorialsTab } from "./admin-editorials-tab";
import { AdminGendersTab } from "./admin-genders-tab";
import { AddBookModal } from "./add-book-modal";
import { AddAuthorModal } from "./add-author-modal";
import { AddEditorialModal } from "./add-editorial-modal";
import { AddGenderModal } from "./add-gender-modal";
import { api } from "~/trpc/react";

type TabValue = "books" | "authors" | "editorials" | "genders";

const tabConfig: Record<TabValue, { label: string; buttonText: string }> = {
  books: { label: "Libros", buttonText: "Agregar Libro" },
  authors: { label: "Autores", buttonText: "Agregar Autor" },
  editorials: { label: "Editoriales", buttonText: "Agregar Editorial" },
  genders: { label: "Géneros", buttonText: "Agregar Género" },
};

export function AdminCatalogTabs() {
  const [activeTab, setActiveTab] = useState<TabValue>("books");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [showAddEditorialModal, setShowAddEditorialModal] = useState(false);
  const [showAddGenderModal, setShowAddGenderModal] = useState(false);
  const utils = api.useUtils();

  const handleRefreshBooks = () => {
    void utils.books.getAllAdmin.invalidate();
  };

  const handleRefreshAuthors = () => {
    void utils.catalog.getAllAuthors.invalidate();
  };

  const handleRefreshEditorials = () => {
    void utils.catalog.getAllEditorials.invalidate();
  };

  const handleRefreshGenders = () => {
    void utils.catalog.getAllGenders.invalidate();
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case "books":
        setShowAddBookModal(true);
        break;
      case "authors":
        setShowAddAuthorModal(true);
        break;
      case "editorials":
        setShowAddEditorialModal(true);
        break;
      case "genders":
        setShowAddGenderModal(true);
        break;
    }
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
          onClick={handleAddClick}
          className="bg-berkeley-blue hover:bg-berkeley-blue/90"
        >
          <Plus className="mr-2 h-4 w-4" /> {tabConfig[activeTab].buttonText}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="w-full"
      >
        <TabsList className="mb-6 grid w-full grid-cols-4">
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
        onSuccess={handleRefreshBooks}
      />
      <AddAuthorModal
        isOpen={showAddAuthorModal}
        onClose={() => setShowAddAuthorModal(false)}
        onSuccess={handleRefreshAuthors}
      />
      <AddEditorialModal
        isOpen={showAddEditorialModal}
        onClose={() => setShowAddEditorialModal(false)}
        onSuccess={handleRefreshEditorials}
      />
      <AddGenderModal
        isOpen={showAddGenderModal}
        onClose={() => setShowAddGenderModal(false)}
        onSuccess={handleRefreshGenders}
      />
    </div>
  );
}
