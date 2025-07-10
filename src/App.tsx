import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Goal, Users, TrendingUp, Heart, ShieldCheck, Clock, BookOpen, UserMinus, Bug, Package, DollarSign, User, Gauge } from 'lucide-react';

// Fonction utilitaire pour générer des données réalistes
const generateData = (startDate, numMonths, initialValue, targetValue, targetDate, fluctuates = true, trendFactor = 0.05) => {
  const data = [];
  let currentValue = initialValue;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + numMonths);

  for (let i = 0; i < numMonths; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);

    let value = currentValue;
    if (fluctuates) {
      value += (Math.random() - 0.5) * (initialValue * 0.1); // Fluctuation de +/- 5%
    }

    // Tendre vers la valeur cible
    if (date <= targetDate) {
      const progress = (date.getTime() - startDate.getTime()) / (targetDate.getTime() - startDate.getTime());
      value = initialValue + (targetValue - initialValue) * progress;
      if (fluctuates) {
        value += (Math.random() - 0.5) * (initialValue * 0.08); // Moins de fluctuation à mesure qu'on approche de la cible
      }
    } else {
      value = targetValue + (Math.random() - 0.5) * (targetValue * 0.05); // Fluctuation autour de la cible après la date
    }

    data.push({
      name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2)),
    });
    currentValue = value; // Pour que la tendance suive
  }
  return data;
};

// Fonction pour simuler la réduction du stock d'incidents
const generateCyberIncidentsData = (startDate, numMonths, initialIncidents, targetIncidents, targetDate) => {
  const data = [];
  let currentIncidents = initialIncidents;
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + numMonths);

  for (let i = 0; i < numMonths; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);

    let incidents = currentIncidents;

    // Diminuer le nombre d'incidents jusqu'à la date cible
    if (date <= targetDate) {
      const progress = (date.getTime() - startDate.getTime()) / (targetDate.getTime() - startDate.getTime());
      incidents = initialIncidents - (initialIncidents - targetIncidents) * progress;
      incidents = Math.max(targetIncidents, incidents); // Ne pas descendre en dessous de la cible
      incidents = Math.round(incidents + (Math.random() - 0.5) * 1); // Petite fluctuation entière
    } else {
      incidents = targetIncidents + Math.round((Math.random() - 0.5) * 0.5); // Fluctuation autour de la cible
      incidents = Math.max(targetIncidents, incidents);
    }


    data.push({
      name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      date: date.toISOString().split('T')[0],
      incidents: Math.max(0, incidents), // Assurez-vous que le nombre d'incidents n'est pas négatif
    });
    currentIncidents = incidents;
  }
  return data;
};

// Fonction pour simuler les projets en retard
const generateDelayedProjectsData = (startDate, numMonths, initialDelayed) => {
  const data = [];
  for (let i = 0; i < numMonths; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    let delayed = Math.max(0, Math.round(initialDelayed + (Math.random() - 0.5) * 2)); // Fluctuation
    if (i > numMonths / 2) { // Tendance à l'amélioration
      delayed = Math.max(0, Math.round(delayed - (Math.random() * 0.8)));
    }
    data.push({
      name: date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
      date: date.toISOString().split('T')[0],
      delayed: delayed,
    });
  }
  return data;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Card = ({ title, value, unit, icon: Icon, color = 'text-blue-500', trend = null, description = null }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300">
    <div>
      <div className={`text-2xl font-bold mb-2 ${color} flex items-center`}>
        {Icon && <Icon className="mr-2" size={32} />}
        <span>{value}{unit}</span>
      </div>
      <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
    </div>
    {trend && (
      <div className="mt-4 text-sm text-gray-600 flex items-center">
        {trend.type === 'up' && <TrendingUp className="mr-1 text-green-500" size={16} />}
        {trend.type === 'down' && <TrendingUp className="mr-1 text-red-500 rotate-180" size={16} />}
        {trend.value} {trend.unit} {trend.text}
      </div>
    )}
  </div>
);

const SectionTitle = ({ title, icon: Icon }) => (
  <h2 className="text-3xl font-extrabold text-gray-800 mb-6 flex items-center">
    {Icon && <Icon className="mr-3 text-purple-600" size={32} />}
    {title}
  </h2>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dates de référence
  const currentDate = useMemo(() => new Date(), []);
  const startDataDate = useMemo(() => {
    // Start from the beginning of the current month
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return d;
  }, [currentDate]);
  const numDataMonths = 36; // 36 mois de données à partir du mois actuel pour la projection

  // Objectifs dates
  const grossMarginTargetDate = useMemo(() => new Date('2026-12-31'), []);
  const npsTargetDate = useMemo(() => new Date('2026-05-31'), []);
  const trainingBudgetTargetDate = useMemo(() => new Date('2027-05-31'), []);
  const turnoverTargetDate = useMemo(() => new Date('2027-12-31'), []);
  const projectDeliveryTargetDate = useMemo(() => new Date('2026-01-31'), []);
  const cyberIncidentsTargetDate = useMemo(() => new Date('2025-09-30'), []);


  // Génération des données réalistes
  const grossMarginData = useMemo(() =>
    generateData(startDataDate, numDataMonths, 22, 65, grossMarginTargetDate, true),
    [startDataDate, numDataMonths, grossMarginTargetDate]
  );
  const npsData = useMemo(() =>
    generateData(startDataDate, numDataMonths, 6.5, 8, npsTargetDate, true),
    [startDataDate, numDataMonths, npsTargetDate]
  );
  // Updated initial training budget to 1% and target to 3% (1% + 2% increase)
  const trainingBudgetShareData = useMemo(() =>
    generateData(startDataDate, numDataMonths, 0.01, 0.03, trainingBudgetTargetDate, true),
    [startDataDate, numDataMonths, trainingBudgetTargetDate]
  );
  const companyTurnoverData = useMemo(() =>
    generateData(startDataDate, numDataMonths, 0.18, 0.10, turnoverTargetDate, true), // De 18% à 10%
    [startDataDate, numDataMonths, turnoverTargetDate]
  );
  const projectDeliveryTimeData = useMemo(() =>
    generateData(startDataDate, numDataMonths, 4.5, 3, projectDeliveryTargetDate, true), // De 4.5 mois à 3 mois
    [startDataDate, numDataMonths, projectDeliveryTargetDate]
  );
  const cyberIncidentsMonthlyData = useMemo(() =>
    generateCyberIncidentsData(startDataDate, numDataMonths, 3, 1, cyberIncidentsTargetDate), // De 3 à 1 incident
    [startDataDate, numDataMonths, cyberIncidentsTargetDate]
  );
  const delayedProjectsData = useMemo(() =>
    generateDelayedProjectsData(startDataDate, numDataMonths, 4), // Initial 4 projects delayed
    [startDataDate, numDataMonths]
  );

  // Valeurs actuelles (dernières données générées)
  const currentGrossMargin = grossMarginData[grossMarginData.length - 1]?.value || 0;
  const currentNPS = npsData[npsData.length - 1]?.value || 0;
  const currentTrainingBudgetShare = trainingBudgetShareData[trainingBudgetShareData.length - 1]?.value || 0;
  const currentCompanyTurnover = companyTurnoverData[companyTurnoverData.length - 1]?.value || 0;
  const currentProjectDeliveryTime = projectDeliveryTimeData[projectDeliveryTimeData.length - 1]?.value || 0;
  const currentCyberIncidents = cyberIncidentsMonthlyData[cyberIncidentsMonthlyData.length - 1]?.incidents || 0;
  const currentDelayedProjects = delayedProjectsData[delayedProjectsData.length - 1]?.delayed || 0;

  // New metrics from user input
  const currentRevenue = 2.5; // M€
  const currentActiveClients = 35;
  const totalProjectsInCourse = 12; // Including 4 delayed
  const majorClientDependency = 55; // % of CA


  // Répartition du budget formation par service (exemple statique)
  const trainingBudgetServiceDistribution = [
    { name: 'Développement', value: 40 },
    { name: 'Marketing', value: 20 },
    { name: 'RH', value: 15 },
    { name: 'Opérations', value: 25 },
  ];

  // Répartition du turnover par service (exemple statique)
  const turnoverServiceDistribution = [
    { name: 'Développement', value: 12 },
    { name: 'Opérations', value: 15 },
    { name: 'Commercial', value: 8 },
    { name: 'Support Client', value: 10 },
  ];

  // Risques (Updated with detailed information)
  const risks = [
    {
      name: 'Non-respect des délais',
      severity: 4,
      probability: 4,
      criticality: 16,
      preventionPlan: 'Améliorer la planification et le suivi de projet',
      reparabilityPlan: 'Mobilisation d’une équipe en urgence, pénalités à négocier',
    },
    {
      name: 'Sous-effectif',
      severity: 4,
      probability: 3,
      criticality: 12,
      preventionPlan: 'Renforcer la politique de recrutement',
      reparabilityPlan: 'Externalisation temporaire ou intérim',
    },
    {
      name: 'Surcharge des équipes',
      severity: 3,
      probability: 4,
      criticality: 12,
      preventionPlan: 'Rééquilibrer la charge par la priorisation et l\'automatisation',
      reparabilityPlan: 'Réaffectation des priorités, aide ponctuelle',
    },
    {
      name: 'Gestion inefficace des projets complexes',
      severity: 4,
      probability: 3,
      criticality: 12,
      preventionPlan: 'Former les chefs de projets, mettre en place des outils adaptés',
      reparabilityPlan: 'Consultants externes ou PMO de secours',
    },
    {
      name: 'Érosion des marges',
      severity: 4,
      probability: 3,
      criticality: 12,
      preventionPlan: 'Mieux chiffrer les projets, optimiser les coûts internes',
      reparabilityPlan: 'Révision des prix ou recentrage sur projets rentables',
    },
    {
      name: 'Dépendance à un nombre limité de clients',
      severity: 5,
      probability: 2,
      criticality: 10,
      preventionPlan: 'Diversifier le portefeuille client',
      reparabilityPlan: 'Négociation avec d’autres clients, plan de redressement',
    },
    {
      name: 'Perte de compétences clés',
      severity: 4,
      probability: 3,
      criticality: 12,
      preventionPlan: 'Mettre en place un plan de fidélisation des talents',
      reparabilityPlan: 'Recrutement rapide, documentation des savoirs critiques',
    },
    {
      name: 'Insuffisance dans le développement des compétences',
      severity: 3,
      probability: 3,
      criticality: 9,
      preventionPlan: 'Augmenter le budget formation, créer un parcours de développement',
      reparabilityPlan: 'Formations express, tutorat interne',
    },
    {
      name: 'Cybersécurité',
      severity: 5,
      probability: 2,
      criticality: 10,
      preventionPlan: 'Renforcer les dispositifs de sécurité, former les équipes',
      reparabilityPlan: 'Réponse technique rapide, audit post-incident',
    },
    {
      name: 'Détérioration de la satisfaction client',
      severity: 4,
      probability: 3,
      criticality: 12,
      preventionPlan: 'Mieux gérer les retours clients et mesurer régulièrement la satisfaction',
      reparabilityPlan: 'Geste commercial, réajustement de la prestation',
    },
    {
      name: 'Perte d’attractivité de l’entreprise',
      severity: 3,
      probability: 3,
      criticality: 9,
      preventionPlan: 'Travailler sur la QVT, la marque employeur et les parcours internes',
      reparabilityPlan: 'Campagne de recrutement ciblée, actions RH rapides',
    },
  ];

  const Tabs = [
    { id: 'overview', name: 'Aperçu', icon: Goal },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'hr', name: 'RH', icon: Users },
    { id: 'operational', name: 'Opérationnel', icon: ShieldCheck },
    { id: 'risks', name: 'Risques', icon: Bug },
  ];

  return (
    <div className="font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <header className="mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 flex items-center justify-center">
          <Goal className="mr-4" size={40} />
          Tableau de bord de performance
        </h1>
        <p className="text-center text-gray-600 mt-2 text-lg">Suivez vos indicateurs clés pour devenir le leader des solutions low cost.</p>
      </header>

      <nav className="mb-8 flex justify-center bg-white p-2 rounded-full shadow-md">
        {Tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 mx-1 rounded-full text-lg font-medium transition-all duration-300 ease-in-out flex items-center
              ${activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
              }`}
          >
            <tab.icon className="mr-2" size={20} />
            {tab.name}
          </button>
        ))}
      </nav>

      <main className="container mx-auto px-4">
        {activeTab === 'overview' && (
          <section id="overview" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Aperçu des indicateurs clés" icon={Goal} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Card
                title="Chiffre d'affaires annuel"
                value={currentRevenue}
                unit=" M€"
                icon={DollarSign}
                color="text-green-700"
                description={`Actuel`}
              />
              <Card
                title="Nombre de clients actifs"
                value={currentActiveClients}
                unit=""
                icon={Users}
                color="text-blue-700"
                description={`Actuel`}
              />
              <Card
                title="Projets en cours"
                value={totalProjectsInCourse}
                unit=""
                icon={Package}
                color="text-purple-700"
                description={`${currentDelayedProjects} en retard`}
              />
              <Card
                title="Dépendance clients majeurs"
                value={majorClientDependency}
                unit="%"
                icon={Heart}
                color="text-orange-700"
                description={`3 clients majeurs`}
              />
              <Card
                title="Marge Brute Actuelle"
                value={currentGrossMargin}
                unit="%"
                icon={TrendingUp}
                color="text-green-600"
                description={`Objectif: 65% d'ici fin 2026`}
                trend={{ type: 'up', value: `+${(currentGrossMargin - 22).toFixed(1)}`, unit: '%', text: 'depuis le début' }}
              />
              <Card
                title="NPS Actuel"
                value={currentNPS}
                unit="/10"
                icon={Gauge}
                color="text-blue-600"
                description={`Objectif: 8 d'ici mai 2026`}
                trend={{ type: 'up', value: `+${(currentNPS - 6.5).toFixed(1)}`, unit: '', text: 'depuis le début' }}
              />
              <Card
                title="Budget Formation"
                value={(currentTrainingBudgetShare * 100).toFixed(1)}
                unit="%"
                icon={BookOpen}
                color="text-purple-600"
                description={`Objectif: +2% (total ${(0.03 * 100).toFixed(1)}%) d'ici mai 2027`}
                trend={{ type: 'up', value: `+${((currentTrainingBudgetShare - 0.01) * 100).toFixed(1)}`, unit: '%', text: 'alloué' }}
              />
              <Card
                title="Taux de Turn-over"
                value={(currentCompanyTurnover * 100).toFixed(1)}
                unit="%"
                icon={UserMinus}
                color="text-red-600"
                description={`Objectif: 10% d'ici fin 2027`}
                trend={{ type: 'down', value: `${(18 - (currentCompanyTurnover * 100)).toFixed(1)}`, unit: '%', text: 'de réduction' }}
              />
              <Card
                title="Temps Moyen de Livraison"
                value={currentProjectDeliveryTime}
                unit=" mois"
                icon={Clock}
                color="text-yellow-600"
                description={`Objectif: 3 mois d'ici Janvier 2026`}
                trend={{ type: 'down', value: `${(4.5 - currentProjectDeliveryTime).toFixed(1)}`, unit: ' mois', text: 'de réduction' }}
              />
              <Card
                title="Incidents Cybersécurité (actuel)"
                value={currentCyberIncidents}
                unit=""
                icon={Bug}
                color="text-orange-600"
                description={`Objectif: 1 d'ici Septembre 2025`}
                trend={{ type: 'down', value: `${(3 - currentCyberIncidents).toFixed(0)}`, unit: ' incidents', text: 'de réduction' }}
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mt-10 mb-4">Écarts actuels par rapport aux objectifs</h3>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 bg-gray-50 p-6 rounded-lg shadow-inner">
              <li>**Taux de satisfaction client (NPS)** : {currentNPS.toFixed(1)}/10 au lieu de 9</li>
              <li>**Turn-over technique annuel** : {(currentCompanyTurnover * 100).toFixed(1)}% au lieu de 5%-10%</li>
              <li>**Temps moyen de livraison d’un projet** : {currentProjectDeliveryTime.toFixed(1)} mois au lieu de 3 mois</li>
              <li>**Nombre d’incidents de cybersécurité sur 12 mois** : {currentCyberIncidents} au lieu de 0</li>
              <li>**Projets en retard** : {currentDelayedProjects} au lieu de 0 (sur {totalProjectsInCourse} projets en cours)</li>
              <li>**Marge brute** : {currentGrossMargin.toFixed(1)}% au lieu de 60%-80% dans le secteur</li>
              <li>**Budget formation** : {(currentTrainingBudgetShare * 100).toFixed(1)}% au lieu de 3% (1% + 2% d'augmentation)</li>
            </ul>
          </section>
        )}

        {activeTab === 'marketing' && (
          <section id="marketing" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Performance Marketing" icon={TrendingUp} />

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Taux de marge brute mensuelle (Objectif: 65% d'ici fin 2026)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={grossMarginData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'Marge Brute (%)', angle: -90, position: 'insideLeft' }} domain={[0, 70]} />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)}%`}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return `Mois: ${payload[0].payload.name}`;
                      }
                      return `Mois: ${label}`;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Marge Brute" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine x={grossMarginTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Évolution de la marge brute mensuelle. Actuel: {currentGrossMargin.toFixed(1)}%</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Suivi du NPS mensuel (Objectif: 8 d'ici mai 2026)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={npsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'NPS (/10)', angle: -90, position: 'insideLeft' }} domain={[0, 10]} />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)}/10`}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return `Mois: ${payload[0].payload.name}`;
                      }
                      return `Mois: ${label}`;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" name="NPS" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine x={npsTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Évolution du Net Promoter Score. Actuel: {currentNPS.toFixed(1)}/10</p>
            </div>
          </section>
        )}

        {activeTab === 'hr' && (
          <section id="hr" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Performance RH" icon={Users} />

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Pourcentage alloué à la formation (Objectif: +2% d'ici mai 2027)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trainingBudgetShareData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: '% Budget', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} domain={[0, 0.05]} />
                  <Tooltip
                    formatter={(value) => `${(value * 100).toFixed(1)}%`}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return `Mois: ${payload[0].payload.name}`;
                      }
                      return `Mois: ${label}`;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ffc658" name="% Formation" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine x={trainingBudgetTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Part du budget allouée à la formation. Actuel: {(currentTrainingBudgetShare * 100).toFixed(1)}%</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Répartition du % du budget formation par service</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={trainingBudgetServiceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {trainingBudgetServiceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Distribution actuelle du budget de formation entre les services.</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Taux de turn-over mensuel dans l'entreprise (Objectif: 10% d'ici fin 2027)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={companyTurnoverData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'Turn-over (%)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `${(value * 100).toFixed(1)}%`} domain={[0, 20]} />
                  <Tooltip
                    formatter={(value) => `${(value * 100).toFixed(1)}%`}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return `Mois: ${payload[0].payload.name}`;
                      }
                      return `Mois: ${label}`;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" name="Turn-over" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine x={turnoverTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Évolution du taux de turn-over mensuel. Actuel: {(currentCompanyTurnover * 100).toFixed(1)}%</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Répartition du turn-over mensuel par service</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={turnoverServiceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: '% Turn-over', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                  <Bar dataKey="value" name="Turn-over" fill="#82caff" radius={[10, 10, 0, 0]}>
                    {turnoverServiceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Distribution actuelle du turn-over par service.</p>
            </div>
          </section>
        )}

        {activeTab === 'operational' && (
          <section id="operational" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Performance Opérationnelle" icon={ShieldCheck} />

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Temps moyen de livraison des projets (Objectif: 3 mois d'ici Janvier 2026)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectDeliveryTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'Temps (mois)', angle: -90, position: 'insideLeft' }} domain={[2, 5]} />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)} mois`}
                    labelFormatter={(label, payload) => {
                      if (payload.length > 0) {
                        return `Mois: ${payload[0].payload.name}`;
                      }
                      return `Mois: ${label}`;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Temps de livraison" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <ReferenceLine x={projectDeliveryTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Évolution du temps moyen de livraison des projets. Actuel: {currentProjectDeliveryTime.toFixed(1)} mois</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Nombre d'incidents techniques mensuels (Objectif: 1 d'ici Septembre 2025)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cyberIncidentsMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'Incidents', angle: -90, position: 'insideLeft' }} domain={[0, 5]} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="incidents" name="Incidents Cyber" fill="#ffbb28" radius={[10, 10, 0, 0]} />
                  <ReferenceLine x={cyberIncidentsTargetDate.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} stroke="red" label="Objectif" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Nombre d'incidents de cybersécurité. Actuel: {currentCyberIncidents}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Nombre de projets en retard mensuels (Objectif: 0)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={delayedProjectsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval="preserveStartEnd" />
                  <YAxis label={{ value: 'Projets', angle: -90, position: 'insideLeft' }} domain={[0, 5]} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="delayed" name="Projets en Retard" fill="#ff8042" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-gray-600 mt-2">Nombre de projets en retard. Actuel: {currentDelayedProjects}</p>
            </div>
          </section>
        )}

        {activeTab === 'risks' && (
          <section id="risks" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Analyse des Risques" icon={Bug} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {risks.map((risk, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-red-400">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{risk.name}</h3>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Gravité:</span> {risk.severity}
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Probabilité:</span> {risk.probability}
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Criticité (GxP):</span> {risk.criticality}
                  </p>
                  <p className="text-gray-600 text-base mt-2">
                    <span className="font-medium">Plan de prévention:</span> {risk.preventionPlan}
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-medium">Plan de réparabilité:</span> {risk.reparabilityPlan}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-8 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Tableau de bord de performance. Toutes les données sont simulées.</p>
      </footer>
    </div>
  );
};

export default App;

