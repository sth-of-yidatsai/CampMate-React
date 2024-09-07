import { createContext } from 'react'

// 1. 建立context與導出它
// 傳入參數為defaultValue，是在套用context時錯誤或失敗才會得到的值。
// 可以使用有意義的預設值，或使用null(通常目的是為了除錯)
export const AuthContext = createContext(null)
