'use client';

import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, Circle, ShieldAlert, AlertCircle } from 'lucide-react';
import { apiClient } from '@/services/api-client';

interface DriverEntity {
    _id: string;
    name: string;
    email: string;
    status: 'AVAILABLE' | 'ON_TRIP' | 'OFFLINE';
    updatedAt: string;
}

export default function ActiveFleetPage() {
    const [drivers, setDrivers] = useState<DriverEntity[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorAlert, setErrorAlert] = useState<string | null>(null);

    // FUNCTION TO FETCH ALL DRIVERS FROM CLOUD ENGINE
    const fetchFleetUnits = async () => {
        setLoading(true);
        setErrorAlert(null);
        try {
            const data = await apiClient<DriverEntity[]>('/drivers', { method: 'GET' });
            setDrivers(data);
        } catch (err: any) {
            setErrorAlert(err.message || 'Failed to fetch the active fleet registry.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFleetUnits();
    }, []);

    // FUNCTION TO MUTATE DRIVER LIFE-CYCLE STATUS LIVE FROM SCREEN
    const handleToggleStatus = async (driverId: string, currentStatus: string) => {
        // Logic: Toggle between AVAILABLE and OFFLINE for test simulation
        const nextStatus = currentStatus === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';

        try {
            await apiClient(`/drivers/${driverId}/status`, {
                method: 'PATCH',
                bodyData: { status: nextStatus },
            });

            // Refresh the specific data stream locally to reflect dynamic state immediately
            setDrivers((prev) =>
                prev.map((d) => (d._id === driverId ? { ...d, status: nextStatus as any } : d))
            );
        } catch (err: any) {
            alert(`Status mutation blocked: ${err.message}`);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Upper Grid Layout Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-100">Active Fleet Monitor</h2>
                    <p className="text-sm text-slate-400 mt-1">Supervise running driver status variables and switch availability profiles live.</p>
                </div>
                <button
                    onClick={fetchFleetUnits}
                    disabled={loading}
                    className="self-start sm:self-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 cursor-pointer transition-colors"
                >
                    <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
                    <span>Refresh Fleet Grid</span>
                </button>
            </div>

            {/* Dynamic Exception Alert */}
            {errorAlert && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg flex items-start gap-3">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <span>{errorAlert}</span>
                </div>
            )}

            {/* 📊 THE ACTIVE FLEET TABLE GRID */}
            {loading && drivers.length === 0 ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
                </div>
            ) : drivers.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[250px]">
                    <Users className="text-slate-500 mb-3" size={36} />
                    <h3 className="text-md font-bold text-slate-300">No Fleet Units Registered</h3>
                    <p className="text-xs text-slate-400 mt-1">Drivers must onboard via the mobile app application gateways first.</p>
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-900/40 border-b border-slate-700/80 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    <th className="p-4 pl-6">Driver Metadata Name</th>
                                    <th className="p-4">Secure Corporate Email</th>
                                    <th className="p-4">Live Status Registry</th>
                                    <th className="p-4 pr-6 text-right">Lifecycle Actions Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50 text-sm text-slate-300">
                                {drivers.map((driver) => (
                                    <tr key={driver._id} className="hover:bg-slate-700/20 transition-colors">
                                        <td className="p-4 pl-6 font-medium text-slate-200">{driver.name}</td>
                                        <td className="p-4 font-mono text-xs text-slate-400">{driver.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${driver.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                driver.status === 'ON_TRIP' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    'bg-slate-700/40 text-slate-400 border border-slate-700/60'
                                                }`}>
                                                <Circle size={8} fill="currentColor" />
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(driver._id, driver.status)}
                                                disabled={driver.status === 'ON_TRIP'}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${driver.status === 'ON_TRIP'
                                                    ? 'bg-slate-800 text-slate-600 border-slate-700/40 cursor-not-allowed'
                                                    : driver.status === 'AVAILABLE'
                                                        ? 'bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 border-rose-500/10'
                                                        : 'bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                                                    }`}
                                            >
                                                {driver.status === 'ON_TRIP' ? 'Locked on Run' : driver.status === 'AVAILABLE' ? 'Force Offline' : 'Set Available'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
