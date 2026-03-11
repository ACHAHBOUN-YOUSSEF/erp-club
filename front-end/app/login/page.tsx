"use client"
import Loader from '@/components/ui/loader';
import { AuthService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false);

    const [isPending, setIsPending] = useState<boolean>(false)
    const router = useRouter();

    const login = async (e: any) => {
        e.preventDefault()
        setIsPending(true)
        try {
            const res = await AuthService.login({ email, password })
            Cookies.set("token", res.data.token)
            setIsPending(false)
            router.push("/adherents");
            toast.success(res.message)
        } catch (err: any) {
            setIsPending(false)
        }
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center p-4 relative">
            {isPending && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-red-900/90 border-2 border-red-500/50 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full mx-4">
                        <Loader />
                        <p className="text-white mt-4 text-lg font-semibold">Connexion en cours...</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md relative z-10">
                {/* Logo Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/50">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11a9.39 9.39 0 0 0 9-11V7l-10-5z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-red-300 to-red-500 bg-clip-text text-transparent mb-2">
                        ERP-STARGYM
                    </h1>
                    <p className="text-red-200 text-lg">Connectez-vous à votre espace personnel</p>
                </div>

                {/* Form Card */}
                <div className="bg-red-900/80 backdrop-blur-xl border border-red-500/50 rounded-3xl p-8 shadow-2xl shadow-red-500/40">
                    <form onSubmit={login} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email" onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-4 bg-red-800/50 border-2 rounded-xl text-white placeholder-red-200 focus:outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowedborder-red-400 bg-red-700/50 ring-2 ring-red-400/50 border-red-500/60 hover:border-red-400 focus:border-red-400`}
                                placeholder="exemple@email.com"
                            />

                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                Mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-4 pr-12 bg-red-800/50 border-2 rounded-xl text-white placeholder-red-200 focus:outline-none transition-all duration-300 border-red-400 bg-red-700/50 ring-2 ring-red-400/50"
                                    placeholder="••••••••"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute  cursor-pointer right-3 top-1/2 -translate-y-1/2 text-white"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-4 px-6 text-white font-bold text-lg rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-red-600 to-red-500 shadow-red-500/50 hover:from-red-500 hover:to-red-400 hover:shadow-2xl hover:shadow-red-400/70 hover:-translate-y-1'`}
                        >
                            Connecter
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-red-400/40 text-center">
                        <p className="text-red-200 text-sm">
                            © 2026 ERP-STARGYM. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
