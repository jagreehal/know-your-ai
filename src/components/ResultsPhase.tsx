import { m } from 'framer-motion';
import { getIconPath, type IconEntry } from '@/data/icons';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
  Share2,
  RotateCcw,
  Trophy,
  Sparkles,
  Link2,
  Copy,
} from 'lucide-react';
import { useState } from 'react';

interface Answer {
  icon: IconEntry;
  selected: string | null;
  correct: boolean;
}

interface ResultsPhaseProps {
  answers: Answer[];
  score: number;
  total: number;
  percentage: number;
  shareUrl: string;
  numIcons: number;
  numOptions: number;
  onShare: () => void;
  onRestart: () => void;
  prefersReducedMotion: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

const reducedContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
};

const scoreVariants = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 80,
      damping: 14,
      delay: 0.15,
    },
  },
};

const reducedScoreVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

function getGrade(percentage: number): { label: string; color: string } {
  if (percentage >= 90)
    return { label: 'Expert', color: 'text-emerald-600 dark:text-emerald-400' };
  if (percentage >= 70)
    return {
      label: 'Advanced',
      color: 'text-emerald-600 dark:text-emerald-400',
    };
  if (percentage >= 50)
    return {
      label: 'Intermediate',
      color: 'text-amber-600 dark:text-amber-400',
    };
  return { label: 'Beginner', color: 'text-rose-500 dark:text-rose-400' };
}

export function ResultsPhase({
  answers,
  score,
  total,
  percentage,
  shareUrl,
  numIcons,
  numOptions,
  onShare,
  onRestart,
  prefersReducedMotion,
}: ResultsPhaseProps) {
  const grade = getGrade(percentage);
  const container = prefersReducedMotion
    ? reducedContainerVariants
    : containerVariants;
  const item = prefersReducedMotion ? reducedItemVariants : itemVariants;
  const scoreV = prefersReducedMotion ? reducedScoreVariants : scoreVariants;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const text = `I scored ${score}/${total} on know-your-ai. Think you can beat me? ${shareUrl}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onShare();
    }
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] w-full py-20 md:py-28 px-4"
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        {/* Score card */}
        <m.div
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 30, scale: 0.97 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.2 }
              : { type: 'spring' as const, stiffness: 80, damping: 20 }
          }
          className="relative w-full bg-white dark:bg-zinc-900 rounded-[2rem] diffusion-shadow border border-zinc-200/50 dark:border-zinc-800/50 p-10 md:p-14 flex flex-col items-center gap-6 overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />

          <m.div
            variants={scoreV}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Final Score
              </span>
            </div>

            <m.div
              className="text-7xl md:text-8xl font-semibold tracking-tighter text-zinc-900 dark:text-zinc-100 tabular-nums"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.2 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.2, delay: 0.15 }
                  : {
                      type: 'spring' as const,
                      stiffness: 50,
                      damping: 10,
                      delay: 0.3,
                    }
              }
            >
              {percentage}
              <span className="text-4xl md:text-5xl text-zinc-400 dark:text-zinc-500">
                %
              </span>
            </m.div>

            <m.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: prefersReducedMotion ? 0.1 : 0.55,
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
              }}
              className={cn(
                'text-sm font-semibold uppercase tracking-wider',
                grade.color,
              )}
            >
              {grade.label}
            </m.span>
          </m.div>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: prefersReducedMotion ? 0.1 : 0.6 }}
            className="text-base text-zinc-500 dark:text-zinc-400"
          >
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {score}
            </span>{' '}
            out of{' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {total}
            </span>{' '}
            correct
          </m.p>

          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <m.div
              className={cn(
                'h-full rounded-full',
                percentage >= 70
                  ? 'bg-emerald-500'
                  : percentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500',
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={
                prefersReducedMotion
                  ? { duration: 0.3 }
                  : {
                      type: 'spring' as const,
                      stiffness: 30,
                      damping: 18,
                      delay: 0.5,
                    }
              }
            />
          </div>
        </m.div>

        {/* Share link card */}
        <m.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.2, delay: 0.2 }
              : {
                  delay: 0.6,
                  type: 'spring' as const,
                  stiffness: 100,
                  damping: 20,
                }
          }
          className="w-full bg-white dark:bg-zinc-900 rounded-[2rem] diffusion-shadow border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 flex flex-col gap-5 overflow-hidden relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-400/15 to-transparent" />

          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
              Challenge a friend
            </h3>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Share this link to let someone else try the same quiz ({numIcons}{' '}
            logos, {numOptions} choices)
          </p>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-sm text-zinc-500 dark:text-zinc-400 truncate font-mono text-xs">
              {shareUrl}
            </div>
            <m.button
              whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.96 }}
              onClick={handleCopyLink}
              className={cn(
                'px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shrink-0',
                copied
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200',
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </m.button>
          </div>
        </m.div>

        {/* Review list */}
        <m.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="w-full bg-white dark:bg-zinc-900 rounded-[2rem] diffusion-shadow border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden"
        >
          <div className="p-6 pb-3">
            <h3 className="text-sm font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Review
            </h3>
          </div>

          <div className="px-2 pb-2 max-h-[20rem] overflow-y-auto">
            {answers.map((answer) => (
              <m.div
                key={answer.icon.filename}
                variants={item}
                layout
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors',
                  answer.correct
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10'
                    : 'bg-rose-50/50 dark:bg-rose-900/10',
                )}
              >
                <img
                  src={getIconPath(answer.icon.filename)}
                  alt={answer.icon.name}
                  className="w-8 h-8 object-contain rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {answer.icon.name}
                  </div>
                  {!answer.correct && answer.selected && (
                    <div className="text-xs text-rose-500 dark:text-rose-400 mt-0.5">
                      You picked: {answer.selected}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    answer.correct
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400',
                  )}
                >
                  {answer.correct ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </div>
              </m.div>
            ))}
          </div>
        </m.div>

        {/* Action buttons */}
        <m.div
          initial={
            prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0.2, delay: 0.3 }
              : {
                  delay: 0.9,
                  type: 'spring' as const,
                  stiffness: 100,
                  damping: 20,
                }
          }
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <m.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98, y: 1 }}
            transition={{
              type: 'spring' as const,
              stiffness: 400,
              damping: 17,
            }}
            onClick={onShare}
            className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm tracking-tight transition-colors flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Share2 className="w-4 h-4 relative" />
            <span className="relative">Share Score</span>
          </m.button>
          <m.button
            whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.98, y: 1 }}
            transition={{
              type: 'spring' as const,
              stiffness: 400,
              damping: 17,
            }}
            onClick={onRestart}
            className="flex-1 py-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-2xl font-semibold text-sm tracking-tight transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </m.button>
        </m.div>
      </div>
    </m.div>
  );
}
