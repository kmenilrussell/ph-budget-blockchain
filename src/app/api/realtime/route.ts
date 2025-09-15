import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// This function broadcasts real-time updates to connected clients
export async function broadcastUpdate(event: string, data: any, room?: string) {
  try {
    // In a real implementation, this would emit through Socket.IO
    // For now, we'll store the event and let the client poll
    await db.auditLog.create({
      data: {
        action: `BROADCAST:${event}`,
        entityType: 'RealTimeUpdate',
        entityId: 'global',
        newValues: JSON.stringify({ event, data, room }),
        ipAddress: 'system',
        userAgent: 'budget-system',
      },
    });
  } catch (error) {
    console.error('Error broadcasting update:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data, room } = body;

    if (!event || !data) {
      return NextResponse.json(
        { success: false, error: 'Event and data are required' },
        { status: 400 }
      );
    }

    await broadcastUpdate(event, data, room);

    return NextResponse.json({ success: true, message: 'Update broadcasted' });
  } catch (error) {
    console.error('Error broadcasting update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to broadcast update' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get recent real-time updates
    const recentUpdates = await db.auditLog.findMany({
      where: {
        action: {
          startsWith: 'BROADCAST:',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    const updates = recentUpdates.map(log => {
      const eventData = JSON.parse(log.newValues || '{}');
      return {
        id: log.id,
        event: eventData.event,
        data: eventData.data,
        room: eventData.room,
        timestamp: log.createdAt,
      };
    });

    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    console.error('Error fetching real-time updates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}