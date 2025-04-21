// src/utils/response.util.ts

/**
 * Định nghĩa kiểu dữ liệu trả về cho response.
 * Tính linh hoạt giúp có thể dùng cho nhiều trường hợp (dữ liệu trả về, lỗi, thông báo).
 */
export interface Response<T = object> {
  statusCode: number
  message: string | Record<string, object> | null
  data: T | null
  errors: T | null
}

/**
 * Tạo một response chuẩn cho các API.
 * @param statusCode - Mã trạng thái HTTP (ví dụ: 200, 400, 500)
 * @param message - Thông điệp trả về cho người dùng hoặc đối tượng chi tiết lỗi
 * @param data - Dữ liệu trả về, mặc định là null
 * @param errors - Chi tiết lỗi nếu có, mặc định là null
 */
const createResponse = <T = object>(
  statusCode: number,
  message: string | Record<string, object> | null = null, // Thiết lập mặc định là null
  data: T | null = null,
  errors: T | null = null
): Response<T> => {
  return {
    statusCode,
    message: message ?? null, // Nếu message không có thì gán null
    errors: errors ?? null, // Nếu errors không có thì gán null
    data: data ?? null // Nếu data không có thì gán null
  }
}

export { createResponse }
