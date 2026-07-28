#!/usr/bin/env python3
"""Generate src/lib/content/dog-breeds.ts from English breed list."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads/message.txt"
OUT = ROOT / "src/lib/content/dog-breeds.ts"

CHAR: dict[str, str] = {
    "a": "ა", "b": "ბ", "c": "კ", "d": "დ", "e": "ე", "f": "ფ", "g": "გ", "h": "ჰ",
    "i": "ი", "j": "ჯ", "k": "კ", "l": "ლ", "m": "მ", "n": "ნ", "o": "ო", "p": "პ",
    "q": "კ", "r": "რ", "s": "ს", "t": "ტ", "u": "უ", "v": "ვ", "w": "უ", "x": "ქს",
    "y": "ი", "z": "ზ",
}


def transliterate(text: str) -> str:
    cleaned = text.replace("'", "")
    out: list[str] = []
    for ch in cleaned:
        low = ch.lower()
        if low in CHAR:
            out.append(CHAR[low])
        elif ch == "-":
            out.append("-")
        elif ch == " ":
            out.append(" ")
    return re.sub(r"\s+", " ", "".join(out)).strip()


# Well-known breeds with standard Georgian names (not phonetic).
EXACT: dict[str, str] = {
    "Afghan Hound": "ავღანური ბრწყინვალე",
    "Airedale Terrier": "ერდეილის ტერიერი",
    "Akita": "აკიტა",
    "Alaskan Malamute": "ალასკის მალამუტი",
    "American Akita": "ამერიკული აკიტა",
    "American Bully": "ამერიკული ბული",
    "American Cocker Spaniel": "ამერიკული კოკერ-სპანიელი",
    "American English Coonhound": "ამერიკული ინგლისური კუნჰაუნდი",
    "American Foxhound": "ამერიკული ფოქსჰაუნდი",
    "American Hairless Terrier": "ამერიკული უთმოსი ტერიერი",
    "American Staffordshire Terrier": "ამერიკული სტაფორდშირის ტერიერი",
    "American Water Spaniel": "ამერიკული წყლის სპანიელი",
    "Anatolian Shepherd Dog": "ანატოლიის ნაგაზი",
    "Australian Cattle Dog": "ავსტრალიური საქონლის ძაღლი",
    "Australian Terrier": "ავსტრალიული ტერიერი",
    "Azawakh": "აზავაკი",
    "Beagle": "ბიგლი",
    "Beagle-Harrier": "ბიგლ-ჰარიერი",
    "Border Collie": "ბორდერ კოლი",
    "Boxer": "ბოქსერი",
    "Bull Terrier": "ბულ ტერიერი",
    "Bulldog": "ბულდოგი",
    "Cane Corso": "კანე კორსო",
    "Caucasian Shepherd Dog": "კავკასიური ნაგაზი",
    "Central Asian Shepherd Dog": "ცენტრალურაზიის ნაგაზი",
    "Chihuahua": "ჩიხუახუა",
    "Chow Chow": "ჩაუ-ჩაუ",
    "Cocker Spaniel": "კოკერ-სპანიელი",
    "Dachshund": "მალიაშის ძაღლი",
    "Dobermann": "დობერმანი",
    "English Cocker Spaniel": "ინგლისური კოკერ-სპანიელი",
    "English Foxhound": "ინგლისური ფოქსჰაუნდი",
    "English Pointer": "ინგლისური პოინტერი",
    "English Setter": "ინგლისური სეტერი",
    "French Bulldog": "ფრანღული ბულდოგი",
    "German Shepherd Dog": "გერმანული ნაგაზი",
    "Golden Retriever": "გოლდენ რეტრივერი",
    "Labrador Retriever": "ლაბრადორი",
    "Poodle Standard": "სტანდარტული პუდელი",
    "Poodle Miniature": "მინიატურე პუდელი",
    "Poodle Toy": "თოი პუდელი",
    "Rottweiler": "როტქსილერი",
    "Siberian Husky": "სიბირული ჰასკი",
    "Weimaraner": "ვაიმარანერი",
    "White Swiss Shepherd Dog": "თეთრი შვეიცარიული ნაგაზი",
    "Yorkshire Terrier": "იორქშირული ტერიერი",
}


def to_ka(en: str) -> str:
    return EXACT.get(en, transliterate(en))


def main() -> None:
    breeds_en: list[str] = json.loads(SOURCE.read_text())
    pairs = [{"en": en, "ka": to_ka(en)} for en in breeds_en]

    seen: set[str] = set()
    for p in pairs:
        ka = p["ka"]
        if ka in seen:
            p["ka"] = f"{ka} ({transliterate(p['en'])})"
        seen.add(p["ka"])

    pairs.append({"en": "Mixed Breed", "ka": "მეტისი / შერეული"})

    lines = [
        "/** Dog breeds — English (FCI) + Georgian labels. */",
        "export interface DogBreed { en: string; ka: string; }",
        "",
        "export const DOG_BREEDS: DogBreed[] = [",
    ]
    for p in pairs:
        en = p["en"].replace("\\", "\\\\").replace('"', '\\"')
        ka = p["ka"].replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'  {{ en: "{en}", ka: "{ka}" }},')
    lines += [
        "] as const;",
        "",
        'export const MIXED_BREED_KA = "მეტისი / შერეული" as const;',
        "export const BREED_LABELS: string[] = DOG_BREEDS.map((b) => b.ka);",
        "",
        "export function searchDogBreeds(query: string): DogBreed[] {",
        "  const q = query.trim().toLowerCase();",
        "  if (!q) return [...DOG_BREEDS];",
        "  return DOG_BREEDS.filter(",
        "    (b) => b.ka.toLowerCase().includes(q) || b.en.toLowerCase().includes(q),",
        "  );",
        "}",
        "",
    ]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(pairs)} breeds to {OUT}")


if __name__ == "__main__":
    main()
