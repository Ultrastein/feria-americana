"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PasswordProtect({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isChecking, setIsChecking] = useState(true);

    // Read from localStorage to persist session
    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (auth === "true") {
            setIsAuthenticated(true);
        }
        setIsChecking(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "Juancagliero2022") {
            setIsAuthenticated(true);
            localStorage.setItem("adminAuth", "true");
        } else {
            setError("Contraseña incorrecta");
            setPassword("");
        }
    };

    if (isChecking) {
        return null; // Don't flash login screen if already authenticated
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-text hover:text-foreground mb-8">
                <ArrowLeft size={16} className="mr-1" /> Volver al portal
            </Link>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-border-color max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-serif font-bold text-foreground">Panel de Admin</h1>
                    <p className="text-sm text-muted-text mt-1">Acceso restringido</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full border border-border-color rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                            placeholder="Ingresa la contraseña"
                            autoFocus
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
                    <button 
                        type="submit" 
                        className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-[#c8684d] transition-colors"
                    >
                        Ingresar
                    </button>
                    
                </form>
            </div>
        </div>
    );
}
