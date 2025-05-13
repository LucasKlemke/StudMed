import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'
export const locales = ['en', 'pt-BR', 'es']

const getLocale = () => {
  const headersList = headers()
  const l = headersList?.get('accept-language')
  const locale = l && l.split(',')[0]

  return locale && locales.includes(locale) ? locale : locales[0]
}

export default getRequestConfig(async () => {
  const locale = getLocale()

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
