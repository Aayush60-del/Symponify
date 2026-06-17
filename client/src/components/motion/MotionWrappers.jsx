import React from 'react'
import { motion } from 'framer-motion'
import {
  pageVariants,
  containerVariants,
  itemVariants,
  listContainerVariants,
  listItemVariants,
  fadeInVariants,
} from '../lib/animations'
import { useReducedMotion } from '../lib/animation-utils'

// Animated page wrapper
export const AnimatedPage = ({ children, ...props }) => {
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : pageVariants

  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit" {...props}>
      {children}
    </motion.div>
  )
}

// Animated container with staggered children
export const AnimatedContainer = ({ children, ...props }) => {
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : containerVariants

  return (
    <motion.div variants={variants} initial="initial" animate="animate" {...props}>
      {children}
    </motion.div>
  )
}

// Animated list
export const AnimatedList = ({ children, ...props }) => {
  const prefersReducedMotion = useReducedMotion()

  const containerVars = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : listContainerVariants

  return (
    <motion.div variants={containerVars} initial="hidden" animate="visible" {...props}>
      {children}
    </motion.div>
  )
}

// Animated list item
export const AnimatedListItem = ({ children, ...props }) => {
  const prefersReducedMotion = useReducedMotion()

  const itemVars = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : listItemVariants

  return (
    <motion.div variants={itemVars} {...props}>
      {children}
    </motion.div>
  )
}

// Fade in animation
export const FadeIn = ({ children, ...props }) => {
  const prefersReducedMotion = useReducedMotion()

  const variants = prefersReducedMotion
    ? { initial: {}, animate: {} }
    : fadeInVariants

  return (
    <motion.div variants={variants} initial="initial" animate="animate" {...props}>
      {children}
    </motion.div>
  )
}

// Hover effect wrapper
export const HoverScale = ({ children, scale = 1.05, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Loading skeleton wrapper
export const SkeletonWrapper = ({ isLoading, children, skeleton }) => {
  return isLoading ? skeleton : children
}
