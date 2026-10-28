'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import { PageHeader } from '@/components/organisms/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DetailRow } from '@/components/ui/detail-row';
import { StateMessage } from '@/components/ui/state-message';

import { useOrder } from '@/hooks/queries/use-order';
import { useDriversLookup } from '@/hooks/queries/use-drivers-lookup';
import { useAssignDriver } from '@/hooks/mutations/use-assign-driver';
import { ORDER_STATUS_BADGE_VARIANT } from '@/lib/order-status-styles';
import { ROUTES } from '@/lib/routes';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BASE_URL = 'http://192.168.100.27:3000';

export default function OrderDetailPage() {
    const { id: orderId } = useParams<{ id: string }>();
    const router = useRouter();

    const { data: order, isLoading } = useOrder(orderId);
    const { data: drivers } = useDriversLookup();
    const { mutate: assignDriver, isPending: isAssigning } = useAssignDriver();

    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapInstance = useRef<L.Map | null>(null);
    const carMarkerRef = useRef<L.Marker | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);
    const socketRef = useRef<Socket | null>(null);

    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (!order || !mapRef.current || leafletMapInstance.current) return;

        const initializeLeafletTracking = async () => {
            try {
                // 1. Fetch History data
                const response = await axios.get(`${BASE_URL}/api/v1/tracking/history/${orderId}`);
                const historyCoordinates = response.data?.data?.coordinates || [];

                const formattedPath: [number, number][] = historyCoordinates.map((pt: any) => [
                    Number(pt.lat),
                    Number(pt.lng),
                ]);

                const baseLocation: [number, number] = formattedPath.length > 0
                    ? formattedPath[formattedPath.length - 1]
                    : [24.8607, 67.0011]; // Karachi default fallback

                // 2. Initialize Leaflet Map Engine
                const map = L.map(mapRef.current!).setView(baseLocation, 15);
                leafletMapInstance.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors',
                }).addTo(map);

                // 3. Draw Driver Marker (Using default Leaflet icon to avoid broken image links)
                const carHtmlIcon = L.divIcon({
                    className: 'custom-car-marker',
                    html: `
        <div style="
            background-color: #3b82f6; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 3px solid white; 
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        "></div>
    `,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                });
                const carMarker = L.marker(baseLocation, { icon: carHtmlIcon }).addTo(map);
                carMarkerRef.current = carMarker;

                // 4. Draw History Path Polyline
                const polyline = L.polyline(formattedPath, { color: '#3b82f6', weight: 4 }).addTo(map);
                polylineRef.current = polyline;

                // If path has points, fit bounds nicely
                if (formattedPath.length > 0) {
                    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
                }

                // 5. Socket Handshake & Listeners Setup
                const socket = io(`${BASE_URL}/tracking`, { transports: ['websocket'] });
                socketRef.current = socket;

                socket.emit('joinOrderStream', { orderId });

                socket.on('liveTelemetryUpdate', (liveNode: { lat: number; lng: number }) => {
                    const nextPos: [number, number] = [Number(liveNode.lat), Number(liveNode.lng)];

                    if (carMarkerRef.current) {
                        carMarkerRef.current.setLatLng(nextPos);
                    }

                    if (polylineRef.current) {
                        polylineRef.current.addLatLng(nextPos);
                    }

                    if (leafletMapInstance.current) {
                        leafletMapInstance.current.panTo(nextPos);
                    }
                });

            } catch (err) {
                console.error(err);
                setMapError('Could not launch OpenStreetMap asset modules.');
            }
        };

        initializeLeafletTracking();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (leafletMapInstance.current) {
                leafletMapInstance.current.remove();
                leafletMapInstance.current = null;
            }
        };
    }, [order, orderId]);

    if (isLoading) return <StateMessage variant="loading" message="Loading order..." />;
    if (!order) return <StateMessage variant="empty" message="Order not found." />;

    return (
        <>
            <PageHeader
                title={`Order ${order.trackingId}`}
                subtitle="Full shipment details and assignment."
                action={
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.edit(order.id))}>
                            <Pencil size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.admin.orders.list)}>
                            <ArrowLeft size={20} />
                        </Button>
                    </div>
                }
            />

            {/* OPENSTREETMAP LEAFLET WRAPPER CONTAINER */}
            <div className="mt-6 w-full h-[380px] relative rounded-xl overflow-hidden bg-muted shadow-sm z-0">
                {mapError ? (
                    <div className="absolute inset-0 flex items-center justify-center text-destructive text-sm font-medium">
                        {mapError}
                    </div>
                ) : (
                    <div ref={mapRef} className="w-full h-full" />
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: shipment details, read-only */}
                <Card className="md:col-span-2 p-6 space-y-4">
                    <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-3">Shipment Information</h3>
                    <DetailRow label="Customer Name" value={order.customerName} />
                    <DetailRow label="Delivery Address" value={order.deliveryAddress} />
                    <DetailRow label="Pickup Location" value={order.pickupLocation} />
                    {order.driverName && <DetailRow label="Assigned Driver" value={order.driverName} />}
                    {order.driverVehicleNumber && <DetailRow label="Vehicle Number" value={order.driverVehicleNumber} />}
                </Card>

                {/* Right: editable — status + driver assignment */}
                <Card className="p-6 h-fit space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">Status</h3>
                        <div className="mb-3">
                            <Badge variant={ORDER_STATUS_BADGE_VARIANT[order.status]}>{order.status}</Badge>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                            Assigned Driver
                        </h3>
                        <Select
                            value={order.assignedDriverId ?? ''}
                            disabled={isAssigning}
                            onChange={(e) => assignDriver({ orderId: order.id, driverId: e.target.value })}
                        >
                            <option value="" disabled>
                                {drivers?.length === 0 ? "No drivers available" : "Unassigned"}
                            </option>
                            {drivers?.map((driver) => (
                                <option key={driver.id} value={driver.id}>
                                    {driver.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                </Card>
            </div>
        </>
    );
}