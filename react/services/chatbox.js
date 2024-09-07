// services/chatbox.js
import useSWR from 'swr'
import axios from 'axios'
import axiosInstance from './axios-instance'

// API 函數來獲取特定 user_id 的聊天記錄
export const getChatByUserId = async (user_id) => {
  if (!user_id) {
    throw new Error('User ID is required')
  }
  const response = await axiosInstance.get(
    `http://localhost:3005/api/chat_box/${user_id}`
  )
  return response.data
}

// 使用 SWR 來管理數據請求和緩存
export const useChatByUserId = (user_id) => {
  const { data, error } = useSWR(
    user_id ? `http://localhost:3005/api/chat_box/${user_id}` : null,
    () => getChatByUserId(user_id)
  )

  // 確保從 data 中提取聊天記錄
  const messages = data?.data?.chats || []

  return {
    data: messages,
    isLoading: !error && !data,
    isError: !!error,
  }
}

// 傳送聊天訊息到後端 API
export const register = async (message) => {
  try {
    const response = await axios.post(
      'http://localhost:3005/api/chat_box',
      message
    )
    return response.data
  } catch (error) {
    console.error('Error in register function:', error)
    throw error
  }
}
