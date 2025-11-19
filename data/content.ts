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
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">La structure d'un mémoire en QHSE (Qualité, Hygiène, Sécurité, Environnement) ne s'improvise pas. Elle doit répondre à une logique d'amélioration continue, souvent calquée sur la roue de Deming (PDCA : Plan-Do-Check-Act).</p>
      
      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">1. L'Introduction : Contextualisation des enjeux</h3>
      <p class="mb-4">Ne commencez pas directement par la technique. Votre introduction doit situer l'entreprise (secteur, taille, enjeux) et justifier pourquoi le sujet choisi est critique <em>maintenant</em>.</p>
      <p class="mb-4 p-4 bg-slate-50 border-l-4 border-indigo-500"><strong>Exemple de contexte :</strong> "Dans un contexte de durcissement de la réglementation ICPE et suite à l'augmentation de 15% du taux de fréquence des accidents en 2023, l'entreprise X doit repenser sa culture sécurité."</p>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">2. La Revue de Littérature et Normative (Le "Plan")</h3>
      <p class="mb-4">Un mémoire QHSE sans références normatives solides est incomplet. Vous devez citer et expliquer les référentiels utilisés :</p>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>ISO 45001 (2018)</strong> : Pour tout ce qui touche à la Santé et Sécurité au Travail (SST). Insistez sur le leadership et la participation des travailleurs.</li>
        <li><strong>ISO 14001 (2015)</strong> : Pour l'analyse environnementale et le cycle de vie.</li>
        <li><strong>Code du Travail</strong> : Citez les articles précis (ex: L.4121-1 sur les principes généraux de prévention).</li>
        <li><strong>MASE / UIC</strong> : Si vous êtes dans le secteur industriel ou pétrochimique.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">3. La Méthodologie et Diagnostic (Le "Do")</h3>
      <p class="mb-4">C'est ici que vous prouvez votre valeur technique. Quels outils avez-vous déployés pour analyser le réel ?</p>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Le Document Unique (DUERP)</strong> : Avez-vous mis à jour les cotations (Fréquence x Gravité) ?</li>
        <li><strong>L'AMDEC</strong> : Pour une analyse prédictive des défaillances.</li>
        <li><strong>Arbre des causes</strong> : Indispensable après un AT (Accident du Travail).</li>
        <li><strong>Matrice de conformité</strong> : Pour évaluer l'écart entre le réglementaire et le terrain.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">4. Résultats et Analyse Terrain (Le "Check")</h3>
      <p class="mb-4">L'erreur classique est de faire du descriptif. Vous devez faire de l'analytique.</p>
      <p class="mb-4"><em>Mauvais :</em> "Nous avons observé 15 non-conformités."</p>
      <p class="mb-4"><em>Excellent :</em> "L'analyse de Pareto démontre que 80% des 15 non-conformités proviennent d'un défaut de formation des intérimaires, soulignant une faille dans le processus d'accueil sécurité."</p>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">5. Préconisations et Plan d'Action (Le "Act")</h3>
      <p class="mb-4">C'est la partie la plus importante pour la note finale. Vos solutions doivent être opérationnelles (SMART).</p>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-slate-200 mb-6">
          <thead class="bg-slate-100">
            <tr>
              <th class="py-2 px-4 border-b text-left">Action</th>
              <th class="py-2 px-4 border-b text-left">Responsable</th>
              <th class="py-2 px-4 border-b text-left">Budget</th>
              <th class="py-2 px-4 border-b text-left">Indicateur (KPI)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="py-2 px-4 border-b">Refonte Livret Accueil</td>
              <td class="py-2 px-4 border-b">Resp. QHSE</td>
              <td class="py-2 px-4 border-b">500€</td>
              <td class="py-2 px-4 border-b">100% des nouveaux formés</td>
            </tr>
             <tr>
              <td class="py-2 px-4 border-b">Audit à blanc ISO 45001</td>
              <td class="py-2 px-4 border-b">Consultant Ext.</td>
              <td class="py-2 px-4 border-b">2500€</td>
              <td class="py-2 px-4 border-b">Nb d'écarts majeurs < 3</td>
            </tr>
          </tbody>
        </table>
      </div>
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
    imageUrl: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">La soutenance n'est pas un résumé de l'écrit. C'est un exercice de vente. Vous vendez votre travail, votre professionnalisme et votre capacité à synthétiser.</p>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Astuce 1 : La règle des 10/20/30</h3>
      <p class="mb-4">Guy Kawasaki a théorisé cette règle pour les présentations, très applicable en soutenance :</p>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>10 slides maximum</strong> : Allez à l'essentiel.</li>
        <li><strong>20 minutes</strong> : C'est souvent le temps imparti. Ne débordez jamais.</li>
        <li><strong>Police de taille 30</strong> : N'écrivez pas des romans sur vos diapositives. Le jury doit vous écouter, pas vous lire.</li>
      </ul>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Astuce 2 : L'attitude non-verbale (55% du message)</h3>
      <p class="mb-4">Selon la règle de Mehrabian, 55% de la communication est visuelle (corps), 38% vocale (ton) et seulement 7% verbale (mots).</p>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li>Tenez-vous droit, ancré au sol (pas de balancement).</li>
        <li>Ne croisez pas les bras (fermeture).</li>
        <li>Regardez chaque membre du jury dans les yeux à tour de rôle (balayage du regard).</li>
        <li>Souriez dès l'introduction pour créer un lien.</li>
      </ul>
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
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">Un mémoire académique répond à une codification stricte. Voici la structure standard attendue par 95% des jurys en France.</p>
      
      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Phase 1 : La Problématisation</h3>
      <p class="mb-4">Tout part d'un constat terrain. Votre mémoire doit répondre à une question centrale (la problématique). Elle doit être formulée sous forme de question ouverte commençant par "Dans quelle mesure...", "Comment...", "En quoi...".</p>
      
      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Phase 2 : L'État de l'Art (Théorie)</h3>
      <p class="mb-4">Avant de donner votre avis, vous devez montrer que vous avez lu ce que les experts ont dit avant vous. C'est la partie "Revue de littérature". Définissez les concepts clés.</p>

      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Phase 3 : L'Empirique (Pratique)</h3>
      <p class="mb-4">C'est votre valeur ajoutée. Comment avez-vous vérifié vos hypothèses ?</p>
      <ul class="list-disc pl-6 space-y-2 mb-6">
         <li>Étude Qualitative : Entretiens semi-directifs (pour comprendre le "pourquoi").</li>
         <li>Étude Quantitative : Sondages, questionnaires (pour mesurer le "combien").</li>
         <li>Observation participante : Vous êtes en stage, décrivez ce que vous vivez.</li>
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
    imageUrl: 'https://images.unsplash.com/photo-1532619675605-1ede6c2eddb0?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">Rien de tel que l'exemple pour comprendre. Voici une analyse de mémoires d'excellence.</p>
      
      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Mémoire 1 : Domaine Logistique</h3>
      <p class="mb-4"><strong>Sujet :</strong> L'optimisation du dernier kilomètre en zone urbaine dense.</p>
      <p class="mb-4"><strong>Note :</strong> 17/20</p>
      <p class="mb-4"><strong>Point fort :</strong> L'étudiant a réalisé une véritable étude de coûts comparée (Vélo cargo vs Camionnette). Les chiffres étaient réels et vérifiés.</p>
      
      <h3 class="text-2xl font-serif font-bold text-slate-900 mt-8 mb-4">Mémoire 2 : Domaine RH</h3>
      <p class="mb-4"><strong>Sujet :</strong> L'impact du télétravail sur la cohésion d'équipe.</p>
      <p class="mb-4"><strong>Note :</strong> 16.5/20</p>
      <p class="mb-4"><strong>Point fort :</strong> L'utilisation d'une grille d'analyse sociologique pour décrypter les verbatims des entretiens. L'étudiant ne s'est pas contenté de citer, il a interprété.</p>
    `
  },
  {
    id: '5',
    title: 'La bibliographie aux normes APA sans effort',
    category: 'Académique',
    slug: 'bibliographie-apa',
    excerpt: 'Ne perdez plus de points bêtement. Voici les règles d\'or pour citer vos sources et les outils pour automatiser votre bibliographie.',
    readTime: '6 min',
    date: '15 Sept 2024',
    author: 'Sarah Cohen',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7837437532d?auto=format&fit=crop&q=80&w=800',
    content: `
      <p class="lead text-xl text-slate-600 mb-8">La bibliographie est souvent négligée, traitée à la dernière minute. Pourtant, une bibliographie mal faite peut coûter jusqu'à 2 points sur la note finale et, pire, soulever des soupçons de plagiat.</p>
      <!-- Contenu précédent conservé pour la brièveté -->
    `
  }
];