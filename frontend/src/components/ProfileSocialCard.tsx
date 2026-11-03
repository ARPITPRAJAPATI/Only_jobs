'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Code2, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/BrandIcons';
import { useStudent } from '@/components/store';

export function ProfileSocialCard() {
  const { student } = useStudent();

  const platforms = [
    {
      id: 'github',
      label: 'GitHub',
      handle: student.githubHandle ? `@${student.githubHandle}` : 'Not linked',
      href: student.githubHandle ? `https://github.com/${student.githubHandle}` : null,
      icon: <GithubIcon className="h-3.5 w-3.5" />,
      color: '#ffffff',
    },
    {
      id: 'leetcode',
      label: 'LeetCode',
      handle: student.leetcodeHandle ? `@${student.leetcodeHandle}` : 'Not linked',
      href: student.leetcodeHandle ? `https://leetcode.com/u/${student.leetcodeHandle}` : null,
      icon: <Code2 className="h-3.5 w-3.5" />,
      color: '#ffa116',
    },
    {
      id: 'codeforces',
      label: 'Codeforces',
      handle: student.codeforcesHandle ? `@${student.codeforcesHandle}` : 'Not linked',
      href: student.codeforcesHandle ? `https://codeforces.com/profile/${student.codeforcesHandle}` : null,
      icon: <Code2 className="h-3.5 w-3.5" />,
      color: '#3182ce',
    },
    {
      id: 'codechef',
      label: 'CodeChef',
      handle: student.codechefHandle ? `@${student.codechefHandle}` : 'Not linked',
      href: student.codechefHandle ? `https://www.codechef.com/users/${student.codechefHandle}` : null,
      icon: <Code2 className="h-3.5 w-3.5" />,
      color: '#d97706',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'Arpit Prajapati',
      href: student.linkedinUrl || null,
      icon: <LinkedinIcon className="h-3.5 w-3.5" />,
      color: '#0a66c2',
    },
    {
      id: 'x',
      label: 'X',
      handle: student.xUrl?.split('/').pop() ? `@${student.xUrl.split('/').pop()}` : '@arpit',
      href: student.xUrl || null,
      icon: <XIcon className="h-3 w-3" />,
      color: '#ffffff',
    },
  ];

  const connectedCount = platforms.filter((p) => p.href).length;

  return (
    <div className="relative w-full max-w-[320px] h-[290px] rounded-xl border border-white/[0.09] bg-black/25 backdrop-blur-xl p-4 flex flex-col justify-between overflow-hidden group">
      {/* Background subtle glow */}
      <div className="pointer-events-none absolute -bottom-16 -right-16 w-36 h-36 bg-[#0969da]/10 rounded-full blur-3xl" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-white/[0.08] border border-white/10 flex items-center justify-center">
            <Globe className="h-3 w-3 text-[#58a6ff]" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-white/45 block leading-none">
              Online Presence
            </span>
            <h2 className="text-sm font-black tracking-tight text-white leading-none mt-1">
              SOCIAL
            </h2>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-[#58a6ff]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#58a6ff] border border-[#58a6ff]/30 shadow-sm">
          {connectedCount} Connected
        </span>
      </div>

      {/* Middle: 2-column Grid of Social Platforms */}
      <div className="relative z-10 grid grid-cols-2 gap-1.5 my-auto py-1">
        {platforms.map((platform) => {
          const isLinked = Boolean(platform.href);

          if (!isLinked) {
            return (
              <div
                key={platform.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.05] bg-white/[0.02] p-2 opacity-50 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-white/30 shrink-0">{platform.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white/50 truncate text-[11px] leading-tight">
                      {platform.label}
                    </p>
                    <p className="font-mono text-[9.5px] text-white/30 truncate">
                      Unlinked
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <a
              key={platform.id}
              href={platform.href!}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/[0.22] px-2.5 py-1.5 transition-all duration-200"
              title={`Visit ${platform.label} (${platform.handle})`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: platform.color }}
                >
                  {platform.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-white/90 group-hover:text-white truncate text-[11px] leading-tight transition-colors">
                    {platform.label}
                  </p>
                  <p className="font-mono text-[9px] text-white/45 group-hover:text-white/70 truncate transition-colors">
                    {platform.handle}
                  </p>
                </div>
              </div>

              <ExternalLink className="h-2.5 w-2.5 text-white/20 group-hover:text-white/75 shrink-0 transition-colors" />
            </a>
          );
        })}
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-white/45">
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="h-3.5 w-3.5 text-[#3fb950] shrink-0" />
          <span className="truncate">Audited Handles · KIET TPO</span>
        </div>

        <Link
          href="/settings"
          className="hover:text-white transition-colors shrink-0 whitespace-nowrap font-medium text-[10px] text-[#58a6ff]"
        >
          Manage →
        </Link>
      </div>
    </div>
  );
}
