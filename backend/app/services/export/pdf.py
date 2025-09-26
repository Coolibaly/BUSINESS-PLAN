# app/export/pdf.py
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from datetime import datetime
import os

EXPORT_DIR = "data/exports/pdf"
os.makedirs(EXPORT_DIR, exist_ok=True)

def generate_pdf(plan_title: str, sections: list[str], filename: str) -> str:
    path = os.path.join(EXPORT_DIR, filename)
    doc = SimpleDocTemplate(path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph(f"<b>Business Plan – {plan_title}</b>", styles["Title"]))
    story.append(Spacer(1, 20))

    for section in sections:
        story.append(Paragraph(section, styles["BodyText"]))
        story.append(Spacer(1, 12))

    doc.build(story)
    return path
