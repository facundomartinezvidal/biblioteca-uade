import { createClient } from "@supabase/supabase-js";
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

async function listBooks() {
  try {
    const { data: books, error } = await supabase
      .from("books")
      .select("id, title, image_url")
      .order("title");

    if (error) {
      console.error("❌ Error fetching books:", error.message);
      return;
    }

    console.log("\n📚 Available Books:\n");
    console.log("─".repeat(80));

    books?.forEach((book, index) => {
      console.log(`\n${index + 1}. ${book.title}`);
      console.log(`   🆔 ID: ${book.id}`);
      console.log(`   🖼️  Image: ${book.image_url || "No image"}`);
    });

    console.log("\n" + "─".repeat(80));
    console.log("\n💡 To upload an image, use:");
    console.log("   npm run upload-image <book-id> <image-path>\n");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

listBooks();
