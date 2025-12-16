import ExcelJS from "exceljs";
import { getGeneralSettings } from "@/lib/utils";

export type ColumnDef = { header: string; key: string; width?: number };

export async function exportExcel({
  filename,
  title,
  columns,
  rows,
  subtitle,
  includeTitleColumn,
  titleColumnName,
  titleValue,
  currencyKeys,
  dateKeys,
  autoFit,
}: {
  filename: string;
  title?: string;
  columns: ColumnDef[];
  rows: Array<Record<string, unknown>>;
  subtitle?: string;
  includeTitleColumn?: boolean;
  titleColumnName?: string;
  titleValue?: string;
  currencyKeys?: string[];
  dateKeys?: string[];
  autoFit?: boolean;
}) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report", {
    properties: { defaultRowHeight: 20 },
    views: [{ state: "frozen", ySplit: subtitle ? 3 : 2 }],
  });

  // Title row
  const titleText = title || filename.replace(/\.xlsx$/i, "");
  const totalCols = (includeTitleColumn ? columns.length + 1 : columns.length) || 1;
  sheet.mergeCells(1, 1, 1, Math.max(1, totalCols));
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = titleText;
  titleCell.font = { size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2563EB" } }; // blue

  // Optional subtitle row
  let headerStartRow = 2;
  if (subtitle) {
    sheet.mergeCells(2, 1, 2, Math.max(1, totalCols));
    const subCell = sheet.getCell(2, 1);
    subCell.value = subtitle;
    subCell.font = { size: 10, color: { argb: "FFFFFFFF" } };
    subCell.alignment = { vertical: "middle", horizontal: "center" };
    subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } }; // lighter blue
    headerStartRow = 3;
  }

  // Header row
  const effectiveColumns: ColumnDef[] = includeTitleColumn
    ? [{ header: titleColumnName || "Title", key: "__title__" }, ...columns]
    : columns;
  // Define columns without automatic header row to control header placement
  sheet.columns = effectiveColumns.map((c) => ({ key: c.key, width: c.width || 18 }));
  const headerRow = sheet.getRow(headerStartRow);
  effectiveColumns.forEach((c, idx) => {
    headerRow.getCell(idx + 1).value = c.header;
  });
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 20;
  headerRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F2937" } }; // slate-800
    cell.border = {
      top: { style: "thin", color: { argb: "FF374151" } },
      left: { style: "thin", color: { argb: "FF374151" } },
      bottom: { style: "thin", color: { argb: "FF374151" } },
      right: { style: "thin", color: { argb: "FF374151" } },
    };
  });

  // Body rows with zebra striping
  type CellValue = string | number | boolean | Date | null;
  rows.forEach((r, idx) => {
    const obj: Record<string, CellValue> = {};
    const keys = effectiveColumns.map((c) => c.key);
    keys.forEach((key) => {
      if (includeTitleColumn && key === "__title__") {
        obj[key] = (titleValue || titleText) as CellValue;
        return;
      }
      const v = (r as Record<string, unknown>)[key];
      if (v === undefined || v === null) {
        obj[key] = "";
      } else if (v instanceof Date) {
        obj[key] = v;
      } else if (typeof v === "number" || typeof v === "boolean" || typeof v === "string") {
        obj[key] = v as CellValue;
      } else {
        obj[key] = String(v);
      }
    });
    const row = sheet.addRow(obj);
    row.alignment = { vertical: "middle" };
    const isEven = idx % 2 === 0;
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
      if (isEven) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8FAFC" } }; // slate-50
      }
      const colKey = sheet.getColumn(colNumber).key as string | undefined;
      const numKeys = currencyKeys || [];
      const dKeys = dateKeys || [];
      if (typeof cell.value === "number") {
        cell.alignment = { ...cell.alignment, horizontal: "right" };
        if (colKey && numKeys.includes(colKey)) {
          const { currency } = getGeneralSettings();
          const symbol = currency === 'USD' ? '$' : '₱';
          cell.numFmt = `${symbol}#,##0.00`;
        } else {
          cell.numFmt = "#,##0.00";
        }
      }
      if (colKey && dKeys.includes(colKey)) {
        // try parse date-like strings
        const raw = cell.value;
        if (typeof raw === "string") {
          const d = new Date(raw);
          if (!isNaN(d.getTime())) {
            cell.value = d;
            cell.numFmt = "mm/dd/yyyy hh:mm";
          }
        }
      }
    });
  });

  // Auto-fit widths up to a max (optional)
  if (autoFit ?? true) {
    sheet.columns.forEach((col) => {
      let max = 10;
      col.eachCell({ includeEmpty: true }, (cell) => {
        const val = cell.value == null ? "" : String(cell.value);
        max = Math.max(max, Math.min(24, val.length + 2));
      });
      col.width = Math.min(28, max);
    });
  }

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
