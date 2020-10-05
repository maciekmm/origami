import React from "react"

import { useStore } from "@store"

export const usePlayerStore = () => useStore("player")
