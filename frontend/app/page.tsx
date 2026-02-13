/**
 * Landing Page
 *
 * Modern dark gradient landing page with hero, features, and CTA sections.
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShouldRedirect(true);
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">

    {/* HERO SECTION */}
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between py-24">

          {/* LEFT SIDE */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Task Management{' '}
              <span className="text-indigo-400">Made Simple</span>
            </h1>

            <p className="mt-6 text-lg text-gray-200 max-w-xl">
              Organize your work, boost productivity, and achieve your goals
              with our modern task management platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <Link
                href="/signup"
                className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-lg shadow-lg"
              >
                Get Started
              </Link>

              <Link
                href="/signin"
                className="px-8 py-3 rounded-xl bg-slate-950/40 backdrop-blur-md border border-white/20 hover:bg-slate-950/40 transition font-semibold text-lg"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE VISUAL */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <div className="bg-slate-950/40 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/10">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-300">
                Productivity Dashboard Preview
              </h3>
              <div className="space-y-4">
                <div className="bg-indigo-500/30 p-4 rounded-lg">✔ Smart Task Tracking</div>
                <div className="bg-indigo-500/30 p-4 rounded-lg">✔ Secure Authentication</div>
                <div className="bg-indigo-500/30 p-4 rounded-lg">✔ Real-Time Sync</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* FEATURES SECTION */}
    <div className="py-24 bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">

        <h2 className="text-indigo-300 font-bold uppercase tracking-wide">
          Features
        </h2>

        <p className="mt-4 text-5xl font-extrabold text-white">
          Powerful & Modern Tools
        </p>

        <p className="mt-6 text-gray-200 max-w-2xl mx-auto text-lg">
          Everything you need to stay productive and organized.
        </p>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 text-left">

          {[
            { title: "Task Management", desc: "Create, update and organize tasks easily." },
            { title: "Secure Login", desc: "JWT based authentication for full security." },
            { title: "Cross Device Sync", desc: "Access tasks from anywhere, anytime." },
            { title: "Smart Notifications", desc: "Never miss important deadlines again." }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:scale-105 transition duration-300 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-indigo-300 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-200">
                {feature.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>

      {/* CTA SECTION - unchanged */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-slate-950/70">Start managing your tasks today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-800 bg-white hover:bg-blue-50"
              >
                Get started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-950/40 bg-opacity-60 hover:bg-slate-800/30 "
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};