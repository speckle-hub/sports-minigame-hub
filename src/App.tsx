import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Navbar } from "./components/ui/Navbar"
import { ToastContainer } from "./components/ui/ToastContainer"
import { AuthProvider } from "./components/AuthProvider"
import { MilestoneWatcher } from "./components/MilestoneWatcher"
import { Onboarding } from "./components/Onboarding"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { Profile } from "./pages/Profile"
import { Leaderboards } from "./pages/Leaderboards"
import { Achievements } from "./pages/Achievements"
import { Challenges } from "./pages/Challenges"
import { NotFound } from "./pages/NotFound"

const ReflexRushPage = lazy(() => import("./pages/ReflexRushPage").then((m) => ({ default: m.ReflexRushPage })))
const TacticsDailyPage = lazy(() => import("./pages/TacticsDailyPage").then((m) => ({ default: m.TacticsDailyPage })))
const MatchCallPage = lazy(() => import("./pages/MatchCallPage").then((m) => ({ default: m.MatchCallPage })))
const TrueFalsePage = lazy(() => import("./pages/TrueFalsePage").then((m) => ({ default: m.TrueFalsePage })))
const CareerPathPage = lazy(() => import("./pages/CareerPathPage").then((m) => ({ default: m.CareerPathPage })))
const FootballAZPage = lazy(() => import("./pages/FootballAZPage").then((m) => ({ default: m.FootballAZPage })))
const FootballJeopardyPage = lazy(() => import("./pages/FootballJeopardyPage").then((m) => ({ default: m.FootballJeopardyPage })))
const TriviaPathPage = lazy(() => import("./pages/TriviaPathPage").then((m) => ({ default: m.TriviaPathPage })))
const TicTacToeGridPage = lazy(() => import("./pages/TicTacToeGridPage").then((m) => ({ default: m.TicTacToeGridPage })))
const GuessTheKitPage = lazy(() => import("./pages/GuessTheKitPage").then((m) => ({ default: m.GuessTheKitPage })))
const FormationBuilderPage = lazy(() => import("./pages/FormationBuilderPage").then((m) => ({ default: m.FormationBuilderPage })))

function GameSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-6 h-6 border-2 border-copper border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-text-muted">Loading game...</span>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/profile/:username" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/leaderboards" element={<PageTransition><Leaderboards /></PageTransition>} />
        <Route path="/achievements" element={<PageTransition><Achievements /></PageTransition>} />
        <Route path="/challenges" element={<PageTransition><Challenges /></PageTransition>} />
        <Route path="/play/reflex-rush" element={<PageTransition><GameSuspense><ReflexRushPage /></GameSuspense></PageTransition>} />
        <Route path="/play/tactics-daily" element={<PageTransition><GameSuspense><TacticsDailyPage /></GameSuspense></PageTransition>} />
        <Route path="/play/match-call" element={<PageTransition><GameSuspense><MatchCallPage /></GameSuspense></PageTransition>} />
        <Route path="/play/true-or-false" element={<PageTransition><GameSuspense><TrueFalsePage /></GameSuspense></PageTransition>} />
        <Route path="/play/career-path" element={<PageTransition><GameSuspense><CareerPathPage /></GameSuspense></PageTransition>} />
        <Route path="/play/football-a-z" element={<PageTransition><GameSuspense><FootballAZPage /></GameSuspense></PageTransition>} />
        <Route path="/play/football-jeopardy" element={<PageTransition><GameSuspense><FootballJeopardyPage /></GameSuspense></PageTransition>} />
        <Route path="/play/trivia-path" element={<PageTransition><GameSuspense><TriviaPathPage /></GameSuspense></PageTransition>} />
        <Route path="/play/tic-tac-toe-grid" element={<PageTransition><GameSuspense><TicTacToeGridPage /></GameSuspense></PageTransition>} />
        <Route path="/play/guess-the-kit" element={<PageTransition><GameSuspense><GuessTheKitPage /></GameSuspense></PageTransition>} />
        <Route path="/play/formation-builder" element={<PageTransition><GameSuspense><FormationBuilderPage /></GameSuspense></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MilestoneWatcher />
        <Onboarding />
        <Navbar />
        <ToastContainer />
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
