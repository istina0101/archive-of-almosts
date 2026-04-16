"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArchiveCard } from "@/components/ArchiveCard";
import { EmotionSelector } from "@/components/EmotionSelector";
import { StepLayout } from "@/components/StepLayout";
import { addArchive } from "@/lib/storage";
import { Emotion, TypographyPattern } from "@/lib/types";

const TOTAL_STEPS = 15;
const CLOSING_ANIMATION_DURATION = 650;

const PATTERNS: TypographyPattern[] = [
  "fragmented",
  "spiral",
  "falling",
  "mirrored",
  "collapse",
  "fading",
  "stretched",
  "heavy",
];

const generateArchiveId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const randomPart = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(8, "0")
  ).join("");
  return `archive-${Date.now()}-${randomPart}`;
};

export default function NewArchivePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [creditMode, setCreditMode] = useState<"anonymous" | "pseudonym" | "date">("anonymous");
  const [stillEnding, setStillEnding] = useState(false);

  const dateCode = useMemo(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `Donor ${now.getFullYear()}-${month}`;
  }, []);

  const [form, setForm] = useState({
    subject: "",
    beganAt: "",
    endedAt: "",
    title: "",
    medium: "",
    origin: "",
    dimensions: "",
    story: "",
    hardestPart: "",
    whatRemains: "",
    emotion: "grief" as Emotion,
    archivistNote: "",
    pseudonym: "",
    finalWords: "",
    typographyPattern: "fragmented" as TypographyPattern,
  });

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const computedEnded = stillEnding ? "It is still ending." : form.endedAt;
  const credit =
    creditMode === "anonymous"
      ? "Anonymous"
      : creditMode === "date"
        ? dateCode
        : form.pseudonym.trim();

  const canAdvance = () => {
    switch (step) {
      case 1:
        return form.subject.trim().length > 0;
      case 2:
        return form.beganAt.trim().length > 0;
      case 3:
        return stillEnding || form.endedAt.trim().length > 0;
      case 4:
        return form.title.trim().length > 0;
      case 5:
        return form.medium.trim().length > 0;
      case 6:
        return form.origin.trim().length > 0;
      case 7:
        return form.dimensions.trim().length > 0;
      case 8:
        return form.story.trim().length > 0;
      case 9:
        return form.hardestPart.trim().length > 0;
      case 10:
        return form.whatRemains.trim().length > 0;
      case 12:
        return form.archivistNote.trim().length > 0;
      case 13:
        return creditMode !== "pseudonym" || form.pseudonym.trim().length > 0;
      default:
        return true;
    }
  };

  const onConfirm = async () => {
    if (!canAdvance()) {
      return;
    }

    const archive = {
      id: generateArchiveId(),
      createdAt: new Date().toISOString(),
      subject: form.subject.trim(),
      beganAt: form.beganAt.trim(),
      endedAt: computedEnded.trim(),
      title: form.title.trim(),
      medium: form.medium.trim(),
      origin: form.origin.trim(),
      dimensions: form.dimensions.trim(),
      story: form.story.trim(),
      hardestPart: form.hardestPart.trim(),
      whatRemains: form.whatRemains.trim(),
      emotion: form.emotion,
      archivistNote: form.archivistNote.trim(),
      credit,
      finalWords: form.finalWords.trim(),
      typographyPattern: form.typographyPattern,
    };

    addArchive(archive);
    setIsClosing(true);

    setTimeout(() => {
      router.push("/collection");
    }, CLOSING_ANIMATION_DURATION);
  };

  const archivePreview = {
    id: "preview",
    createdAt: new Date().toISOString(),
    subject: form.subject || "Untitled almost",
    beganAt: form.beganAt || "Unknown",
    endedAt: computedEnded || "Unknown",
    title: form.title || "Untitled Artifact",
    medium: form.medium || "Not yet described",
    origin: form.origin || "Uncatalogued",
    dimensions: form.dimensions || "Unmeasured",
    story: form.story || "",
    hardestPart: form.hardestPart || "",
    whatRemains: form.whatRemains || "",
    emotion: form.emotion,
    archivistNote: form.archivistNote || "Awaiting archivist note.",
    credit: credit || "Anonymous",
    finalWords: form.finalWords,
    typographyPattern: form.typographyPattern,
  };

  const controls = (
    <div className="flow-actions">
      <button
        type="button"
        className="quiet-button"
        onClick={() => setStep((previous) => Math.max(previous - 1, 1))}
        disabled={step === 1}
      >
        Previous
      </button>
      {step < TOTAL_STEPS ? (
        <button
          type="button"
          className="quiet-button primary"
          onClick={() =>
            canAdvance() && setStep((previous) => Math.min(previous + 1, TOTAL_STEPS))
          }
          disabled={!canAdvance()}
        >
          Continue
        </button>
      ) : (
        <button type="button" className="quiet-button primary" onClick={onConfirm}>
          Enter the collection
        </button>
      )}
    </div>
  );

  return (
    <div
      style={{
        opacity: isClosing ? 0 : 1,
        transition: `opacity ${CLOSING_ANIMATION_DURATION}ms ease`,
      }}
    >
      {step === 1 && (
        <StepLayout
          chapter="Chapter I — Acknowledgment"
          step={1}
          totalSteps={TOTAL_STEPS}
          title="What are you letting go of?"
        >
          <label htmlFor="subject">Name what is being released</label>
          <input
            id="subject"
            name="subject"
            className="field"
            placeholder="A friendship"
            value={form.subject}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 2 && (
        <StepLayout
          chapter="Chapter I — Acknowledgment"
          step={2}
          totalSteps={TOTAL_STEPS}
          title="When did it begin?"
        >
          <label htmlFor="beganAt">When it first took form</label>
          <input
            id="beganAt"
            name="beganAt"
            className="field"
            placeholder="A summer in college"
            value={form.beganAt}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 3 && (
        <StepLayout
          chapter="Chapter I — Acknowledgment"
          step={3}
          totalSteps={TOTAL_STEPS}
          title="When did it end?"
        >
          <label htmlFor="endedAt">When it came apart</label>
          <input
            id="endedAt"
            name="endedAt"
            className="field"
            placeholder="2019"
            value={form.endedAt}
            onChange={update}
            disabled={stillEnding}
          />
          <label className="inline-option" htmlFor="still-ending">
            <input
              id="still-ending"
              type="checkbox"
              checked={stillEnding}
              onChange={(event) => setStillEnding(event.target.checked)}
            />{" "}
            It&apos;s still ending.
          </label>
          {controls}
        </StepLayout>
      )}

      {step === 4 && (
        <StepLayout
          chapter="Chapter II — The Artifact"
          step={4}
          totalSteps={TOTAL_STEPS}
          title="If this thing had a name, what would it be?"
        >
          <label htmlFor="title">Formal artifact title</label>
          <input
            id="title"
            name="title"
            className="field"
            placeholder="The Letter I Didn't Send"
            value={form.title}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 5 && (
        <StepLayout
          chapter="Chapter II — The Artifact"
          step={5}
          totalSteps={TOTAL_STEPS}
          title="What was it made of?"
        >
          <label htmlFor="medium">Medium</label>
          <input
            id="medium"
            name="medium"
            className="field"
            placeholder="Unsent messages and long silences"
            value={form.medium}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 6 && (
        <StepLayout
          chapter="Chapter II — The Artifact"
          step={6}
          totalSteps={TOTAL_STEPS}
          title="Where did it live?"
        >
          <label htmlFor="origin">Origin</label>
          <input
            id="origin"
            name="origin"
            className="field"
            placeholder="Between two airports"
            value={form.origin}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 7 && (
        <StepLayout
          chapter="Chapter II — The Artifact"
          step={7}
          totalSteps={TOTAL_STEPS}
          title="How big was it?"
        >
          <label htmlFor="dimensions">Dimensions</label>
          <input
            id="dimensions"
            name="dimensions"
            className="field"
            placeholder="A lifetime, compressed"
            value={form.dimensions}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 8 && (
        <StepLayout
          chapter="Chapter III — The Story"
          step={8}
          totalSteps={TOTAL_STEPS}
          title="Tell us about it."
        >
          <label htmlFor="story">Story</label>
          <textarea
            id="story"
            name="story"
            className="long-field"
            value={form.story}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 9 && (
        <StepLayout
          chapter="Chapter III — The Story"
          step={9}
          totalSteps={TOTAL_STEPS}
          title="What was the hardest part to let go of?"
        >
          <label htmlFor="hardestPart">The difficult edge</label>
          <input
            id="hardestPart"
            name="hardestPart"
            className="field"
            value={form.hardestPart}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 10 && (
        <StepLayout
          chapter="Chapter III — The Story"
          step={10}
          totalSteps={TOTAL_STEPS}
          title="What remains?"
        >
          <label htmlFor="whatRemains">What remains</label>
          <input
            id="whatRemains"
            name="whatRemains"
            className="field"
            value={form.whatRemains}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 11 && (
        <StepLayout
          chapter="Chapter IV — The Closing"
          step={11}
          totalSteps={TOTAL_STEPS}
          title="Choose the emotion"
        >
          <EmotionSelector
            value={form.emotion}
            onChange={(emotion) => setForm((previous) => ({ ...previous, emotion }))}
          />
          {controls}
        </StepLayout>
      )}

      {step === 12 && (
        <StepLayout
          chapter="Chapter IV — The Closing"
          step={12}
          totalSteps={TOTAL_STEPS}
          title="Write an archivist's note."
        >
          <label htmlFor="archivistNote">
            Describe this archive as if you were a stranger cataloguing it.
          </label>
          <textarea
            id="archivistNote"
            name="archivistNote"
            className="long-field"
            value={form.archivistNote}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 13 && (
        <StepLayout
          chapter="Chapter IV — The Closing"
          step={13}
          totalSteps={TOTAL_STEPS}
          title="How should we credit you?"
        >
          <div className="radio-group" role="radiogroup" aria-label="Credit options">
            <label className="inline-option" htmlFor="credit-anon">
              <input
                id="credit-anon"
                type="radio"
                checked={creditMode === "anonymous"}
                onChange={() => setCreditMode("anonymous")}
              />{" "}
              Anonymous
            </label>
            <label className="inline-option" htmlFor="credit-pseudo">
              <input
                id="credit-pseudo"
                type="radio"
                checked={creditMode === "pseudonym"}
                onChange={() => setCreditMode("pseudonym")}
              />{" "}
              A pseudonym
            </label>
            {creditMode === "pseudonym" && (
              <input
                name="pseudonym"
                className="field"
                placeholder="Name for this filing"
                value={form.pseudonym}
                onChange={update}
              />
            )}
            <label className="inline-option" htmlFor="credit-date">
              <input
                id="credit-date"
                type="radio"
                checked={creditMode === "date"}
                onChange={() => setCreditMode("date")}
              />{" "}
              A date code ({dateCode})
            </label>
          </div>
          {controls}
        </StepLayout>
      )}

      {step === 14 && (
        <StepLayout
          chapter="Chapter IV — The Closing"
          step={14}
          totalSteps={TOTAL_STEPS}
          title="Final words"
        >
          <label htmlFor="finalWords">One-sentence farewell (optional)</label>
          <input
            id="finalWords"
            name="finalWords"
            className="field"
            value={form.finalWords}
            onChange={update}
          />
          {controls}
        </StepLayout>
      )}

      {step === 15 && (
        <StepLayout
          chapter="Chapter IV — The Closing"
          step={15}
          totalSteps={TOTAL_STEPS}
          title="Preview & Confirm"
        >
          <p>Choose a typography pattern for your archive card.</p>
          <div className="pattern-grid">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern}
                type="button"
                className={`quiet-button${form.typographyPattern === pattern ? " primary" : ""}`}
                onClick={() =>
                  setForm((previous) => ({ ...previous, typographyPattern: pattern }))
                }
              >
                {pattern}
              </button>
            ))}
          </div>
          <div className="preview-box">
            <ArchiveCard archive={archivePreview} />
          </div>
          {controls}
        </StepLayout>
      )}
    </div>
  );
}
