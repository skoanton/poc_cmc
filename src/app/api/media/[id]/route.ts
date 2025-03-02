import { NextResponse } from "next/server";
import { MediaCategory, PrismaClient } from "@prisma/client";
import path from "path";
import { writeFile, existsSync, mkdirSync } from "fs";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
  }

  try {
    const media = await prisma.media.findMany({
      where: { customerId: params.id },
    });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    console.log(media);

    const serializedMedia = media.map((m) => ({
      ...m,
      size: m.size.toString(),
    }));

    return NextResponse.json(serializedMedia, { status: 200 });
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Hämta fält från formData
    const file = formData.get("file");
    const type = formData.get("type") as string;
    const category = formData.get("category") as MediaCategory;
    const size = formData.get("size") as string;
    const customerId = formData.get("customerId") as string;

    // 🚨 Validering
    if (!file || !type || !category || !size || !customerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let url: string | null = null;

    // 📂 Om det är en faktisk fil (IMAGE, VIDEO, etc.)
    if (file instanceof File) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;

      // Kontrollera att uppladdningsmappen finns
      const folderPath = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);
      await writeFile(filePath, fileBuffer, (err) => {
        if (err) {
          console.error("Error writing file:", err);
          throw new Error("Failed to write file");
        }
      });

      url = `/uploads/${fileName}`;
    }
    // 📌 Om `file` är en textsträng (t.ex. företagsnamn, beskrivning)
    else if (typeof file === "string") {
      url = file; // Spara texten direkt
    }
    // ❌ Om formatet är okänt
    else {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      );
    }

    // 🗄️ Spara i Prisma-databasen
    const newMedia = await prisma.media.create({
      data: {
        url, // Antingen en fil-url eller en textsträng
        type,
        category,
        size: parseInt(size, 10),
        customerId,
      },
    });

    const serializedMedia = {
      ...newMedia,
      size: newMedia.size.toString(),
    };

    return NextResponse.json(serializedMedia, { status: 201 });
  } catch (error) {
    console.error("Error adding media:", error);
    return NextResponse.json({ error: "Failed to add media" }, { status: 500 });
  }
}
