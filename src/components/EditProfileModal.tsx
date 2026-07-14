import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Card, CardTitle } from "./ui/Card"
import { useAuthStore } from "../stores/authStore"
import { AVATAR_GRADIENTS, avatarGradientClasses } from "../lib/utils"

interface EditProfileModalProps {
  open: boolean
  onClose: () => void
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { profile, updateProfile } = useAuthStore()
  const [username, setUsername] = useState(profile?.username ?? "")
  const [gradientId, setGradientId] = useState(profile?.avatar_url ?? "copper")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    if (saving) return
    setError(null)
    setUsername(profile?.username ?? "")
    setGradientId(profile?.avatar_url ?? "copper")
    onClose()
  }

  async function handleSave() {
    const trimmed = username.trim()
    if (!trimmed) {
      setError("Username cannot be empty")
      return
    }
    if (trimmed.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    setSaving(true)
    setError(null)

    const result = await updateProfile({
      username: trimmed,
      avatar_url: gradientId,
    })

    if (result.error) {
      if (result.error.includes("duplicate key") || result.error.includes("unique")) {
        setError("That username is already taken")
      } else {
        setError(result.error)
      }
      setSaving(false)
      return
    }

    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <CardTitle>Edit Profile</CardTitle>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-text-muted hover:text-text hover:bg-surface-3 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarGradientClasses(gradientId)} flex items-center justify-center text-3xl font-heading font-bold text-base`}
                  >
                    {(username || profile?.username || "?")[0].toUpperCase()}
                  </div>
                </div>

                <Input
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="YourName"
                  minLength={3}
                  required
                />

                <div>
                  <p className="text-sm font-medium text-text-muted mb-2">
                    Avatar Color
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {AVATAR_GRADIENTS.map((g) => {
                      const selected = gradientId === g.id
                      return (
                        <button
                          key={g.id}
                          onClick={() => setGradientId(g.id)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all cursor-pointer ${
                            selected
                              ? "border-copper bg-surface-3"
                              : "border-transparent bg-surface-2 hover:border-border"
                          }`}
                        >
                          <div
                            className={`w-full h-8 rounded-lg bg-gradient-to-br ${avatarGradientClasses(g.id)}`}
                          />
                          <span className={`text-[11px] font-medium ${selected ? "text-copper" : "text-text-muted"}`}>
                            {g.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-danger bg-danger/10 p-3 rounded-lg">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={saving}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  isLoading={saving}
                  className="flex-1"
                >
                  Save
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
