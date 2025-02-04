import React from 'react'

// src/components/layout/PrivateHeader.tsx
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function PrivateHeader() {
    const { data: session } = useSession();

    return (
        <header className="bg-green-500 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/dashboard" className="text-xl font-bold">
                    Dashboard
                </Link>
                <div>
                    {session?.user?.role === 'admin' && (
                        <Link href="/admin" className="mr-4">
                            Admin
                        </Link>
                    )}
                    <button onClick={() => signOut()} className="bg-red-500 px-4 py-2 rounded">
                        Cerrar sesión
                    </button>
                </div>
            </nav>
        </header>
    );
}