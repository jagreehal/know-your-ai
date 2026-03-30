import { m, AnimatePresence } from "framer-motion";
import { getIconPath, type IconEntry } from "@/data/icons";
import { cn } from "@/lib/utils";
import { Check, X, ArrowRight, BarChart3 } from "lucide-react";

interface Question {
  icon: IconEntry;
  options: string[];
  correctAnswer: string;
}

interface PlayingPhaseProps {
  question: Question;
  currentIndex: number;
  total: number;
  score: number;
  selectedAnswer: string | null;
  hasAnswered: boolean;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  prefersReducedMotion: boolean;
}

const optionVariants = {
  hidden: { opacity: 0, x: -20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      delay: i * 0.07,
    },
  }),
};

const reducedOptionVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.15, delay: i * 0.03 },
  }),
};

export function PlayingPhase({
  question,
  currentIndex,
  total,
  score,
  selectedAnswer,
  hasAnswered,
  onAnswer,
  onNext,
  prefersReducedMotion,
}: PlayingPhaseProps) {
  const progress = ((currentIndex) / total) * 100;
  const isLastQuestion = currentIndex + 1 >= total;
  const optVariants = prefersReducedMotion ? reducedOptionVariants : optionVariants;

  return (
    <m.div
      key={`question-${currentIndex}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-[100dvh] w-full flex items-center justify-center px-4"
    >
      <div className="w-full max-w-xl mx-auto flex flex-col gap-8">
        {/* Header bar */}
        <m.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 100, damping: 20 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BarChart3 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 tabular-nums">
              {score} / {currentIndex + (hasAnswered ? 1 : 0)}
            </span>
          </div>
          <span className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums">
            {currentIndex + 1} of {total}
          </span>
        </m.div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <m.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring" as const, stiffness: 60, damping: 20 }}
          />
        </div>

        {/* Question card */}
        <m.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring" as const, stiffness: 80, damping: 20, delay: 0.1 }}
          className="relative bg-white dark:bg-zinc-900 rounded-[2rem] diffusion-shadow border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-12 flex flex-col items-center gap-8 overflow-hidden"
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

          {/* Logo display with glow */}
          <m.div
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={prefersReducedMotion ? { duration: 0.2 } : { type: "spring" as const, stiffness: 100, damping: 18, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-400/5 dark:bg-emerald-400/10 rounded-3xl blur-2xl scale-110" />
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
              <m.img
                key={question.icon.filename}
                initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.7, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={prefersReducedMotion ? { duration: 0.15 } : { type: "spring" as const, stiffness: 120, damping: 16, delay: 0.25 }}
                src={getIconPath(question.icon.filename)}
                alt="Identify this AI company logo"
                className="w-24 h-24 md:w-28 md:h-28 object-contain"
              />
            </div>
          </m.div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base text-zinc-500 dark:text-zinc-400 font-medium"
          >
            Which company is this?
          </m.p>

          {/* Answer options */}
          <div className="flex flex-col gap-2.5 w-full">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctAnswer;

              let styles = "bg-zinc-50 dark:bg-zinc-800 border-zinc-200/60 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm";
              let icon = null;

              if (hasAnswered) {
                if (isCorrect) {
                  styles = "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 shadow-sm shadow-emerald-500/5";
                  icon = <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
                } else if (isSelected) {
                  styles = "bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 shadow-sm shadow-rose-500/5";
                  icon = <X className="w-4 h-4 text-rose-500 dark:text-rose-400" />;
                } else {
                  styles = "bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 opacity-50";
                }
              }

              return (
                <m.button
                  key={option}
                  custom={i}
                  variants={optVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={!hasAnswered && !prefersReducedMotion ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!hasAnswered && !prefersReducedMotion ? { scale: 0.97, y: 1 } : {}}
                  layout
                  onClick={() => onAnswer(option)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full py-4 px-5 rounded-2xl border text-sm font-medium text-left transition-all duration-200 flex items-center justify-between",
                    styles
                  )}
                >
                  <span>{option}</span>
                  {icon}
                </m.button>
              );
            })}
          </div>

          {/* Next button */}
          <AnimatePresence>
            {hasAnswered && (
              <m.button
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={prefersReducedMotion ? { duration: 0.15 } : { type: "spring" as const, stiffness: 100, damping: 20 }}
                whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98, y: 1 }}
                onClick={onNext}
                className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-2xl font-semibold text-sm tracking-tight transition-colors flex items-center justify-center gap-2 relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-black/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative">{isLastQuestion ? "See Results" : "Next Question"}</span>
                <ArrowRight className="w-4 h-4 relative" />
              </m.button>
            )}
          </AnimatePresence>
        </m.div>
      </div>
    </m.div>
  );
}
