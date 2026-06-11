/**
 * TomCodeX Academy — Certificate Generator
 * Draws a premium certificate on an HTML Canvas and downloads it as a PNG.
 * No external dependencies required.
 */

const CERT_W = 1400;
const CERT_H = 990;

function generateCertificateId(studentName, courseId) {
  const raw = `${studentName}-${courseId}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (Math.imul(31, hash) + raw.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `TCX-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
  return currentY;
}

export async function generateCertificate({ studentName, courseName, verifiedSkills, issueDate, certId }) {
  const canvas = document.createElement("canvas");
  canvas.width = CERT_W;
  canvas.height = CERT_H;
  const ctx = canvas.getContext("2d");

  // ── Background ──────────────────────────────────────────────────────────────
  // Deep navy base
  const bg = ctx.createLinearGradient(0, 0, CERT_W, CERT_H);
  bg.addColorStop(0, "#041f2e");
  bg.addColorStop(0.5, "#062c3a");
  bg.addColorStop(1, "#051a27");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Radial glow top-right
  const glow1 = ctx.createRadialGradient(CERT_W * 0.78, CERT_H * 0.18, 0, CERT_W * 0.78, CERT_H * 0.18, 420);
  glow1.addColorStop(0, "rgba(98,214,255,0.18)");
  glow1.addColorStop(1, "rgba(98,214,255,0)");
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // Radial glow bottom-left (lime)
  const glow2 = ctx.createRadialGradient(CERT_W * 0.12, CERT_H * 0.82, 0, CERT_W * 0.12, CERT_H * 0.82, 320);
  glow2.addColorStop(0, "rgba(216,255,95,0.14)");
  glow2.addColorStop(1, "rgba(216,255,95,0)");
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, CERT_W, CERT_H);

  // ── Outer border ────────────────────────────────────────────────────────────
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 28, 28, CERT_W - 56, CERT_H - 56, 32);
  ctx.stroke();

  // Inner double border line
  ctx.strokeStyle = "rgba(216,255,95,0.25)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, 44, 44, CERT_W - 88, CERT_H - 88, 24);
  ctx.stroke();

  // ── Left accent bar ─────────────────────────────────────────────────────────
  const accentBar = ctx.createLinearGradient(80, 120, 80, CERT_H - 120);
  accentBar.addColorStop(0, "rgba(216,255,95,0)");
  accentBar.addColorStop(0.3, "#d8ff5f");
  accentBar.addColorStop(0.7, "#62d6ff");
  accentBar.addColorStop(1, "rgba(98,214,255,0)");
  ctx.fillStyle = accentBar;
  ctx.fillRect(80, 120, 4, CERT_H - 240);

  // ── Header: Academy label ───────────────────────────────────────────────────
  ctx.fillStyle = "#62d6ff";
  ctx.font = "bold 18px 'Arial', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.textAlign = "center";
  ctx.fillText("TOMCODEX AI ACADEMY", CERT_W / 2, 118);

  // Separator line under header
  const sepGrad = ctx.createLinearGradient(CERT_W * 0.2, 0, CERT_W * 0.8, 0);
  sepGrad.addColorStop(0, "rgba(98,214,255,0)");
  sepGrad.addColorStop(0.5, "rgba(98,214,255,0.5)");
  sepGrad.addColorStop(1, "rgba(98,214,255,0)");
  ctx.strokeStyle = sepGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CERT_W * 0.2, 132);
  ctx.lineTo(CERT_W * 0.8, 132);
  ctx.stroke();

  // ── Certificate of Completion title ─────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "500 22px 'Arial', sans-serif";
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE OF COMPLETION", CERT_W / 2, 185);

  // ── "This is to certify that" ────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "italic 20px 'Georgia', serif";
  ctx.letterSpacing = "0px";
  ctx.textAlign = "center";
  ctx.fillText("This is to certify that", CERT_W / 2, 260);

  // ── Student name ─────────────────────────────────────────────────────────────
  // Name glow
  ctx.shadowColor = "#d8ff5f";
  ctx.shadowBlur = 30;
  ctx.fillStyle = "#d8ff5f";
  ctx.font = "bold 72px 'Georgia', serif";
  ctx.letterSpacing = "0px";
  ctx.textAlign = "center";
  ctx.fillText(studentName || "Academy Graduate", CERT_W / 2, 360);
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";

  // Name underline
  const nameWidth = Math.min(ctx.measureText(studentName || "Academy Graduate").width + 80, 700);
  const nameLineGrad = ctx.createLinearGradient(CERT_W / 2 - nameWidth / 2, 0, CERT_W / 2 + nameWidth / 2, 0);
  nameLineGrad.addColorStop(0, "rgba(216,255,95,0)");
  nameLineGrad.addColorStop(0.5, "#d8ff5f");
  nameLineGrad.addColorStop(1, "rgba(216,255,95,0)");
  ctx.strokeStyle = nameLineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(CERT_W / 2 - nameWidth / 2, 375);
  ctx.lineTo(CERT_W / 2 + nameWidth / 2, 375);
  ctx.stroke();

  // ── "has successfully completed" ─────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = "italic 20px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("has successfully completed all required modules of", CERT_W / 2, 430);

  // ── Course name ───────────────────────────────────────────────────────────────
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px 'Arial', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(courseName || "Salesforce Admin Foundation", CERT_W / 2, 490);

  // ── Divider ───────────────────────────────────────────────────────────────────
  const div2 = ctx.createLinearGradient(CERT_W * 0.25, 0, CERT_W * 0.75, 0);
  div2.addColorStop(0, "rgba(255,255,255,0)");
  div2.addColorStop(0.5, "rgba(255,255,255,0.15)");
  div2.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = div2;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(CERT_W * 0.25, 515);
  ctx.lineTo(CERT_W * 0.75, 515);
  ctx.stroke();

  // ── Verified Skills grid ──────────────────────────────────────────────────────
  const skills = Array.isArray(verifiedSkills) ? verifiedSkills : [];
  if (skills.length > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "bold 13px 'Arial', sans-serif";
    ctx.letterSpacing = "2px";
    ctx.textAlign = "center";
    ctx.fillText("VERIFIED SKILLS", CERT_W / 2, 550);

    const cols = Math.min(skills.length, 3);
    const colW = 380;
    const startX = CERT_W / 2 - ((cols - 1) * colW) / 2;
    const rows = Math.ceil(skills.length / cols);
    const rowH = 38;

    skills.forEach((skill, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = startX + col * colW;
      const y = 580 + row * rowH;

      // Pill background
      const pillW = 340;
      const pillH = 28;
      drawRoundedRect(ctx, x - pillW / 2, y - 18, pillW, pillH, 14);
      ctx.fillStyle = "rgba(98,214,255,0.12)";
      ctx.fill();
      ctx.strokeStyle = "rgba(98,214,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "#62d6ff";
      ctx.font = "600 13px 'Arial', sans-serif";
      ctx.letterSpacing = "0px";
      ctx.textAlign = "center";
      ctx.fillText(`✓  ${skill}`, x, y);
    });
  }

  // ── Bottom section: metadata ──────────────────────────────────────────────────
  const bottomY = CERT_H - 185;

  // Left: Issue date
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "bold 11px 'Arial', sans-serif";
  ctx.letterSpacing = "2px";
  ctx.textAlign = "center";
  ctx.fillText("DATE OF ISSUE", 300, bottomY);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 18px 'Arial', sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText(issueDate || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), 300, bottomY + 30);

  // Center: Seal circle
  const cx = CERT_W / 2;
  const cy = bottomY + 20;
  const outerR = 68;

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  const sealBg = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
  sealBg.addColorStop(0, "#087ea4");
  sealBg.addColorStop(1, "#041f2e");
  ctx.fillStyle = sealBg;
  ctx.fill();
  ctx.strokeStyle = "#d8ff5f";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(cx, cy, outerR - 10, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(216,255,95,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Star rays
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * (outerR - 10), cy + Math.sin(angle) * (outerR - 10));
    ctx.lineTo(cx + Math.cos(angle) * (outerR - 5), cy + Math.sin(angle) * (outerR - 5));
    ctx.strokeStyle = "rgba(216,255,95,0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Seal text
  ctx.fillStyle = "#d8ff5f";
  ctx.font = "bold 26px 'Georgia', serif";
  ctx.textAlign = "center";
  ctx.fillText("✓", cx, cy + 4);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "bold 10px 'Arial', sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText("VERIFIED", cx, cy + 22);

  // Right: Certificate ID
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.font = "bold 11px 'Arial', sans-serif";
  ctx.letterSpacing = "2px";
  ctx.textAlign = "center";
  ctx.fillText("CERTIFICATE ID", CERT_W - 300, bottomY);
  ctx.fillStyle = "#62d6ff";
  ctx.font = "600 17px 'Arial', sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillText(certId, CERT_W - 300, bottomY + 30);

  // ── Signature line ────────────────────────────────────────────────────────────
  const sigY = CERT_H - 100;
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(200, sigY);
  ctx.lineTo(500, sigY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CERT_W - 500, sigY);
  ctx.lineTo(CERT_W - 200, sigY);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "13px 'Georgia', serif";
  ctx.letterSpacing = "0px";
  ctx.textAlign = "center";
  ctx.fillText("Tom Codex", 350, sigY + 22);
  ctx.fillText("Academy Director, TomCodeX", 350, sigY + 38);
  ctx.fillText("AI Academy Programme", CERT_W - 350, sigY + 22);
  ctx.fillText("Curriculum & Certification", CERT_W - 350, sigY + 38);

  // ── Bottom watermark ──────────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = "12px 'Arial', sans-serif";
  ctx.letterSpacing = "1px";
  ctx.textAlign = "center";
  ctx.fillText("academytcx.vercel.app  ·  Powered by TomCodeX AI Academy", CERT_W / 2, CERT_H - 52);

  return canvas;
}

export async function downloadCertificate(options) {
  const canvas = await generateCertificate(options);
  const link = document.createElement("a");
  link.download = `TomCodeX-Certificate-${options.certId || "Academy"}.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

export async function showCertificatePreview(options, containerId) {
  const canvas = await generateCertificate(options);
  canvas.style.cssText = "max-width:100%;height:auto;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5);";
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = "";
    container.appendChild(canvas);
  }
  return canvas;
}
