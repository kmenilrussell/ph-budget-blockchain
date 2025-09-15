import { NextRequest, NextResponse } from 'next/server';
import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';

type NextApiResponseWithSocket = NextResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

export async function GET(req: NextRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log('Initializing Socket.IO server...');
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join budget-related rooms
      socket.on('join-budget-room', (allocationId: string) => {
        socket.join(`allocation-${allocationId}`);
        console.log(`Client ${socket.id} joined budget room for allocation ${allocationId}`);
      });

      socket.on('join-agency-room', (agencyId: string) => {
        socket.join(`agency-${agencyId}`);
        console.log(`Client ${socket.id} joined agency room for agency ${agencyId}`);
      });

      socket.on('join-global-updates', () => {
        socket.join('global-updates');
        console.log(`Client ${socket.id} joined global updates room`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    console.log('Socket.IO server initialized');
  }

  return NextResponse.json({ success: true, message: 'Socket.IO server initialized' });
}