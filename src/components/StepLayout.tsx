import { ReactNode } from "react";

interface StepLayoutProps {
  chapter: string;
  step: number;
  totalSteps: number;
  title: string;
  children: ReactNode;
}

export function StepLayout({ chapter, step, totalSteps, title, children }: StepLayoutProps) {
  return (
    <main className="step-shell">
      <p className="step-kicker">{chapter}</p>
      <p className="step-progress">
        Step {step} of {totalSteps}
      </p>
      <h1 className="step-title">{title}</h1>
      <section className="step-content">{children}</section>
    </main>
  );
}
