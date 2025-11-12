import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { AdminBooksTab } from "./admin-books-tab";
import { AdminAuthorsTab } from "./admin-authors-tab";
import { AdminEditorialsTab } from "./admin-editorials-tab";
import { AdminGendersTab } from "./admin-genders-tab";

export function AdminCatalogTabs() {
  return (
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
  );
}
