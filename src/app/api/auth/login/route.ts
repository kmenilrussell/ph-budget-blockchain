import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email (in a real app, you'd verify password hash)
    const user = await db.user.findUnique({
      where: { email },
      include: {
        agency: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For demo purposes, accept any password for seeded users
    // In production, you'd use proper password hashing and verification
    const isDemoUser = email.includes('@ph.gov.ph') || email.includes('@gov.ph');
    
    if (!isDemoUser && password !== 'demo123') {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Math.random().toString(36).substr(2, 64);

    // Return user data without sensitive information
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agency: user.agency,
      sessionToken,
    };

    return NextResponse.json({
      success: true,
      data: userData,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    error: 'Method not allowed',
  }, { status: 405 });
}