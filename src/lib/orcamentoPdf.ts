import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface PdfPeca {
  qtd: number;
  descricao: string;
  valor: number;
}

export interface OrcamentoPdfData {
  numero?: number | null;
  data: string; // ISO yyyy-mm-dd
  nome_cliente: string;
  telefone_cliente?: string | null;
  marca?: string | null;
  modelo?: string | null;
  placa?: string | null;
  pecas: PdfPeca[];
  mao_obra_descricao?: string | null;
  mao_obra_valor: number;
  total_pecas: number;
  total_geral: number;
  oficina: {
    nome: string;
    telefone?: string | null;
    cnpj?: string | null;
    endereco?: string | null;
    logo_url?: string | null;
  };
}

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const formatDate = (iso: string) => {
  try {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  } catch {
    return iso;
  }
};

async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateOrcamentoPdf(data: OrcamentoPdfData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header dark
  const headerH = 110;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, headerH, "F");

  // Logo
  let logoDataUrl: string | null = null;
  if (data.oficina.logo_url) {
    logoDataUrl = await loadImageAsDataUrl(data.oficina.logo_url);
  }
  const logoSize = 70;
  const logoX = 30;
  const logoY = (headerH - logoSize) / 2;
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", logoX, logoY, logoSize, logoSize, undefined, "FAST");
    } catch {
      // ignore image errors
    }
  }

  // Workshop info
  const infoX = logoDataUrl ? logoX + logoSize + 15 : logoX;
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(data.oficina.nome.toUpperCase(), infoX, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  let infoY = 55;
  if (data.oficina.cnpj) {
    doc.text(`CNPJ: ${data.oficina.cnpj}`, infoX, infoY);
    infoY += 12;
  }
  if (data.oficina.telefone) {
    doc.text(data.oficina.telefone, infoX, infoY);
    infoY += 12;
  }
  if (data.oficina.endereco) {
    doc.text(data.oficina.endereco, infoX, infoY);
  }

  // Title bar
  let y = headerH + 25;
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titulo = data.numero ? `Orçamento Nº ${data.numero}` : "Orçamento";
  doc.text(titulo, 30, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Data: ${formatDate(data.data)}`, pageWidth - 30, y, { align: "right" });
  y += 18;
  doc.setDrawColor(220);
  doc.line(30, y, pageWidth - 30, y);
  y += 18;

  // Cliente / veículo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Cliente:", 30, y);
  doc.setFont("helvetica", "normal");
  doc.text(data.nome_cliente, 80, y);
  if (data.telefone_cliente) {
    doc.setFont("helvetica", "bold");
    doc.text("Telefone:", pageWidth - 200, y);
    doc.setFont("helvetica", "normal");
    doc.text(data.telefone_cliente, pageWidth - 145, y);
  }
  y += 16;
  doc.setFont("helvetica", "bold");
  doc.text("Veículo:", 30, y);
  doc.setFont("helvetica", "normal");
  const veic = [data.marca, data.modelo].filter(Boolean).join(" ");
  doc.text(veic || "—", 80, y);
  if (data.placa) {
    doc.setFont("helvetica", "bold");
    doc.text("Placa:", pageWidth - 200, y);
    doc.setFont("helvetica", "normal");
    doc.text(data.placa, pageWidth - 160, y);
  }
  y += 22;

  // Peças table
  autoTable(doc, {
    startY: y,
    head: [["QTD", "Descrição", "Valor (R$)"]],
    body:
      data.pecas.length > 0
        ? data.pecas.map((p) => [String(p.qtd), p.descricao, brl(p.valor)])
        : [["—", "Nenhuma peça adicionada", brl(0)]],
    foot: [["", "Total Peças:", brl(data.total_pecas)]],
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 50, halign: "center" },
      1: { cellWidth: "auto" },
      2: { cellWidth: 100, halign: "right" },
    },
    margin: { left: 30, right: 30 },
  });

  // @ts-ignore lastAutoTable
  y = (doc as any).lastAutoTable.finalY + 20;

  // Mão de obra
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Mão de Obra", 30, y);
  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const moDesc = data.mao_obra_descricao?.trim() || "—";
  const moLines = doc.splitTextToSize(moDesc, pageWidth - 60) as string[];
  doc.text(moLines, 30, y + 10);
  y += Math.max(40, 14 + moLines.length * 12);

  doc.setFont("helvetica", "bold");
  doc.text("Total Mão de Obra:", pageWidth - 200, y);
  doc.text(brl(data.mao_obra_valor), pageWidth - 30, y, { align: "right" });
  y += 22;

  // Total geral
  doc.setFillColor(15, 23, 42);
  doc.rect(30, y, pageWidth - 60, 36, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("TOTAL GERAL:", 45, y + 23);
  doc.setFontSize(15);
  doc.text(brl(data.total_geral), pageWidth - 45, y + 23, { align: "right" });

  // Footer
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("Powered by ONficina", pageWidth / 2, pageHeight - 20, { align: "center" });

  return doc;
}

export async function downloadOrcamentoPdf(data: OrcamentoPdfData, filename = "orcamento.pdf") {
  const doc = await generateOrcamentoPdf(data);
  doc.save(filename);
}
