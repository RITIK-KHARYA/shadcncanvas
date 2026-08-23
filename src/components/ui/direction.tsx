"use client"

import type * as React from "react"

import { Direction as RadixDirection } from "radix-ui"

type DirectionProviderProps = React.ComponentProps<
  typeof RadixDirection.Provider
>

function DirectionProvider(props: DirectionProviderProps) {
  return <RadixDirection.Provider {...props} />
}

export { DirectionProvider }
export type { DirectionProviderProps }
