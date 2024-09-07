import axiosInstance from './axios-instance'
import useSWR from 'swr'

// 從後端 API 獲取指定 user_id 的收藏紀錄
// 營地
export const getCollectCampgroundByUserId = async (user_id) => {
  const response = await axiosInstance.get(
    `http://localhost:3005/api/collect_campground/${user_id}`
  )
  return response.data
}
// 商品
export const getCollectProductByUserId = async (user_id) => {
  const response = await axiosInstance.get(
    `http://localhost:3005/api/collect_product/${user_id}`
  )
  return response.data
}

// SWR hook 來獲取指定 user_id 的收藏紀錄
// 營地
export const useCollectCampgroundByUserId = (user_id) => {
  const fetcher = (url) =>
    axiosInstance.get(url).then((res) => {
      console.log('Product Data:', res.data) // 確認 API 返回的數據
      return res.data
    })
  const { data, error } = useSWR(
    `http://localhost:3005/api/collect_campground/${user_id}`,
    fetcher
  )
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}
// 商品
export const useCollectProductByUserId = (user_id) => {
  const fetcher = (url) =>
    axiosInstance.get(url).then((res) => {
      console.log('Product Data:', res.data) // 確認 API 返回的數據
      return res.data
    })
  const { data, error } = useSWR(
    `http://localhost:3005/api/collect_product/${user_id}`,
    fetcher
  )
  return {
    data,
    isLoading: !error && !data,
    isError: error,
  }
}

// 刪除收藏
// 營地
export const removeCol = async (id) => {
  console.log(`Deleting collection with ID: ${id}`)
  try {
    const response = await axiosInstance.delete(
      `http://localhost:3005/api/collect_campground/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting collection:', error)
    throw new Error('取消收藏失敗')
  }
}
// 商品
export const removePro = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:3005/api/collect_product/${id}`
    )
    return response.data
  } catch (error) {
    console.error('Error deleting collection:', error)
    throw new Error('取消收藏失敗')
  }
}
