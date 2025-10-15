# 📚 Scripts de Gestión de Imágenes de Libros

## 📋 Prerequisitos

Asegúrate de tener las variables de entorno configuradas en tu `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bvkijydewrgsbczyikej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
```

## 🚀 Comandos Disponibles

### 1. Listar todos los libros

```bash
npm run list-books
```

Este comando muestra todos los libros con sus IDs y URLs de imágenes actuales.

**Ejemplo de salida:**

```
📚 Available Books:

────────────────────────────────────────────────────────────────────────────────

1. Cien años de soledad
   🆔 ID: abc123-def456-ghi789
   🖼️  Image: No image

2. La casa de los espíritus
   🆔 ID: xyz789-uvw456-rst123
   🖼️  Image: No image

────────────────────────────────────────────────────────────────────────────────

💡 To upload an image, use:
   npm run upload-image <book-id> <image-path>
```

### 2. Subir una imagen para un libro

```bash
npm run upload-image <book-id> <ruta-a-la-imagen>
```

**Parámetros:**

- `book-id`: El ID del libro (obtenerlo con `npm run list-books`)
- `ruta-a-la-imagen`: Ruta al archivo de imagen (jpg, png, etc.)

**Ejemplo:**

```bash
npm run upload-image abc123-def456-ghi789 ./covers/cien-anos-de-soledad.jpg
```

**Lo que hace el script:**

1. ✅ Sube la imagen a Supabase Storage en la carpeta `book_image/<book-id>/`
2. ✅ Genera la URL pública de la imagen
3. ✅ Actualiza automáticamente el campo `image_url` del libro en la base de datos
4. ✅ Muestra la confirmación con toda la información

**Ejemplo de salida:**

```
📚 Uploading image for book ID: abc123-def456-ghi789
✅ Image uploaded successfully!
🔗 Public URL: https://bvkijydewrgsbczyikej.supabase.co/storage/v1/object/public/book_image/abc123-def456-ghi789/cien-anos-de-soledad.jpg
✅ Book "Cien años de soledad" updated with new image URL!
📖 Book: Cien años de soledad
🆔 ID: abc123-def456-ghi789
🖼️  URL: https://bvkijydewrgsbczyikej.supabase.co/storage/v1/object/public/book_image/abc123-def456-ghi789/cien-anos-de-soledad.jpg
```

## 📁 Estructura en Supabase Storage

Las imágenes se organizan así:

```
book_image/
├── <book-id-1>/
│   └── cover.jpg
├── <book-id-2>/
│   └── cover.jpg
└── <book-id-3>/
    └── cover.jpg
```

Cada libro tiene su propia carpeta identificada por su ID.

## 🔧 Solución de Problemas

### Error: "Book not found"

- Verifica que el ID del libro sea correcto usando `npm run list-books`

### Error: "Upload error"

- Verifica que las políticas de Storage estén configuradas correctamente
- Asegúrate de que el bucket `book_image` exista y sea público

### Error: Variables de entorno

- Verifica que tu archivo `.env` tenga las variables correctas
- Reinicia el terminal después de modificar `.env`

## 💡 Tips

1. **Formato de imágenes**: Se recomienda usar JPG o PNG
2. **Tamaño**: Preferiblemente portadas de libros de 600x800px o similar
3. **Nombres**: Usa nombres descriptivos para las imágenes
4. **Backup**: Las imágenes se pueden reemplazar usando `upsert: true`
