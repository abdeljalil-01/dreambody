import { MEAL_TYPES } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import type { PdfMealPlanData } from "@/lib/meal-plan-utils";

function buildPrintableHtml(data: PdfMealPlanData): string {
  const mealsHtml = MEAL_TYPES.map(({ value, label }) => {
    const meal = data.plan[value];
    return `
      <div style="margin-bottom: 8px; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px;">
          <div style="flex: 1; min-width: 0;">
            <p style="margin: 0 0 2px; font-size: 9px; color: #16a34a; font-weight: 600;">${label}</p>
            <p style="margin: 0; font-size: 12px; font-weight: 700; line-height: 1.3;">${meal.name}</p>
            <p style="margin: 2px 0 0; font-size: 10px; color: #6b7280; line-height: 1.4;">${meal.ingredients}</p>
          </div>
          <div style="flex-shrink: 0; font-size: 9px; text-align: left; color: #374151; white-space: nowrap;">
            <div>${formatNumber(meal.calories)} kcal</div>
            <div>ب ${formatNumber(meal.protein)}g · ك ${formatNumber(meal.carbs)}g · د ${formatNumber(meal.fat)}g</div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; width: 595px; padding: 20px 24px; background: #ffffff; color: #111827; box-sizing: border-box;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
        <h1 style="margin: 0; font-size: 18px; font-weight: 800;">${data.title}</h1>
        ${data.date ? `<p style="margin: 0; font-size: 10px; color: #6b7280;">${data.date}</p>` : ""}
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
        <div style="padding: 8px; background: #f0fdf4; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 9px; color: #6b7280;">السعرات</p>
          <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700;">${formatNumber(data.calories)}</p>
        </div>
        <div style="padding: 8px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 9px; color: #6b7280;">البروتين</p>
          <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700;">${formatNumber(data.protein)}g</p>
        </div>
        <div style="padding: 8px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 9px; color: #6b7280;">الكربوهيدرات</p>
          <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700;">${formatNumber(data.carbs)}g</p>
        </div>
        <div style="padding: 8px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-size: 9px; color: #6b7280;">الدهون</p>
          <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700;">${formatNumber(data.fat)}g</p>
        </div>
      </div>
      <h2 style="margin: 0 0 8px; font-size: 13px; font-weight: 700;">الوجبات</h2>
      ${mealsHtml}
      <p style="margin-top: 10px; font-size: 9px; color: #9ca3af; text-align: center;">تم إنشاؤه بواسطة DreamBody</p>
    </div>
  `;
}

export async function downloadMealPlanPdf(data: PdfMealPlanData, filename?: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.innerHTML = buildPrintableHtml(data);
  document.body.appendChild(container);

  try {
    const element = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    let imgWidth = maxWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > maxHeight) {
      imgHeight = maxHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    pdf.addImage(imgData, "PNG", x, margin, imgWidth, imgHeight);

    const datePart = data.date?.replace(/\s/g, "-") ?? "program";
    pdf.save(filename ?? `dreambody-${datePart}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
