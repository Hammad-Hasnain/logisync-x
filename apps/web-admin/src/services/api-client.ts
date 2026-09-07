/**
 * 👑 GLOBAL TYPE-SAFE API NETWORK UTILITY
 * Handles request cycles and injects authorization tokens cleanly.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RequestOptions extends RequestInit {
    bodyData?: any;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { bodyData, headers, ...restOptions } = options;

    // 1. Gather any existing token securely from browser memory storage
    let token: string | null = null;
    if (typeof window !== 'undefined') {
        token = window.sessionStorage.getItem('admin_token');
    }

    // 2. Configure standard centralized network headers
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // 3. Automated Injection Guard: If a token exists, attach it cleanly to the request stream
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        ...restOptions,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
    };

    // 4. Handle serialization securely if payload body data is provided
    if (bodyData) {
        config.body = JSON.stringify(bodyData);
    }

    // 5. Execute HTTP asynchronous network stream handshake
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // 6. Exception Processing Boundaries
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `API Pipeline Failed with status code: ${response.status}`;
        throw new Error(errorMessage);
    }

    // Return parsed clean JSON response mapping types natively
    return response.json() as Promise<T>;
}
