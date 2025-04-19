import { cookies } from 'next/headers'

import { Chat } from '@/components/chat'
import { DEFAULT_MODEL_NAME, models } from '@/lib/ai/models'
import { generateUUID } from '@/lib/utils'
import { DataStreamHandler } from '@/components/data-stream-handler'
import { auth } from '../(auth)/auth'
import { User } from 'next-auth'
import { fetchStripeSubscriptionByEmail } from '@/lib/stripe'

export default async function Page() {
  const id = generateUUID()

  const [session, cookieStore] = await Promise.all([auth(), cookies()])

  const userEmail = session?.user?.email as string
  const modelIdFromCookie = cookieStore.get('model-id')?.value

  const subscription = await fetchStripeSubscriptionByEmail(userEmail)

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME

  return (
    <>
      <Chat
        subscription={subscription}
        user={session?.user as User}
        key={id}
        id={id}
        initialMessages={[]}
        selectedModelId={selectedModelId}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  )
}
