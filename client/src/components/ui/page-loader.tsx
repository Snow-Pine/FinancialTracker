import { Loader2 } from 'lucide-react'

export const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
            <div className="relative w-24 h-24">
                <Loader2 className="w-24 h-24 animate-spin text-accent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-background rounded-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">S</span>
                </div>
            </div>
            <p className="mt-4 text-lg font-medium text-muted-foreground animate-pulse">
                Loading your financial future...
            </p>
        </div>
    )
}

