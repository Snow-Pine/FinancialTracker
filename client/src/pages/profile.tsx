import { useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PageLoader } from "@/components/ui/page-loader"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
    const { isAuthenticated, loading } = useAuth()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleLogout = async () => {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/logout`
    }

    const [profile, setProfile] = useState({
        nickname: '',
        name: '',
        picture: '',
        updated_at: '',
        email: '',
        email_verified: false,
    })

    const loadProfile = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/profile`, {
                credentials: 'include',
            })
            const data = await response.json()
            setProfile(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadProfile()
        }
    }, [isAuthenticated])

    if (loading) {
        return <PageLoader />
    }

    if (!isAuthenticated) {
        window.location.href = `${import.meta.env.VITE_SERVER_URL}/login`
        return <PageLoader />
    }

    return (
        <div className="bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl border-border">
                <CardHeader className="relative pb-0">
                    <div className="w-full h-40 bg-bank-gradient rounded-t-lg" />
                    <div className="absolute -bottom-16 left-8">
                        <Avatar className="w-32 h-32 border-4 border-background">
                            <AvatarImage src={profile.picture} alt={profile.name} />
                            <AvatarFallback className="bg-accent text-accent-foreground text-3xl">
                                {profile.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </CardHeader>
                <CardContent className="pt-20 pb-8">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold text-primary">
                                    <span className="text-accent">{profile.name}</span>
                                </h1>
                                {profile.nickname !== profile.name && (
                                    <span className="text-xl text-muted-foreground">({profile.nickname})</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-foreground">{profile.email}</span>
                                <Badge
                                    variant="outline"
                                    className={profile.email_verified ?
                                        "bg-green-600 text-white]" :
                                        "bg-red-600 text-white"}
                                >
                                    {profile.email_verified ? "Verified" : "Unverified"}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="pt-4 border-t border-border">
                                <div className="grid gap-2">
                                    <div className="text-sm text-muted-foreground">
                                        <span className="font-medium text-accent">Last Login:</span>{" "}
                                        {formatDate(profile.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleLogout()}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-110 shadow-lg"
                        >
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

