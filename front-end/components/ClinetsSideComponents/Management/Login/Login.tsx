"use client"

import { AuthService } from "@/services/authService"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const router = useRouter()

    const login = async (e: any) => {
        e.preventDefault()
        setIsPending(true)

        try {
            const res = await AuthService.login({ email, password })
            Cookies.set("token", res.data.token)

            toast.success(res.message)
            router.push("/adherents")

        } catch (err: any) {
            toast.warn(err.response?.data?.message)

            if (err.response?.status === 422) {
                const backendErrors = err.response.data.errors

                if (backendErrors) {
                    const firstFieldErrors = Object.values(backendErrors)[0] as string[]

                    if (firstFieldErrors.length > 0) {
                        toast.error(firstFieldErrors[0])
                    }
                }
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 via-red-800 to-black p-4 relative">

            {/* Full page overlay spinner */}
            {isPending && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-red-900/90 border-2 border-red-500/50 rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="w-12 h-12 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                        <p className="text-white font-semibold text-lg">Connexion en cours...</p>
                    </div>
                </div>
            )}

            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute w-96 h-96 bg-red-600 blur-3xl rounded-full top-10 left-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-red-500 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-10">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-24 h-24 mx-auto mb-5 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl"
                    >
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11a9.39 9.39 0 0 0 9-11V7l-10-5z" />
                        </svg>
                    </motion.div>

                    <h1 className="text-4xl font-bold text-white">
                        ERP-STARGYM
                    </h1>

                    <p className="text-red-200 mt-2">
                        Connectez-vous à votre espace
                    </p>
                </div>

                {/* Card */}
                <div className="bg-red-900/70 backdrop-blur-xl border border-red-500/40 rounded-3xl p-8 shadow-2xl">
                    <form onSubmit={login} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                disabled={isPending}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-red-800/60 border border-red-400 rounded-xl text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="email@stargym.ma"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-white text-sm font-semibold mb-2 block">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    disabled={isPending}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 bg-red-800/60 border border-red-400 rounded-xl text-white placeholder-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white disabled:opacity-50"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Button */}
                        <motion.button
                            whileHover={{ scale: isPending ? 1 : 1.03 }}
                            whileTap={{ scale: isPending ? 1 : 0.97 }}
                            type="submit"
                            disabled={isPending}
                            className={`w-full py-3 rounded-xl cursor-pointer font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${isPending
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg hover:shadow-red-500/50"
                                }`}
                        >
                            {isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Connexion...
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center text-red-200 text-sm border-t border-red-400/30 pt-4">
                        © {new Date().getFullYear()} <span className="font-semibold">ERP-STARGYM</span> — v2.9.11
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
