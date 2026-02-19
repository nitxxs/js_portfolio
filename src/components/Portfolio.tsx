"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useEditMode } from "@/hooks/useEditMode";

/* ── Types ── */
type Project = {
  id: string;
  title: string;
  org: string;
  role: string;
  period: string;
  summary: string;
  description: string;
  contributions: string[];
  stack: string[];
};

/* ── Constants ── */
const GRADIENTS = [
  "linear-gradient(135deg, #33425f 0%, #7B8FAF 100%)",
  "linear-gradient(135deg, #1B263B 0%, #4A5A70 100%)",
  "linear-gradient(135deg, #2B3A52 0%, #6B8FAF 100%)",
];

const SKILL_LEVELS: Record<string, number> = {
  "AI & Frameworks": 5,
  "3D Reconstruction": 4,
  Programming: 5,
  "Development Tools": 4,
};

/* ── Editable helpers ── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getByPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => {
    const m = key.match(/^(.+)\[(\d+)\]$/);
    if (m) return acc?.[m[1]]?.[parseInt(m[2])];
    return acc?.[key];
  }, obj);
}

/**
 * Editable text field.
 *  - default: block input (width:100%, one field per line)
 *  - inline=true: auto-sized inline input that stays in text flow
 */
function ET({
  path,
  className,
  inline,
}: {
  path: string;
  className?: string;
  inline?: boolean;
}) {
  const { isEditing } = useEditMode();
  const { t, updateField } = useLanguage();
  const value = getByPath(t, path) as string;
  if (!isEditing) return <>{value}</>;

  if (inline) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => updateField(path, e.target.value)}
        className={`edit-input-inline ${className || ""}`}
        size={Math.max(value.length || 1, 1)}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => updateField(path, e.target.value)}
      className={`edit-input ${className || ""}`}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

/** Multiline editable text */
function ETA({
  path,
  className,
  rows = 3,
}: {
  path: string;
  className?: string;
  rows?: number;
}) {
  const { isEditing } = useEditMode();
  const { t, updateField } = useLanguage();
  const value = getByPath(t, path) as string;
  if (!isEditing) return <>{value}</>;
  return (
    <textarea
      value={value}
      onChange={(e) => updateField(path, e.target.value)}
      className={`edit-textarea ${className || ""}`}
      rows={rows}
      onClick={(e) => e.stopPropagation()}
    />
  );
}

function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="edit-badge edit-badge-add"
    >
      + 추가
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="edit-badge edit-badge-remove"
    >
      &times;
    </button>
  );
}

/* ── Password Modal ── */
function PasswordModal() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const { enterEditMode, setShowPasswordModal } = useEditMode();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (enterEditMode(pw)) {
      setPw("");
      setError(false);
    } else {
      setError(true);
      setPw("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-1">Edit Mode</h3>
        <p className="text-sm text-secondary mb-5">비밀번호를 입력하세요.</p>
        <input
          ref={inputRef}
          type="password"
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-accent"
        />
        {error && (
          <p className="text-xs text-red-500 mt-2">
            비밀번호가 올바르지 않습니다.
          </p>
        )}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => setShowPasswordModal(false)}
            className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 text-sm bg-accent text-white rounded hover:opacity-90 transition-opacity"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Toolbar ── */
function EditToolbar() {
  const { exitEditMode } = useEditMode();
  const { saveContent, revertContent, resetContent } = useLanguage();
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="edit-toolbar">
      <div className="flex items-center gap-2 md:gap-3">
        <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs md:text-sm font-semibold">Edit Mode</span>
      </div>
      <div className="flex items-center gap-1.5 md:gap-2">
        {showReset ? (
          <>
            <span className="text-xs text-red-500 mr-1">
              초기화 하시겠습니까?
            </span>
            <button
              onClick={() => {
                resetContent();
                exitEditMode();
                setShowReset(false);
              }}
              className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              확인
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              아니오
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowReset(true)}
              className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={() => {
                revertContent();
                exitEditMode();
              }}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={() => {
                saveContent();
                exitEditMode();
              }}
              className="px-3 py-1.5 text-xs bg-accent text-white rounded hover:opacity-90 transition-opacity"
            >
              저장
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 0: Hero
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HeroSlide() {
  const { t } = useLanguage();
  const { isEditing } = useEditMode();

  const hashtags = t.hero.field
    .split(" / ")
    .map((f: string) => `#${f.replace(/\s+/g, "")}`);

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line" />
      <div className="absolute bottom-[140px] left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line" />
      <div className="absolute top-[48px] left-[72px] w-[14px] h-[14px] bg-foreground hidden md:block" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 pt-20 pb-10 md:pl-28 md:pr-20 md:pt-24 md:pb-16 overflow-y-auto no-scrollbar">
        {/* Title */}
        <h1 className="text-[clamp(1.8rem,7.5vw,6.5rem)] font-black leading-[1.05] tracking-[-0.03em]">
          <ET path="hero.nameEn" inline />&apos;s
          <br />
          <ET path="hero.subtitle" inline />
        </h1>

        {/* Bottom section */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold">
                <ET path="hero.field" />
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {hashtags.map((tag: string) => (
                <p key={tag} className="text-sm font-semibold">
                  {tag}
                </p>
              ))}
            </div>
          )}
          <div className="h-px bg-grid-line max-w-lg" />
          <p className="text-base">
            <ET path="about.greeting" />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 1: Profile
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProfileSlide() {
  const { t, addListItem, removeListItem, updateField } = useLanguage();
  const { isEditing } = useEditMode();

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line" />
      <div className="absolute bottom-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line" />
      <div className="absolute top-0 bottom-0 left-[30%] w-px bg-grid-line hidden md:block" />
      <div className="absolute top-[48px] left-[30%] w-[14px] h-[14px] bg-foreground hidden md:block" />

      <div className="relative z-10 h-full flex flex-col md:flex-row px-6 pt-16 pb-12 md:pl-28 md:pr-16 md:pt-20 md:pb-16 gap-6 md:gap-0 overflow-y-auto no-scrollbar">
        {/* Left: Profile info */}
        <div className="md:w-[28%] flex flex-col md:pr-10 shrink-0">
          <img
            src="/images/profile.png"
            alt={t.profile.name}
            className="w-[120px] h-[150px] md:w-[180px] md:h-[220px] rounded-sm object-cover shrink-0"
          />

          <h2 className="text-xl md:text-2xl font-bold mt-4 md:mt-6">
            <ET path="profile.name" />
          </h2>
          <p className="text-xs md:text-sm text-secondary mt-1">
            <ET path="profile.nameEn" />
          </p>

          <div className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <svg
                className="w-4 h-4 text-secondary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span className="flex-1 min-w-0">
                <ET path="profile.phone" />
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-4 h-4 text-secondary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="flex-1 min-w-0 break-all">
                <ET path="profile.email" />
              </span>
            </div>
          </div>

          <p className="mt-6 md:mt-8 text-sm leading-relaxed text-secondary hidden md:block">
            <ET path="about.greeting" />
          </p>
        </div>

        {/* Middle: Education + Experience */}
        <div className="md:w-[36%] md:px-10 space-y-6 md:space-y-10">
          {/* Education */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-5">
              <span className="w-[10px] h-[10px] bg-foreground inline-block" />
              EDUCATION
            </h3>
            <div className="space-y-4 text-sm">
              {t.profile.education.map((edu, i) => (
                <div key={i} className="relative group">
                  {isEditing && t.profile.education.length > 1 && (
                    <div className="absolute -right-2 -top-1 z-10">
                      <RemoveBtn
                        onClick={() =>
                          removeListItem("profile.education", i)
                        }
                      />
                    </div>
                  )}
                  <p className="text-secondary">
                    <ET path={`profile.education[${i}].period`} />
                  </p>
                  <p>
                    <ET path={`profile.education[${i}].school`} inline /> |{" "}
                    <ET path={`profile.education[${i}].degree`} inline />
                  </p>
                  <p className="text-secondary">
                    <ET path={`profile.education[${i}].major`} />
                  </p>
                </div>
              ))}
              {isEditing && (
                <AddBtn
                  onClick={() =>
                    addListItem("profile.education", {
                      period: "",
                      school: "",
                      major: "",
                      degree: "",
                    })
                  }
                />
              )}
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-5">
              <span className="w-[10px] h-[10px] bg-foreground inline-block" />
              EXPERIENCE
            </h3>
            <div className="space-y-4 text-sm">
              {t.experience.items.map((exp, i) => (
                <div key={i} className="relative group">
                  {isEditing && t.experience.items.length > 1 && (
                    <div className="absolute -right-2 -top-1 z-10">
                      <RemoveBtn
                        onClick={() =>
                          removeListItem("experience.items", i)
                        }
                      />
                    </div>
                  )}
                  <p className="text-secondary">
                    <ET path={`experience.items[${i}].period`} />
                  </p>
                  <p>
                    <ET path={`experience.items[${i}].org`} inline /> |{" "}
                    <ET path={`experience.items[${i}].role`} inline />
                  </p>
                </div>
              ))}
              {isEditing && (
                <AddBtn
                  onClick={() =>
                    addListItem("experience.items", {
                      period: "",
                      role: "",
                      org: "",
                    })
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: Skills */}
        <div className="md:w-[36%] md:px-10 space-y-6 md:space-y-10">
          {/* Expertise */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-5">
              <span className="w-[10px] h-[10px] bg-foreground inline-block" />
              EXPERTISE
            </h3>
            <div className="space-y-2 text-sm">
              {t.skills.categories.map((cat, i) => (
                <div key={i} className="relative group">
                  {isEditing && t.skills.categories.length > 1 && (
                    <div className="absolute -right-2 -top-1 z-10">
                      <RemoveBtn
                        onClick={() =>
                          removeListItem("skills.categories", i)
                        }
                      />
                    </div>
                  )}
                  <p className="font-medium">
                    <ET path={`skills.categories[${i}].name`} />
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={cat.items.join(", ")}
                      onChange={(e) =>
                        updateField(
                          `skills.categories[${i}].items`,
                          e.target.value
                            .split(",")
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                        )
                      }
                      className="edit-input text-secondary"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="text-secondary">{cat.items.join(", ")}</p>
                  )}
                </div>
              ))}
              {isEditing && (
                <AddBtn
                  onClick={() =>
                    addListItem("skills.categories", {
                      name: "",
                      items: [""],
                    })
                  }
                />
              )}
            </div>
          </div>

          {/* Skill levels */}
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold mb-5">
              <span className="w-[10px] h-[10px] bg-foreground inline-block" />
              SKILL
            </h3>
            <div className="space-y-3 text-sm">
              {t.skills.categories.map((cat) => (
                <div
                  key={cat.name}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="truncate">{cat.name}</span>
                  <div className="flex gap-1 shrink-0">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span
                        key={n}
                        className={`w-3 h-3 rounded-full ${
                          n <= (SKILL_LEVELS[cat.name] || 3)
                            ? "bg-foreground"
                            : "border border-foreground/25"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 2: About
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function AboutSlide() {
  const { t } = useLanguage();
  const { isEditing } = useEditMode();

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line" />
      <div className="absolute top-[46%] left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute bottom-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line" />
      <div className="absolute top-[calc(46%-8px)] left-[72px] w-[14px] h-[14px] bg-foreground hidden md:block" />

      <div className="relative z-10 h-full flex flex-col justify-between px-6 pt-16 pb-12 md:pl-28 md:pr-20 md:pt-24 md:pb-16 overflow-y-auto no-scrollbar">
        {/* Big statement */}
        <h2 className="text-[clamp(1.3rem,4.5vw,3.2rem)] font-extrabold leading-[1.35] tracking-[-0.02em] max-w-[900px]">
          {isEditing ? (
            <ET path="about.greeting" />
          ) : (
            <>
              {t.about.greeting.replace(".", "")}
              <span className="text-accent">.</span>
            </>
          )}
        </h2>

        {/* Description */}
        <div className="max-w-3xl">
          <p className="text-sm md:text-base leading-[1.8] md:leading-[1.9] tracking-wide">
            <ETA path="about.description" rows={5} />
          </p>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 3: Projects Overview
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectsSlide({
  onNavigate,
}: {
  onNavigate: (slideIndex: number) => void;
}) {
  const { t } = useLanguage();
  const { isEditing } = useEditMode();

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line" />
      <div className="absolute top-[62%] left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute bottom-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line" />
      <div className="absolute top-0 bottom-0 left-[33.33%] w-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-[66.66%] w-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 right-20 w-px bg-grid-line hidden md:block" />
      <div className="absolute top-[48px] right-[72px] w-[14px] h-[14px] bg-foreground hidden md:block" />

      <div className="relative z-10 h-full px-6 pt-16 pb-12 md:px-24 md:pt-20 md:pb-16 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 h-full">
          {t.projects.items.map((project, i) => (
            <button
              key={project.id}
              onClick={() => !isEditing && onNavigate(4 + i)}
              className={`group flex flex-col text-left px-2 md:px-6 transition-opacity ${
                isEditing
                  ? "cursor-default"
                  : "cursor-pointer hover:opacity-80"
              }`}
            >
              {/* Image placeholder */}
              <div
                className="w-full aspect-[4/3] rounded-sm mb-4 md:mb-6 transition-transform duration-300 group-hover:scale-[1.02]"
                style={{
                  background: GRADIENTS[i % GRADIENTS.length],
                }}
              />

              {/* Info */}
              <h3 className="text-lg md:text-xl font-bold mb-2">Case {i + 1}</h3>
              <p className="text-sm mb-1">
                <span className="text-secondary mr-1">&bull;</span>
                <ET path={`projects.items[${i}].summary`} />
              </p>
              <p className="text-sm text-secondary mt-2">
                <ET path={`projects.items[${i}].period`} />
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 4-6: Project Detail
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProjectDetailSlide({
  project,
  index,
  projectIndex,
}: {
  project: Project;
  index: number;
  projectIndex: number;
}) {
  const { isEditing } = useEditMode();
  const { t, updateField, addListItem, removeListItem } = useLanguage();
  const pi = projectIndex;

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute bottom-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-[42%] w-px bg-grid-line hidden md:block" />

      <div className="relative z-10 h-full flex flex-col md:flex-row overflow-y-auto no-scrollbar">
        {/* Left: Image */}
        <div
          className="md:w-[42%] h-[160px] md:h-full shrink-0"
          style={{
            background:
              GRADIENTS[(index - 1) % GRADIENTS.length] || GRADIENTS[0],
          }}
        />

        {/* Right: Info */}
        <div className="md:w-[58%] flex flex-col justify-center px-6 py-8 md:px-16 md:py-20 overflow-y-auto no-scrollbar">
          <p className="text-xs md:text-sm font-semibold text-secondary mb-3 md:mb-4">
            Case {index}
          </p>

          <h2 className="text-xl md:text-[2.2rem] font-extrabold mb-2 md:mb-3 leading-tight">
            <ET path={`projects.items[${pi}].title`} />
          </h2>

          {isEditing ? (
            <p className="text-xs md:text-sm text-secondary mb-6 md:mb-10">
              <ET path={`projects.items[${pi}].stack`} className="text-secondary" />
            </p>
          ) : (
            <p className="text-xs md:text-sm text-secondary mb-6 md:mb-10">
              {project.stack.map((s) => `#${s}`).join("  ")}
            </p>
          )}

          {/* Info table */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex gap-3 md:gap-5 items-start">
              <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 bg-foreground text-white text-[10px] md:text-xs font-semibold rounded-[2px] w-[72px] md:w-[84px] shrink-0">
                일시
              </span>
              <span className="text-sm pt-0.5 flex-1 min-w-0">
                <ET path={`projects.items[${pi}].period`} />
              </span>
            </div>

            <div className="flex gap-3 md:gap-5 items-start">
              <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 bg-foreground text-white text-[10px] md:text-xs font-semibold rounded-[2px] w-[72px] md:w-[84px] shrink-0">
                클라이언트
              </span>
              <span className="text-sm pt-0.5 flex-1 min-w-0">
                <ET path={`projects.items[${pi}].org`} />
              </span>
            </div>

            <div className="flex gap-3 md:gap-5 items-start">
              <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 bg-foreground text-white text-[10px] md:text-xs font-semibold rounded-[2px] w-[72px] md:w-[84px] shrink-0">
                역할
              </span>
              <span className="text-sm pt-0.5 flex-1 min-w-0">
                <ET path={`projects.items[${pi}].role`} />
              </span>
            </div>

            <div className="flex gap-3 md:gap-5 items-start">
              <span className="inline-flex items-center justify-center px-2 md:px-3 py-1 bg-foreground text-white text-[10px] md:text-xs font-semibold rounded-[2px] w-[72px] md:w-[84px] shrink-0">
                활동소개
              </span>
              <div className="text-sm leading-relaxed pt-0.5 flex-1 min-w-0">
                <ETA
                  path={`projects.items[${pi}].description`}
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Contributions */}
          <div className="mt-6 md:mt-10 space-y-2">
            {project.contributions.map((c, j) => (
              <div key={j} className="flex items-center gap-2">
                <span className="text-secondary shrink-0">&bull;</span>
                <span className="text-sm text-secondary flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={c}
                      onChange={(e) =>
                        updateField(
                          `projects.items[${pi}].contributions[${j}]`,
                          e.target.value
                        )
                      }
                      className="edit-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    c
                  )}
                </span>
                {isEditing &&
                  t.projects.items[pi].contributions.length > 1 && (
                    <RemoveBtn
                      onClick={() =>
                        removeListItem(
                          `projects.items[${pi}].contributions`,
                          j
                        )
                      }
                    />
                  )}
              </div>
            ))}
            {isEditing && (
              <AddBtn
                onClick={() =>
                  addListItem(`projects.items[${pi}].contributions`, "")
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SLIDE 7: Contact
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ContactSlide() {
  const { t, addListItem, removeListItem } = useLanguage();
  const { isEditing } = useEditMode();

  return (
    <div className="relative h-full bg-white">
      {/* Grid decorations */}
      <div className="absolute top-14 left-0 right-0 h-px bg-grid-line" />
      <div className="absolute bottom-14 left-0 right-0 h-px bg-grid-line hidden md:block" />
      <div className="absolute top-0 bottom-0 left-6 md:left-20 w-px bg-grid-line" />
      <div className="absolute top-[48px] left-[72px] w-[14px] h-[14px] bg-accent hidden md:block" />

      <div className="relative z-10 h-full flex flex-col justify-center px-6 md:pl-28 md:pr-20 overflow-y-auto no-scrollbar">
        <h2 className="text-3xl md:text-6xl font-black mb-10 md:mb-16 tracking-[-0.03em]">
          CONTACT
        </h2>

        <div className="space-y-0 max-w-xl">
          {t.contact.items.map((item, i) => (
            <div key={i} className="relative group">
              <div className="flex items-center gap-4 md:gap-8 py-4 md:py-5">
                <span className="text-xs md:text-sm text-secondary w-14 md:w-16 shrink-0 tracking-wide">
                  <ET path={`contact.items[${i}].label`} />
                </span>
                <span className="text-sm md:text-base font-medium flex-1 min-w-0">
                  <ET path={`contact.items[${i}].value`} />
                </span>
                {isEditing && t.contact.items.length > 1 && (
                  <RemoveBtn
                    onClick={() => removeListItem("contact.items", i)}
                  />
                )}
              </div>
              <div className="h-px bg-grid-line" />
            </div>
          ))}
          {isEditing && (
            <div className="pt-3">
              <AddBtn
                onClick={() =>
                  addListItem("contact.items", { label: "", value: "" })
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN PORTFOLIO COMPONENT
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Portfolio() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { t } = useLanguage();
  const { isEditing, showPasswordModal, setShowPasswordModal } = useEditMode();

  const slides = [
    <HeroSlide key="hero" />,
    <ProfileSlide key="profile" />,
    <AboutSlide key="about" />,
    <ProjectsSlide key="projects" onNavigate={scrollToSlide} />,
    ...t.projects.items.map((p, i) => (
      <ProjectDetailSlide
        key={p.id}
        project={p}
        index={i + 1}
        projectIndex={i}
      />
    )),
    <ContactSlide key="contact" />,
  ];

  const total = slides.length;

  function scrollToSlide(idx: number) {
    slideRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
  }

  const next = useCallback(() => {
    setCurrent((c) => {
      const nextIdx = Math.min(c + 1, total - 1);
      slideRefs.current[nextIdx]?.scrollIntoView({ behavior: "smooth" });
      return nextIdx;
    });
  }, [total]);

  const prev = useCallback(() => {
    setCurrent((c) => {
      const prevIdx = Math.max(c - 1, 0);
      slideRefs.current[prevIdx]?.scrollIntoView({ behavior: "smooth" });
      return prevIdx;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (idx >= 0) setCurrent(idx);
          }
        });
      },
      { root: container, threshold: 0.5 }
    );

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isEditing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, isEditing]);

  return (
    <div className="relative w-screen h-screen bg-[#F5F5F5] select-none">
      {isEditing && <EditToolbar />}
      {showPasswordModal && <PasswordModal />}

      {/* Edit button — visible on all pages */}
      {!isEditing && (
        <button
          onClick={() => setShowPasswordModal(true)}
          className="absolute top-2 right-3 md:top-3 md:right-5 z-30 flex items-center gap-1 md:gap-1.5 px-2 py-1 md:px-3 md:py-1.5 rounded bg-white/80 border border-grid-line hover:bg-accent hover:text-white hover:border-accent transition-all duration-200 group"
          aria-label="Edit"
        >
          <svg
            className="w-3.5 h-3.5 text-secondary group-hover:text-white transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 3.487a2.1 2.1 0 1 1 2.97 2.97L7.5 18.79l-4 1 1-4L16.862 3.487z"
            />
          </svg>
          <span className="text-xs font-medium text-secondary group-hover:text-white transition-colors">
            Edit
          </span>
        </button>
      )}

      <div
        ref={containerRef}
        className={`h-full overflow-y-auto snap-y snap-mandatory no-scrollbar ${
          isEditing ? "pt-[49px]" : ""
        }`}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`snap-start ${isEditing ? "min-h-screen" : "h-screen"}`}
            style={isEditing ? { height: "100vh" } : undefined}
          >
            {slide}
          </div>
        ))}
      </div>

      {current > 0 && !isEditing && (
        <button
          onClick={prev}
          className="absolute left-1 md:left-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-2xl md:text-3xl font-light text-foreground/30 hover:text-foreground/70 transition-colors"
          aria-label="Previous slide"
        >
          &#8249;
        </button>
      )}

      {current < total - 1 && !isEditing && (
        <button
          onClick={next}
          className="absolute right-1 md:right-5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-2xl md:text-3xl font-light text-foreground/30 hover:text-foreground/70 transition-colors"
          aria-label="Next slide"
        >
          &#8250;
        </button>
      )}

      <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSlide(i)}
            className={`h-1 md:h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-accent w-3.5 md:w-5"
                : "bg-foreground/15 w-1 md:w-1.5 hover:bg-foreground/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-3 md:bottom-5 right-4 md:right-8 z-20 text-[10px] md:text-[11px] text-secondary tracking-widest font-medium">
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}
