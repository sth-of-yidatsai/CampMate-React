import axiosInstance, { fetcher } from './axios-instance'
import ticketSWR from 'swr'
import axios from 'axios'

const BASE_URL = 'http://localhost:3005/api'

/**
 * 取得指定 user_id 的所有客服單紀錄
 */
export const getTicketsByUserId = async (user_id) => {
  return await axiosInstance.get(`api/tickets/${user_id}`)
}

/**
 * SWR hook 用於取得指定 user_id 的客服單紀錄
 */
export const useTicketsByUserId = (user_id) => {
  const { data, error, isLoading } = ticketSWR(
    `/api/tickets/${user_id}`,
    // `/custer-server/custerServer`,
    fetcher
  )

  return {
    data,
    isLoading,
    isError: error,
  }
}

/**
 * 新增客服單
 */
export const register = async (ticket) => {
  try {
    const response = await axios.post(
      'http://localhost:3005/api/tickets',
      ticket,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    const errorMessage = error.response ? error.response.data.error : '未知錯誤'
    throw new Error(errorMessage)
  }
}
