
import { BlogPost } from '../types';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Comment structurer un mémoire QHSE parfait ?',
    category: 'Méthodologie',
    slug: 'structure-memoire-qhse',
    excerpt: 'Le guide complet pour articuler votre Document Unique, votre analyse environnementale et vos recommandations dans un plan cohérent.',
    readTime: '12 min',
    date: '12 Oct 2024',
    author: 'Dr. Sophie Martin',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">La structure d'un mémoire en QHSE ne s'improvise pas. Elle doit répondre à une logique d'amélioration continue, calquée sur la roue de Deming (PDCA).</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">1. L'Introduction : Contextualisation</h3>
      <p class="mb-4 text-slate-700 leading-7">Ne commencez pas directement par la technique. Votre introduction doit situer l'entreprise et justifier l'urgence du sujet.</p>
      
      <div class="my-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
        <strong class="text-indigo-900 block mb-2 font-serif">Exemple de contexte impactant :</strong>
        <span class="text-slate-700 italic">"Dans un contexte de durcissement de la réglementation ICPE et suite à l'augmentation de 15% du taux de fréquence des accidents en 2023, l'entreprise X doit repenser sa culture sécurité."</span>
      </div>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">2. Le Cadre Normatif (Plan)</h3>
      <p class="mb-4 text-slate-700 leading-7">Un mémoire QHSE sans références normatives solides est incomplet. Citez vos sources :</p>
      <ul class="list-disc pl-6 space-y-3 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong class="text-slate-900">ISO 45001 (2018)</strong> : Pour la Santé et Sécurité au Travail. Insistez sur le leadership.</li>
        <li><strong class="text-slate-900">ISO 14001 (2015)</strong> : Pour l'analyse environnementale et le cycle de vie.</li>
        <li><strong class="text-slate-900">Code du Travail</strong> : Citez les articles précis (ex: L.4121-1).</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">3. Diagnostic Terrain (Do & Check)</h3>
      <p class="mb-4 text-slate-700 leading-7">Prouvez votre valeur technique avec des outils reconnus :</p>
      <ul class="list-disc pl-6 space-y-3 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong>Le Document Unique (DUERP)</strong> : Mise à jour des cotations Fréquence x Gravité.</li>
        <li><strong>L'AMDEC</strong> : Pour l'analyse prédictive des défaillances processus.</li>
        <li><strong>Arbre des causes</strong> : Indispensable après un accident.</li>
      </ul>
    `
  },
  {
    id: '2',
    title: 'Réussir sa soutenance orale : 10 astuces',
    category: 'Soutenance',
    slug: 'reussir-soutenance',
    excerpt: 'La note finale se joue souvent à l\'oral. Découvrez comment captiver le jury, gérer votre stress et répondre aux questions pièges.',
    readTime: '8 min',
    date: '28 Sept 2024',
    author: 'Jean Dupont',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">La soutenance n'est pas un résumé de l'écrit. C'est un exercice de vente. Vous vendez votre professionnalisme.</p>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Astuce 1 : La règle des 10/20/30</h3>
      <p class="mb-4 text-slate-700 leading-7">Guy Kawasaki a théorisé cette règle d'or pour captiver un auditoire :</p>
      <ul class="list-disc pl-6 space-y-3 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong class="text-slate-900">10 slides maximum</strong> : Allez à l'essentiel, ne noyez pas le jury.</li>
        <li><strong class="text-slate-900">20 minutes</strong> : C'est le temps imparti standard. Ne débordez jamais.</li>
        <li><strong class="text-slate-900">Police taille 30</strong> : Le jury doit vous écouter, pas lire l'écran.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Astuce 2 : Le Non-Verbal</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
        <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h4 class="font-bold text-emerald-600 mb-2">À FAIRE</h4>
          <ul class="text-sm space-y-2 text-slate-600">
            <li>✓ Ancrage au sol solide</li>
            <li>✓ Regard balayant le jury</li>
            <li>✓ Mains ouvertes</li>
          </ul>
        </div>
        <div class="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <h4 class="font-bold text-red-500 mb-2">À ÉVITER</h4>
          <ul class="text-sm space-y-2 text-slate-600">
            <li>✗ Bras croisés (fermeture)</li>
            <li>✗ Lire ses notes</li>
            <li>✗ Tourner le dos au jury</li>
          </ul>
        </div>
      </div>
    `
  },
  {
    id: '3',
    title: 'Guide Méthodologique : De A à Z',
    category: 'Méthodologie',
    slug: 'guide-methodologique',
    excerpt: 'Le plan type universel pour un mémoire de Licence Pro ou Master. Ne réinventez pas la roue, suivez ce standard académique.',
    readTime: '15 min',
    date: '10 Oct 2024',
    author: 'Prof. Durand',
    imageUrl: 'https://images.unsplash.com/photo-1456324854777-9dd40a3fe47b?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">Un mémoire académique répond à une codification stricte. Voici la structure standard attendue par 95% des jurys.</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Phase 1 : La Problématisation</h3>
      <p class="mb-4 text-slate-700 leading-7">Tout part d'un constat terrain. Votre mémoire doit répondre à une question centrale. Elle doit être formulée sous forme de question ouverte.</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Phase 2 : L'État de l'Art</h3>
      <p class="mb-4 text-slate-700 leading-7">Avant de donner votre avis, montrez que vous maîtrisez la théorie. C'est la revue de littérature.</p>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Phase 3 : L'Empirique</h3>
      <p class="mb-4 text-slate-700 leading-7">Comment avez-vous vérifié vos hypothèses ?</p>
      <ul class="list-disc pl-6 space-y-3 mb-8 text-slate-700 marker:text-indigo-500">
         <li><strong class="text-slate-900">Qualitatif</strong> : Entretiens (pour comprendre le "pourquoi").</li>
         <li><strong class="text-slate-900">Quantitatif</strong> : Sondages (pour mesurer le "combien").</li>
         <li><strong class="text-slate-900">Observation</strong> : Immersion terrain.</li>
      </ul>
    `
  },
  {
    id: '4',
    title: 'Exemples de Mémoires Validés',
    category: 'Inspiration',
    slug: 'exemples-memoires',
    excerpt: 'Analyse de 3 mémoires ayant obtenu plus de 16/20. Points forts, structure et astuces à copier.',
    readTime: '10 min',
    date: '05 Oct 2024',
    author: 'Léa Dubois',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">Rien de tel que l'exemple pour comprendre. Voici une analyse de mémoires d'excellence.</p>
      
      <div class="space-y-8">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-indigo-700">Mémoire 1 : Logistique Urbaine</h3>
                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">17/20</span>
            </div>
            <p class="text-slate-600 mb-4"><strong class="text-slate-900">Sujet :</strong> Optimisation du dernier kilomètre.</p>
            <p class="text-slate-600"><strong class="text-slate-900">Le + du jury :</strong> Une étude de coûts comparative réelle (Vélo cargo vs Camionnette) avec des données chiffrées de l'entreprise.</p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-indigo-700">Mémoire 2 : RSE & RH</h3>
                <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">16.5/20</span>
            </div>
            <p class="text-slate-600 mb-4"><strong class="text-slate-900">Sujet :</strong> Impact du télétravail sur la cohésion.</p>
            <p class="text-slate-600"><strong class="text-slate-900">Le + du jury :</strong> L'utilisation d'une grille d'analyse sociologique pour décrypter les entretiens.</p>
        </div>
      </div>
    `
  },
  {
    id: '5',
    title: 'La bibliographie aux normes APA sans effort',
    category: 'Académique',
    slug: 'bibliographie-apa',
    excerpt: 'Ne perdez plus de points bêtement. Les règles d\'or pour citer vos sources et les outils pour automatiser.',
    readTime: '6 min',
    date: '15 Sept 2024',
    author: 'Sarah Cohen',
    imageUrl: 'https://images.unsplash.com/photo-1507842217121-9e9d147d7f20?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">La bibliographie est souvent négligée. Pourtant, une bibliographie mal faite peut coûter jusqu'à 2 points et soulever des soupçons de plagiat.</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">La Norme APA 7 : Les Bases</h3>
      <p class="mb-4 text-slate-700">Le format standard est : Auteur, A. A. (Année). <em>Titre en italique</em>. Éditeur.</p>

      <div class="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm my-8 shadow-lg">
        <p class="mb-4"><span class="text-indigo-400">// Livre</span><br>Dupont, J. (2023). <em>Le Management Moderne</em>. Dunod.</p>
        <p><span class="text-indigo-400">// Article Web</span><br>Martin, L. (2024). L'IA en entreprise. <em>Le Monde</em>. https://lemonde.fr/...</p>
      </div>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Automatisez avec MémoirePro</h3>
      <p class="mb-4 text-slate-700">Notre outil <strong class="text-indigo-600">Bibliographe Express</strong> génère ces citations pour vous. Ne le faites plus à la main.</p>
    `
  },
  {
    id: '6',
    title: '10 Thèmes de Mémoire Incontournables en 2024',
    category: 'Inspiration',
    slug: 'themes-memoire-licence-pro',
    excerpt: 'En panne d\'idée ? Voici 10 sujets porteurs en QHSE, Management et Industrie qui passionnent les jurys cette année.',
    readTime: '7 min',
    date: '22 Oct 2024',
    author: 'Dr. Sophie Martin',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">Le choix du sujet représente 50% de la réussite. Un bon sujet doit être actuel, problématique et ancré dans la réalité de l'entreprise.</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Thèmes QHSE & Environnement</h3>
      <ul class="list-disc pl-6 space-y-4 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong>1. La culture sécurité 2.0 :</strong> Comment digitaliser les remontées d'incidents sans déshumaniser le terrain ?</li>
        <li><strong>2. La gestion des risques psychosociaux (RPS) :</strong> L'impact du télétravail hybride sur la santé mentale des cadres.</li>
        <li><strong>3. L'économie circulaire en PME :</strong> Transformer les déchets de production en ressources (Analyse de cycle de vie).</li>
        <li><strong>4. La norme ISO 45001 :</strong> Les freins à la mise en place du leadership participatif en industrie lourde.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Thèmes Management & Industrie</h3>
      <ul class="list-disc pl-6 space-y-4 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong>5. L'IA dans la maintenance :</strong> Passer du préventif au prédictif grâce au Machine Learning.</li>
        <li><strong>6. La marque employeur :</strong> Comment attirer la génération Z dans les métiers industriels en tension ?</li>
        <li><strong>7. Le Lean Management :</strong> Les limites du "Zéro Stock" face aux crises d'approvisionnement mondiales.</li>
      </ul>

      <div class="my-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl">
        <strong class="text-amber-900 block mb-2 font-serif">Conseil d'expert :</strong>
        <span class="text-slate-700">Ne choisissez pas un sujet trop vaste (ex: "L'écologie"). Ciblez un problème précis de VOTRE entreprise (ex: "Réduire de 20% les déchets plastiques sur la ligne 3").</span>
      </div>
    `
  },
  {
    id: '7',
    title: 'Idées de Mémoire : Spécial RH & Comptabilité',
    category: 'Inspiration',
    slug: 'sujets-memoire-rh-compta',
    excerpt: 'Ressources Humaines, Finance, Comptabilité : Les sujets qui font mouche auprès des experts-comptables et DRH.',
    readTime: '9 min',
    date: '25 Oct 2024',
    author: 'Jean Dupont',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    content: `
      <p class="lead text-xl text-slate-600 mb-8 leading-relaxed">Les métiers du chiffre et de l'humain sont en pleine mutation technologique. Votre mémoire doit refléter cette transformation.</p>
      
      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Thèmes Ressources Humaines (RH)</h3>
      <p class="mb-4 text-slate-700">L'humain est au centre, mais la data arrive en force.</p>
      <ul class="list-disc pl-6 space-y-4 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong>1. L'IA dans le recrutement :</strong> Automatisation du sourcing vs biais algorithmiques. Quelle éthique ?</li>
        <li><strong>2. L'Onboarding digital :</strong> Comment intégrer efficacement un collaborateur à 100% à distance ?</li>
        <li><strong>3. La semaine de 4 jours :</strong> Impact réel sur la productivité et l'absentéisme en PME.</li>
        <li><strong>4. Le management intergénérationnel :</strong> Faire cohabiter Boomers et Gen Z dans les équipes projets.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-indigo-800 mt-10 mb-6 border-b border-indigo-100 pb-2">Thèmes Comptabilité & Finance</h3>
      <p class="mb-4 text-slate-700">Sortez de la saisie comptable, visez l'analyse et le conseil.</p>
      <ul class="list-disc pl-6 space-y-4 mb-8 text-slate-700 marker:text-indigo-500">
        <li><strong>5. La facturation électronique 2026 :</strong> Quels impacts sur l'organisation des cabinets d'expertise comptable ?</li>
        <li><strong>6. Le reporting extra-financier (CSRD) :</strong> Comment les PME peuvent-elles transformer cette contrainte RSE en opportunité de financement ?</li>
        <li><strong>7. Les crypto-actifs au bilan :</strong> Enjeux de comptabilisation et de valorisation pour l'auditeur.</li>
        <li><strong>8. L'automatisation des notes de frais :</strong> ROI et résistance au changement.</li>
      </ul>

      <div class="my-8 p-6 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl">
        <strong class="text-indigo-900 block mb-2 font-serif">Le mot de la fin :</strong>
        <span class="text-slate-700">Pour la compta, privilégiez les sujets liés à la digitalisation ou à la RSE. C'est là que se trouve l'avenir de la profession.</span>
      </div>
    `
  }
];
