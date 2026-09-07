'use client';

import React from 'react';
import { Truck, Navigation, Box, Users } from 'lucide-react';

export default function FleetOverviewPage() {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Title Layout */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-100">Fleet Control Dashboard</h2>
                <p className="text-sm text-slate-400 mt-1">Real-time status overview of the LogiSync-X tracking infrastructure.</p>
            </div>

            {/* 📊 TELEMETRY COUNTER SCORECARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Active Tripping Runs</p>
                        <p className="text-3xl font-bold text-slate-100">0</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                        <Navigation size={24} />
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Total Inventory Loads</p>
                        <p className="text-3xl font-bold text-slate-100">0</p>
                    </div>
                    <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
                        <Box size={24} />
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Drivers Available</p>
                        <p className="text-3xl font-bold text-slate-100">0</p>
                    </div>
                    <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-lg">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700/60 p-5 rounded-xl flex items-center justify-between shadow-lg">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Offline Fleet Units</p>
                        <p className="text-3xl font-bold text-slate-100">0</p>
                    </div>
                    <div className="p-3 bg-slate-700/30 text-slate-400 rounded-lg">
                        <Truck size={24} />
                    </div>
                </div>

            </div>

            {/* 🖥️ DUMMY HOOK PLACEHOLDER FOR UPCOMING SYSTEM GRIDS */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                <div className="w-12 h-12 bg-slate-700/50 rounded-full flex items-center justify-center mb-4 border border-slate-600 text-slate-400">
                    <Truck size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-200">No Dispatched Tracking Streams</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1">
                    The layout matrix placeholder is active. Move to the next page to initialize dynamic order records inside the workspace!
                </p>
            </div>

        </div>
    );
}
