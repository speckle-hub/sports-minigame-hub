import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "./components/ui/Navbar"
import { AuthProvider } from "./components/AuthProvider"
import { Home } from "./pages/Home"
import { Login } from "./pages/Login"
import { Signup } from "./pages/Signup"
import { Profile } from "./pages/Profile"
import { Leaderboards } from "./pages/Leaderboards"
import { ReflexRushPage } from "./pages/ReflexRushPage"
import { TacticsDailyPage } from "./pages/TacticsDailyPage"
import { MatchCallPage } from "./pages/MatchCallPage"
import { TrueFalsePage } from "./pages/TrueFalsePage"
import { CareerPathPage } from "./pages/CareerPathPage"
import { FootballAZPage } from "./pages/FootballAZPage"
import { FootballJeopardyPage } from "./pages/FootballJeopardyPage"
import { TriviaPathPage } from "./pages/TriviaPathPage"
import { TicTacToeGridPage } from "./pages/TicTacToeGridPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/play/reflex-rush" element={<ReflexRushPage />} />
          <Route path="/play/tactics-daily" element={<TacticsDailyPage />} />
          <Route path="/play/match-call" element={<MatchCallPage />} />
          <Route path="/play/true-or-false" element={<TrueFalsePage />} />
          <Route path="/play/career-path" element={<CareerPathPage />} />
          <Route path="/play/football-a-z" element={<FootballAZPage />} />
          <Route path="/play/football-jeopardy" element={<FootballJeopardyPage />} />
          <Route path="/play/trivia-path" element={<TriviaPathPage />} />
          <Route path="/play/tic-tac-toe-grid" element={<TicTacToeGridPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
