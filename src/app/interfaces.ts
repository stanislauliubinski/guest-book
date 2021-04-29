export interface User {
    email: String,
    password?: String
    name?: string
    avatar?: string
    id?: number
}

export interface newUser {
    avatar?: FormData,
    email: string,
    name: string,
    password: string,
    password_confirmation: string
}

export interface newPost {
    id?: string,
    message: string,
    title: string,
    user?: {
        [key: string]: User
    },
    answers?: {
        [key: string]: answers
    },
    answers_count?: number
}

export interface answers {
    id?: string | number,
    message: string,
    post_id?: number,
    user_id?: number,
    user?: User
}

export interface posts {
    id: string
}

export interface receivedAnswers {
    data: answers[]
    links: {
        first: string,
        last: string,
        next: string,
        prev: any
    },
    meta: pageInfo
}

export interface push {
    data: newPost
    type: string
}

export interface pushPrivate {
    data: answers
    type: string
}

export interface pushedData {
    id: number,
    message: string,
    title: string
}

export interface receivedPosts {
    data: newPost[]
    links: {
        first: string,
        last: string,
        next: string,
        prev: any
    },
    meta: pageInfo
}

export interface pageInfo {
    current_page: number,
    from: number,
    last_page: number,
    path: string,
    per_page: number,
    to: number,
    total: number
}

export interface AuthResponse {
    token: {
        access_token: string,
        expires_at: string
    },
    user: {
        avatar: string,
        created_at: string,
        email: string,
        id: number,
        is_admin: number,
        name: string,
        updated_at: string
    }
}