import { redirect } from 'next/navigation'

export default function LandingRedirect() {
  return redirect('/home')
}