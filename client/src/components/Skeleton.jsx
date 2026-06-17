import React from 'react'
import { motion } from 'framer-motion'

const pulseVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const Skeleton = ({ className = '', animate = true }) => (
  <motion.div
    className={`bg-[var(--surface-3)] rounded ${className}`}
    variants={animate ? pulseVariants : {}}
    animate={animate ? 'animate' : {}}
  />
)

export const SongRowSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-lg">
    <Skeleton className="w-10 h-10 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="w-12 h-4" />
  </div>
)

export const AlbumCardSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="w-full aspect-square rounded-lg" />
    <Skeleton className="h-4 w-4/5" />
    <Skeleton className="h-3 w-3/5" />
  </div>
)

export const PlayerBarSkeleton = () => (
  <div className="flex flex-col gap-4">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-8 w-full" />
  </div>
)

export const SkeletonList = ({ count = 3, children: SkeletonComponent = SongRowSkeleton }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <SkeletonComponent />
      </div>
    ))}
  </div>
)
