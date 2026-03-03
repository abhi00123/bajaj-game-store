import { useRef, useCallback, useEffect, useState } from 'react';
import { useGame, GAME_STATUS } from '../context/GameContext';
import {
    CANVAS_WIDTH, CANVAS_HEIGHT,
    PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_Y, PLAYER_SPEED, PLAYER_LANE_PADDING,
    MAX_LIVES, LIFE_REGEN_TIME,
    RISK_SIZE, RISK_INITIAL_SPEED, RISK_MAX_SPEED,
    RISK_SPAWN_INTERVAL_INITIAL, RISK_SPAWN_INTERVAL_MIN,
    PHASE_1_END, PHASE_2_END, CRASH_TRIGGER_MIN, CRASH_TRIGGER_MAX,
    CAR_WIDTH, CAR_HEIGHT, CAR_SPEED,
    SCORE_PER_SECOND, RISK_TYPES, COLORS,
} from '../constants/constants';

/* ================================================================
   STATIC PREMIUM SCENE DATA
   ================================================================ */
const W = CANVAS_WIDTH;
const H = CANVAS_HEIGHT;
const ROAD_TOP = H * 0.72;

// Soft premium clouds
const CLOUDS = Array.from({ length: 12 }, (_, i) => ({
    x: Math.random() * W * 2,
    y: 10 + Math.random() * 120,
    w: 80 + Math.random() * 100,
    h: 25 + Math.random() * 30,
    speed: 0.05 + Math.random() * 0.15,
    op: 0.15 + Math.random() * 0.4,
}));

// Procedural premium buildings
function makeBuilding(w, h, styleIdx, hasWindows = true) {
    const cols = Math.floor(w / 18);
    const rows = Math.floor(h / 26);
    const wins = [];
    if (hasWindows) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.25) wins.push({ r, c, lit: Math.random() > 0.4 });
            }
        }
    }
    return { w, h, styleIdx, cols, rows, wins, roofType: Math.floor(Math.random() * 3), details: Math.random() > 0.5 };
}

// 3 Layers of depth + atmospheric perspective
const SKYLINE_BLDGS = [
    makeBuilding(60, 220, 0, false), makeBuilding(50, 280, 1, false), makeBuilding(70, 240, 0, false),
    makeBuilding(55, 190, 1, false), makeBuilding(80, 320, 0, false), makeBuilding(65, 260, 1, false),
    makeBuilding(75, 300, 0, false), makeBuilding(55, 210, 1, false)
];

const MID_BLDGS = [
    makeBuilding(70, 200, 2), makeBuilding(65, 250, 3), makeBuilding(75, 180, 2),
    makeBuilding(90, 290, 3), makeBuilding(60, 210, 2), makeBuilding(85, 260, 3),
    makeBuilding(70, 190, 2)
];

// Sharp detailed foreground edge
const FORE_BLDGS = [
    makeBuilding(90, 120, 4), makeBuilding(110, 150, 4), makeBuilding(85, 90, 4),
    makeBuilding(120, 140, 4)
];

// Road Asphalt noise texture points
const NOISE_POINTS = Array.from({ length: 150 }, () => ({
    x: Math.random() * W,
    y: Math.random() * (H - ROAD_TOP),
    op: Math.random() * 0.05
}));

export const useGameEngine = () => {
    const {
        setStatus, setScore, setLives, setPhase,
        setElapsedTime, incrementDodgeStreak, resetDodgeStreak,
        triggerCrash, lives, score, comboMultiplier,
    } = useGame();

    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const lastTimeRef = useRef(0);
    const lastSpawnTimeRef = useRef(0);
    const lastScoreTimeRef = useRef(0);
    const elapsedRef = useRef(0);

    const playerRef = useRef({ x: W / 2 - PLAYER_WIDTH / 2, y: PLAYER_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, animPhase: 0, bounce: 0 });
    const risksRef = useRef([]);
    const particlesRef = useRef([]);
    const sparkRef = useRef([]);
    const carRef = useRef(null);

    const livesRef = useRef(MAX_LIVES);
    const scoreRef = useRef(0);
    const comboRef = useRef(1);

    const isCrashingRef = useRef(false);
    const screenShakeRef = useRef(0);
    const slowMoRef = useRef(false);
    const crashTriggeredRef = useRef(false);
    const isPausedRef = useRef(false);

    // Parallax
    const bgScrollRef = useRef([0, 0, 0, 0, 0]); // sky, mid, fore, lane, clouds
    const glowTimeRef = useRef(0);
    const lastHitTimeRef = useRef(0);
    const lastHeartbeatTimeRef = useRef(0);
    const crashTimeRef = useRef(CRASH_TRIGGER_MIN + Math.random() * (CRASH_TRIGGER_MAX - CRASH_TRIGGER_MIN));

    const moveDirectionRef = useRef(0);
    const touchStartRef = useRef(null);

    // States
    const [heartShake, setHeartShake] = useState(false);
    const [isCrashing, setIsCrashing] = useState(false);
    const [screenShake, setScreenShake] = useState(0);

    // Audio Context for Heartbeat
    const audioCtxRef = useRef(null);
    const playHeartbeat = useCallback(() => {
        try {
            if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();

            const osc = audioCtxRef.current.createOscillator();
            const gain = audioCtxRef.current.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(50, audioCtxRef.current.currentTime);
            osc.frequency.exponentialRampToValueAtTime(30, audioCtxRef.current.currentTime + 0.1);

            gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
            gain.gain.linearRampToValueAtTime(0.7, audioCtxRef.current.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(audioCtxRef.current.destination);

            osc.start();
            osc.stop(audioCtxRef.current.currentTime + 0.3);
        } catch (e) { console.error('Audio failed', e); }
    }, []);

    // ─── INPUTS ───────────────────────────────────────────────
    const handleTouchStart = useCallback(e => { e.preventDefault(); const t = e.touches[0]; touchStartRef.current = { x: t.clientX, y: t.clientY }; const r = canvasRef.current?.getBoundingClientRect(); if (r) moveDirectionRef.current = (t.clientX - r.left) < r.width / 2 ? -1 : 1; }, []);
    const handleTouchEnd = useCallback(e => { e.preventDefault(); moveDirectionRef.current = 0; touchStartRef.current = null; }, []);
    const handleTouchMove = useCallback(e => { e.preventDefault(); if (touchStartRef.current && canvasRef.current) moveDirectionRef.current = (e.touches[0].clientX - canvasRef.current.getBoundingClientRect().left) < canvasRef.current.clientWidth / 2 ? -1 : 1; }, []);
    const handleKeyDown = useCallback(e => { if (['ArrowLeft', 'a'].includes(e.key)) moveDirectionRef.current = -1; if (['ArrowRight', 'd'].includes(e.key)) moveDirectionRef.current = 1; }, []);
    const handleKeyUp = useCallback(e => { if (['ArrowLeft', 'a', 'ArrowRight', 'd'].includes(e.key)) moveDirectionRef.current = 0; }, []);

    // ─── SPAWNING ─────────────────────────────────────────────
    const spawnRisk = useCallback(() => {
        const type = RISK_TYPES[Math.floor(Math.random() * RISK_TYPES.length)];
        const x = PLAYER_LANE_PADDING + Math.random() * (W - PLAYER_LANE_PADDING * 2 - RISK_SIZE);
        const speed = RISK_INITIAL_SPEED + Math.random() * (RISK_MAX_SPEED - RISK_INITIAL_SPEED) * 1.5;
        risksRef.current.push({ x, y: -RISK_SIZE - 20, width: RISK_SIZE, height: RISK_SIZE, speed, type, floatAnim: Math.random() * 10, dodged: false });
    }, []);

    const spawnImpactParticles = useCallback((x, y, color) => {
        for (let i = 0; i < 20; i++) {
            particlesRef.current.push({ x, y, vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.8) * 12, life: 1, color, size: 3 + Math.random() * 5 });
        }
    }, []);

    // ─── SYMBOL DRAWING HELPERS ────────────────────────────────
    const drawCustomSymbol = useCallback((ctx, id, x, y, size) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#FFF';
        ctx.strokeStyle = '#FFF';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const s = size * 0.45;

        if (id === 'medical') {
            // Shiny Cross
            ctx.beginPath();
            ctx.roundRect(-s * 0.2, -s, s * 0.4, s * 2, 2);
            ctx.roundRect(-s, -s * 0.2, s * 2, s * 0.4, 2);
            ctx.fill();
        } else if (id === 'loan') {
            // Folded document
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.roundRect(-s * 0.6, -s * 0.8, s * 1.2, s * 1.6, 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-s * 0.3, -s * 0.3); ctx.lineTo(s * 0.3, -s * 0.3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-s * 0.3, 0); ctx.lineTo(s * 0.3, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-s * 0.3, s * 0.3); ctx.lineTo(0, s * 0.3); ctx.stroke();
        } else if (id === 'accident') {
            // Warning Triangle
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(s * 0.9, s * 0.7); ctx.lineTo(-s * 0.9, s * 0.7); ctx.closePath(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -s * 0.3); ctx.lineTo(0, s * 0.2); ctx.stroke();
            ctx.beginPath(); ctx.arc(0, s * 0.5, 1.5, 0, Math.PI * 2); ctx.fill();
        } else if (id === 'illness') {
            // Pill capsule
            ctx.rotate(Math.PI / 4);
            ctx.beginPath(); ctx.arc(0, -s * 0.4, s * 0.4, Math.PI, 0); ctx.lineTo(s * 0.4, 0); ctx.lineTo(-s * 0.4, 0); ctx.fill();
            ctx.fillStyle = '#E2E8F0';
            ctx.beginPath(); ctx.arc(0, s * 0.4, s * 0.4, 0, Math.PI); ctx.lineTo(-s * 0.4, 0); ctx.lineTo(s * 0.4, 0); ctx.fill();
        }
        ctx.restore();
    }, []);

    // ─── RENDERING ────────────────────────────────────────────

    const drawBackgroundLayers = useCallback((ctx) => {
        // Flat sky to vertical gradient: Dark navy top -> Bajaj blue mid -> Lighter horizon
        const sky = ctx.createLinearGradient(0, 0, 0, ROAD_TOP + 40);
        sky.addColorStop(0, '#06183A'); // Dark navy
        sky.addColorStop(0.5, COLORS.SKY_MID); // Bajaj blue mid
        sky.addColorStop(1, '#8ABCE3'); // Lighter horizon
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Soft Clouds
        const coff = bgScrollRef.current[4];
        CLOUDS.forEach(c => {
            let cx = (c.x - coff * c.speed) % (W + c.w * 2);
            if (cx < -c.w) cx += W + c.w * 2;
            ctx.fillStyle = COLORS.WHITE;
            ctx.globalAlpha = c.op;
            ctx.beginPath();
            ctx.ellipse(cx, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
            ctx.ellipse(cx - c.w * 0.25, c.y + 6, c.w * 0.35, c.h * 0.4, 0, 0, Math.PI * 2);
            ctx.ellipse(cx + c.w * 0.3, c.y + 4, c.w * 0.3, c.h * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }, []);

    const drawCityLayer = useCallback((ctx, bldgs, baseTint, winLit, winDark, xOffset, scale, isSilhouette = false) => {
        let bx = -20;
        bldgs.forEach(b => {
            const top = ROAD_TOP - b.h * scale;
            const bw = b.w * scale;

            // Base shadow/gradient for buildings
            if (!isSilhouette) {
                const bGrad = ctx.createLinearGradient(bx - xOffset * 0.1, top, bx - xOffset * 0.1, ROAD_TOP);
                bGrad.addColorStop(0, baseTint);
                bGrad.addColorStop(1, '#1A2942');
                ctx.fillStyle = bGrad;
            } else {
                ctx.fillStyle = baseTint;
            }
            ctx.fillRect(bx - xOffset * 0.1, top, bw, b.h * scale);

            if (b.roofType === 1) { ctx.beginPath(); ctx.moveTo(bx - xOffset * 0.1, top); ctx.lineTo(bx - xOffset * 0.1 + bw / 2, top - 20 * scale); ctx.lineTo(bx - xOffset * 0.1 + bw, top); ctx.fill(); }
            else { ctx.fillRect(bx - xOffset * 0.1 - 2, top - 4, bw + 4, 8); }

            if (b.wins && b.wins.length > 0) {
                const ww = 6 * scale, wh = 9 * scale;
                ctx.globalAlpha = 0.85;
                b.wins.forEach(({ r, c, lit }) => {
                    ctx.fillStyle = lit ? winLit : winDark;
                    const wx = bx - xOffset * 0.1 + 8 * scale + c * (ww + 6 * scale);
                    const wy = top + 15 * scale + r * (wh + 10 * scale);
                    if (wy + wh < ROAD_TOP - 5) {
                        ctx.fillRect(wx, wy, ww, wh);
                        if (lit && !isSilhouette) {
                            // Warm window glow bloom
                            ctx.fillStyle = "rgba(255, 230, 150, 0.15)";
                            ctx.beginPath(); ctx.arc(wx + ww / 2, wy + wh / 2, ww * 1.5, 0, Math.PI * 2); ctx.fill();
                        }
                    }
                });
                ctx.globalAlpha = 1;
            }
            bx += bw + 8;
        });
    }, []);

    const drawRoad = useCallback((ctx, currentLives, gTime) => {
        // 5) Road Top ambient reflection & Shadow
        const roadGlow = ctx.createLinearGradient(0, ROAD_TOP, 0, ROAD_TOP + 40);
        roadGlow.addColorStop(0, '#00000080'); // Top gradient shadow where road meets buildings
        roadGlow.addColorStop(0.5, 'rgba(100, 150, 200, 0.1)'); // Lighting reflection
        roadGlow.addColorStop(1, 'rgba(0,0,0,0)');

        // Base gradient
        const road = ctx.createLinearGradient(0, ROAD_TOP, 0, H);
        road.addColorStop(0, COLORS.ROAD_TOP);
        road.addColorStop(0.4, COLORS.ROAD_MID);
        road.addColorStop(0.9, COLORS.ROAD_BOT);
        road.addColorStop(1, '#111116'); // Depth edge near bottom

        ctx.fillStyle = road;
        ctx.fillRect(0, ROAD_TOP, W, H - ROAD_TOP);
        ctx.fillStyle = roadGlow;
        ctx.fillRect(0, ROAD_TOP, W, 40);

        // Asphalt Noise Texture
        ctx.fillStyle = '#000000';
        NOISE_POINTS.forEach(p => {
            ctx.globalAlpha = p.op;
            ctx.fillRect(p.x, ROAD_TOP + p.y, 2, 2);
        });
        ctx.globalAlpha = 1;

        // Sidewalk perspective edge
        const swG = ctx.createLinearGradient(0, ROAD_TOP - 6, 0, ROAD_TOP + 2);
        swG.addColorStop(0, COLORS.SIDEWALK_TOP); swG.addColorStop(1, COLORS.SIDEWALK_FACE);
        ctx.fillStyle = swG;
        ctx.beginPath(); ctx.moveTo(0, ROAD_TOP - 6); ctx.lineTo(W, ROAD_TOP - 6); ctx.lineTo(W, ROAD_TOP + 2); ctx.lineTo(0, ROAD_TOP + 2); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(0, ROAD_TOP + 2, W, 3); // Curb drop shadow

        // Motion dashes
        const dashY = ROAD_TOP + (H - ROAD_TOP) * 0.45;
        const total = 60;
        const offset = bgScrollRef.current[3] % total;

        ctx.fillStyle = COLORS.ROAD_LINE;
        ctx.shadowColor = COLORS.ROAD_LINE;
        ctx.shadowBlur = 4;
        for (let dx = -total + offset; dx < W + total; dx += total) {
            ctx.fillRect(dx, dashY, 28, 4);
            ctx.fillStyle = '#FFFFFF40'; ctx.fillRect(dx, dashY + 4, 28, 2); // bevel edge
            ctx.fillStyle = COLORS.ROAD_LINE;
        }
        ctx.shadowBlur = 0;

        // Screen Color grading & Vignette around edges
        const vgR = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
        vgR.addColorStop(0, 'rgba(0,0,0,0)');

        // Dramatic "Almost Dead" Feedback
        if (currentLives === 1) {
            const dangerPulse = 0.5 + Math.sin(gTime * 6) * 0.3;
            vgR.addColorStop(1, `rgba(180, 0, 0, ${dangerPulse})`);
        } else {
            vgR.addColorStop(1, 'rgba(0, 10, 30, 0.45)');
        }

        ctx.fillStyle = vgR;
        ctx.fillRect(0, 0, W, H);
    }, []);

    const drawPlayer = useCallback((ctx, p) => {
        const { x, y, width: w, height: h, animPhase } = p;
        // 6-8 frame smooth bounce animation
        const bounce = Math.abs(Math.sin(animPhase)) * 8;
        const legSwing = Math.sin(animPhase * 1.5) * 6;

        ctx.save();
        ctx.translate(0, -bounce);

        // Dark Ground Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        // Shadow stays on ground, counter-acts bounce
        ctx.beginPath(); ctx.ellipse(x + w / 2, y + h + bounce + 4, w * 0.4 - bounce * 0.5, 6, 0, 0, Math.PI * 2); ctx.fill();

        // Shoes & Legs with distinct running swing
        ctx.fillStyle = '#1A2A40';
        ctx.fillRect(x + w / 2 - 12 + legSwing * 0.5, y + h - 18, 9, 14 - legSwing);
        ctx.fillRect(x + w / 2 + 3 - legSwing * 0.5, y + h - 18, 9, 14 + legSwing);

        ctx.fillStyle = COLORS.PLAYER_SHOES;
        // Left shoe
        ctx.beginPath(); ctx.roundRect(x + w / 2 - 15 + legSwing * 0.5, y + h - 6 - legSwing, 14, 8, 4); ctx.fill();
        // Right shoe
        ctx.beginPath(); ctx.roundRect(x + w / 2 + 1 - legSwing * 0.5, y + h - 6 + legSwing, 14, 8, 4); ctx.fill();

        // Hoodie Main Body
        const g = ctx.createLinearGradient(x, y + 15, x, y + h - 10);
        g.addColorStop(0, COLORS.PLAYER_HOODIE);
        g.addColorStop(1, COLORS.PLAYER_HOODIE_DARK);
        ctx.fillStyle = g;
        ctx.shadowColor = 'rgba(0,0,0,0.3)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 2;
        ctx.beginPath(); ctx.roundRect(x + 10, y + 25, w - 20, h - 38, [12, 12, 8, 8]); ctx.fill();
        ctx.shadowColor = 'transparent';

        // Hoodie Zipper/Details
        ctx.fillStyle = '#1A3D63';
        ctx.fillRect(x + w / 2 - 2, y + 35, 4, h - 50);
        ctx.fillStyle = '#FFF';
        ctx.beginPath(); ctx.ellipse(x + w / 2, y + 28, 6, 8, 0, 0, Math.PI * 2); ctx.fill();

        // Neck
        ctx.fillStyle = '#DCA38C';
        ctx.fillRect(x + w / 2 - 4, y + 18, 8, 10);

        // Face
        ctx.fillStyle = COLORS.PLAYER_FACE;
        ctx.beginPath(); ctx.roundRect(x + w / 2 - 12, y + 4, 24, 20, 8); ctx.fill();

        // Modern Hair
        ctx.fillStyle = '#2A1B14'; // Dark brown hair
        ctx.beginPath();
        ctx.moveTo(x + w / 2 - 14, y + 10);
        ctx.bezierCurveTo(x + w / 2 - 12, y - 4, x + w / 2 + 12, y - 6, x + w / 2 + 14, y + 10);
        ctx.lineTo(x + w / 2 + 10, y + 2);
        ctx.lineTo(x + w / 2, y - 2);
        ctx.lineTo(x + w / 2 - 10, y + 4);
        ctx.closePath();
        ctx.fill();

        // Hair spikes (casual modern look)
        ctx.beginPath(); ctx.moveTo(x + w / 2 - 8, y + 2); ctx.lineTo(x + w / 2 - 4, y + 12); ctx.lineTo(x + w / 2, y + 2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + w / 2 + 2, y - 1); ctx.lineTo(x + w / 2 + 6, y + 10); ctx.lineTo(x + w / 2 + 8, y + 2); ctx.fill();

        // Eyes (adult style, determined expression)
        ctx.fillStyle = '#111';
        ctx.fillRect(x + w / 2 - 8, y + 12, 4, 4);
        ctx.fillRect(x + w / 2 + 4, y + 12, 4, 4);

        // Eyebrows
        ctx.strokeStyle = '#2A1B14'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + w / 2 - 9, y + 10); ctx.lineTo(x + w / 2 - 4, y + 10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + w / 2 + 4, y + 10); ctx.lineTo(x + w / 2 + 9, y + 10); ctx.stroke();

        // Mouth (neutral/determined)
        ctx.strokeStyle = '#4A2B29'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x + w / 2 - 3, y + 20); ctx.lineTo(x + w / 2 + 3, y + 20); ctx.stroke();

        ctx.restore();
    }, []);

    const drawRiskCoin = useCallback((ctx, r, drawCustomSymbol) => {
        const cx = r.x + r.width / 2;
        const cy = r.y + r.height / 2;
        const rad = r.width / 2;
        // Soft floating animation
        const floatY = cy + Math.sin(glowTimeRef.current * 3 + r.floatAnim) * 6;
        const pulse = 1 + Math.sin(glowTimeRef.current * 5 + r.floatAnim) * 0.08;

        ctx.save();

        // Inner intense light bloom
        ctx.globalCompositeOperation = 'hard-light';
        const aGlow = ctx.createRadialGradient(cx, floatY, rad * 0.2, cx, floatY, rad * 3);
        aGlow.addColorStop(0, r.type.aura);
        aGlow.addColorStop(0.5, r.type.aura + '66');
        aGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = aGlow;
        ctx.beginPath(); ctx.arc(cx, floatY, rad * 3.5 * pulse, 0, Math.PI * 2); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';

        // Drop shadow directly below
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath(); ctx.ellipse(cx, floatY + rad + 8, rad * 0.6, 4, 0, 0, Math.PI * 2); ctx.fill();

        // Glossy Inner Body
        const orbGrad = ctx.createRadialGradient(cx - rad * 0.3, floatY - rad * 0.3, rad * 0.1, cx, floatY, rad);
        orbGrad.addColorStop(0, '#FFFFFF');
        orbGrad.addColorStop(0.3, r.type.color);
        orbGrad.addColorStop(1, shadeColor(r.type.color, -40));

        ctx.beginPath(); ctx.arc(cx, floatY, rad * pulse, 0, Math.PI * 2);
        ctx.fillStyle = orbGrad; ctx.fill();

        // Pulsating glowing ring
        ctx.strokeStyle = '#FFFFFF99';
        ctx.lineWidth = 2 + pulse * 2;
        ctx.beginPath(); ctx.arc(cx, floatY, rad * pulse * 1.1, 0, Math.PI * 2); ctx.stroke();

        // Draw Premium Symbol
        drawCustomSymbol(ctx, r.type.id, cx, floatY, rad * pulse);

        ctx.restore();
    }, []);

    const drawOrnateHUD = useCallback((ctx, clives, scr, cbo) => {
        // --- Premium Hearts Box ---
        const hx = 12, hy = 20, hw = 150, hh = 56;
        ctx.save();

        // Soft Glow
        ctx.shadowColor = COLORS.HUD_EMBOSS; ctx.shadowBlur = 15;

        // Metallic Blue Gradient Frame
        const hbg = ctx.createLinearGradient(hx, hy, hx, hy + hh);
        hbg.addColorStop(0, '#162C4E'); hbg.addColorStop(1, '#0C182B');
        ctx.fillStyle = hbg;
        ctx.beginPath(); ctx.roundRect(hx, hy, hw, hh, 12); ctx.fill();
        ctx.shadowBlur = 0;

        // Inner shadow effect
        ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(hx, hy, hw, hh, 12); ctx.stroke();

        // Soft gold/blue border highlight
        const mg = ctx.createLinearGradient(hx, hy, hx + hw, hy + hh);
        mg.addColorStop(0, '#6FA8E4');
        mg.addColorStop(0.5, '#2C5A96');
        mg.addColorStop(1, '#1A3860');
        ctx.strokeStyle = mg; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(hx + 1, hy + 1, hw - 2, hh - 2, 11); ctx.stroke();

        // Glossy hearts with shine animation
        const hs = 28, sp = 42, sx = hx + 22, sy = hy + 14;
        for (let i = 0; i < MAX_LIVES; i++) {
            const ix = sx + i * sp, iy = sy;

            // Heart Path
            ctx.beginPath();
            ctx.moveTo(ix, iy + hs * 0.35);
            ctx.bezierCurveTo(ix - hs * 0.6, iy - hs * 0.4, ix - hs * 0.1, iy - hs * 0.6, ix, iy - hs * 0.1);
            ctx.bezierCurveTo(ix + hs * 0.1, iy - hs * 0.6, ix + hs * 0.6, iy - hs * 0.4, ix, iy + hs * 0.4);
            ctx.lineTo(ix, iy + hs * 0.9);
            ctx.closePath();

            if (i < clives) {
                ctx.shadowColor = COLORS.HEART_HIGHLIGHT; ctx.shadowBlur = 8;
                const hg = ctx.createRadialGradient(ix - hs * 0.2, iy - hs * 0.2, hs * 0.1, ix, iy, hs);
                hg.addColorStop(0, '#FFA8C2');
                hg.addColorStop(0.4, COLORS.HEART_BASE);
                hg.addColorStop(1, COLORS.HEART_SHADOW);
                ctx.fillStyle = hg; ctx.fill();
                ctx.shadowBlur = 0;

                // Glossy reflection stripe
                const shineAnim = (glowTimeRef.current * 2 + i) % 4;
                if (shineAnim < 1.5) {
                    ctx.save();
                    ctx.clip(); // clip to heart shape
                    ctx.fillStyle = 'rgba(255,255,255,0.4)';
                    ctx.beginPath(); ctx.lineTo(ix - hs, iy - hs + shineAnim * hs * 2); ctx.lineTo(ix + hs, iy - hs * 1.5 + shineAnim * hs * 2); ctx.lineTo(ix + hs, iy - hs * 1.2 + shineAnim * hs * 2); ctx.lineTo(ix - hs, iy - hs * 0.7 + shineAnim * hs * 2); ctx.fill();
                    ctx.restore();
                }
            } else {
                ctx.fillStyle = '#4A5B6D'; ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2; ctx.stroke();
            }
        }
        ctx.restore();

        // --- Premium Score Capsule ---
        ctx.save();
        const sw = 160, sh = 50, srx = W - sw - 12, sry = 20;
        ctx.shadowColor = COLORS.HUD_EMBOSS; ctx.shadowBlur = 12;

        const sbg = ctx.createLinearGradient(srx, sry, srx, sry + sh);
        sbg.addColorStop(0, '#1E3555'); sbg.addColorStop(1, '#0E1D33');
        ctx.fillStyle = sbg;
        ctx.beginPath(); ctx.roundRect(srx, sry, sw, sh, 25); ctx.fill();
        ctx.shadowBlur = 0;

        // Inner shadow
        ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.roundRect(srx, sry, sw, sh, 25); ctx.stroke();

        const sfg = ctx.createLinearGradient(srx, sry, srx + sw, sry + sh);
        sfg.addColorStop(0, '#8CBEEB'); sfg.addColorStop(0.5, '#3C6CA6'); sfg.addColorStop(1, '#1A3A60');
        ctx.strokeStyle = sfg; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(srx + 1, sry + 1, sw - 2, sh - 2, 24); ctx.stroke();

        ctx.fillStyle = '#FFF';
        ctx.font = '900 20px "Outfit", system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(255,255,255,0.4)'; ctx.shadowBlur = 4;
        ctx.fillText(`SCORE: ${scr}`, srx + sw / 2, sry + sh / 2 + 1);

        if (cbo > 1) {
            ctx.fillStyle = COLORS.GLOW_GOLD;
            ctx.shadowColor = COLORS.GLOW_GOLD; ctx.shadowBlur = 6;
            ctx.font = '800 13px system-ui';
            ctx.fillText(`x${cbo.toFixed(1)}`, srx + sw / 2, sry + sh + 14);
        }
        ctx.restore();
    }, []);

    // ─── UTILS ────────────────────────────────────────────────
    function shadeColor(color, percent) {
        let R = parseInt(color.substring(1, 3), 16), G = parseInt(color.substring(3, 5), 16), B = parseInt(color.substring(5, 7), 16);
        R = parseInt(R * (100 + percent) / 100); G = parseInt(G * (100 + percent) / 100); B = parseInt(B * (100 + percent) / 100);
        R = (R < 255) ? R : 255; G = (G < 255) ? G : 255; B = (B < 255) ? B : 255;
        const RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));
        return "#" + RR + GG + BB;
    }

    // ─── GAME LOOP ────────────────────────────────────────────
    const gameLoop = useCallback((ts) => {
        if (!canvasRef.current || isPausedRef.current) { if (!isPausedRef.current) animFrameRef.current = requestAnimationFrame(gameLoop); return; }

        const ctx = canvasRef.current.getContext('2d');
        if (!lastTimeRef.current) lastTimeRef.current = ts;
        // High fidelity 60FPS DT Smoothing
        let dt = (ts - lastTimeRef.current) / 1000;
        lastTimeRef.current = ts;
        if (dt > 0.05) dt = 0.05; // Tight clamp for smooth logic

        if (slowMoRef.current) dt *= 0.1; // Exaggerated cinematic slow motion

        elapsedRef.current += dt;
        glowTimeRef.current += dt;
        const elapsed = elapsedRef.current;

        // Smooth Scrolling Parallax
        bgScrollRef.current[0] += dt * 4;  // skyline
        bgScrollRef.current[1] += dt * 10; // mid
        bgScrollRef.current[2] += dt * 25; // fore
        bgScrollRef.current[3] += dt * 80; // road
        bgScrollRef.current[4] += dt * 5;  // clouds

        // Player Move Processing
        if (moveDirectionRef.current !== 0) {
            playerRef.current.x += moveDirectionRef.current * PLAYER_SPEED * dt * 60;
            // Blue-White Spark Trail Engine
            sparkRef.current.push({
                x: playerRef.current.x + PLAYER_WIDTH / 2 + (Math.random() - 0.5) * 15,
                y: playerRef.current.y + PLAYER_HEIGHT - 6,
                vx: -moveDirectionRef.current * 0.5 + (Math.random() - 0.5) * 2,
                vy: -Math.random() * 2,
                life: 1,
                c: Math.random() > 0.6 ? '#6FA8E4' : '#FFFFFF'
            });
        }
        playerRef.current.x = Math.max(PLAYER_LANE_PADDING, Math.min(W - PLAYER_WIDTH - PLAYER_LANE_PADDING, playerRef.current.x));
        playerRef.current.animPhase += dt * 16;

        // Physics Updates
        sparkRef.current = sparkRef.current.filter(s => { s.x += s.vx; s.y += s.vy; s.life -= dt * 3; return s.life > 0; });
        particlesRef.current = particlesRef.current.filter(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.life -= dt * 1.5; return p.life > 0; });

        // Spawning — cap concurrent risks to prevent overwhelming the player
        const MAX_CONCURRENT_RISKS = 4;
        const sInt = Math.max(RISK_SPAWN_INTERVAL_MIN, RISK_SPAWN_INTERVAL_INITIAL - elapsed * 12);
        if (ts - lastSpawnTimeRef.current > sInt && !carRef.current && risksRef.current.length < MAX_CONCURRENT_RISKS) { spawnRisk(); lastSpawnTimeRef.current = ts; }

        risksRef.current = risksRef.current.filter(r => {
            r.y += r.speed * dt * 60;
            if (!r.dodged && r.y > playerRef.current.y + PLAYER_HEIGHT) { r.dodged = true; incrementDodgeStreak(); }

            const pHit = playerRef.current;
            if (r.x < pHit.x + PLAYER_WIDTH - 12 && r.x + r.width > pHit.x + 12 && r.y < pHit.y + PLAYER_HEIGHT - 12 && r.y + r.height > pHit.y + 12) {
                // Minimum lives is bounded to 1 during standard phase!
                livesRef.current = Math.max(1, livesRef.current - 1); setLives(livesRef.current); resetDodgeStreak(); comboRef.current = 1;
                spawnImpactParticles(r.x + r.width / 2, r.y + r.height / 2, r.type.color);
                lastHitTimeRef.current = elapsed; setHeartShake(true); setTimeout(() => setHeartShake(false), 500);

                return false;
            }
            return r.y < H + 60;
        });

        // Add Heartbeat Logic when at 1 heart
        if (livesRef.current === 1 && !carRef.current && elapsed - lastHeartbeatTimeRef.current > 0.6) {
            playHeartbeat();
            lastHeartbeatTimeRef.current = elapsed;
        }

        if (elapsed < 40 && livesRef.current < MAX_LIVES && elapsed - lastHitTimeRef.current > LIFE_REGEN_TIME / 1000) { livesRef.current++; setLives(livesRef.current); lastHitTimeRef.current = elapsed; }

        if (ts - lastScoreTimeRef.current > 1000 && !carRef.current) { scoreRef.current += Math.floor(SCORE_PER_SECOND * comboRef.current); setScore(scoreRef.current); lastScoreTimeRef.current = ts; }

        // Crash Event — sudden, no warning
        if (elapsed > crashTimeRef.current && !crashTriggeredRef.current && !carRef.current) {
            crashTriggeredRef.current = true;
            // No slow-mo — car appears almost instantly for shock value
            setTimeout(() => { carRef.current = { x: W + 20, y: PLAYER_Y + 10, width: CAR_WIDTH, height: CAR_HEIGHT, speed: CAR_SPEED }; }, 200);
        }

        if (carRef.current) {
            carRef.current.x -= carRef.current.speed * dt * 60;
            if (carRef.current.x < playerRef.current.x + PLAYER_WIDTH && carRef.current.x + carRef.current.width > playerRef.current.x) {
                isCrashingRef.current = true; setIsCrashing(true); screenShakeRef.current = 35; setScreenShake(35);
                livesRef.current = 0; setLives(0); spawnImpactParticles(playerRef.current.x + 20, playerRef.current.y + 20, '#FF1133');
                // Quick transition to game over overlay
                setTimeout(() => { screenShakeRef.current = 0; setScreenShake(0); triggerCrash(); }, 600);
                carRef.current = null; cancelAnimationFrame(animFrameRef.current); setScore(scoreRef.current); setElapsedTime(elapsed); return;
            }
        }

        // RENDER 
        ctx.clearRect(0, 0, W, H);
        if (screenShakeRef.current > 0) { ctx.save(); const s = screenShakeRef.current; ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s); }

        drawBackgroundLayers(ctx);
        drawCityLayer(ctx, SKYLINE_BLDGS, COLORS.BLDG_SKYLINE_BASE, COLORS.BLDG_WIN_DARK, 'rgba(0,0,0,0)', bgScrollRef.current[0], 0.65, true);
        drawCityLayer(ctx, MID_BLDGS, COLORS.BLDG_MID_BASE, COLORS.BLDG_WIN_LIT, COLORS.BLDG_WIN_DARK, bgScrollRef.current[1], 0.85);
        drawCityLayer(ctx, FORE_BLDGS, '#121F36', '#FFEAA7', '#2A3C56', bgScrollRef.current[2], 1.2); // Sharp Dark Foreground

        drawRoad(ctx, livesRef.current, glowTimeRef.current);

        risksRef.current.forEach(r => drawRiskCoin(ctx, r, drawCustomSymbol));
        if (!isCrashingRef.current) drawPlayer(ctx, playerRef.current);

        // Premium Modern Car & Motion Blur
        if (carRef.current) {
            ctx.save();
            const cx = carRef.current.x;
            const cy = carRef.current.y;
            const cw = carRef.current.width;
            const ch = carRef.current.height;

            // Intense dash lines behind car
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            for (let i = 0; i < 15; i++) {
                ctx.fillRect(cx + cw + Math.random() * 50, cy + Math.random() * ch, 100 + Math.random() * 200, 2);
            }

            // Drop shadow
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.beginPath(); ctx.ellipse(cx + cw / 2, cy + ch, cw * 0.45, 8, 0, 0, Math.PI * 2); ctx.fill();

            // Slek Car Body
            const cg = ctx.createLinearGradient(cx, cy, cx, cy + ch);
            cg.addColorStop(0, '#E74C3C'); cg.addColorStop(0.6, '#C0392B'); cg.addColorStop(1, '#8E2820');
            ctx.fillStyle = cg;

            // Aerodynamic shape (Facing Left)
            ctx.beginPath();
            ctx.moveTo(cx, cy + ch - 8);
            ctx.lineTo(cx, cy + ch - 25);
            ctx.quadraticCurveTo(cx + 20, cy + ch - 30, cx + 55, cy + 15); // steep windshield
            ctx.lineTo(cx + cw - 50, cy + 10); // roof
            ctx.quadraticCurveTo(cx + cw - 10, cy + 15, cx + cw, cy + ch - 30); // smooth back window
            ctx.lineTo(cx + cw, cy + ch - 8);
            ctx.closePath();
            ctx.fill();

            // Grille & Headlights (Front is Left)
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.roundRect(cx + 2, cy + ch - 25, 12, 12, 4); ctx.fill();

            ctx.fillStyle = '#FFF';
            ctx.shadowColor = '#FFD700'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.ellipse(cx + 6, cy + ch - 18, 4, 4, 0, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Tail lights (Back is Right)
            ctx.fillStyle = '#FF0000';
            ctx.shadowColor = '#FF0000'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.roundRect(cx + cw - 10, cy + ch - 25, 10, 8, 2); ctx.fill();
            ctx.shadowBlur = 0;

            // Windows
            ctx.fillStyle = '#1F2937';
            // Front window (Left)
            ctx.beginPath();
            ctx.moveTo(cx + 45, cy + ch - 35);
            ctx.lineTo(cx + 60, cy + 16);
            ctx.lineTo(cx + cw / 2, cy + 16);
            ctx.lineTo(cx + cw / 2, cy + ch - 35);
            ctx.closePath();
            ctx.fill();

            // Back window (Right)
            ctx.beginPath();
            ctx.moveTo(cx + cw / 2 + 10, cy + ch - 35);
            ctx.lineTo(cx + cw / 2 + 10, cy + 16);
            ctx.lineTo(cx + cw - 45, cy + 16);
            ctx.lineTo(cx + cw - 15, cy + ch - 35);
            ctx.closePath();
            ctx.fill();

            // Wheels
            const drawWheel = (wx, wy) => {
                ctx.fillStyle = '#111';
                ctx.beginPath(); ctx.arc(wx, wy, 16, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#666'; // Rims
                ctx.beginPath(); ctx.arc(wx, wy, 8, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#CCC';
                ctx.beginPath(); ctx.arc(wx, wy, 4, 0, Math.PI * 2); ctx.fill();
            };
            drawWheel(cx + 35, cy + ch - 5);
            drawWheel(cx + cw - 35, cy + ch - 5);

            ctx.restore();
        }

        sparkRef.current.forEach(s => {
            ctx.globalAlpha = Math.max(0, s.life);
            ctx.fillStyle = s.c;
            ctx.shadowColor = s.c; ctx.shadowBlur = 4;
            ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2); ctx.fill();
        });
        ctx.shadowBlur = 0;
        particlesRef.current.forEach(p => {
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;

        drawOrnateHUD(ctx, livesRef.current, scoreRef.current, comboRef.current);

        if (screenShakeRef.current > 0) { ctx.restore(); screenShakeRef.current *= 0.9; }
        if (isCrashingRef.current) { ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H); }

        animFrameRef.current = requestAnimationFrame(gameLoop);
    }, [drawBackgroundLayers, drawCityLayer, drawRoad, drawRiskCoin, drawCustomSymbol, drawPlayer, drawOrnateHUD, incrementDodgeStreak, resetDodgeStreak, setLives, setScore, triggerCrash, setElapsedTime, setPhase]);

    const startEngine = useCallback(() => {
        lastTimeRef.current = 0; elapsedRef.current = 0; glowTimeRef.current = 0; scoreRef.current = 0; livesRef.current = MAX_LIVES; comboRef.current = 1;
        crashTimeRef.current = CRASH_TRIGGER_MIN + Math.random() * (CRASH_TRIGGER_MAX - CRASH_TRIGGER_MIN);
        crashTriggeredRef.current = false; slowMoRef.current = false; isCrashingRef.current = false; setIsCrashing(false);
        risksRef.current = []; particlesRef.current = []; sparkRef.current = []; carRef.current = null;
        bgScrollRef.current = [0, 0, 0, 0, 0];
        playerRef.current = { x: W / 2 - PLAYER_WIDTH / 2, y: PLAYER_Y, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, animPhase: 0, bounce: 0 };
        animFrameRef.current = requestAnimationFrame(gameLoop);
        if (canvasRef.current) { canvasRef.current.addEventListener('touchstart', handleTouchStart, { passive: false }); canvasRef.current.addEventListener('touchend', handleTouchEnd, { passive: false }); canvasRef.current.addEventListener('touchmove', handleTouchMove, { passive: false }); }
    }, [gameLoop, handleTouchStart, handleTouchEnd, handleTouchMove]);

    const stopEngine = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        isPausedRef.current = true;
        if (canvasRef.current) { canvasRef.current.removeEventListener('touchstart', handleTouchStart); canvasRef.current.removeEventListener('touchend', handleTouchEnd); canvasRef.current.removeEventListener('touchmove', handleTouchMove); }
    }, [handleTouchStart, handleTouchEnd, handleTouchMove]);

    useEffect(() => { window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp); return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); }; }, [handleKeyDown, handleKeyUp]);
    useEffect(() => { return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); if (canvasRef.current) { canvasRef.current.removeEventListener('touchstart', handleTouchStart); canvasRef.current.removeEventListener('touchend', handleTouchEnd); canvasRef.current.removeEventListener('touchmove', handleTouchMove); } }; }, []);
    useEffect(() => { comboRef.current = comboMultiplier; }, [comboMultiplier]);

    return { canvasRef, startEngine, stopEngine, heartShake, isCrashing, screenShake, canvasWidth: W, canvasHeight: H };
};
