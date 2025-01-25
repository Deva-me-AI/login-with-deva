import { useState, useEffect } from "react"
import { isEmail } from "validator"

export function useEmailValidation(email: string) {
  const [isValid, setIsValid] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (email.length === 0) {
      setIsValid(false)
      setError("")
    } else if (!isEmail(email)) {
      setIsValid(false)
      setError("Please enter a valid email address")
    } else {
      setIsValid(true)
      setError("")
    }
  }, [email])

  return { isValid, error }
}

