// Ausführen mit: npm test  (Node ≥ 23 lädt .ts-Dateien direkt)
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ACCENT_PRESETS,
  contrastRatio,
  DEFAULT_ACCENT,
  getContrastForeground,
  isHexColor,
  normalizeHex,
  safeAccent,
} from "./color.ts";

test("isHexColor akzeptiert nur 6-stellige Hex-Werte", () => {
  for (const valid of ["#4f46e5", "#FFFFFF", "#a1B2c3"]) {
    assert.equal(isHexColor(valid), true, valid);
  }
  for (const invalid of [
    "red;} body{background:url(x)}",
    "url(x)",
    "#FFF",
    "#12345g",
    "red",
    "4f46e5",
    "#4f46e5 ",
    " #4f46e5",
    "#4f46e5;",
    "#4f46e5\n",
    "",
    null,
    undefined,
    123456,
  ]) {
    assert.equal(isHexColor(invalid), false, String(invalid));
  }
});

test("normalizeHex wandelt in Kleinbuchstaben um", () => {
  assert.equal(normalizeHex("#A1B2C3"), "#a1b2c3");
});

test("safeAccent fällt bei ungültigen Werten auf den Default zurück", () => {
  assert.equal(safeAccent("#DB2777"), "#db2777");
  assert.equal(safeAccent("red;} body{}"), DEFAULT_ACCENT);
  assert.equal(safeAccent("url(x)"), DEFAULT_ACCENT);
  assert.equal(safeAccent(null), DEFAULT_ACCENT);
});

test("contrastRatio entspricht bekannten WCAG-Werten", () => {
  assert.equal(contrastRatio("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(contrastRatio("#777777", "#ffffff").toFixed(2), "4.48");
});

test("getContrastForeground: Weiß nur bei Kontrast ≥ 4.5", () => {
  assert.equal(getContrastForeground("#000000"), "#ffffff");
  assert.equal(getContrastForeground("#ffffff"), "#0a0a0a");
  assert.equal(getContrastForeground("#777777"), "#0a0a0a");
  // Ungültige Eingabe → Kontrast der Default-Farbe statt Absturz
  assert.equal(getContrastForeground("url(x)"), getContrastForeground(DEFAULT_ACCENT));
});

test("alle 10 Presets haben lesbaren Button-Text (Kontrast ≥ 4.5)", () => {
  assert.equal(ACCENT_PRESETS.length, 10);
  for (const { name, value } of ACCENT_PRESETS) {
    const ratio = contrastRatio(value, getContrastForeground(value));
    assert.ok(ratio >= 4.5, `${name} ${value}: ${ratio.toFixed(2)}`);
  }
});
