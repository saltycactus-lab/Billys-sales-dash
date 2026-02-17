'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Map } from 'lucide-react';

const NAV = [
  { href: '/',         label: "Today's Quest", sub: 'Weekly view',   icon: Compass },
  { href: '/pipeline', label: "The Journey",   sub: 'Full pipeline', icon: Map     },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside
      className="relative w-56 flex-shrink-0 flex flex-col h-screen z-20"
      style={{
        background: 'rgba(6,13,8,0.85)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo mark */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-1">
          {/* Stylised leaf / crest */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08))',
              border: '1px solid rgba(201,168,76,0.3)',
              boxShadow: '0 0 20px rgba(201,168,76,0.12)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3C7 3 3 7.5 3 12c0 3 1.5 5.5 4 7.5L8.5 15C7.2 14 6.5 12.7 6.5 11 6.5 8 9 5.5 12 5.5s5.5 2.5 5.5 5.5c0 1.7-.7 3-2 4l1.5 4.5C19.5 17.5 21 15 21 12c0-4.5-4-9-9-9z"
                fill="#c9a84c"
              />
            </svg>
          </div>
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: '#c9a84c' }}>
              Sales
            </p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#3d5c49' }}>
              Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="glass-divider mx-4 mb-5" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, sub, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
              style={
                active
                  ? {
                      background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                      border: '1px solid rgba(201,168,76,0.2)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 20px rgba(201,168,76,0.08)',
                    }
                  : {
                      border: '1px solid transparent',
                    }
              }
            >
              <Icon
                className="w-4 h-4 flex-shrink-0"
                style={{ color: active ? '#c9a84c' : '#3d5c49' }}
              />
              <div className="flex-1">
                <p
                  className="text-xs font-semibold"
                  style={{ color: active ? '#c9a84c' : '#7a9e87' }}
                >
                  {label}
                </p>
                <p className="text-[10px]" style={{ color: '#3d5c49' }}>{sub}</p>
              </div>
              {active && (
                <span
                  className="w-1.5 h-1.5 rounded-full pulse-dot"
                  style={{ background: '#c9a84c' }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Status pill */}
      <div className="px-4 pb-6">
        <div
          className="px-3 py-2.5 rounded-2xl"
          style={{
            background: 'rgba(45,106,79,0.1)',
            border: '1px solid rgba(45,106,79,0.2)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full pulse-dot"
              style={{ background: '#52c47e' }}
            />
            <span className="text-[10px] font-semibold tracking-wide uppercase" style={{ color: '#3d8b5e' }}>
              HubSpot Live
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
