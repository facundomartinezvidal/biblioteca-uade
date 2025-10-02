import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing environment variables");
  console.error(
    "Please make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadBookImage(bookId: string, imagePath: string) {
  try {
    console.log(`📚 Uploading image for book ID: ${bookId}`);

    const fileBuffer = readFileSync(resolve(imagePath));
    const fileName = imagePath.split("/").pop() ?? "cover.jpg";
    const fileExtension = fileName.split(".").pop();
    const storagePath = `${bookId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("book_image")
      .upload(storagePath, fileBuffer, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError.message);
      return;
    }

    console.log("✅ Image uploaded successfully!");

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/book_image/${storagePath}`;
    console.log(`🔗 Public URL: ${publicUrl}`);

    const { data: books, error: fetchError } = await supabase
      .from("books")
      .select("id, title")
      .eq("id", bookId);

    if (fetchError || !books || books.length === 0) {
      console.error("❌ Book not found with ID:", bookId);
      console.log("📝 You can manually update the image_url with:");
      console.log(
        `UPDATE books SET image_url = '${publicUrl}' WHERE id = '${bookId}';`,
      );
      return;
    }

    const { error: updateError } = await supabase
      .from("books")
      .update({ image_url: publicUrl })
      .eq("id", bookId);

    if (updateError) {
      console.error("❌ Error updating book:", updateError.message);
      return;
    }

    console.log(`✅ Book "${books[0]?.title}" updated with new image URL!`);
    console.log(`📖 Book: ${books[0]?.title}`);
    console.log(`🆔 ID: ${bookId}`);
    console.log(`🖼️  URL: ${publicUrl}`);
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

const bookId = process.argv[2];
const imagePath = process.argv[3];

if (!bookId || !imagePath) {
  console.log("Usage: npm run upload-image <book-id> <image-path>");
  console.log("Example: npm run upload-image abc123 ./covers/book.jpg");
  process.exit(1);
}

void uploadBookImage(bookId, imagePath);
