"use client";

import Link from "next/link";
import {
  Plane,
  Shield,
  LogIn,
  Eye,
  Zap,
  Globe,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  BarChart3,
  Clock,
  MapPin,
  AlertTriangle
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user);
  return (
    <div className="min-h-screen text-white bg-gray-950 font-[Poppins]">
      {/* Hero Section */}
      <section className="p-6 sm:p-8 max-w-6xl mx-auto">
        <div className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-400/80 mb-3">
              <Plane size={16} /> Real-time Airspace Safety
            </div>
            <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
              Simulate. Detect. Prevent.
            </h1>
            <p className="mt-4 text-white/70 max-w-prose">
              AeroSafe predicts collisions, enforces geofences, and issues AI-grade alerts for UAV operations.
              Explore a beautiful 3D dashboard designed for clarity and control.
            </p>
            {!isAuthed && (<div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/auth/signup"
                className="px-4 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 transition-colors"
              >
                <Shield size={18} /> Get started
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2.5 rounded-md bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center gap-2 transition-colors"
              >
                <LogIn size={18} /> Login
              </Link>
            </div>)}
          </div>

          {/* Fixed SVG background pattern */}
          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div
              className="aspect-video w-full rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-white/10 flex items-center justify-center text-white/80 relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                }}
              ></div>
              <div className="relative z-10 text-center">
                <Play size={24} className="mx-auto mb-2 opacity-80" />
                <span className="text-sm">3D Simulator available after login →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "99.9%", label: "Collision Prevention Rate" },
              { number: "< 50ms", label: "Real-time Response" },
              { number: "500+", label: "UAVs Monitored Daily" },
              { number: "24/7", label: "Continuous Monitoring" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stat.number}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-400/80 mb-3">
              <Zap size={16} /> Core Features
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold">Advanced UAV Safety Technology</h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              Comprehensive airspace management with cutting-edge AI and real-time monitoring capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Eye size={24} />,
                title: "Real-time Tracking",
                description: "Monitor UAV positions, velocities, and flight paths with millisecond precision across unlimited airspace."
              },
              {
                icon: <Shield size={24} />,
                title: "Collision Prediction",
                description: "AI-powered algorithms predict potential collisions up to 20 seconds in advance with 99.9% accuracy."
              },
              {
                icon: <Globe size={24} />,
                title: "Geofence Enforcement",
                description: "Define restricted zones and no-fly areas with automatic violation detection and instant alerts."
              },
              {
                icon: <BarChart3 size={24} />,
                title: "Analytics Dashboard",
                description: "Comprehensive insights into flight patterns, safety metrics, and operational efficiency."
              },
              {
                icon: <AlertTriangle size={24} />,
                title: "Smart Alerts",
                description: "Contextual notifications with severity levels, automated responses, and escalation protocols."
              },
              {
                icon: <MapPin size={24} />,
                title: "3D Visualization",
                description: "Immersive 3D environment for intuitive airspace management and situation awareness."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-400/80 mb-3">
              <Clock size={16} /> How It Works
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold">Simple. Powerful. Automated.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect & Configure",
                description: "Integrate your UAV fleet and define airspace parameters, restricted zones, and safety thresholds."
              },
              {
                step: "02",
                title: "Monitor & Analyze",
                description: "Real-time tracking with AI-powered collision detection and predictive path analysis."
              },
              {
                step: "03",
                title: "Prevent & Alert",
                description: "Automatic intervention with instant alerts, course corrections, and emergency protocols."
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-400 text-emerald-400 font-bold text-xl mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 text-white/30" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... (keep Use Cases, Testimonial, CTA, and Footer sections same as before — they are valid JSX) */}
    </div>
  );
}
