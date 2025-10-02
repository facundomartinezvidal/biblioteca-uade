"use client";
import { LibraryBig, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BookCard from "./_components/home/book-card";
import FiltersSidebar from "./_components/home/filters-sidebar";
import { api } from "~/trpc/react";

export default function HomePage() {
  const { data: books } = api.books.getAll.useQuery();
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LibraryBig className="h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Catálogo de Libros
          </h1>
        </div>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Encontrá el libro que estás buscando de la forma más rápida
      </p>

      <div className="mt-6 flex gap-6">
        <div className="flex-1">
          {/* SearchBar */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por título, autor, etc..."
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                Todos
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="recomended" className="flex-1">
                Recomendados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {books?.response.map((book) => (
                  <BookCard
                    key={book.id}
                    title={book.title}
                    author={book.author}
                    category={book.gender}
                    description={book.description}
                    isbn={book.isbn}
                    location={book.location ?? ""}
                    available={book.status === "AVAILABLE"}
                    coverUrl={book.imageUrl}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BookCard
                  title="Nexus"
                  author="Yuval Noah Harari"
                  category="Programacion"
                  description="El esperado nuevo libro de Yuval Noah Harari..."
                  isbn="543-65-376-0400-1"
                  location="Piso 2, Seccion Ciencias"
                  available
                  isFavorite
                />
              </div>
            </TabsContent>

            <TabsContent value="recomended" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <BookCard
                  title="Python para todos"
                  author="Charles Severance"
                  category="Programacion"
                  description="Este libro está diseñado para programar incluso si no se tiene experiencia previa..."
                  isbn="543-65-376-0400-1"
                  location="Piso 2, Seccion Ciencias"
                  available
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FiltersSidebar */}
        <div className="hidden lg:block">
          <FiltersSidebar />
        </div>
      </div>
    </div>
  );
}
