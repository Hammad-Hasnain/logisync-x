import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TrackingService } from './tracking.service';

@WebSocketGateway({
    namespace: 'tracking',
    cors: { origin: '*' }
})
export class TrackingGateway {
    @WebSocketServer() server!: Server;

    constructor(private readonly trackingService: TrackingService) { }

    @SubscribeMessage('joinOrderStream')
    handleJoinChannel(@MessageBody() data: { orderId: string }, @ConnectedSocket() client: Socket) {
        if (!data.orderId) {
            return client.emit('error', { statusCode: 400, message: 'Missing orderId parameter.' });
        }

        const streamRoom = `order:stream:${data.orderId}`;
        client.join(streamRoom);
        client.emit('joined', { channel: streamRoom });
    }

    @SubscribeMessage('pushLiveTelemetry')
    async handleIncomingTelemetry(
        @MessageBody() payload: { orderId: string; lat: number; lng: number; timestamp: string },
        @ConnectedSocket() client: Socket
    ) {
        try {
            console.log('📡 LIVE TELEME TRY RECEIVED:', payload);
            const { orderId, lat, lng, timestamp } = payload;

            if (!orderId || lat === undefined || lng === undefined || !timestamp) {
                return client.emit('error', { statusCode: 400, message: 'Malformed telemetry frame parameters.' });
            }

            // Route directly into our clean injected service memory layer
            const savedNode = await this.trackingService.pushTelemetryToCache(orderId, lat, lng, timestamp);

            // Instant broadcast loop to update listening admin cockpit monitors
            this.server.to(`order:stream:${orderId}`).emit('liveTelemetryUpdate', savedNode);

        } catch (error: any) {
            client.emit('error', {
                statusCode: error.getStatus ? error.getStatus() : 500,
                message: error.message || 'Internal streaming processing error.'
            });
        }
    }
}
