import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Goal, Users, TrendingUp, Heart, ShieldCheck, Clock, BookOpen, UserMinus, Bug, Package, DollarSign, User, Gauge } from 'lucide-react';

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

const BlankDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données vides pour tous les graphiques
  const emptyData = [];

  // Données vides pour les graphiques circulaires
  const emptyPieData = [];

  // Risques vides
  const emptyRisks = [];

  const Tabs = [
    { id: 'overview', name: 'Aperçu', icon: Goal },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp },
    { id: 'hr', name: 'RH', icon: Users },
    { id: 'operational', name: 'Opérationnel', icon: ShieldCheck },
    { id: 'risks', name: 'Risques', icon: Bug },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 font-sans text-gray-900 p-4 sm:p-6 lg:p-8">
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
          Tableau de bord vierge
        </h1>
        <p className="text-center text-gray-600 mt-2 text-lg">Version vierge - Aucune donnée n'est affichée.</p>
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
                value="—"
                unit=""
                icon={DollarSign}
                color="text-green-700"
                description="En attente de données"
              />
              <Card
                title="Nombre de clients actifs"
                value="—"
                unit=""
                icon={Users}
                color="text-blue-700"
                description="En attente de données"
              />
              <Card
                title="Projets en cours"
                value="—"
                unit=""
                icon={Package}
                color="text-purple-700"
                description="En attente de données"
              />
              <Card
                title="Dépendance clients majeurs"
                value="—"
                unit=""
                icon={Heart}
                color="text-orange-700"
                description="En attente de données"
              />
              <Card
                title="Marge Brute"
                value="—"
                unit=""
                icon={TrendingUp}
                color="text-green-600"
                description="En attente de données"
              />
              <Card
                title="NPS"
                value="—"
                unit=""
                icon={Gauge}
                color="text-blue-600"
                description="En attente de données"
              />
              <Card
                title="Budget Formation"
                value="—"
                unit=""
                icon={BookOpen}
                color="text-purple-600"
                description="En attente de données"
              />
              <Card
                title="Taux de Turn-over"
                value="—"
                unit=""
                icon={UserMinus}
                color="text-red-600"
                description="En attente de données"
              />
              <Card
                title="Temps Moyen de Livraison"
                value="—"
                unit=""
                icon={Clock}
                color="text-yellow-600"
                description="En attente de données"
              />
              <Card
                title="Incidents Cybersécurité"
                value="—"
                unit=""
                icon={Bug}
                color="text-orange-600"
                description="En attente de données"
              />
            </div>

            <h3 className="text-2xl font-bold text-gray-700 mt-10 mb-4">Écarts par rapport aux objectifs</h3>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <p className="text-lg text-gray-500 text-center italic">Aucune donnée disponible pour l'instant</p>
            </div>
          </section>
        )}

        {activeTab === 'marketing' && (
          <section id="marketing" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Métriques Marketing" icon={TrendingUp} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Évolution de la Marge Brute</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Évolution du NPS</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'hr' && (
          <section id="hr" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Métriques RH" icon={Users} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Évolution du Budget Formation</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#ffc658" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Répartition du Budget Formation par Service</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={emptyPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {emptyPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Évolution du Turn-over</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Répartition du Turn-over par Service</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'operational' && (
          <section id="operational" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Métriques Opérationnelles" icon={ShieldCheck} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Temps de Livraison des Projets</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Incidents de Cybersécurité</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="incidents" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-4">Projets en Retard</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emptyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="delayed" stroke="#ff4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-center text-gray-500 mt-4">Aucune donnée disponible</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'risks' && (
          <section id="risks" className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <SectionTitle title="Analyse des Risques" icon={Bug} />
            
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-700 mb-6 text-center">Matrice des Risques</h3>
              <div className="text-center text-gray-500">
                <p className="text-lg mb-4">Aucun risque identifié pour le moment</p>
                <p className="text-sm">La matrice des risques apparaîtra ici une fois les données saisies</p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-700 mb-4">Liste des Risques</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-center text-gray-500 italic">Aucun risque enregistré</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default BlankDashboard; 