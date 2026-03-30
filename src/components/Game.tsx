import { useCallback, useReducer, useEffect } from "react";
import { AnimatePresence, useReducedMotion, LazyMotion } from "framer-motion";
import {
  ICONS,
  shuffleSeeded,
  pickSeeded,
  createRng,
  hashSeed,
  generateSeed,
  type IconEntry,
} from "@/data/icons";
import { SetupPhase } from "@/components/SetupPhase";
import { PlayingPhase } from "@/components/PlayingPhase";
import { ResultsPhase } from "@/components/ResultsPhase";
import { features } from "@/lib/motion-features";

type GamePhase = "setup" | "playing" | "results";

interface Question {
  icon: IconEntry;
  options: string[];
  correctAnswer: string;
}

interface Answer {
  icon: IconEntry;
  selected: string | null;
  correct: boolean;
}

interface GameState {
  phase: GamePhase;
  numIcons: number;
  numOptions: number;
  seed: string;
  questions: Question[];
  currentIndex: number;
  answers: Answer[];
  selectedAnswer: string | null;
  hasAnswered: boolean;
}

type GameAction =
  | { type: "START_GAME"; questions: Question[]; seed: string }
  | { type: "RESTORE_GAME"; questions: Question[]; seed: string; answers: Answer[]; currentIndex: number; hasAnswered: boolean; selectedAnswer: string | null }
  | { type: "SET_NUM_ICONS"; numIcons: number }
  | { type: "SET_NUM_OPTIONS"; numOptions: number }
  | { type: "ANSWER"; answer: string; correct: boolean; icon: IconEntry }
  | { type: "NEXT_QUESTION" }
  | { type: "RESTART" };

function buildInitialState(numIcons: number, numOptions: number): GameState {
  return {
    phase: "setup",
    numIcons,
    numOptions,
    seed: "",
    questions: [],
    currentIndex: 0,
    answers: [],
    selectedAnswer: null,
    hasAnswered: false,
  };
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "SET_NUM_ICONS":
      return { ...state, numIcons: action.numIcons };
    case "SET_NUM_OPTIONS":
      return { ...state, numOptions: action.numOptions };
    case "START_GAME":
      return {
        ...state,
        questions: action.questions,
        seed: action.seed,
        currentIndex: 0,
        answers: [],
        selectedAnswer: null,
        hasAnswered: false,
        phase: "playing",
      };
    case "RESTORE_GAME":
      return {
        ...state,
        questions: action.questions,
        seed: action.seed,
        answers: action.answers,
        currentIndex: action.currentIndex,
        hasAnswered: action.hasAnswered,
        selectedAnswer: action.selectedAnswer,
        phase: action.currentIndex >= action.questions.length ? "results" : "playing",
      };
    case "ANSWER":
      return {
        ...state,
        selectedAnswer: action.answer,
        hasAnswered: true,
        answers: [
          ...state.answers,
          { icon: action.icon, selected: action.answer, correct: action.correct },
        ],
      };
    case "NEXT_QUESTION":
      if (state.currentIndex + 1 >= state.questions.length) {
        return { ...state, phase: "results" };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        hasAnswered: false,
      };
    case "RESTART":
      return buildInitialState(state.numIcons, state.numOptions);
    default:
      return state;
  }
}

function generateQuestions(
  icons: IconEntry[],
  numQuestions: number,
  numOptions: number,
  seed: string
): Question[] {
  const rng = createRng(hashSeed(seed));
  const selectedIcons = pickSeeded(icons, numQuestions, rng);
  const allNames = icons.map((i) => i.name);

  return selectedIcons.map((icon) => {
    const wrongPool = allNames.filter((n) => n !== icon.name);
    const wrongNames = shuffleSeeded(wrongPool, rng).slice(0, numOptions - 1);
    const options = shuffleSeeded([icon.name, ...wrongNames], rng);
    return { icon, options, correctAnswer: icon.name };
  });
}

function buildShareUrl(numIcons: number, numOptions: number, seed: string): string {
  const base = `${window.location.origin}/knowyourai`;
  return `${base}/q/${numIcons}/${numOptions}?seed=${seed}`;
}

// localStorage helpers
const STORAGE_PREFIX = "kya_game_";

interface SavedProgress {
  answers: { filename: string; name: string; selected: string | null; correct: boolean }[];
  currentIndex: number;
  hasAnswered: boolean;
  selectedAnswer: string | null;
}

function saveProgress(seed: string, state: GameState) {
  if (!seed) return;
  const data: SavedProgress = {
    answers: state.answers.map((a) => ({
      filename: a.icon.filename,
      name: a.icon.name,
      selected: a.selected,
      correct: a.correct,
    })),
    currentIndex: state.currentIndex,
    hasAnswered: state.hasAnswered,
    selectedAnswer: state.selectedAnswer,
  };
  try {
    localStorage.setItem(STORAGE_PREFIX + seed, JSON.stringify(data));
  } catch {}
}

function loadProgress(seed: string): SavedProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + seed);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProgress;
  } catch {
    return null;
  }
}

function clearProgress(seed: string) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + seed);
  } catch {}
}

function readSeedFromDom(): string {
  if (typeof document === "undefined") return "";
  const el = document.getElementById("game-root");
  return el?.dataset?.seed || "";
}

interface GameProps {
  initialNumIcons?: number;
  initialNumOptions?: number;
  initialSeed?: string;
}

export function Game({
  initialNumIcons = 10,
  initialNumOptions = 4,
  initialSeed = "",
}: GameProps) {
  // Read seed from DOM data attribute (set by inline script on /q pages)
  const seed = initialSeed || readSeedFromDom();

  const [state, dispatch] = useReducer(
    gameReducer,
    null,
    () => buildInitialState(initialNumIcons, initialNumOptions)
  );
  const prefersReducedMotion = useReducedMotion();

  // If we have a seed, start or restore the game immediately
  useEffect(() => {
    if (!seed) return;

    const questions = generateQuestions(ICONS, initialNumIcons, initialNumOptions, seed);
    const saved = loadProgress(seed);

    if (saved && saved.answers.length > 0) {
      const iconMap = new Map(questions.map((q) => [q.icon.filename, q.icon]));
      const answers: Answer[] = saved.answers.map((a) => ({
        icon: iconMap.get(a.filename) || ({ filename: a.filename, name: a.name } as IconEntry),
        selected: a.selected,
        correct: a.correct,
      }));

      dispatch({
        type: "RESTORE_GAME",
        questions,
        seed,
        answers,
        currentIndex: saved.currentIndex,
        hasAnswered: saved.hasAnswered,
        selectedAnswer: saved.selectedAnswer,
      });
    } else {
      dispatch({ type: "START_GAME", questions, seed });
    }
  }, [seed]);

  // Save progress after each action
  useEffect(() => {
    if (state.phase === "playing" && state.seed) {
      saveProgress(state.seed, state);
    }
  }, [state.answers, state.currentIndex, state.hasAnswered, state.phase, state.seed]);

  const startGame = useCallback(() => {
    const seed = generateSeed();
    const url = buildShareUrl(state.numIcons, state.numOptions, seed);
    // Generate questions and start immediately - no page reload
    const questions = generateQuestions(ICONS, state.numIcons, state.numOptions, seed);
    dispatch({ type: "START_GAME", questions, seed });
    // Update URL so refresh/sharing works
    window.history.pushState({}, "", url);
  }, [state.numIcons, state.numOptions]);

  const handleAnswer = (answer: string) => {
    if (state.hasAnswered) return;
    const question = state.questions[state.currentIndex];
    const correct = answer === question.correctAnswer;
    dispatch({ type: "ANSWER", answer, correct, icon: question.icon });
  };

  const handleShare = async () => {
    const score = state.answers.filter((a) => a.correct).length;
    const total = state.questions.length;
    const url = buildShareUrl(state.numIcons, state.numOptions, state.seed);
    const shareText = `I scored ${score}/${total} on KnowYourAI. Think you can beat me? ${url}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "KnowYourAI", text: shareText, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  const handleRestart = () => {
    if (state.seed) clearProgress(state.seed);
    dispatch({ type: "RESTART" });
  };

  const score = state.answers.filter((a) => a.correct).length;
  const total = state.questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const shareUrl = state.seed
    ? buildShareUrl(state.numIcons, state.numOptions, state.seed)
    : "";

  return (
    <LazyMotion features={features}>
      <AnimatePresence mode="wait">
        {state.phase === "setup" && (
          <SetupPhase
            key="setup"
            numIcons={state.numIcons}
            numOptions={state.numOptions}
            onNumIconsChange={(n) => dispatch({ type: "SET_NUM_ICONS", numIcons: n })}
            onNumOptionsChange={(n) => dispatch({ type: "SET_NUM_OPTIONS", numOptions: n })}
            onStart={startGame}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}

        {state.phase === "playing" && state.questions.length > 0 && (
          <PlayingPhase
            key={`playing-${state.currentIndex}`}
            question={state.questions[state.currentIndex]}
            currentIndex={state.currentIndex}
            total={total}
            score={score}
            selectedAnswer={state.selectedAnswer}
            hasAnswered={state.hasAnswered}
            onAnswer={handleAnswer}
            onNext={() => dispatch({ type: "NEXT_QUESTION" })}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}

        {state.phase === "results" && (
          <ResultsPhase
            key="results"
            answers={state.answers}
            score={score}
            total={total}
            percentage={percentage}
            shareUrl={shareUrl}
            numIcons={state.numIcons}
            numOptions={state.numOptions}
            onShare={handleShare}
            onRestart={handleRestart}
            prefersReducedMotion={!!prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
