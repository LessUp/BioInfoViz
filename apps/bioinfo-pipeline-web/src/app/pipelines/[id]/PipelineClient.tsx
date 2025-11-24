"use client";

import React, { useCallback } from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { getApi } from '@/lib/fetch';
import type { Pipeline } from '@/types/pipeline';
import PipelineTimeline from '@/components/timeline/PipelineTimeline';
import StageOverviewCards from '@/components/stage/StageOverviewCards';
import StageSection from '@/components/stage/StageSection';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ResourceCard from '@/components/pipeline/ResourceCard';
import { RefreshCw, AlertCircle, Layers, BookOpen, Users, FileJson } from 'lucide-react';

const CATEGORY_LABEL: Record<string, string> = {
  germline: '外显子/胚系',
  transcriptomics: '转录组',
  'single-cell': '单细胞',
  metagenomics: '宏基因组',
  other: '其他',
};

export default function PipelineClient({ id }: { id: string }) {
  const { data, error, isLoading, isValidating, mutate } = useSWR<Pipeline>(`/api/pipelines/${id}`, getApi);

  const handleSelect = useCallback((stageId: string) => {
    const el = document.getElementById(`stage-${stageId}`);
    if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 180; // Offset for sticky header
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6 pt-24">
        <Card className="border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
          <AlertCircle className="mx-auto h-10 w-10 mb-4" />
          <h3 className="text-lg font-bold">加载流程数据失败</h3>
          <p className="mt-2 text-sm opacity-80">{String((error as any)?.message || error)}</p>
          <button onClick={() => mutate()} className="mt-6 rounded-full bg-red-100 px-6 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">
            重试
          </button>
        </Card>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 p-6 pt-24">
        <div className="space-y-4">
           <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
           <div className="h-10 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-24 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="h-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-64 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  const pipeline = data;

  return (
    <div className="min-h-screen bg-zinc-50 pb-24 dark:bg-black">
      {/* Sticky Header */}
      <header className="sticky top-16 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-lg transition-all dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
             <div>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <Layers className="h-3 w-3" />
                  {CATEGORY_LABEL[pipeline.profile.category] ?? 'Bioinformatics'}
                </div>
                <h1 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{pipeline.profile.name}</h1>
             </div>
             
             <div className="flex items-center gap-3">
               <Badge tone="accent" className="px-3 py-1 text-sm">
                  {pipeline.profile.difficulty === 'beginner' ? '入门' : pipeline.profile.difficulty === 'intermediate' ? '进阶' : '高级'}
               </Badge>
               <button
                  onClick={() => mutate()}
                  disabled={isLoading || isValidating}
                  className="group flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
               >
                  <RefreshCw className={`h-4 w-4 ${isValidating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  {isValidating ? '同步中' : '刷新状态'}
               </button>
             </div>
          </div>
          
          <div className="mt-6">
            <PipelineTimeline stages={pipeline.stages} onSelect={handleSelect} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-6 pt-10">
        {/* Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]"
        >
          <Card elevation="sm" className="flex flex-col justify-between">
            <div>
               <div className="flex items-center gap-2 mb-4">
                 <BookOpen className="h-5 w-5 text-blue-500" />
                 <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">流程简介</h2>
               </div>
               <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300">{pipeline.summary}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">关键知识点</div>
              <div className="flex flex-wrap gap-2">
                {pipeline.profile.keyConcepts.map((concept) => (
                  <Badge key={concept} tone="neutral" className="bg-zinc-100 dark:bg-zinc-800">{concept}</Badge>
                ))}
              </div>
            </div>
          </Card>
          
          <Card elevation="sm" className="flex flex-col justify-between bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
            <div>
               <div className="flex items-center gap-2 mb-4">
                 <Users className="h-5 w-5 text-purple-500" />
                 <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">适合人群</h3>
               </div>
               <ul className="space-y-2">
                {pipeline.profile.recommendedAudiences.map((aud) => (
                  <li key={aud} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    {aud}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
               <div className="mb-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">示例样本 ID</div>
               <div className="flex flex-wrap gap-2">
                  {pipeline.samples.slice(0, 6).map((sample) => (
                    <code key={sample.id} className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {sample.name}
                    </code>
                  ))}
                  {pipeline.samples.length > 6 && (
                    <span className="text-xs text-zinc-400">+{(pipeline.samples.length - 6)} more</span>
                  )}
               </div>
            </div>
          </Card>
        </motion.div>

        {/* Metrics Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">核心指标概览</h2>
          </div>
          <StageOverviewCards pipeline={pipeline} />
        </section>

        {/* Resources Section */}
        {pipeline.resources.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">配套学习资料</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {pipeline.resources.map((resource) => (
                <ResourceCard key={resource.title} resource={resource} />
              ))}
            </div>
          </section>
        )}

        {/* Stages List */}
        <section className="space-y-6">
           <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <FileJson className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">详细执行日志与产出物</h2>
           </div>
          {pipeline.stages
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => (
              <StageSection key={s.id} pipeline={pipeline} stage={s} />
            ))}
        </section>
      </main>
    </div>
  );
}
