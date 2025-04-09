import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { HandHeart } from 'lucide-react'

export default function LandingPage() {
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = () => {
        setIsLoading(true)
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/login`
    }

    return (
        <div className="min-h-screen min-w-full bg-background flex items-center justify-center p-8">
            <main className="text-center space-y-8 max-w-4xl">
                <h1 className="text-5xl font-bold text-primary">Welcome to <span className="text-accent">Spendr</span>
                </h1>
                <p className="text-2xl text-muted-foreground">Your personal budget tracking companion</p>
                <div className="space-y-4">
                    <Button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="bg-bank-gradient text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Logging in...' : 'Get Started'}
                    </Button>
                    <p className="text-muted-foreground">Track expenses, set goals, and achieve <span
                        className="text-accent font-semibold">financial freedom</span></p>
                </div>
                <div className="flex justify-center items-center space-x-4 text-accent">
                    <HandHeart size={24}/>
                    <p className="font-semibold">Join thousands of satisfied users</p>
                </div>
                <footer className="mt-16 text-muted-foreground text-sm">
                    © 2024 <span className="text-accent">Spendr</span>. All rights reserved.
                </footer>
            </main>
        </div>
    )
}

