import type { FeedbackRuleDef, WidgetSpec } from "../content/schema";

/** Konkret, genereret opgaveinstans — gemmes i exercise_instances.rendered */
export type RenderedInstance = {
  templateId: string;
  seed: number;
  variables: Record<string, number | string>;
  prompt: {
    text: string;
    inputWidget?: WidgetSpec;
  };
  answer: RenderedAnswer;
  hints: { level: number; text: string }[];
  solutionSteps: string[];
  /** Mønstrede forkerte svar → misforståelses-kode (doc 05 §5.8) */
  distractors: RenderedDistractor[];
  feedbackRules: FeedbackRuleDef[];
  difficulty: number;
  knowledgeComponents: string[];
};

export type RenderedDistractor = {
  /** Numerisk værdi (numeric/point-validatorer) */
  value?: number;
  /** Udtryk med frie variable (expression-validator) */
  expr?: string;
  misconception: string;
};

export type RenderedAnswer =
  | {
      validator: "numeric";
      value: number;
      unit?: string;
      tolerance: number;
      requireUnit: boolean;
    }
  | {
      validator: "expression";
      value: string;
      variables: string[];
    }
  | {
      validator: "mcq" | "multi";
      options: {
        id: string;
        text: string;
        correct: boolean;
        misconception?: string;
      }[];
    }
  | {
      validator: "point" | "graph";
      x: number;
      y: number;
      tolerance: number;
    };

/** Elevens indsendte svar */
export type SubmittedAnswer =
  | { kind: "numeric"; raw: string }
  | { kind: "expression"; raw: string }
  | { kind: "mcq"; optionId: string }
  | { kind: "multi"; optionIds: string[] }
  | { kind: "point"; x: number; y: number };

/** Alle validatorer returnerer samme kontrakt (doc 06 §6.8) */
export type ValidationResult = {
  correct: boolean;
  closeness: number; // 0..1
  misconceptionCode?: string;
  feedbackId?: string;
  /** Udfyldt af feedback-motoren: den målrettede besked til eleven */
  feedbackMessage?: string;
  missingUnit?: boolean;
};
