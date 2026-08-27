import { currentUser } from "@clerk/nextjs/server"

async function getCurrentUserEmail(): Promise<string> {
  const user = await currentUser()
  return user?.primaryEmailAddress?.emailAddress ?? ""
}

export { getCurrentUserEmail }
