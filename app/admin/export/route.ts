import { NextResponse } from "next/server";
import { PassThrough } from "stream";
import PDFDocument from "pdfkit";
import { getAllPostsAdmin } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^>\s*/gm, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .trim();
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const posts = await getAllPostsAdmin();
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const stream = new PassThrough();

  doc.pipe(stream);

  doc.fontSize(20).text("Blog Posts Export", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor("#666666").text(`Generated on ${new Date().toLocaleDateString("en-GB")}`);
  doc.moveDown(1);
  doc.fillColor("#000000");

  posts.forEach((post, index) => {
    doc.fontSize(16).text(post.title, { underline: true });
    doc.moveDown(0.25);
    doc.fontSize(10).fillColor("#333333").text(`/${post.slug}`);
    doc.fontSize(10).text(`Date: ${post.date}`);
    if (post.tags.length > 0) {
      doc.fontSize(10).text(`Tags: ${post.tags.join(", ")}`);
    }
    doc.moveDown(0.5);
    if (post.excerpt) {
      doc.fontSize(11).fillColor("#000000").text(stripMarkdown(post.excerpt));
      doc.moveDown(0.5);
    }
    if (post.content) {
      doc.fontSize(11).fillColor("#000000").text(stripMarkdown(post.content));
    }

    if (index < posts.length - 1) {
      doc.moveDown(1.25);
      doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor("#e5e5e5").stroke();
      doc.moveDown(1.25);
    }
  });

  doc.end();

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=blog-posts.pdf",
    },
  });
}
