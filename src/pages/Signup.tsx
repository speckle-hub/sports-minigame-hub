import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Card, CardTitle, CardContent } from "../components/ui/Card"
import { supabase } from "../lib/supabase"

export function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card>
            <CardContent className="text-center">
              <div className="text-4xl mb-4">📬</div>
              <CardTitle>Check your email</CardTitle>
              <p className="text-sm text-text-muted mt-2">
                We sent a confirmation link to <strong className="text-text">{email}</strong>.
                Click it to activate your account, then sign in.
              </p>
              <Link to="/login">
                <Button variant="primary" className="mt-6">
                  Go to Sign In
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent>
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-copper flex items-center justify-center font-heading font-bold text-text text-lg mx-auto mb-4">
                S
              </div>
              <CardTitle>Create Account</CardTitle>
              <p className="text-sm text-text-muted mt-1">
                Start building your sports legacy
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="YourName"
                required
                minLength={3}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />

              {error && (
                <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                  {error}
                </p>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full">
                Create Account
              </Button>
            </form>

            <p className="text-sm text-text-muted text-center mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-copper hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
