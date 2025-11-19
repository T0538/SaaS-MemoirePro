import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/content';
import { Clock, ArrowLeft, Calendar, User } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Article non trouvé</h1>
        <Link to="/resources" className="text-indigo-600 hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Retour aux ressources
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Image */}
      <div className="h-[40vh] w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 bg-gradient-to-t from-slate-900/90 to-transparent">
            <div className="max-w-3xl mx-auto">
                <div className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                    {post.category}
                </div>
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
                    {post.title}
                </h1>
                <div className="flex items-center gap-6 text-slate-200 text-sm">
                    <div className="flex items-center gap-2">
                        <User size={16} /> {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} /> {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={16} /> {post.readTime} de lecture
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/resources" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition mb-8 text-sm font-medium">
            <ArrowLeft size={16} /> Retour aux articles
        </Link>

        <div className="prose prose-lg prose-slate prose-headings:font-serif prose-indigo mx-auto">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        <div className="mt-16 pt-8 border-t border-slate-100">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">Vous aimerez aussi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2).map(related => (
                    <Link key={related.id} to={`/blog/${related.slug}`} className="group block bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 transition">
                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">{related.title}</h4>
                        <p className="text-xs text-slate-500 mt-2">{related.readTime} • {related.category}</p>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};