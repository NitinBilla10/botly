'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProps {
  children: ReactNode;
  className?: string;
  initial?: object;
  animate?: object;
  transition?: object;
  whileHover?: object;
  whileTap?: object;
  delay?: number;
}

export function FadeInUp({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className = '', 
  delay = 0,
  ...props 
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function HoverCard({ 
  children, 
  className = '',
  ...props 
}: MotionProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}