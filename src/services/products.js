import axiosInstance from './index'

export function getProducts() {
  return axiosInstance.get('/people')
}
