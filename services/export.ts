
import { Document, Packer, Paragraph, Table, TableRow, TableCell, AlignmentType, WidthType, TextRun, HeadingLevel, VerticalAlign } from 'docx';
import saveAs from 'file-saver';
import { VisitRequest } from '../types';
import { STATUS_MAP } from '../constants';

export const exportVisitRequestsToWord = async (requests: VisitRequest[], unitName: string, date: string) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "QUÂN ĐỘI NHÂN DÂN VIỆT NAM", bold: true, size: 24 }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "ĐƠN VỊ: " + unitName.toUpperCase(), bold: true, size: 24 }),
          ],
        }),
        new Paragraph({ text: "", spacing: { after: 200 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          heading: HeadingLevel.HEADING_1,
          children: [
            new TextRun({ text: "DANH SÁCH TỔNG HỢP ĐĂNG KÝ THĂM QUÂN NHÂN", bold: true, size: 32, color: "000000" }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: `Ngày báo cáo: ${date}`, italics: true, size: 22 }),
          ],
        }),
        new Paragraph({ text: "", spacing: { after: 400 } }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            // Header Row
            new TableRow({
              children: [
                createHeaderCell("STT", 5),
                createHeaderCell("Họ tên Thân nhân", 20),
                createHeaderCell("SĐT", 15),
                createHeaderCell("Quân nhân được thăm", 20),
                createHeaderCell("Đơn vị cụ thể", 15),
                createHeaderCell("Thời gian", 15),
                createHeaderCell("Trạng thái", 10),
              ],
            }),
            // Data Rows
            ...requests.map((req, index) => new TableRow({
              children: [
                createDataCell((index + 1).toString(), AlignmentType.CENTER),
                createDataCell(req.visitorName),
                createDataCell(req.visitorPhone, AlignmentType.CENTER),
                createDataCell(req.soldierName),
                createDataCell(`${req.specificUnit} - ${req.parentUnit}`),
                createDataCell(req.timeSlot, AlignmentType.CENTER),
                createDataCell(STATUS_MAP[req.status].label, AlignmentType.CENTER),
              ],
            })),
          ],
        }),
        new Paragraph({ text: "", spacing: { before: 600 } }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: `Ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${new Date().getFullYear()}`, italics: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "CÁN BỘ PHỤ TRÁCH", bold: true }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "(Ký, ghi rõ họ tên)", size: 18 }),
          ],
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Bao_cao_dang_ky_tham_${unitName.replace(/\s+/g, '_')}_${date.replace(/\//g, '-')}.docx`);
};

function createHeaderCell(text: string, widthPercent: number) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20 })], alignment: AlignmentType.CENTER })],
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: "f2f2f2" },
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
  });
}

function createDataCell(text: string, alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: 18 })], alignment })],
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 100, bottom: 100, left: 100, right: 100 },
  });
}
