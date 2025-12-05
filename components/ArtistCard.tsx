
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from '../types';
import { Calendar, ArrowRight } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
}

const NewsCard: React.FC<ActivityCardProps> = ({ activity }) => {
  return (
    <motion.article 
      className="flex flex-col bg-white h-full border border-slate-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image Block */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img 
          src={activity.image} 
          alt={activity.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
          {activity.category}
        </div>
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Calendar className="w-3 h-3" />
          <span>{activity.time}</span>
        </div>

        <h3 className="font-heading text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-red-700 transition-colors">
          {activity.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
          {activity.description}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100">
           <span className="text-red-700 text-xs font-bold uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all">
             Beitrag lesen <ArrowRight className="w-3 h-3" />
           </span>
        </div>
      </div>
    </motion.article>
  );
};

export default NewsCard;
