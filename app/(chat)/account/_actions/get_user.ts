'use server'

import { auth } from '@/app/(auth)/auth'
import { getUser, updateUser } from '@/lib/db/queries'

export async function getUserSession() {
  const session = await auth()

  const user = await getUser(session?.user?.email as string)

  return user[0]
}
