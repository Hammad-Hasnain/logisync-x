'use client';

import React, { useState, useEffect } from 'react';
import { PackagePlus, ShieldCheck, AlertCircle, FileSpreadsheet, UserCheck, Inbox } from 'lucide-react';
import { apiClient } from '@/services/api-client';

interface OrderEntity {
    _id: string;
    trackingId: string;
    originAddress: string;
    destinationAddress: string;
    billingAmount: number;
    status: string;
    assignedDriverId: string | null;
}

interface DriverEntity {
    _id: string;
    name: string;
    status: string;
}

export default function OrderDispatchPage() {
    const [trackingId, setTrackingId] = useState('');
    const [originAddress, setOriginAddress] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [billingAmount, setBillingAmount] = useState('');

    const [loading, setLoading] = useState(false);
    const [successAlert, setSuccessAlert] = useState<string | null>(null);
    const [errorAlert, setErrorAlert] = useState<string | null>(null);

    // 👑 STATE CHANNELS FOR THE PENDING INVENTORY QUEUE
    const [orders, setOrders] = useState<OrderEntity[]>([]);
    const [availableDrivers, setAvailableDrivers] = useState<DriverEntity[]>([]);
    const [queueLoading, setQueueLoading] = useState(false);

    // FETCH BOTH CORE CLUSTERS
    const loadDashboardDataStreams = async () => {
        setQueueLoading(true);
        try {
            const fetchedOrders = await apiClient<OrderEntity[]>('/orders', { method: 'GET' });
            const fetchedDrivers = await apiClient<DriverEntity[]>('/drivers', { method: 'GET' });

            setOrders(fetchedOrders);
            // Filter out ONLY the drivers who are strictly marked as AVAILABLE natively
            setAvailableDrivers(fetchedDrivers.filter(d => d.status === 'AVAILABLE'));
        } catch (err: any) {
            console.error('Data stream sync error:', err.message);
        } finally {
            setQueueLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardDataStreams();
    }, []);

    const handleCreateOrderSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccessAlert(null);
        setErrorAlert(null);

        try {
            const response = await apiClient<OrderEntity>('/orders/create', {
                method: 'POST',
                bodyData: {
                    trackingId,
                    originAddress,
                    destinationAddress,
                    billingAmount: Number(billingAmount),
                },
            });

            setSuccessAlert(`Order Reference [${response.trackingId}] successfully created!`);
            setTrackingId('');
            setOriginAddress('');
            setDestinationAddress('');
            setBillingAmount('');

            // Auto refresh queue to show the new pending load instantly
            loadDashboardDataStreams();

        } catch (err: any) {
            setErrorAlert(err.message || 'The dispatch order pipeline execution failed.');
        } finally {
            setLoading(false);
        }
    };

    // 👑 TRANSACTIONAL ASSIGNMENT INTERFACE EXECUTOR
    const handleAssignDriverSubmit = async (orderId: string, driverId: string) => {
        if (!driverId) return;

        try {
            await apiClient(`/orders/${orderId}/assign`, {
                method: 'PATCH',
                bodyData: { driverId },
            });

            alert('Handshake Successful: Driver assigned and tracking session initialized natively! 🚀');
            loadDashboardDataStreams(); // Refresh queue view matrix
        } catch (err: any) {
            alert(`Assignment aborted via transaction guards: ${err.message}`);
        }
    };

    return (
        <div className="space-y-12 animate-fadeIn">

            {/* SECTION 1: CREATE DISPATCH FORM */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-100">Dispatch Order Management</h2>
                    <p className="text-sm text-slate-400 mt-1">Initialize fresh cargo tracking variables and sync records to cloud pipelines.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <form onSubmit={handleCreateOrderSubmit} className="lg:col-span-2 bg-slate-800 border border-slate-700/60 p-6 rounded-xl space-y-5 shadow-xl">
                        {successAlert && (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-lg flex items-start gap-3">
                                <ShieldCheck className="shrink-0 mt-0.5" size={18} />
                                <span>{successAlert}</span>
                            </div>
                        )}
                        {errorAlert && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-start gap-3">
                                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                <span>{errorAlert}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Order Tracking Code</label>
                                <input type="text" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm font-mono" placeholder="e.g. LGS-10029" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Billing Amount (PKR)</label>
                                <input type="number" required min="0" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="450" value={billingAmount} onChange={(e) => setBillingAmount(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pickup Origin Address</label>
                            <input type="text" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. DHA Phase 6, Karachi" value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Destination Delivery Target</label>
                            <input type="text" required className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm" placeholder="e.g. Gulshan Block 3, Karachi" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} />
                        </div>

                        <button type="submit" disabled={loading} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-medium px-6 py-2.5 rounded-lg flex justify-center items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-blue-600/10">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> <PackagePlus size={18} /> <span>Commit Order Dispatch</span> </>}
                        </button>
                    </form>

                    <div className="bg-slate-800/40 border border-slate-800 p-5 rounded-xl space-y-4">
                        <div className="flex items-center gap-2.5 text-blue-400">
                            <FileSpreadsheet size={20} />
                            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">Operational Pipeline</h3>
                        </div>
                        <ul className="space-y-3 text-xs text-slate-400 leading-relaxed list-disc pl-4">
                            <li>Tracking codes must be globally unique inside the system domain matrix.</li>
                            <li>Assigning a driver triggers an automatic database transaction session.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 📊 SECTION 2: LIVE ORDERS ALLOCATION INVENTORY QUEUE */}
            <div className="space-y-5">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-100">Pending Cargo Allocation Queue</h3>
                    <p className="text-xs text-slate-400 mt-1">Select an active available driver to securely initialize high-frequency monitoring routes.</p>
                </div>

                {queueLoading && orders.length === 0 ? (
                    <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" /></div>
                ) : orders.length === 0 ? (
                    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[180px]">
                        <Inbox className="text-slate-600 mb-2" size={32} />
                        <p className="text-sm text-slate-400">No active cargo dispatch records found inside the cloud pool.</p>
                    </div>
                ) : (
                    <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/40 border-b border-slate-700/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="p-4 pl-6">Tracking ID</th>
                                    <th className="p-4">Route Blueprint</th>
                                    <th className="p-4">Operational Status</th>
                                    <th className="p-4 pr-6 text-right">Driver Assignment Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-xs text-slate-300">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-700/10 transition-colors">
                                        <td className="p-4 pl-6 font-bold font-mono text-slate-200">{order.trackingId}</td>
                                        <td className="p-4 space-y-0.5">
                                            <p className="text-slate-300 font-medium">
                                                <span className="text-slate-500">From:</span> {order.originAddress}
                                            </p>
                                            <p className="text-slate-400">
                                                <span className="text-slate-500">To:</span> {order.destinationAddress}
                                            </p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full font-bold font-mono ${order.status === 'PENDING'
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            {order.assignedDriverId ? (
                                                <span className="text-slate-500 font-medium inline-flex items-center gap-1">
                                                    <UserCheck size={14} /> Allocated
                                                </span>
                                            ) : (
                                                <div className="inline-flex items-center gap-2">
                                                    <select
                                                        onChange={(e) => handleAssignDriverSubmit(order._id, e.target.value)}
                                                        defaultValue=""
                                                        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
                                                    >
                                                        <option value="" disabled>Select Driver...</option>
                                                        {availableDrivers.map((d) => (
                                                            <option key={d._id} value={d._id}>{d.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                }
            </div>
        </div>
    )
}

