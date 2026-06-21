/* eslint-disable @typescript-eslint/explicit-function-return-type */
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dateFormatter = new Intl.DateTimeFormat(
  typeof window !== 'undefined' ? window.api?.locale || navigator.language : 'en-US',
  {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'UTC'
  }
)

export const formatDateFromMs = (ms: number) => dateFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
