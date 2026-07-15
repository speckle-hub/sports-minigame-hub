import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/ui/Navbar"
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MilestoneWatcher />
        <Onboarding />
        <Navbar />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/play/reflex-rush" element={<GameSuspense><ReflexRushPage /></GameSuspense>} />
            <Route path="/play/tactics-daily" element={<GameSuspense><TacticsDailyPage /></GameSuspense>} />
            <Route path="/play/match-call" element={<GameSuspense><MatchCallPage /></GameSuspense>} />
            <Route path="/play/true-or-false" element={<GameSuspense><TrueFalsePage /></GameSuspense>} />
            <Route path="/play/career-path" element={<GameSuspense><CareerPathPage /></GameSuspense>} />
            <Route path="/play/football-a-z" element={<GameSuspense><FootballAZPage /></GameSuspense>} />
            <Route path="/play/football-jeopardy" element={<GameSuspense><FootballJeopardyPage /></GameSuspense>} />
            <Route path="/play/trivia-path" element={<GameSuspense><TriviaPathPage /></GameSuspense>} />
            <Route path="/play/tic-tac-toe-grid" element={<GameSuspense><TicTacToeGridPage /></GameSuspense>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
