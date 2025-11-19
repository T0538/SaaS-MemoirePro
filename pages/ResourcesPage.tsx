
import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/content';
import { Search, Clock, ArrowRight, ImageOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResourcesPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">Centre de Ressources</h1>
          <p className="text-slate-500 max-w-2xl mx-auto mb-8">
            Tout ce dont vous avez besoin pour exceller dans votre rédaction académique. 
            Guides, tutoriels et conseils d'experts.
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un article, une méthode..." 
              className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {['Tout voir', 'Méthodologie', 'QHSE', 'Soutenance', 'Outils', 'Inspiration'].map((cat, idx) => (
            <button 
              key={idx}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${idx === 0 ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-bold mb-4">Ne manquez aucun conseil</h2>
            <p className="text-indigo-100 mb-8 max-w-lg mx-auto">Rejoignez 5000+ étudiants qui reçoivent nos astuces hebdomadaires pour réussir leur mémoire.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="votre@email.com" 
                className="px-6 py-3 rounded-full text-slate-900 outline-none flex-1 border-2 border-transparent focus:border-indigo-300"
              />
              <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition shadow-lg">
                S'inscrire
              </button>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </div>
    </div>
  );
};

// Subcomponent for safe image loading
const BlogCard: React.FC<{ post: any }> = ({ post }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-slate-100 flex flex-col h-full">
      <div className="h-52 overflow-hidden relative bg-slate-200">
        {!imgError ? (
            <img 
            src={post.imageUrl} 
            alt={post.title} 
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
        ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-indigo-50 text-slate-300">
                <ImageOff size={32} className="mb-2" />
                <span className="text-xs font-medium">Image indisponible</span>
            </div>
        )}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide shadow-sm">
            {post.category}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <Link to={`/blog/${post.slug}`}>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2">
            {post.title}
            </h3>
        </Link>
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
            {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
            <Clock size={14} />
            <span>{post.readTime} de lecture</span>
            </div>
            <Link to={`/blog/${post.slug}`} className="text-slate-900 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Lire l'article <ArrowRight size={14} className="text-indigo-600" />
            </Link>
        </div>
      </div>
    </article>
  );
};
