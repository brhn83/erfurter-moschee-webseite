/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

const GeometricBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-white overflow-hidden pointer-events-none">
      {/* Base Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-100" />
      
      {/* Decorative Rotating Center Element - Very Subtle */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-emerald-900/5 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-emerald-900/5 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default GeometricBackground;