import { NextRequest, NextResponse } from 'next/server'

interface UserAccount {
  name: string
  username: string
  password: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get users from environment variable
    const usersJson = process.env.DATABASE_USERS
    if (!usersJson) {
      console.error('DATABASE_USERS environment variable not set')
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 500 }
      )
    }

    const users: UserAccount[] = JSON.parse(usersJson)

    // Find matching user
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      // Return user info without password
      return NextResponse.json({
        success: true,
        user: {
          name: user.name,
          username: user.username,
        },
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
