from pathlib import Path


def main() -> None:
    import fitz

    sample_dir = Path(__file__).resolve().parents[1] / "samples"
    resume_text = (sample_dir / "sample_resume.txt").read_text(encoding="utf-8")
    output = sample_dir / "sample_resume.pdf"

    doc = fitz.open()
    page = doc.new_page()
    rect = fitz.Rect(48, 48, 548, 780)
    page.insert_textbox(rect, resume_text, fontsize=10, fontname="helv", lineheight=1.2)
    doc.save(output)
    doc.close()
    print(f"Created {output}")


if __name__ == "__main__":
    main()
