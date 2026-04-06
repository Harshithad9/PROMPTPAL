/**
 * PromptPal — AI Prompt Generator
 * React 18 SPA · Light blue theme · Full field validation
 */

import { useState, useEffect, useCallback, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   GLOBAL STYLESHEET — Light Blue Theme
═══════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:           #eef6fd;
    --bg2:          #ddeef9;
    --bg3:          #cce4f5;
    --ink:          #0b1f35;
    --ink2:         #1e3a52;
    --ink3:         #4a7090;
    --ink4:         #89afc8;
    --accent:       #1a6fb5;
    --accent-light: #d0e8f8;
    --accent-dark:  #124f85;
    --border:       #b8d8ef;
    --border2:      #93c0e2;
    --white:        #f5fbff;
    --success:      #1a6b3c;
    --success-bg:   #d3f0e0;
    --error:        #b91c1c;
    --error-bg:     #fee2e2;
    --error-border: #fca5a5;
    --radius:       6px;
    --radius-lg:    12px;
    --shadow-sm:    0 1px 3px rgba(11,31,53,0.08);
    --shadow-md:    0 4px 16px rgba(11,31,53,0.10);
    --shadow-lg:    0 8px 32px rgba(11,31,53,0.13);
    --font-display: 'Instrument Serif', Georgia, serif;
    --font-body:    'Geist', system-ui, sans-serif;
    --font-mono:    'Geist Mono', 'Fira Code', monospace;
    --transition:   0.18s ease;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--ink);
    min-height: 100vh;
    font-size: 15px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  ::selection { background: var(--accent-light); color: var(--accent-dark); }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 99px; }

  /* ── Shell ── */
  .pp-shell { min-height: 100vh; background: var(--bg); }

  /* ── Top bar ── */
  .pp-topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(238,246,253,0.90);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .pp-topbar-inner {
    max-width: 1200px; margin: 0 auto;
    padding: 0 32px; height: 56px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pp-logo {
    font-family: var(--font-display); font-size: 22px;
    color: var(--ink); letter-spacing: -0.01em;
    display: flex; align-items: center; gap: 8px;
  }
  .pp-logo-dot {
    width: 8px; height: 8px;
    background: var(--accent); border-radius: 50%;
  }

  /* ── Nav tabs ── */
  .pp-nav-tabs {
    display: flex; gap: 2px;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 8px; padding: 3px;
  }
  .pp-nav-tab {
    padding: 6px 18px; font-size: 13px; font-weight: 500;
    font-family: var(--font-body); border: none;
    background: transparent; color: var(--ink3);
    border-radius: 6px; cursor: pointer;
    transition: all var(--transition); white-space: nowrap;
  }
  .pp-nav-tab:hover { color: var(--ink); background: var(--bg3); }
  .pp-nav-tab.active { background: var(--white); color: var(--ink); box-shadow: var(--shadow-sm); }
  .pp-nav-badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 18px; height: 18px; padding: 0 5px;
    background: var(--accent); color: #fff;
    border-radius: 99px; font-size: 10px; font-weight: 600;
    margin-left: 6px; vertical-align: middle;
  }

  /* ── Main ── */
  .pp-main { max-width: 1200px; margin: 0 auto; padding: 52px 32px 80px; }

  /* ── Hero ── */
  .pp-hero {
    text-align: center; margin-bottom: 52px;
    animation: fadeUp 0.5s ease both;
  }
  .pp-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--accent);
    background: var(--accent-light); border: 1px solid rgba(26,111,181,0.2);
    border-radius: 99px; padding: 5px 14px; margin-bottom: 20px;
  }
  .pp-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(44px, 6vw, 72px);
    font-weight: 400; letter-spacing: -0.03em;
    line-height: 1.05; color: var(--ink); margin-bottom: 18px;
  }
  .pp-hero h1 em { font-style: italic; color: var(--accent); }
  .pp-hero p { font-size: 16px; color: var(--ink3); max-width: 460px; margin: 0 auto; line-height: 1.7; }

  /* ── Section header ── */
  .pp-section-header {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: 28px;
  }
  .pp-section-title { font-family: var(--font-display); font-size: 28px; color: var(--ink); letter-spacing: -0.02em; }
  .pp-section-meta  { font-size: 13px; color: var(--ink4); }

  /* ── Category grid ── */
  .pp-cat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
  .pp-cat-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); padding: 22px 20px;
    cursor: pointer; transition: all 0.22s ease;
    position: relative; overflow: hidden;
    animation: fadeUp 0.4s ease both;
  }
  .pp-cat-card:hover {
    border-color: var(--accent); box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  .pp-cat-card:hover .cat-arrow { transform: translate(3px,-3px); opacity: 1; }
  .pp-cat-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 14px;
  }
  .pp-cat-name  { font-size: 14px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .pp-cat-desc  { font-size: 12.5px; color: var(--ink3); line-height: 1.5; margin-bottom: 16px; }
  .cat-arrow {
    position: absolute; top: 18px; right: 18px;
    color: var(--accent); opacity: 0;
    transition: all 0.2s ease;
  }

  /* ── Builder ── */
  .pp-builder-header {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 28px; animation: fadeUp 0.3s ease both;
  }
  .pp-builder-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 18px; animation: fadeUp 0.35s ease both;
  }

  /* ── Card ── */
  .pp-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); overflow: hidden;
    box-shadow: var(--shadow-sm);
    display: flex; flex-direction: column;
  }
  .pp-card-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    background: var(--bg2); flex-shrink: 0;
  }
  .pp-card-title { font-size: 13px; font-weight: 600; color: var(--ink); letter-spacing: 0.01em; }
  .pp-card-sub   { font-size: 12px; color: var(--ink4); margin-top: 2px; }
  .pp-card-body  { padding: 22px; flex: 1; display: flex; flex-direction: column; }

  /* ── Form ── */
  .pp-field { margin-bottom: 16px; }
  .pp-label {
    display: block; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--ink3); margin-bottom: 6px;
  }
  .pp-label .pp-required { color: var(--error); margin-left: 2px; }

  .pp-input, .pp-select, .pp-textarea {
    width: 100%; padding: 9px 12px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); font-size: 13.5px;
    font-family: var(--font-body); color: var(--ink); outline: none;
    transition: border-color var(--transition), box-shadow var(--transition);
    line-height: 1.5;
  }
  .pp-input::placeholder, .pp-textarea::placeholder { color: var(--ink4); }
  .pp-input:focus, .pp-select:focus, .pp-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,111,181,0.13);
    background: var(--white);
  }
  /* Error state on inputs */
  .pp-input.has-error, .pp-select.has-error, .pp-textarea.has-error {
    border-color: var(--error);
    background: #fff8f8;
    box-shadow: 0 0 0 3px rgba(185,28,28,0.09);
  }
  .pp-input.has-error:focus, .pp-select.has-error:focus, .pp-textarea.has-error:focus {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(185,28,28,0.14);
  }

  .pp-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 6L10 1' stroke='%234a7090' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    padding-right: 34px;
  }
  .pp-select.has-error {
    background-image: url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5.5 6L10 1' stroke='%23b91c1c' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }
  .pp-textarea { resize: vertical; min-height: 84px; line-height: 1.6; }

  /* ── Inline error message ── */
  .pp-field-error {
    display: flex; align-items: center; gap: 5px;
    margin-top: 5px; font-size: 12px;
    color: var(--error); font-weight: 500;
    animation: fadeUp 0.2s ease both;
  }
  .pp-field-error svg { flex-shrink: 0; }

  /* ── Validation summary banner ── */
  .pp-validation-banner {
    display: flex; align-items: flex-start; gap: 10px;
    padding: 12px 14px;
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--radius);
    margin-bottom: 16px;
    animation: shake 0.4s ease both;
  }
  .pp-validation-banner-icon { font-size: 14px; color: var(--error); flex-shrink: 0; margin-top: 1px; }
  .pp-validation-banner-text { font-size: 13px; color: var(--error); font-weight: 500; line-height: 1.5; }

  @keyframes shake {
    0%  { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
    100%{ transform: translateX(0); }
  }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    padding: 9px 18px; font-size: 13px; font-weight: 500;
    font-family: var(--font-body); border-radius: var(--radius);
    cursor: pointer; transition: all var(--transition);
    white-space: nowrap; border: 1px solid transparent; line-height: 1;
  }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }

  .btn-accent {
    background: var(--accent); color: #fff;
    border-color: var(--accent-dark);
    box-shadow: 0 1px 3px rgba(26,111,181,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
  }
  .btn-accent:hover { background: var(--accent-dark); box-shadow: 0 4px 12px rgba(26,111,181,0.35); transform: translateY(-1px); }
  .btn-accent:active { transform: translateY(0); }

  .btn-outline {
    background: transparent; color: var(--ink2); border-color: var(--border2);
  }
  .btn-outline:hover { background: var(--bg2); color: var(--ink); }

  .btn-ghost {
    background: var(--bg2); color: var(--ink2); border-color: var(--border);
  }
  .btn-ghost:hover { background: var(--bg3); color: var(--ink); }

  .btn-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; font-size: 13px; font-weight: 500;
    font-family: var(--font-body); border: 1px solid var(--border);
    border-radius: var(--radius); cursor: pointer;
    background: var(--white); color: var(--ink3);
    transition: all var(--transition); box-shadow: var(--shadow-sm);
  }
  .btn-back:hover { color: var(--ink); border-color: var(--border2); background: var(--bg2); }

  /* ── Output ── */
  .pp-output {
    width: 100%; flex: 1; min-height: 210px; padding: 14px 16px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius); font-size: 12.5px;
    font-family: var(--font-mono); line-height: 1.75; color: var(--ink2);
    resize: vertical; outline: none; transition: border-color var(--transition);
  }
  .pp-output:focus { border-color: var(--accent); }

  /* ── Actions ── */
  .pp-actions { display: flex; gap: 8px; margin-top: 14px; }

  /* ── Output placeholder ── */
  .pp-output-placeholder {
    flex: 1; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 24px; text-align: center;
    border: 1px dashed var(--border2);
    border-radius: var(--radius); color: var(--ink4);
    gap: 10px; min-height: 210px;
  }
  .pp-output-placeholder-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: var(--bg2); display: flex;
    align-items: center; justify-content: center; font-size: 20px; margin-bottom: 4px;
  }

  /* ── Status pill ── */
  .pp-status-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
  }
  .pp-status-pill.ready { background: var(--success-bg); color: var(--success); }
  .pp-status-pill::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: block; }

  /* ── Saved cards ── */
  .pp-saved-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 14px;
    box-shadow: var(--shadow-sm);
    transition: border-color var(--transition), box-shadow var(--transition);
    animation: fadeUp 0.3s ease both;
  }
  .pp-saved-card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); }
  .pp-saved-header {
    padding: 13px 18px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .pp-badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; font-size: 11px; font-weight: 600;
    border-radius: 99px; background: var(--bg3); color: var(--ink2);
    border: 1px solid var(--border2); letter-spacing: 0.02em;
  }
  .pp-saved-body { padding: 18px; }

  /* ── Empty ── */
  .pp-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 72px 24px; background: var(--white);
    border: 1px dashed var(--border2); border-radius: var(--radius-lg); text-align: center;
  }

  /* ── Delete button ── */
  .pp-del-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: var(--radius);
    border: 1px solid var(--border); background: transparent;
    cursor: pointer; color: var(--ink4); transition: all var(--transition);
  }
  .pp-del-btn:hover { color: var(--error); border-color: rgba(185,28,28,0.3); background: var(--error-bg); }

  /* ── Toast ── */
  .pp-toast-stack {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    display: flex; flex-direction: column; gap: 8px; pointer-events: none;
  }
  .pp-toast {
    display: flex; align-items: flex-start; gap: 11px;
    padding: 13px 16px; background: var(--ink);
    border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);
    min-width: 260px; max-width: 340px;
    animation: toastPop 0.28s cubic-bezier(0.34,1.56,0.64,1);
    pointer-events: all;
  }
  .pp-toast.success { border-left: 3px solid #4caf81; }
  .pp-toast.error   { border-left: 3px solid #e07070; }
  .pp-toast-icon    { font-size: 14px; margin-top: 1px; }
  .pp-toast-title   { font-size: 13px; font-weight: 600; color: #e8f4ff; }
  .pp-toast-msg     { font-size: 12px; color: #89afc8; margin-top: 2px; }

  /* ── Footer ── */
  .pp-footer { text-align: center; margin-top: 64px; padding-top: 28px; border-top: 1px solid var(--border); }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes toastPop {
    from { opacity: 0; transform: translateX(16px) scale(0.95); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .pp-spin { animation: spin 0.75s linear infinite; }

  /* ── Card stagger ── */
  .pp-cat-card:nth-child(1) { animation-delay: 0.04s; }
  .pp-cat-card:nth-child(2) { animation-delay: 0.08s; }
  .pp-cat-card:nth-child(3) { animation-delay: 0.12s; }
  .pp-cat-card:nth-child(4) { animation-delay: 0.16s; }
  .pp-cat-card:nth-child(5) { animation-delay: 0.20s; }
  .pp-cat-card:nth-child(6) { animation-delay: 0.24s; }
  .pp-cat-card:nth-child(7) { animation-delay: 0.28s; }
  .pp-cat-card:nth-child(8) { animation-delay: 0.32s; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .pp-cat-grid     { grid-template-columns: repeat(2, 1fr); }
    .pp-builder-grid { grid-template-columns: 1fr; }
    .pp-main         { padding: 32px 20px 60px; }
    .pp-topbar-inner { padding: 0 20px; }
  }
  @media (max-width: 540px) {
    .pp-cat-grid { grid-template-columns: 1fr; }
    .pp-actions  { flex-wrap: wrap; }
    .pp-actions .btn { flex: 1; min-width: 100px; }
  }
`;

/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const CATEGORIES = [
  { id:"coding",       title:"Coding Help",      desc:"Debug, build, and optimize code",        icon:"💻", bg:"#dbeafe", accent:"#1d4ed8" },
  { id:"resume",       title:"Resume Writing",   desc:"Land interviews with standout CVs",       icon:"📄", bg:"#dcfce7", accent:"#166534" },
  { id:"social-media", title:"Social Media",     desc:"Craft posts that stop the scroll",        icon:"📱", bg:"#fce7f3", accent:"#9d174d" },
  { id:"blogging",     title:"Blogging",         desc:"Write articles readers actually finish",  icon:"✍️",  bg:"#fff7ed", accent:"#9a3412" },
  { id:"marketing",   title:"Marketing",        desc:"Copy that converts browsers to buyers",    icon:"📈", bg:"#fef9c3", accent:"#854d0e" },
  { id:"creative",    title:"Creative Writing",  desc:"Stories, poems, and imaginative work",    icon:"🎨", bg:"#ede9fe", accent:"#5b21b6" },
  { id:"business",    title:"Business",         desc:"Plans, proposals, and exec documents",     icon:"💼", bg:"#e0f2fe", accent:"#0369a1" },
  { id:"education",   title:"Education",        desc:"Lesson plans, quizzes, study guides",      icon:"🎓", bg:"#ccfbf1", accent:"#0f5343" },
];

const STORAGE_KEY = "promptpal_v2_saved";

/* ═══════════════════════════════════════════════════════
   VALIDATION RULES per category
   Returns object: { fieldName: "error message" }
═══════════════════════════════════════════════════════ */
function validateForm(catId, formData) {
  const errors = {};

  switch (catId) {
    case "coding":
      if (!formData.language)      errors.language = "Please select a programming language";
      if (!formData.problem?.trim()) errors.problem  = "Please describe your problem";
      if (!formData.level)         errors.level    = "Please select your skill level";
      break;
    case "resume":
      if (!formData.jobTitle?.trim()) errors.jobTitle  = "Please enter a target job title";
      if (!formData.industry?.trim()) errors.industry  = "Please enter your industry";
      if (!formData.experience)       errors.experience = "Please select your experience level";
      if (!formData.skills?.trim())   errors.skills    = "Please list at least one skill";
      break;
    case "social-media":
      if (!formData.platform) errors.platform = "Please select a platform";
      if (!formData.topic?.trim()) errors.topic = "Please enter a topic or theme";
      if (!formData.tone)    errors.tone    = "Please select a tone";
      if (!formData.audience?.trim()) errors.audience = "Please describe your target audience";
      break;
    case "blogging":
      if (!formData.topic?.trim())    errors.topic   = "Please enter a blog topic";
      if (!formData.keywords?.trim()) errors.keywords = "Please enter at least one keyword";
      if (!formData.length)           errors.length  = "Please select an article length";
      if (!formData.style)            errors.style   = "Please select a writing style";
      break;
    default:
      if (!formData.topic?.trim())    errors.topic    = "Please enter a topic";
      if (!formData.tone)             errors.tone     = "Please select a tone";
      if (!formData.keywords?.trim()) errors.keywords = "Please enter some keywords";
      break;
  }
  return errors;
}

/* ═══════════════════════════════════════════════════════
   PROMPT GENERATOR
═══════════════════════════════════════════════════════ */
function buildPrompt(catId, data) {
  switch (catId) {
    case "coding":
      return `You are a senior ${data.language} engineer with 10+ years of experience. Help me with the following:\n\nProblem: ${data.problem}\nLanguage: ${data.language}\nSkill Level: ${data.level}\n\nPlease provide:\n1. A clean, well-commented solution\n2. Step-by-step explanation of the logic\n3. Time & space complexity analysis\n4. Edge cases to watch out for\n5. Best practices and alternative approaches\n\nEnsure code is production-ready and follows industry standards.`;
    case "resume":
      return `You are an executive career coach and ATS optimization expert. Create a compelling resume for:\n\nTarget Role: ${data.jobTitle}\nIndustry: ${data.industry}\nExperience Level: ${data.experience}\nKey Skills: ${data.skills}\n\nDeliver:\n1. A punchy 3-line professional summary\n2. 3–5 bullet-point achievements per role (quantified where possible)\n3. Skills section with ATS-optimized keywords\n4. Section ordering recommendation\n5. Tailoring tips for this specific role`;
    case "social-media":
      return `You are a top-tier social media strategist with proven viral content experience on ${data.platform}.\n\nPlatform: ${data.platform}\nTopic: ${data.topic}\nTone: ${data.tone}\nTarget Audience: ${data.audience}\n\nCreate:\n1. ${data.platform === "twitter" ? "5 tweet thread" : "3 post variations (short/medium/long)"}\n2. 10–15 targeted hashtags\n3. A hook line designed to maximize the first 2 seconds of attention\n4. A call-to-action that drives engagement\n5. Best times to post for this audience`;
    case "blogging":
      return `You are a professional SEO content strategist with a track record of first-page rankings.\n\nTopic: ${data.topic}\nKeywords: ${data.keywords}\nLength: ${data.length}\nStyle: ${data.style}\n\nProduce:\n1. 5 headline variations (including a power word version)\n2. Full H2/H3 outline\n3. Strong hook introduction (first 100 words)\n4. SEO meta description (under 160 characters)\n5. Internal linking suggestions\n6. CTA for the conclusion`;
    default:
      return `You are a world-class expert in ${catId}. Help me with the following:\n\nTopic: ${data.topic}\nTone: ${data.tone}\nKeywords: ${data.keywords}\n\nProvide comprehensive, well-structured, and immediately actionable content. Include concrete examples, proven frameworks, and specific next steps the reader can take today.`;
  }
}

/* ═══════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════ */
const Icons = {
  Back:     () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Copy:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Save:     () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  External: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Trash:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>,
  Zap:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Arrow:    () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Spinner:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="pp-spin"><path d="M12 2a10 10 0 0 1 10 10" opacity="0.2"/><path d="M22 12a10 10 0 0 1-10 10" opacity="0.45"/><path d="M12 22a10 10 0 0 1-10-10" opacity="0.7"/><path d="M2 12a10 10 0 0 1 10-10"/></svg>,
  Alert:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

/* ═══════════════════════════════════════════════════════
   FIELD with error support
═══════════════════════════════════════════════════════ */
function Field({ label, required, error, children }) {
  return (
    <div className="pp-field">
      <label className="pp-label">
        {label}
        {required && <span className="pp-required">*</span>}
      </label>
      {children}
      {error && (
        <div className="pp-field-error">
          <Icons.Alert />
          {error}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CATEGORY FORM — injects error classes + messages
═══════════════════════════════════════════════════════ */
function CategoryForm({ catId, formData, onChange, errors }) {
  const ec = (name) => errors[name] ? " has-error" : "";

  const I = (name, ph) => (
    <input
      className={`pp-input${ec(name)}`}
      name={name} placeholder={ph}
      value={formData[name] || ""} onChange={onChange}
    />
  );
  const S = (name, opts) => (
    <select
      className={`pp-select${ec(name)}`}
      name={name} value={formData[name] || ""} onChange={onChange}
    >
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
  const T = (name, ph) => (
    <textarea
      className={`pp-textarea${ec(name)}`}
      name={name} placeholder={ph}
      value={formData[name] || ""} onChange={onChange}
    />
  );

  switch (catId) {
    case "coding": return (<>
      <Field label="Language / Stack" required error={errors.language}>{S("language",[["","Select language"],["javascript","JavaScript"],["typescript","TypeScript"],["python","Python"],["java","Java"],["cpp","C++"],["react","React"],["nodejs","Node.js"],["go","Go"],["rust","Rust"]])}</Field>
      <Field label="Problem Description" required error={errors.problem}>{T("problem","Describe what you need help with in detail...")}</Field>
      <Field label="Skill Level" required error={errors.level}>{S("level",[["","Select level"],["beginner","Beginner — explain concepts"],["intermediate","Intermediate — assume basics"],["advanced","Advanced — skip basics, go deep"]])}</Field>
    </>);
    case "resume": return (<>
      <Field label="Target Job Title" required error={errors.jobTitle}>{I("jobTitle","e.g., Senior Software Engineer, Product Manager")}</Field>
      <Field label="Industry" required error={errors.industry}>{I("industry","e.g., FinTech, Healthcare, SaaS, E-commerce")}</Field>
      <Field label="Experience Level" required error={errors.experience}>{S("experience",[["","Select experience"],["entry","Entry Level — 0–2 years"],["mid","Mid Level — 3–5 years"],["senior","Senior Level — 6–10 years"],["lead","Lead / Director — 10+ years"]])}</Field>
      <Field label="Top Skills" required error={errors.skills}>{I("skills","e.g., React, Team Leadership, SQL, Agile, Python")}</Field>
    </>);
    case "social-media": return (<>
      <Field label="Platform" required error={errors.platform}>{S("platform",[["","Select platform"],["twitter","Twitter / X"],["linkedin","LinkedIn"],["instagram","Instagram"],["facebook","Facebook"],["tiktok","TikTok"],["threads","Threads"]])}</Field>
      <Field label="Topic / Theme" required error={errors.topic}>{I("topic","e.g., productivity hacks, AI trends, startup lessons")}</Field>
      <Field label="Tone of Voice" required error={errors.tone}>{S("tone",[["","Select tone"],["professional","Professional & authoritative"],["casual","Casual & relatable"],["humorous","Witty & humorous"],["inspirational","Motivational & uplifting"],["educational","Educational & informative"]])}</Field>
      <Field label="Target Audience" required error={errors.audience}>{I("audience","e.g., early-stage founders, junior developers")}</Field>
    </>);
    case "blogging": return (<>
      <Field label="Blog Topic" required error={errors.topic}>{I("topic","e.g., The future of remote work, How to learn Python in 30 days")}</Field>
      <Field label="Primary Keywords" required error={errors.keywords}>{I("keywords","e.g., remote work productivity, async communication")}</Field>
      <Field label="Article Length" required error={errors.length}>{S("length",[["","Select length"],["short","Short — 500–800 words"],["medium","Medium — 800–1,500 words"],["long","Long-form — 1,500–3,000 words"],["pillar","Pillar — 3,000+ words"]])}</Field>
      <Field label="Writing Style" required error={errors.style}>{S("style",[["","Select style"],["informative","Informative / How-to"],["conversational","Conversational / First-person"],["academic","Research-backed / Academic"],["storytelling","Storytelling / Narrative"],["listicle","Listicle / Scannable"]])}</Field>
    </>);
    default: return (<>
      <Field label="Topic" required error={errors.topic}>{I("topic","What do you want to accomplish?")}</Field>
      <Field label="Desired Tone" required error={errors.tone}>{S("tone",[["","Select tone"],["professional","Professional"],["casual","Casual"],["formal","Formal & authoritative"],["creative","Creative & unconventional"]])}</Field>
      <Field label="Keywords / Focus Areas" required error={errors.keywords}>{I("keywords","Enter key themes or terms to include")}</Field>
    </>);
  }
}

/* ═══════════════════════════════════════════════════════
   TOAST STACK
═══════════════════════════════════════════════════════ */
function ToastStack({ toasts }) {
  return (
    <div className="pp-toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`pp-toast ${t.type}`}>
          <span className="pp-toast-icon">{t.type === "error" ? "⚠" : "✓"}</span>
          <div>
            <div className="pp-toast-title">{t.title}</div>
            <div className="pp-toast-msg">{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════ */
export default function PromptPal() {
  const [tab, setTab]           = useState("generate");
  const [catId, setCatId]       = useState(null);
  const [formData, setFormData] = useState({});
  const [errors, setErrors]     = useState({});   // field-level errors
  const [output, setOutput]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const [saved, setSaved]       = useState([]);
  const [toasts, setToasts]     = useState([]);
  const outputRef               = useRef(null);
  const formRef                 = useRef(null);

  useEffect(() => {
    try { setSaved(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
    catch { setSaved([]); }
  }, []);

  const addToast = useCallback((title, msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, title, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  function selectCategory(id) {
    setCatId(id);
    setFormData({});
    setErrors({});
    setOutput("");
  }

  // Clear individual field error when user changes the value
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) {
      setErrors(p => { const n = { ...p }; delete n[name]; return n; });
    }
  }

  async function handleGenerate() {
    // Run validation
    const newErrors = validateForm(catId, formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll form into view so user sees errors
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      addToast(
        "Please fill in all required fields",
        `${Object.keys(newErrors).length} field${Object.keys(newErrors).length > 1 ? "s" : ""} need attention`,
        "error"
      );
      return;
    }

    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setOutput(buildPrompt(catId, formData));
    setLoading(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  }

  async function handleCopy(text) {
    try {
      await navigator.clipboard.writeText(text || output);
      setCopied(true);
      addToast("Copied to clipboard", "Paste it into any AI tool");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast("Copy failed", "Please select and copy manually", "error");
    }
  }

  function handleSave() {
    if (saved.some(p => p.prompt === output)) {
      addToast("Already in library", "This prompt is already saved", "error");
      return;
    }
    const cat = CATEGORIES.find(c => c.id === catId);
    const entry = {
      id: Date.now().toString(),
      prompt: output, catId,
      catTitle: cat.title, catIcon: cat.icon,
      savedAt: new Date().toISOString(),
    };
    const updated = [entry, ...saved];
    setSaved(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    addToast("Saved to library", `"${cat.title}" prompt added`);
  }

  function handleDelete(id) {
    const updated = saved.filter(p => p.id !== id);
    setSaved(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    addToast("Removed", "Prompt deleted from your library");
  }

  function openInChatGPT(text) {
    window.open(`https://chat.openai.com/?q=${encodeURIComponent(text || output)}`, "_blank");
  }

  const activeCat = CATEGORIES.find(c => c.id === catId);
  const errorCount = Object.keys(errors).length;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <ToastStack toasts={toasts} />

      <div className="pp-shell">

        {/* ── Topbar ── */}
        <header className="pp-topbar">
          <div className="pp-topbar-inner">
            <div className="pp-logo">
              <span className="pp-logo-dot" />
              PromptPal
            </div>
            <nav className="pp-nav-tabs">
              <button className={`pp-nav-tab${tab === "generate" ? " active" : ""}`} onClick={() => setTab("generate")}>
                Generate
              </button>
              <button className={`pp-nav-tab${tab === "saved" ? " active" : ""}`} onClick={() => setTab("saved")}>
                Library
                {saved.length > 0 && <span className="pp-nav-badge">{saved.length}</span>}
              </button>
            </nav>
          </div>
        </header>

        <main className="pp-main">

          {/* ══ GENERATE TAB ══ */}
          {tab === "generate" && (
            <>
              {/* Hero */}
              {!catId && (
                <div className="pp-hero">
                  {/* <div className="pp-eyebrow"><span>⚡</span> AI Prompt Generator</div> */}
                  <h1>Generate <em>perfect</em><br />AI prompts, instantly</h1>
                  <p>Choose a category, fill in your details, and get a professionally crafted prompt ready for ChatGPT, Claude, or any AI tool.</p>
                </div>
              )}

              {/* Category grid */}
              {!catId && (
                <>
                  <div className="pp-section-header">
                    <h2 className="pp-section-title">Choose a category</h2>
                    <span className="pp-section-meta">{CATEGORIES.length} categories available</span>
                  </div>
                  <div className="pp-cat-grid">
                    {CATEGORIES.map(c => (
                      <div key={c.id} className="pp-cat-card" onClick={() => selectCategory(c.id)}>
                        <span className="cat-arrow"><Icons.Arrow /></span>
                        <div className="pp-cat-icon" style={{ background: c.bg }}>{c.icon}</div>
                        <div className="pp-cat-name">{c.title}</div>
                        <div className="pp-cat-desc">{c.desc}</div>
                        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, color:c.accent }}>
                          Generate prompt <Icons.Arrow />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Prompt builder */}
              {catId && activeCat && (
                <>
                  <div className="pp-builder-header">
                    <button className="btn-back" onClick={() => { setCatId(null); setErrors({}); }}>
                      <Icons.Back /> Back
                    </button>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:38, height:38, borderRadius:9, background:activeCat.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, border:`1px solid ${activeCat.accent}22` }}>
                        {activeCat.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:16, color:"var(--ink)" }}>{activeCat.title}</div>
                        <div style={{ fontSize:12, color:"var(--ink3)" }}>{activeCat.desc}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pp-builder-grid">

                    {/* Left — Form */}
                    <div className="pp-card" ref={formRef}>
                      <div className="pp-card-header">
                        <div className="pp-card-title">Customize your prompt</div>
                        <div className="pp-card-sub">All fields marked <span style={{color:"var(--error)"}}>*</span> are required</div>
                      </div>
                      <div className="pp-card-body">

                        {/* Validation summary banner — appears after a failed submit */}
                        {errorCount > 0 && (
                          <div className="pp-validation-banner">
                            <span className="pp-validation-banner-icon"><Icons.Alert /></span>
                            <div className="pp-validation-banner-text">
                              {errorCount === 1
                                ? "1 field needs to be filled in before generating."
                                : `${errorCount} fields need to be filled in before generating.`}
                            </div>
                          </div>
                        )}

                        <CategoryForm
                          catId={catId}
                          formData={formData}
                          onChange={handleChange}
                          errors={errors}
                        />

                        <div style={{ marginTop:"auto", paddingTop:8 }}>
                          <button className="btn btn-accent" style={{ width:"100%" }} onClick={handleGenerate} disabled={loading}>
                            {loading ? <><Icons.Spinner /> Generating…</> : <><Icons.Zap /> Generate Prompt</>}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right — Output */}
                    <div className="pp-card" ref={outputRef}>
                      <div className="pp-card-header" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div>
                          <div className="pp-card-title">Generated prompt</div>
                          <div className="pp-card-sub">Ready to paste into any AI tool</div>
                        </div>
                        {output && <span className="pp-status-pill ready">Ready</span>}
                      </div>
                      <div className="pp-card-body">
                        {!output ? (
                          <div className="pp-output-placeholder">
                            <div className="pp-output-placeholder-icon">✦</div>
                            <div style={{ fontWeight:500, fontSize:14, color:"var(--ink3)" }}>No prompt yet</div>
                            <div style={{ fontSize:13, color:"var(--ink4)", lineHeight:1.6 }}>
                              Complete the form and click<br />
                              <strong style={{ color:"var(--ink3)", fontWeight:600 }}>Generate Prompt</strong> to continue
                            </div>
                          </div>
                        ) : (
                          <>
                            <textarea className="pp-output" readOnly value={output} onChange={() => {}} />
                            <div className="pp-actions">
                              <button className="btn btn-outline" style={{ flex:1 }} onClick={() => handleCopy()}>
                                {copied ? <><Icons.Check /> Copied!</> : <><Icons.Copy /> Copy</>}
                              </button>
                              <button className="btn btn-ghost" style={{ flex:1 }} onClick={handleSave}>
                                <Icons.Save /> Save
                              </button>
                              <button className="btn btn-ghost" style={{ flex:1 }} onClick={() => openInChatGPT()}>
                                <Icons.External /> ChatGPT
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                  </div>
                </>
              )}
            </>
          )}

          {/* ══ LIBRARY TAB ══ */}
          {tab === "saved" && (
            <div style={{ maxWidth:720, margin:"0 auto" }}>
              <div className="pp-section-header">
                <h2 className="pp-section-title">Your library</h2>
                {saved.length > 0 && <span className="pp-section-meta">{saved.length} saved prompt{saved.length !== 1 ? "s" : ""}</span>}
              </div>

              {saved.length === 0 ? (
                <div className="pp-empty">
                  <span style={{ fontSize:36, marginBottom:14 }}>📂</span>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:22, color:"var(--ink)", marginBottom:8 }}>Nothing saved yet</div>
                  <div style={{ fontSize:14, color:"var(--ink3)", marginBottom:20 }}>Generate prompts and save them to build your personal library</div>
                  <button className="btn btn-accent" onClick={() => setTab("generate")}><Icons.Zap /> Start generating</button>
                </div>
              ) : saved.map(p => (
                <div key={p.id} className="pp-saved-card">
                  <div className="pp-saved-header">
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span>{p.catIcon}</span>
                      <span className="pp-badge">{p.catTitle}</span>
                      <span style={{ fontSize:12, color:"var(--ink4)" }}>
                        {new Date(p.savedAt).toLocaleDateString("en-US",{ month:"short", day:"numeric", year:"numeric" })}
                      </span>
                    </div>
                    <button className="pp-del-btn" onClick={() => handleDelete(p.id)} title="Delete"><Icons.Trash /></button>
                  </div>
                  <div className="pp-saved-body">
                    <textarea className="pp-output" readOnly value={p.prompt} onChange={() => {}} style={{ minHeight:100, marginBottom:12 }} />
                    <div className="pp-actions">
                      <button className="btn btn-outline" style={{ flex:1 }} onClick={() => handleCopy(p.prompt)}><Icons.Copy /> Copy</button>
                      <button className="btn btn-ghost"   style={{ flex:1 }} onClick={() => openInChatGPT(p.prompt)}><Icons.External /> Try in ChatGPT</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <footer className="pp-footer">
            <p style={{ fontSize:12, color:"var(--ink4)", letterSpacing:"0.04em" }}>
              PromptPal · Built with ❤️
            </p>
          </footer>

        </main>
      </div>
    </>
  );
}
