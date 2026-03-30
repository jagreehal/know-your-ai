import { m } from "framer-motion";
import { ICONS, getIconPath } from "@/data/icons";
import { Sparkles, Zap, Trophy } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const reducedContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

const shimmerTiles = ICONS.slice(0, 12);

interface SetupPhaseProps {
  numIcons: number;
  numOptions: number;
  onNumIconsChange: (n: number) => void;
  onNumOptionsChange: (n: number) => void;
  onStart: () => void;
  prefersReducedMotion: boolean;
}

export function SetupPhase({
  numIcons,
  numOptions,
  onNumIconsChange,
  onNumOptionsChange,
  onStart,
  prefersReducedMotion,
}: SetupPhaseProps) {
  const iconCounts = [10, 20, 30, 40, ICONS.length];
  const optionCounts = [3, 4, 5];

  const container = prefersReducedMotion ? reducedContainerVariants : containerVariants;
  const item = prefersReducedMotion ? reducedItemVariants : itemVariants;

  return (
    <div className="min-h-[100dvh] w-full relative overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient animate-mesh-drift pointer-events-none" />

      {/* Floating logo tiles */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {shimmerTiles.map((icon, i) => (
          <m.div
            key={icon.filename}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={
              prefersReducedMotion
                ? { opacity: 0.12, scale: 1, y: 0 }
                : {
                    opacity: 0.12,
                    scale: 1,
                    y: [0, -8, 0],
                  }
            }
            transition={
              prefersReducedMotion
                ? { duration: 0.2, delay: i * 0.03 }
                : {
                    opacity: { type: "spring" as const, stiffness: 80, damping: 15, delay: i * 0.05 },
                    scale: { type: "spring" as const, stiffness: 80, damping: 15, delay: i * 0.05 },
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    },
                  }
            }
            className="absolute"
            style={{
              left: `${10 + ((i * 7) % 80)}%`,
              top: `${5 + ((i * 13) % 85)}%`,
            }}
          >
            <img
              src={getIconPath(icon.filename)}
              alt=""
              className="w-10 h-10 md:w-14 md:h-14 object-contain rounded-xl"
              loading="lazy"
            />
          </m.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[100dvh] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
            {/* Left column - Hero */}
            <m.div
              className="md:col-span-7 lg:col-span-6 flex flex-col gap-6"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <m.div variants={item}>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">
                    AI Knowledge Test
                  </span>
                </div>
              </m.div>

              <m.h1
                variants={item}
                className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter leading-[0.95] text-zinc-900 dark:text-zinc-100"
              >
                Can you name
                <br />
                every AI company
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">by its logo?</span>
              </m.h1>

              <m.p
                variants={item}
                className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[50ch]"
              >
                {ICONS.length} logos. One shot each. No second guesses.
                <br className="hidden md:block" />
                How well do you really know the AI landscape?
              </m.p>

              <m.div variants={item} className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                  <Zap className="w-4 h-4" />
                  <span>{ICONS.length} logos</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                <div className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                  <Trophy className="w-4 h-4" />
                  <span>Share your score</span>
                </div>
              </m.div>
            </m.div>

            {/* Right column - Config panel */}
            <m.div
              className="md:col-span-5 lg:col-span-5 md:col-start-8 lg:col-start-7"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              <div className="relative bg-white dark:bg-zinc-900 rounded-[2rem] diffusion-shadow border border-zinc-200/50 dark:border-zinc-800/50 p-8 md:p-10 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

                <m.div variants={item} className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3">
                    <label htmlFor="num-questions" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
                      Questions
                    </label>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      How many logos to guess
                    </p>
                    <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-labelledby="num-questions">
                      {iconCounts.map((count) => (
                        <m.button
                          key={count}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                          onClick={() => onNumIconsChange(count)}
                          className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-colors ${
                            numIcons === count
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                              : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60"
                          }`}
                        >
                          {count === ICONS.length ? "All" : count}
                        </m.button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                  <div className="flex flex-col gap-3">
                    <label htmlFor="num-options" className="text-sm font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">
                      Choices per question
                    </label>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      More choices = harder
                    </p>
                    <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-labelledby="num-options">
                      {optionCounts.map((count) => (
                        <m.button
                          key={count}
                          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                          onClick={() => onNumOptionsChange(count)}
                          className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-colors ${
                            numOptions === count
                              ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                              : "bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200/60 dark:border-zinc-700/60"
                          }`}
                        >
                          {count}
                        </m.button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

                  <m.button
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -1 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98, y: 1 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                    onClick={onStart}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-base tracking-tight transition-colors flex items-center justify-center gap-2 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    <Sparkles className="w-4 h-4 relative" />
                    <span className="relative">Start Quiz</span>
                  </m.button>
                </m.div>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
}
