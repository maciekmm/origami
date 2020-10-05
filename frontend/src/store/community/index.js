import React from "react"

export const CommunityStoreContext = React.createContext()
export const useCommunityStore = () => React.useContext(CommunityStoreContext)
