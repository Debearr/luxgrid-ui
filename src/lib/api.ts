// Network request utilities with proper error handling

export class NetworkError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

export async function apiRequest<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new NetworkError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response
      )
    }

    const data = await response.json()
    return { data, status: response.status }
  } catch (error) {
    if (error instanceof NetworkError) {
      return { error: error.message, status: error.status || 500 }
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { error: 'Request timeout', status: 408 }
    }

    return { 
      error: 'Network request failed. Please check your connection and try again.', 
      status: 500 
    }
  }
}

export async function retryRequest<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  delay = 1000
): Promise<ApiResponse<T>> {
  let lastError: ApiResponse<T> | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await requestFn()
    
    if (!result.error) {
      return result
    }

    lastError = result
    
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  return lastError || { error: 'All retry attempts failed', status: 500 }
}