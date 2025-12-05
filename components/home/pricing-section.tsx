"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { authClient } from "@/utils/auth-client"
import { useRouter } from "next/navigation"
import { PricingTier } from "@/types"
import { freeFeatures, proFeatures } from "@/lib/data"
import { Check, Crown } from "lucide-react"



export function PricingSection() {
    const { data } = authClient.useSession()
    const router = useRouter()

    const handleGetStarted = () => {
        // Navigate to sign up page or create podcast
        router.push('/create-podcast')
    }

    const handleUpgradeToPro = () => {
        if (!data?.user) {
            router.push('/sign-in')
            return
        }
        authClient.checkout({ slug: "pro" })
    }

    const tiers: PricingTier[] = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for getting started with AI podcast creation",
            features: freeFeatures,
            cta: "Get Started",
            ctaAction: handleGetStarted,
        },
        {
            name: "Pro",
            price: "$15",
            description: "For creators who want unlimited access to all features",
            features: proFeatures,
            badge: "Popular",
            popular: true,
            cta: "Upgrade to Pro",
            ctaAction: handleUpgradeToPro,
        },
    ]

    return (
        <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900">
            <section className=" container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                            <Crown className="w-3 h-3 mr-2" />
                            Pricing Plans
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Choose Your Plan
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Start free and upgrade when you&apos;re ready for unlimited access and premium features.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {tiers.map((tier) => (
                            <Card
                                key={tier.name}
                                className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${tier.popular
                                    ? 'border-2 border-purple-500 shadow-lg scale-105'
                                    : 'border shadow-md'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                                        {tier.badge}
                                    </div>
                                )}
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-3xl">{tier.name}</CardTitle>
                                        {tier.name === "Pro" && (
                                            <Crown className="w-6 h-6 text-yellow-500" />
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-4xl font-bold">{tier.price}</span>
                                        {tier.price !== "$0" && (
                                            <span className="text-muted-foreground">/month</span>
                                        )}
                                    </div>
                                    <CardDescription className="text-base">
                                        {tier.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <ul className="space-y-3">
                                        {tier.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {feature.icon ? (
                                                        <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                                            {feature.icon}
                                                        </div>
                                                    ) : (
                                                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                                                    )}
                                                </div>
                                                <span className="text-sm light:text-black dark:text-white leading-relaxed">
                                                    {feature.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={tier.ctaAction}
                                        className={`w-full h-12 text-base font-semibold ${tier.popular
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                            : 'light:text-black dark:text-white'
                                            }`}
                                        variant={tier.popular ? 'default' : 'outline'}
                                        size="lg"
                                    >
                                        {tier.cta}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-muted-foreground">
                            All plans include access to our AI-powered podcast creation tools.
                            <br />
                            <Link
                                href="/podcast/create-podcast"
                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                            >
                                Start creating your first podcast →
                            </Link>
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
