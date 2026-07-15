import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/Button"

export function NotFound() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <div className="text-7xl mb-4">🏟️</div>
        <h1 className="text-4xl font-heading font-bold text-text mb-2">
          404
        </h1>
        <p className="text-text-muted mb-6 max-w-sm mx-auto">
          This page doesn't exist. Maybe it was a false start — head back to the pitch.
        </p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </motion.div>
    </div>
  )
}
