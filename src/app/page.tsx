"use client";
import { LibraryBig, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BookCard from "./_components/home/book-card";
import FiltersSidebar from "./_components/home/filters-sidebar";
import { api } from "~/trpc/react";
import BookCardSkeleton from "./_components/home/book-card-skeleton";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

export default function HomePage() {
  const { data: books, isLoading } = api.books.getAll.useQuery();
  const router = useRouter();

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);
  const [selectedAvailability, setSelectedAvailability] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("all");

  const handleReserve = (book: any) => {
    // Navigate to reserve page with book ID
    router.push(`/reserve?bookId=${book.id}`);
  };

  // Función para aplicar filtros
  const filteredBooks = useMemo(() => {
    if (!books?.response) return [];

    let filtered = books.response;

    // Filtro por búsqueda (título, autor, descripción)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((book) => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        (book.authorMiddleName && book.authorMiddleName.toLowerCase().includes(searchLower)) ||
        (book.authorLastName && book.authorLastName.toLowerCase().includes(searchLower)) ||
        book.description.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por género
    if (selectedGenre) {
      filtered = filtered.filter((book) => 
        book.gender.toLowerCase().includes(selectedGenre.toLowerCase())
      );
    }

    // Filtro por disponibilidad
    if (selectedAvailability) {
      if (selectedAvailability === "disponible") {
        filtered = filtered.filter((book) => book.status === "AVAILABLE");
      } else if (selectedAvailability === "no-disponible") {
        filtered = filtered.filter((book) => book.status !== "AVAILABLE");
      }
    }

    // Filtro por ubicación/sede
    if (selectedLocation) {
      filtered = filtered.filter((book) => 
        book.location && book.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    return filtered;
  }, [books?.response, searchTerm, selectedGenre, selectedAvailability, selectedLocation]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenre(undefined);
    setSelectedAvailability(undefined);
    setSelectedLocation(undefined);
  };

  // Función para manejar cambios en filtros
  const handleFilterChange = (filterType: string, value: string | undefined) => {
    switch (filterType) {
      case "genre":
        setSelectedGenre(value);
        break;
      case "availability":
        setSelectedAvailability(value);
        break;
      case "location":
        setSelectedLocation(value);
        break;
    }
  };
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">
                Todos ({filteredBooks.length})
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
                {isLoading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <BookCardSkeleton key={index} />
                    ))
                  : filteredBooks.length > 0 ? (
                      filteredBooks.map((book) => (
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
                          onReserve={() => handleReserve(book)}
                        />
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-12">
                        <p className="text-gray-500 text-lg">No se encontraron libros que coincidan con los filtros.</p>
                        <button 
                          onClick={clearFilters}
                          className="mt-4 text-berkeley-blue hover:underline"
                        >
                          Limpiar filtros
                        </button>
                      </div>
                    )}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <BookCardSkeleton key={index} />
                  ))
                ) : (
                  // Mostrar libros favoritos simulados (primeros 2 libros disponibles)
                  filteredBooks
                    .filter((book) => book.status === "AVAILABLE")
                    .slice(0, 2)
                    .map((book) => (
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
                        isFavorite
                        onReserve={() => handleReserve(book)}
                      />
                    ))
                )}
                {!isLoading && filteredBooks.filter((book) => book.status === "AVAILABLE").length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500 text-lg">No tienes libros favoritos aún.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recomended" className="mt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <BookCardSkeleton key={index} />
                  ))
                ) : (
                  // Mostrar libros recomendados simulados (últimos 2 libros disponibles)
                  filteredBooks
                    .filter((book) => book.status === "AVAILABLE")
                    .slice(-2)
                    .map((book) => (
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
                        onReserve={() => handleReserve(book)}
                      />
                    ))
                )}
                {!isLoading && filteredBooks.filter((book) => book.status === "AVAILABLE").length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <p className="text-gray-500 text-lg">No hay libros recomendados disponibles.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* FiltersSidebar */}
        <div className="hidden lg:block">
          <FiltersSidebar 
            onGenreChange={(value) => handleFilterChange("genre", value)}
            onAvailabilityChange={(value) => handleFilterChange("availability", value)}
            onLocationChange={(value) => handleFilterChange("location", value)}
            onCancel={clearFilters}
            onSubmit={() => {}} // Los filtros se aplican automáticamente
            selectedGenre={selectedGenre}
            selectedAvailability={selectedAvailability}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>
    </div>
  );
}
