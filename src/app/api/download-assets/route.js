import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import JSZip from "jszip";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const dept = searchParams.get("dept");
    const task = searchParams.get("task");

    if (!dept || !task) {
      return NextResponse.json(
        { error: "Missing department or task parameters" },
        { status: 400 },
      );
    }

    const folderPath = path.join(
      process.cwd(),
      "public",
      "task_assets",
      dept,
      `task_${task}`,
    );

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      return NextResponse.json(
        { error: "No assets found for this task." },
        { status: 404 },
      );
    }

    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Asset folder is empty." },
        { status: 404 },
      );
    }

    const zip = new JSZip();

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isFile()) {
        const fileData = fs.readFileSync(filePath);
        zip.file(file, fileData);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="Task_${task}_Assets.zip"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating zip:", error);
    return NextResponse.json(
      { error: "Internal server error while generating zip." },
      { status: 500 },
    );
  }
}
