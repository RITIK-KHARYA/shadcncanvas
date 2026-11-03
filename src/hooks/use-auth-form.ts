import { useCallback, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { authClient } from "@/lib/auth-client"

const DEFAULT_REDIRECT = "/dashboard"

export type SocialProvider = "github" | "discord" | "google"
export type AuthMode = "sign-in" | "sign-up"

export type AuthForm = {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  mode: AuthMode
  error: string | null
  pending: { submit?: boolean; providers?: boolean }
  signInWith: (provider: SocialProvider) => void
  submit: (event: FormEvent<HTMLFormElement>) => void
  toggleMode: () => void
}

/**
 * All of the auth page's behaviour: field state, the sign-in / sign-up mode
 * switch, provider sign-in, and submit handling with error mapping.
 */
export function useAuthForm(redirectTo = DEFAULT_REDIRECT): AuthForm {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState<{
    submit?: boolean
    providers?: boolean
  }>({})

  const signInWith = useCallback(async (provider: SocialProvider) => {
    setPending({ providers: true })
    setError(null)

    const { error: authError } = await authClient.signIn.social({
      provider,
      callbackURL: redirectTo,
    })

    if (authError) {
      setPending({})
      setError(authError.message ?? "Something went wrong.")
    }
  }, [redirectTo])

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setPending({ submit: true })
      setError(null)

      const { error: authError } =
        mode === "sign-in"
          ? await authClient.signIn.email({
              email,
              password,
              callbackURL: redirectTo,
            })
          : await authClient.signUp.email({
              email,
              password,
              name: email.split("@")[0] || "User",
              callbackURL: redirectTo,
            })

      if (authError) {
        setPending({})
        setError(authError.message ?? "Something went wrong.")
      } else {
        navigate(redirectTo)
      }
    },
    [email, mode, navigate, password, redirectTo],
  )

  const toggleMode = useCallback(() => {
    setMode((previous) => (previous === "sign-in" ? "sign-up" : "sign-in"))
  }, [])

  return {
    email,
    setEmail,
    password,
    setPassword,
    mode,
    error,
    pending,
    signInWith,
    submit,
    toggleMode,
  }
}
