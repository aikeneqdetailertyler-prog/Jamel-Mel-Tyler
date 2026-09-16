import { SimulatorMode, DefectPin, VehicleType } from '../types';

export interface VehicleRenderOptions {
  canvas: HTMLCanvasElement;
  mode: SimulatorMode;
  vehicleType: VehicleType;
  bodyColor: string;
  pins: DefectPin[];
  selectedPinId: string | null;
  hoverPinId: string | null;
}

export function renderVehicleCanvas({
  canvas,
  mode,
  vehicleType,
  bodyColor,
  pins,
  selectedPinId,
  hoverPinId,
}: VehicleRenderOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // 1. Studio Technical Blueprint Backdrop
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#0F172A'); // Slate 900
  bgGrad.addColorStop(1, '#020617'); // Slate 950
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Technical Blueprint Grid Lines
  ctx.save();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Circular target rings in center
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.5, w * 0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Render Vehicle Schema (Exterior vs Interior)
  if (mode === 'exterior') {
    if (vehicleType === 'horse_trailer') {
      drawExteriorHorseTrailer(ctx, w, h, bodyColor);
    } else {
      drawExteriorVehicle(ctx, w, h, vehicleType, bodyColor);
    }
  } else {
    if (vehicleType === 'horse_trailer') {
      drawInteriorHorseTrailer(ctx, w, h);
    } else {
      drawInteriorCabin(ctx, w, h);
    }
  }

  // 3. Render Pins
  const currentModePins = pins.filter((p) => p.mode === mode);
  drawDefectPins(ctx, w, h, currentModePins, selectedPinId, hoverPinId);
}

/** ---------------- EXTERIOR VEHICLE DRAWING ---------------- **/
function drawExteriorVehicle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vType: VehicleType,
  color: string
) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.save();

  // Floor Shadow under Car
  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.filter = 'blur(16px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.26, w * 0.42, h * 0.07, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';

  // Car Side Profile Silhouette
  ctx.beginPath();

  // Wheels Cutout Geometry
  const wheelY = cy + h * 0.19;
  const frontWheelX = cx - w * 0.27;
  const rearWheelX = cx + w * 0.27;
  const wheelRadius = w * 0.085;

  // Front bumper
  ctx.moveTo(cx - w * 0.44, wheelY);
  ctx.quadraticCurveTo(cx - w * 0.45, cy + h * 0.06, cx - w * 0.41, cy + h * 0.02);
  // Hood slope
  ctx.lineTo(cx - w * 0.23, cy - h * 0.06);
  // Windshield
  ctx.lineTo(cx - w * 0.09, cy - h * 0.22);
  // Roofline
  ctx.lineTo(cx + w * 0.16, cy - h * 0.22);
  // Rear Windshield
  ctx.lineTo(cx + w * 0.33, cy - h * 0.04);
  // Trunk Deck
  ctx.lineTo(cx + w * 0.43, cy - h * 0.02);
  // Rear Bumper
  ctx.quadraticCurveTo(cx + w * 0.45, cy + h * 0.12, cx + w * 0.42, wheelY);

  // Bottom rocker panel with wheel arch curves
  // Rear wheel arch
  ctx.arc(rearWheelX, wheelY, wheelRadius, 0, Math.PI, true);
  // Rocker panel between wheels
  ctx.lineTo(frontWheelX + wheelRadius, wheelY);
  // Front wheel arch
  ctx.arc(frontWheelX, wheelY, wheelRadius, 0, Math.PI, true);
  ctx.lineTo(cx - w * 0.44, wheelY);
  ctx.closePath();

  // Base Body Color
  ctx.fillStyle = color;
  ctx.fill();

  // Metallic reflection & panel gradient
  const carGrad = ctx.createLinearGradient(0, cy - h * 0.25, 0, cy + h * 0.22);
  carGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  carGrad.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)');
  carGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.1)');
  carGrad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  ctx.fillStyle = carGrad;
  ctx.fill();

  // Panel Seams & Character Lines
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.lineWidth = 2.5;

  // Front Fender Seam
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.23, cy - h * 0.06);
  ctx.lineTo(cx - w * 0.23, wheelY - wheelRadius * 0.7);
  ctx.stroke();

  // Front Driver Door Seam
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.09, cy - h * 0.22);
  ctx.lineTo(cx - w * 0.13, cy + h * 0.18);
  ctx.stroke();

  // B-Pillar / Rear Door Seam
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.04, cy - h * 0.22);
  ctx.lineTo(cx + w * 0.04, cy + h * 0.18);
  ctx.stroke();

  // Rear Door / Quarter Panel Seam
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.17, cy - h * 0.2);
  ctx.quadraticCurveTo(cx + w * 0.19, cy + h * 0.04, cx + w * 0.21, wheelY - wheelRadius * 0.7);
  ctx.stroke();

  // Trunk Seam
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.33, cy - h * 0.04);
  ctx.lineTo(cx + w * 0.38, cy + h * 0.08);
  ctx.stroke();

  // Windows / Greenhouse (Tinted Glass)
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.07, cy - h * 0.2);
  ctx.lineTo(cx + w * 0.15, cy - h * 0.2);
  ctx.lineTo(cx + w * 0.27, cy - h * 0.05);
  ctx.lineTo(cx - w * 0.18, cy - h * 0.05);
  ctx.closePath();
  ctx.fillStyle = '#0F172A';
  ctx.fill();

  // Window Tint Sheen
  const glassGrad = ctx.createLinearGradient(cx - w * 0.2, cy - h * 0.2, cx + w * 0.3, cy - h * 0.05);
  glassGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  glassGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.85)');
  glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
  ctx.fillStyle = glassGrad;
  ctx.fill();

  // Window Pillar Dividers
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.03, cy - h * 0.2);
  ctx.lineTo(cx + w * 0.03, cy - h * 0.05);
  ctx.stroke();

  // Headlight (LED glow)
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.42, cy + h * 0.02);
  ctx.lineTo(cx - w * 0.36, cy + h * 0.02);
  ctx.lineTo(cx - w * 0.38, cy + h * 0.08);
  ctx.closePath();
  ctx.fillStyle = '#E0F2FE';
  ctx.fill();
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Taillight (Red LED)
  ctx.beginPath();
  ctx.moveTo(cx + w * 0.43, cy - h * 0.01);
  ctx.lineTo(cx + w * 0.38, cy + h * 0.01);
  ctx.lineTo(cx + w * 0.42, cy + h * 0.06);
  ctx.closePath();
  ctx.fillStyle = '#DC2626';
  ctx.fill();
  ctx.shadowColor = '#EF4444';
  ctx.shadowBlur = 8;
  ctx.strokeStyle = '#EF4444';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Wheels (Tires & Multi-Spoke Rims)
  drawWheel(ctx, frontWheelX, wheelY, wheelRadius);
  drawWheel(ctx, rearWheelX, wheelY, wheelRadius);

  // Door handles
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(cx - w * 0.05, cy - h * 0.03, w * 0.035, h * 0.015, 3);
  ctx.roundRect(cx + w * 0.1, cy - h * 0.03, w * 0.035, h * 0.015, 3);
  ctx.fill();

  // Panel labels (subtle holographic overlay)
  ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HOOD / BUMPER', cx - w * 0.32, cy - h * 0.1);
  ctx.fillText('DRIVER DOOR', cx - w * 0.04, cy + h * 0.08);
  ctx.fillText('REAR DOOR', cx + w * 0.11, cy + h * 0.08);
  ctx.fillText('QUARTER PANEL', cx + w * 0.28, cy - h * 0.08);

  ctx.restore();
}

function drawWheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  // Tire Rubber
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#334155';
  ctx.stroke();

  // Tread rings
  ctx.beginPath();
  ctx.arc(x, y, r * 0.92, 0, Math.PI * 2);
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Alloy Rim
  ctx.beginPath();
  ctx.arc(x, y, r * 0.68, 0, Math.PI * 2);
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#94A3B8';
  ctx.stroke();

  // Brake rotor & caliper
  ctx.beginPath();
  ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
  ctx.fillStyle = '#64748B';
  ctx.fill();

  // Red performance brake caliper
  ctx.beginPath();
  ctx.arc(x, y, r * 0.48, -Math.PI * 0.2, Math.PI * 0.2);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#DC2626';
  ctx.stroke();

  // Rim Spokes (5-spoke star)
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#CBD5E1';
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * r * 0.66, y + Math.sin(angle) * r * 0.66);
    ctx.stroke();
  }

  // Center cap
  ctx.beginPath();
  ctx.arc(x, y, r * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.restore();
}

/** ---------------- EQUESTRIAN HORSE TRAILER EXTERIOR DRAWING ---------------- **/
function drawExteriorHorseTrailer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color: string
) {
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.save();

  // Floor Shadow under Trailer
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.filter = 'blur(16px)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.28, w * 0.44, h * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.filter = 'none';

  // Trailer Tandem Wheel Geometry
  const wheelY = cy + h * 0.21;
  const wheelRadius = w * 0.07;
  const wheel1X = cx + w * 0.17;
  const wheel2X = cx + w * 0.31;

  // Trailer Body Bounds
  const bodyTopY = cy - h * 0.24;
  const bodyBottomY = wheelY;
  const noseStartX = cx - w * 0.44;
  const gooseneckDropX = cx - w * 0.28;
  const trailerRearX = cx + w * 0.43;

  // Outer Silhouette of Gooseneck Horse Trailer
  ctx.beginPath();
  // Front coupler hitch
  ctx.moveTo(noseStartX, cy - h * 0.04);
  // Nose front curve
  ctx.quadraticCurveTo(noseStartX - w * 0.01, bodyTopY + h * 0.02, noseStartX + w * 0.04, bodyTopY);
  // Aerodynamic Roofline to rear
  ctx.lineTo(trailerRearX, bodyTopY);
  // Rear loading door / ramp top to bottom
  ctx.lineTo(trailerRearX, bodyBottomY);
  // Bottom deck going forward towards rear wheel
  ctx.lineTo(wheel2X + wheelRadius + 4, bodyBottomY);
  // Rear wheel arch
  ctx.arc(wheel2X, bodyBottomY, wheelRadius + 6, 0, Math.PI, true);
  // Space between tandem axles
  ctx.lineTo(wheel1X + wheelRadius + 6, bodyBottomY);
  // Front wheel arch
  ctx.arc(wheel1X, bodyBottomY, wheelRadius + 6, 0, Math.PI, true);
  // Main chassis bottom deck
  ctx.lineTo(gooseneckDropX, bodyBottomY);
  // Gooseneck drop-down bulkhead to truck bed level
  ctx.lineTo(gooseneckDropX, cy - h * 0.04);
  // Gooseneck bottom floor extending forward
  ctx.lineTo(noseStartX, cy - h * 0.04);
  ctx.closePath();

  // Base Aluminum / Paint Finish
  ctx.fillStyle = color;
  ctx.fill();

  // Metallic Brushed Aluminum Sheen Overlay
  const aluminumGrad = ctx.createLinearGradient(0, bodyTopY, 0, bodyBottomY);
  aluminumGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  aluminumGrad.addColorStop(0.15, 'rgba(255, 255, 255, 0.15)');
  aluminumGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.08)');
  aluminumGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.15)');
  aluminumGrad.addColorStop(1, 'rgba(15, 23, 42, 0.55)');
  ctx.fillStyle = aluminumGrad;
  ctx.fill();

  // Diamond Plate Rock Guard on Front Lower Nose
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(noseStartX, cy - h * 0.04);
  ctx.lineTo(noseStartX, cy - h * 0.14);
  ctx.lineTo(gooseneckDropX, cy - h * 0.14);
  ctx.lineTo(gooseneckDropX, cy - h * 0.04);
  ctx.closePath();
  ctx.fillStyle = '#94A3B8';
  ctx.fill();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Criss-cross diamond plate pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 1;
  for (let px = noseStartX + 8; px < gooseneckDropX; px += 14) {
    ctx.beginPath();
    ctx.moveTo(px, cy - h * 0.14);
    ctx.lineTo(px + 10, cy - h * 0.04);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + 10, cy - h * 0.14);
    ctx.lineTo(px, cy - h * 0.04);
    ctx.stroke();
  }
  ctx.restore();

  // Gooseneck Coupler Stem & Electric Jack Leg (drops to hitch ball)
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(noseStartX + w * 0.03, cy - h * 0.04, w * 0.024, h * 0.22);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(noseStartX + w * 0.03, cy - h * 0.04, w * 0.024, h * 0.22);
  // Jack Foot Pad
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(noseStartX + w * 0.018, cy + h * 0.17, w * 0.048, h * 0.02);

  // Extruded Corrugated Aluminum Lower Side Slats (Acid Flush Zone)
  const slatStartY = cy;
  const slatEndY = bodyBottomY - 4;
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(gooseneckDropX + 4, slatStartY, (trailerRearX - gooseneckDropX) - 8, slatEndY - slatStartY);

  ctx.strokeStyle = 'rgba(100, 116, 139, 0.7)';
  ctx.lineWidth = 1.5;
  for (let sy = slatStartY; sy < slatEndY; sy += 10) {
    ctx.beginPath();
    ctx.moveTo(gooseneckDropX + 4, sy);
    ctx.lineTo(trailerRearX - 4, sy);
    ctx.stroke();
  }

  // Living Quarters Forward Section (gooseneckDropX to cx - w * 0.06)
  // Living Quarters Horizontal Tinted Window
  const lqWinX = gooseneckDropX + w * 0.03;
  const lqWinY = bodyTopY + h * 0.08;
  const lqWinW = w * 0.09;
  const lqWinH = h * 0.09;
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.roundRect(lqWinX, lqWinY, lqWinW, lqWinH, 6);
  ctx.fill();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Window divider & reflection
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lqWinX + lqWinW * 0.5, lqWinY);
  ctx.lineTo(lqWinX + lqWinW * 0.5, lqWinY + lqWinH);
  ctx.stroke();

  // Living Quarters Entry Door
  const lqDoorX = gooseneckDropX + w * 0.13;
  const lqDoorY = bodyTopY + h * 0.06;
  const lqDoorW = w * 0.07;
  const lqDoorH = bodyBottomY - lqDoorY - 8;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(lqDoorX, lqDoorY, lqDoorW, lqDoorH, [6, 6, 0, 0]);
  ctx.stroke();
  // Door RV window
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.roundRect(lqDoorX + w * 0.012, lqDoorY + h * 0.03, lqDoorW - w * 0.024, h * 0.07, 4);
  ctx.fill();
  ctx.stroke();
  // Paddle latch & fold-out step
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(lqDoorX + lqDoorW - 8, lqDoorY + lqDoorH * 0.48, 6, 12);
  // Aluminum fold-out step under door
  ctx.fillStyle = '#64748B';
  ctx.fillRect(lqDoorX + 4, bodyBottomY, lqDoorW - 8, 8);

  // Side Tack Room Access Door (cx - w * 0.05 to cx + w * 0.04)
  const tackDoorX = cx - w * 0.05;
  const tackDoorY = bodyTopY + h * 0.08;
  const tackDoorW = w * 0.075;
  const tackDoorH = bodyBottomY - tackDoorY - 8;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(tackDoorX, tackDoorY, tackDoorW, tackDoorH);
  // Tack room louvered air vents
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  for (let vy = tackDoorY + 12; vy < tackDoorY + 45; vy += 6) {
    ctx.beginPath();
    ctx.moveTo(tackDoorX + 8, vy);
    ctx.lineTo(tackDoorX + tackDoorW - 8, vy);
    ctx.stroke();
  }
  // Tack door flush latch
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(tackDoorX + tackDoorW - 8, tackDoorY + tackDoorH * 0.45, 6, 14);

  // Horse Stall Section (cx + w * 0.04 to trailerRearX)
  // Drop-down Feed Windows (2 stalls)
  const stall1WinX = cx + w * 0.04;
  const stall2WinX = cx + w * 0.17;
  const stallWinY = bodyTopY + h * 0.06;
  const stallWinW = w * 0.095;
  const stallWinH = h * 0.12;

  [stall1WinX, stall2WinX].forEach((winX) => {
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(winX, stallWinY, stallWinW, stallWinH, 6);
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Drop-down face protection bars
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    for (let bx = winX + 12; bx < winX + stallWinW - 8; bx += 14) {
      ctx.beginPath();
      ctx.moveTo(bx, stallWinY + 4);
      ctx.lineTo(bx, stallWinY + stallWinH - 4);
      ctx.stroke();
    }
  });

  // Stainless Steel Horse Tie Rings along exterior wall
  const tieRingPositions = [cx + w * 0.03, cx + w * 0.15, cx + w * 0.28];
  tieRingPositions.forEach((tx) => {
    ctx.beginPath();
    ctx.arc(tx, cy + h * 0.02, 6, 0, Math.PI * 2);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  });

  // Rear Loading Ramp Frame & Heavy Assist Springs
  const rampX = trailerRearX - 8;
  const rampY = bodyTopY + h * 0.04;
  const rampH = bodyBottomY - rampY;
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(rampX, rampY, 8, rampH);
  // Rubber Dock Bumper blocks
  ctx.fillStyle = '#020617';
  ctx.fillRect(trailerRearX - 4, bodyBottomY - 20, 10, 16);
  // Heavy coil spring at ramp base
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(trailerRearX - 4, bodyBottomY - 4, 8, 0, Math.PI * 2);
  ctx.stroke();

  // Roof Pop-Up Ventilation Scoops & Black-Streak Rain Gutter
  ctx.fillStyle = '#475569';
  ctx.fillRect(noseStartX + w * 0.04, bodyTopY - 4, (trailerRearX - noseStartX) - w * 0.04, 4);
  // Pop-up scoops over stalls
  ctx.beginPath();
  ctx.moveTo(stall1WinX + w * 0.02, bodyTopY - 4);
  ctx.lineTo(stall1WinX + w * 0.05, bodyTopY - 14);
  ctx.lineTo(stall1WinX + w * 0.07, bodyTopY - 4);
  ctx.fillStyle = '#E2E8F0';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(stall2WinX + w * 0.02, bodyTopY - 4);
  ctx.lineTo(stall2WinX + w * 0.05, bodyTopY - 14);
  ctx.lineTo(stall2WinX + w * 0.07, bodyTopY - 4);
  ctx.fill();

  // Tandem Heavy-Duty Trailer Axles & Wheels
  drawTrailerWheel(ctx, wheel1X, wheelY, wheelRadius);
  drawTrailerWheel(ctx, wheel2X, wheelY, wheelRadius);

  // Technical Blueprint Annotations
  ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DIAMOND PLATE GRAVEL GUARD', noseStartX + w * 0.08, cy - h * 0.16);
  ctx.fillText('LIVING QUARTERS', gooseneckDropX + w * 0.08, bodyTopY + h * 0.04);
  ctx.fillText('TACK ROOM DOOR', tackDoorX + tackDoorW * 0.5, bodyTopY + h * 0.04);
  ctx.fillText('ALUMINUM SLATS & DROP WINDOWS (ACID FLUSH ZONE)', cx + w * 0.15, bodyTopY + h * 0.04);
  ctx.fillText('TANDEM TORSION AXLES', (wheel1X + wheel2X) * 0.5, wheelY + wheelRadius + 22);
  ctx.fillText('SPRING-ASSIST RAMP', trailerRearX + 4, cy);

  ctx.restore();
}

function drawTrailerWheel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  // Tire Rubber
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#334155';
  ctx.stroke();

  // Heavy Trailer Tread
  ctx.beginPath();
  ctx.arc(x, y, r * 0.9, 0, Math.PI * 2);
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Alloy Rim
  ctx.beginPath();
  ctx.arc(x, y, r * 0.68, 0, Math.PI * 2);
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#64748B';
  ctx.stroke();

  // 8-Lug Heavy-Duty Hub Pattern
  ctx.beginPath();
  ctx.arc(x, y, r * 0.32, 0, Math.PI * 2);
  ctx.fillStyle = '#334155';
  ctx.fill();

  ctx.fillStyle = '#F8FAFC';
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const lx = x + Math.cos(angle) * r * 0.44;
    const ly = y + Math.sin(angle) * r * 0.44;
    ctx.beginPath();
    ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Grease Cap Center
  ctx.beginPath();
  ctx.arc(x, y, r * 0.14, 0, Math.PI * 2);
  ctx.fillStyle = '#0F172A';
  ctx.fill();
  ctx.restore();
}

/** ---------------- EQUESTRIAN HORSE TRAILER INTERIOR FLOORPLAN DRAWING ---------------- **/
function drawInteriorHorseTrailer(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const cw = w * 0.88;
  const ch = h * 0.72;

  ctx.save();

  // Trailer Floorplan Outer Wall Boundary
  const startX = cx - cw * 0.5;
  const startY = cy - ch * 0.5;

  ctx.beginPath();
  ctx.roundRect(startX, startY, cw, ch, [24, 16, 16, 24]);
  ctx.fillStyle = '#09090B'; // Base dark trailer floor
  ctx.fill();
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#475569';
  ctx.stroke();

  // Sub-divide into 3 major compartments:
  // 1. Living Quarters: startX to startX + cw * 0.34
  // 2. Mid Tack Room: startX + cw * 0.34 to startX + cw * 0.52
  // 3. Horse Stall Bays: startX + cw * 0.52 to startX + cw
  const lqEndX = startX + cw * 0.34;
  const tackEndX = startX + cw * 0.52;

  // Solid Bulkhead Walls
  ctx.strokeStyle = '#71717A';
  ctx.lineWidth = 4;
  // Wall between Living Quarters and Tack Room
  ctx.beginPath();
  ctx.moveTo(lqEndX, startY);
  ctx.lineTo(lqEndX, startY + ch);
  ctx.stroke();

  // Wall between Tack Room and Horse Stalls
  ctx.beginPath();
  ctx.moveTo(tackEndX, startY);
  ctx.lineTo(tackEndX, startY + ch);
  ctx.stroke();

  // --- ZONE 1: LIVING QUARTERS (FORWARD LEFT) ---
  // Wood-look / Vinyl floor texture in Living Quarters
  ctx.fillStyle = '#27272A';
  ctx.fillRect(startX + 4, startY + 4, (lqEndX - startX) - 8, ch - 8);

  // Floor plank lines
  ctx.strokeStyle = 'rgba(63, 63, 70, 0.7)';
  ctx.lineWidth = 1;
  for (let py = startY + 16; py < startY + ch - 8; py += 18) {
    ctx.beginPath();
    ctx.moveTo(startX + 6, py);
    ctx.lineTo(lqEndX - 6, py);
    ctx.stroke();
  }

  // Bunk Bed / Mattress Platform in Gooseneck (Top section of Living Quarters)
  const bedX = startX + 10;
  const bedY = startY + 10;
  const bedW = cw * 0.16;
  const bedH = ch * 0.52;
  ctx.beginPath();
  ctx.roundRect(bedX, bedY, bedW, bedH, 8);
  ctx.fillStyle = '#3F3F46';
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Bed Pillow graphics
  ctx.fillStyle = '#E4E4E7';
  ctx.beginPath();
  ctx.roundRect(bedX + 8, bedY + 8, bedW - 16, 26, 4);
  ctx.fill();
  // Quilt folding lines
  ctx.strokeStyle = '#52525B';
  ctx.lineWidth = 1;
  for (let qy = bedY + 48; qy < bedY + bedH - 8; qy += 18) {
    ctx.beginPath();
    ctx.moveTo(bedX + 8, qy);
    ctx.lineTo(bedX + bedW - 8, qy);
    ctx.stroke();
  }

  // Dinette Table & Booth Cushions (Lower Left of Living Quarters)
  const dinetteX = startX + 10;
  const dinetteY = startY + ch * 0.6;
  const dinetteW = cw * 0.16;
  const dinetteH = ch * 0.36;
  // Left bench
  ctx.fillStyle = '#52525B';
  ctx.fillRect(dinetteX, dinetteY, 22, dinetteH);
  // Right bench
  ctx.fillRect(dinetteX + dinetteW - 22, dinetteY, 22, dinetteH);
  // Table in middle
  ctx.fillStyle = '#A1A1AA';
  ctx.fillRect(dinetteX + 26, dinetteY + 6, dinetteW - 52, dinetteH - 12);
  ctx.strokeStyle = '#D4D4D8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(dinetteX + 26, dinetteY + 6, dinetteW - 52, dinetteH - 12);

  // Kitchenette Counter & RV Bathroom (Right side of Living Quarters)
  const kitX = bedX + bedW + 8;
  const kitW = (lqEndX - kitX) - 8;
  // Kitchen counter
  ctx.fillStyle = '#3F3F46';
  ctx.fillRect(kitX, startY + 10, kitW, ch * 0.44);
  ctx.strokeStyle = '#71717A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(kitX, startY + 10, kitW, ch * 0.44);
  // Stainless Sink
  ctx.beginPath();
  ctx.arc(kitX + kitW * 0.5, startY + 36, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();
  ctx.stroke();
  // Faucet
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(kitX + kitW * 0.5 - 2, startY + 16, 4, 12);

  // RV Bathroom / Shower Stall (Lower right of Living Quarters)
  const bathY = startY + ch * 0.52;
  const bathH = ch * 0.44;
  ctx.fillStyle = '#18181B';
  ctx.fillRect(kitX, bathY, kitW, bathH);
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(kitX, bathY, kitW, bathH);
  // Shower drain & pan
  ctx.fillStyle = '#3F3F46';
  ctx.fillRect(kitX + 6, bathY + 6, kitW - 12, bathH * 0.55);
  ctx.beginPath();
  ctx.arc(kitX + kitW * 0.5, bathY + bathH * 0.28, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#CBD5E1';
  ctx.fill();

  // --- ZONE 2: MID TACK ROOM (MIDDLE SECTION) ---
  const tackX = lqEndX + 4;
  const tackW = (tackEndX - tackX) - 4;
  ctx.fillStyle = '#1E1E24';
  ctx.fillRect(tackX, startY + 4, tackW, ch - 8);

  // Tack Room Rubber Ribbed Mat
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1.5;
  for (let ty = startY + 10; ty < startY + ch - 8; ty += 12) {
    ctx.beginPath();
    ctx.moveTo(tackX + 6, ty);
    ctx.lineTo(tackX + tackW - 6, ty);
    ctx.stroke();
  }

  // 3-Tier Swivel Saddle Tree Racks (Left wall of tack room)
  for (let s = 0; s < 3; s++) {
    const sY = startY + 38 + s * 55;
    ctx.fillStyle = '#78350F'; // Leather-look saddle tree
    ctx.beginPath();
    ctx.roundRect(tackX + 12, sY, tackW * 0.52, 28, 8);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // Swivel mount bracket
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(tackX + 6, sY + 8, 8, 12);
  }

  // Bridle Hook Wall (Right wall of tack room) with hanging straps
  for (let b = 0; b < 5; b++) {
    const bY = startY + 28 + b * 42;
    // Hook
    ctx.beginPath();
    ctx.arc(tackX + tackW - 12, bY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F59E0B';
    ctx.fill();
    // Leather strap hanging down
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(tackX + tackW - 12, bY);
    ctx.lineTo(tackX + tackW - 12, bY + 22);
    ctx.stroke();
  }

  // Tack Trunk Box (Lower tack room)
  ctx.fillStyle = '#312E81'; // Navy tack trunk
  ctx.beginPath();
  ctx.roundRect(tackX + 12, startY + ch - 60, tackW - 24, 46, 6);
  ctx.fill();
  ctx.strokeStyle = '#6366F1';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // --- ZONE 3: HORSE STALL BAYS (REAR SECTION) ---
  const stallX = tackEndX + 4;
  const stallW = (startX + cw) - stallX - 8;
  // Stall sub-floor (aluminum deck with drain channels)
  ctx.fillStyle = '#18181B';
  ctx.fillRect(stallX, startY + 4, stallW, ch - 8);

  // Sub-Floor Aluminum Drainage Channels (Acid Flush Zone indicator)
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.lineWidth = 2;
  for (let dx = stallX + 16; dx < stallX + stallW - 12; dx += 24) {
    ctx.beginPath();
    ctx.moveTo(dx, startY + 6);
    ctx.lineTo(dx, startY + ch - 6);
    ctx.stroke();
  }

  // Heavy Vulcanized Rubber Stall Mats (Cutaway showing Pulled Mat Status)
  // Stall 1 (Forward Stall) Mat
  const stall1MatX = stallX + 8;
  const stall1MatY = startY + 8;
  const stall1MatW = stallW * 0.44;
  const stall1MatH = ch - 16;
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(stall1MatX, stall1MatY, stall1MatW, stall1MatH, 6);
  ctx.fill();
  ctx.strokeStyle = '#059669'; // Green border indicating mat inspection
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Stall 2 (Rear Stall) Mat
  const stall2MatX = stallX + stallW * 0.48;
  const stall2MatY = startY + 8;
  const stall2MatW = stallW * 0.44;
  const stall2MatH = ch - 16;
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.roundRect(stall2MatX, stall2MatY, stall2MatW, stall2MatH, 6);
  ctx.fill();
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Slanted Padded Butt & Chest Dividers
  // Divider 1 (between tack wall and stall 1)
  drawPaddedStallDivider(ctx, stallX + 14, startY + ch * 0.15, stallX + stallW * 0.44, startY + ch * 0.85);
  // Divider 2 (between stall 1 and stall 2)
  drawPaddedStallDivider(ctx, stallX + stallW * 0.46, startY + ch * 0.15, stallX + stallW * 0.88, startY + ch * 0.85);

  // Rubber Wall Kick Mats along side walls
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(stallX, startY + 4, stallW, 10);
  ctx.fillRect(stallX, startY + ch - 14, stallW, 10);

  // Rear Fold-Down Ramp Deck with Rubber Traction Cleats
  const rampDeckX = startX + cw;
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.roundRect(rampDeckX, startY + 12, w * 0.04, ch - 24, [0, 8, 8, 0]);
  ctx.fill();
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Traction cleats on ramp deck
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2;
  for (let ry = startY + 24; ry < startY + ch - 24; ry += 16) {
    ctx.beginPath();
    ctx.moveTo(rampDeckX + 4, ry);
    ctx.lineTo(rampDeckX + w * 0.04 - 4, ry);
    ctx.stroke();
  }

  // Zone Label Banners (Blueprint Typography)
  ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
  ctx.font = 'bold 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LIVING QUARTERS (BUNK, DINETTE & RV SHOWER)', startX + cw * 0.17, startY - 8);
  ctx.fillText('MID TACK ROOM', (lqEndX + tackEndX) * 0.5, startY - 8);
  ctx.fillText('HORSE STALL BAYS (PULLED MATS & ACID FLUSH FLOOR)', stallX + stallW * 0.5, startY - 8);

  ctx.fillStyle = 'rgba(52, 211, 153, 0.75)';
  ctx.font = '9px monospace';
  ctx.fillText('MAT PULLING INSPECTION ZONE', stall1MatX + stall1MatW * 0.5, startY + ch * 0.5);
  ctx.fillText('SUB-FLOOR ACID FLUSH ZONE', stall2MatX + stall2MatW * 0.5, startY + ch * 0.5);

  ctx.restore();
}

function drawPaddedStallDivider(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  ctx.save();
  // Steel divider bar
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Padded chest/butt center pad
  const midX = (x1 + x2) * 0.5;
  const midY = (y1 + y2) * 0.5;
  ctx.beginPath();
  ctx.arc(midX, midY, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#D97706'; // Padded amber cushion
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#F59E0B';
  ctx.stroke();

  // Quick-release slam latch pin
  ctx.beginPath();
  ctx.arc(x2, y2, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#EF4444';
  ctx.fill();
  ctx.restore();
}

/** ---------------- INTERIOR CABIN DRAWING ---------------- **/
function drawInteriorCabin(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const cw = w * 0.76;
  const ch = h * 0.74;

  ctx.save();

  // Cabin Outer Border (Bird's-Eye Floorplan Cutaway)
  ctx.beginPath();
  ctx.roundRect(cx - cw * 0.5, cy - ch * 0.5, cw, ch, [32, 32, 24, 24]);
  ctx.fillStyle = '#18181B'; // Dark cabin flooring
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#3F3F46';
  ctx.stroke();

  // Carpet Texture / Floor Weave Lines
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 1;
  for (let y = cy - ch * 0.48; y < cy + ch * 0.48; y += 16) {
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.46, y);
    ctx.lineTo(cx + cw * 0.46, y);
    ctx.stroke();
  }

  // Dashboard & Windshield Area (Front Top)
  ctx.beginPath();
  ctx.roundRect(cx - cw * 0.46, cy - ch * 0.48, cw * 0.92, ch * 0.15, [20, 20, 8, 8]);
  ctx.fillStyle = '#27272A';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#52525B';
  ctx.stroke();

  // Steering Wheel (Driver Left Front)
  const steerX = cx - cw * 0.25;
  const steerY = cy - ch * 0.38;
  ctx.beginPath();
  ctx.arc(steerX, steerY, cw * 0.07, 0, Math.PI * 2);
  ctx.lineWidth = 4.5;
  ctx.strokeStyle = '#E4E4E7';
  ctx.stroke();

  // Center Console Screen & Controls
  ctx.beginPath();
  ctx.roundRect(cx - cw * 0.08, cy - ch * 0.46, cw * 0.16, ch * 0.12, 4);
  ctx.fillStyle = '#09090B';
  ctx.fill();
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Center Transmission Tunnel & Cup Holders
  ctx.beginPath();
  ctx.roundRect(cx - cw * 0.07, cy - ch * 0.32, cw * 0.14, ch * 0.38, 8);
  ctx.fillStyle = '#27272A';
  ctx.fill();
  ctx.strokeStyle = '#3F3F46';
  ctx.stroke();

  // Dual Cup Holders
  ctx.fillStyle = '#09090B';
  ctx.beginPath();
  ctx.arc(cx, cy - ch * 0.22, cw * 0.035, 0, Math.PI * 2);
  ctx.arc(cx, cy - ch * 0.13, cw * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#52525B';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Front Driver Seat (Left)
  drawSeat(ctx, cx - cw * 0.25, cy - ch * 0.16, cw * 0.18, ch * 0.26, 'DRIVER SEAT');

  // Front Passenger Seat (Right)
  drawSeat(ctx, cx + cw * 0.25, cy - ch * 0.16, cw * 0.18, ch * 0.26, 'PASSENGER SEAT');

  // Driver Footwell / Carpet Zone
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(cx - cw * 0.36, cy - ch * 0.32, cw * 0.22, ch * 0.12);
  // Passenger Footwell / Carpet Zone
  ctx.strokeRect(cx + cw * 0.14, cy - ch * 0.32, cw * 0.22, ch * 0.12);
  ctx.setLineDash([]);

  // Rear Cabin Bench Seat
  ctx.beginPath();
  ctx.roundRect(cx - cw * 0.42, cy + ch * 0.22, cw * 0.84, ch * 0.22, 14);
  ctx.fillStyle = '#3F3F46';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#71717A';
  ctx.stroke();

  // Rear Seat Headrests & Dividers
  ctx.strokeStyle = '#27272A';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - cw * 0.14, cy + ch * 0.22);
  ctx.lineTo(cx - cw * 0.14, cy + ch * 0.44);
  ctx.moveTo(cx + cw * 0.14, cy + ch * 0.22);
  ctx.lineTo(cx + cw * 0.14, cy + ch * 0.44);
  ctx.stroke();

  // Text Zone Labels
  ctx.fillStyle = 'rgba(212, 212, 216, 0.45)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FRONT DRIVER CARPET', cx - cw * 0.25, cy - ch * 0.34);
  ctx.fillText('FRONT PASSENGER CARPET', cx + cw * 0.25, cy - ch * 0.34);
  ctx.fillText('REAR PASSENGER BENCH & FOOTWELLS', cx, cy + ch * 0.18);

  ctx.restore();
}

function drawSeat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string
) {
  ctx.save();
  // Seat Bottom Cushion
  ctx.beginPath();
  ctx.roundRect(x - w * 0.5, y - h * 0.5, w, h, 14);
  ctx.fillStyle = '#3F3F46';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#71717A';
  ctx.stroke();

  // Seat Bolsters / Stitching Curves
  ctx.strokeStyle = '#52525B';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Left bolster
  ctx.roundRect(x - w * 0.44, y - h * 0.44, w * 0.2, h * 0.88, 8);
  // Right bolster
  ctx.roundRect(x + w * 0.24, y - h * 0.44, w * 0.2, h * 0.88, 8);
  ctx.stroke();

  // Seat label
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 3);

  ctx.restore();
}

/** ---------------- DEFECT & STAIN PINS DRAWING ---------------- **/
function drawDefectPins(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pins: DefectPin[],
  selectedPinId: string | null,
  hoverPinId: string | null
) {
  pins.forEach((pin, index) => {
    const px = (pin.x / 100) * w;
    const py = (pin.y / 100) * h;
    const isSelected = pin.id === selectedPinId;
    const isHovered = pin.id === hoverPinId;

    ctx.save();

    // Pulse Ring for selected/hovered pin
    if (isSelected || isHovered) {
      ctx.beginPath();
      ctx.arc(px, py, 22, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? 'rgba(239, 68, 68, 0.35)' : 'rgba(56, 189, 248, 0.3)';
      ctx.fill();
    }

    // Pin Base Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(px, py + 3, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pin Badge
    ctx.beginPath();
    ctx.arc(px, py, isSelected ? 14 : 11, 0, Math.PI * 2);

    // Color based on severity & defect
    let pinColor = '#E11D48'; // Red
    if (pin.severity === 'minor') pinColor = '#F59E0B'; // Amber
    if (pin.severity === 'moderate') pinColor = '#E11D48'; // Red
    if (pin.severity === 'severe') pinColor = '#7F1D1D'; // Deep dark red

    ctx.fillStyle = pinColor;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Number text inside pin
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${index + 1}`, px, py);

    // Label banner over pin
    if (isSelected || isHovered) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 1;
      const text = `#${index + 1} ${pin.name} (${pin.severity})`;
      ctx.font = 'bold 10px sans-serif';
      const textWidth = ctx.measureText(text).width;

      const tagX = px - textWidth * 0.5 - 8;
      const tagY = py - 32;
      ctx.beginPath();
      ctx.roundRect(tagX, tagY, textWidth + 16, 20, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(text, tagX + 8, tagY + 5);
    }

    ctx.restore();
  });
}

/**
 * Given click coordinates (x%, y%), returns an inferred panel name
 */
export function identifyPanel(
  mode: SimulatorMode,
  x: number,
  y: number,
  vType?: VehicleType
): string {
  if (vType === 'horse_trailer') {
    if (mode === 'exterior') {
      if (x < 22) return 'Gooseneck Coupler & Diamond Plate Gravel Guard';
      if (x >= 22 && x < 40 && y < 50) return 'Living Quarters Camper Window & Roof Seam';
      if (x >= 22 && x < 40 && y >= 50) return 'Living Quarters Entry Door & Step';
      if (x >= 40 && x < 54) return 'Side Tack Room Access Door & Latches';
      if (x >= 56 && x < 84 && y >= 58) return 'Tandem Heavy-Duty Trailer Axles & Rims';
      if (x >= 54 && x < 78 && y < 58) return 'Horse Stall Drop Windows & Aluminum Slats (Acid Flush Zone)';
      if (x >= 78 && y >= 45) return 'Rear Horse Loading Ramp & Spring Latches';
      if (x >= 78 && y < 45) return 'Rear Horse Gate Doors & Cam Latch Hardware';
      if (y < 25) return 'Trailer Aluminum Roof Sheet & Rain Gutters';
      return 'Trailer Aluminum Corrugated Side Panel';
    } else {
      if (x < 35 && y < 50) return 'Living Quarters - Bunk Mattress & Sleeper';
      if (x < 35 && y >= 50) return 'Living Quarters - Dinette, Kitchenette & RV Shower';
      if (x >= 35 && x < 52 && y < 50) return 'Tack Room - Saddle Racks & Bridle Hooks';
      if (x >= 35 && x < 52 && y >= 50) return 'Tack Room - Flooring & Cobweb Extraction';
      if (x >= 52 && x < 72 && y < 50) return 'Horse Stall #1 - Padded Chest Bar & Window';
      if (x >= 52 && x < 72 && y >= 50) return 'Horse Stall #1 - Rubber Floor Mat (Pulled) & Sub-Floor';
      if (x >= 72 && x < 88 && y < 50) return 'Horse Stall #2 - Padded Butt Divider & Slam Latch';
      if (x >= 72 && x < 88 && y >= 50) return 'Horse Stall #2 - Sub-Floor Acid Flush & Ammonia Drain';
      if (x >= 88) return 'Rear Loading Ramp Deck & Rubber Traction Cleats';
      return 'Horse Stall Interior Bay & Rubber Kick Mat';
    }
  }

  if (mode === 'exterior') {
    // Check for wheel & rim regions
    if (x >= 16 && x <= 32 && y >= 58) return 'Front Alloy Rim & Tire';
    if (x >= 68 && x <= 86 && y >= 58) return 'Rear Alloy Rim & Tire';

    if (x < 24) return 'Front Bumper & Grille (Bug Zone)';
    if (x < 42 && y < 50) return 'Hood Panel';
    if (x < 42 && y >= 50) return 'Front Driver Fender';
    if (x >= 42 && x < 60 && y < 45) return 'Windshield & Roof';
    if (x >= 42 && x < 60 && y >= 45 && y <= 55 && x >= 46 && x <= 52) return 'Driver Door Handle & Jamb';
    if (x >= 42 && x < 60 && y >= 45) return 'Driver Front Door Panel';
    if (x >= 60 && x < 76 && y < 45) return 'Rear Glass & Roof';
    if (x >= 60 && x < 76 && y >= 45 && y <= 55 && x >= 68 && x <= 74) return 'Rear Door Handle & Jamb';
    if (x >= 60 && x < 76 && y >= 45) return 'Driver Rear Door Panel';
    if (x >= 76 && x < 88) return 'Rear Quarter Panel';
    return 'Rear Bumper & Trunk Lid';
  } else {
    // Upper region can be headliner or front footwells depending on Y
    if (y < 16) return 'Overhead Headliner & Sunroof Trim';
    if (y >= 16 && y < 32) {
      if (x >= 35 && x <= 65) return 'Dashboard & AC Air Vents';
      if (x < 50) return 'Front Driver Carpet & Dead Pedal';
      return 'Front Passenger Carpet & Footwell';
    }
    if (y >= 32 && y < 65) {
      if (x >= 42 && x <= 58) return 'Center Console & Cup Holder Wells';
      if (x < 42) return 'Front Driver Leather/Cloth Seat & Bolster';
      return 'Front Passenger Leather/Cloth Seat & Bolster';
    }
    if (x < 38) return 'Rear Driver Side Floor Carpet & Seat';
    if (x > 62) return 'Rear Passenger Side Floor Carpet & Seat';
    return 'Rear Center Bench & Carpet';
  }
}
