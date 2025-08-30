import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Filter, Users, TrendingUp, MapPin, GraduationCap } from 'lucide-react';

const Dashboard = () => {
  const [filters, setFilters] = useState({
    genero: 'Todos',
    universidad: 'Todas',
    nse: 'Todos',
    facultad: 'Todas'
  });

  // Leer datos del archivo usando window.fs
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const fileContent = await window.fs.readFile('Consumo_Alcohol.txt', { encoding: 'utf8' });
        const lines = fileContent.split('\n').filter(line => line.trim() && !line.startsWith('Género'));
        setRawData(lines);
        setLoading(false);
      } catch (error) {
        console.error('Error loading file:', error);
        // Fallback con datos de ejemplo si no se puede leer el archivo
        const fallbackData = `F	21	UNMSM	Administración	San Juan de Lurigancho	C	Semanal	RTD	Discoteca	Socializar	Sí	Piqueo
M	22	PUCP	Derecho	San Isidro	A	Ocasional	Vino	Casa	Celebrar	No	Comida
F	19	UTP	Comunicación	San Juan de Lurigancho	C	Mensual	RTD	Fiesta	Socializar	Sí	Piqueo
M	20	UPC	Ingeniería	Miraflores	B	Semanal	Cerveza	Bar	Socializar	Sí	Piqueo
M	23	UNMSM	Medicina	La Victoria	C	Semanal	Licor	Discoteca	Estrés	Sí	Ninguno
F	20	PUCP	Comunicación	Jesús María	A	Ocasional	RTD	Casa	Celebrar	No	Comida
M	21	UTP	Comunicación	San Juan de Lurigancho	C	Semanal	RTD	Fiesta	Socializar	Sí	Piqueo
F	24	USIL	Administración	La Molina	B	Mensual	Cerveza	Bar	Socializar	Sí	Piqueo
M	20	UPC	Administración	La Victoria	C	Semanal	RTD	Discoteca	Socializar	Sí	Piqueo
M	22	UNMSM	Ingeniería	San Juan de Lurigancho	C	Semanal	RTD	Discoteca	Socializar	Sí	Piqueo`.split('\n');
        setRawData(fallbackData);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const data = useMemo(() => {
    if (rawData.length === 0) return [];
    return rawData.map(row => {
      const cols = row.split('\t');
      return {
        genero: cols[0],
        edad: parseInt(cols[1]),
        universidad: cols[2],
        facultad: cols[3],
        distrito: cols[4],
        nse: cols[5],
        frecuencia: cols[6],
        bebida: cols[7],
        lugar: cols[8],
        motivacion: cols[9],
        borracheras: cols[10],
        piqueo: cols[11]
      };
    });
  }, [rawData]);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (filters.genero === 'Todos' || item.genero === filters.genero) &&
             (filters.universidad === 'Todas' || item.universidad === filters.universidad) &&
             (filters.nse === 'Todos' || item.nse === filters.nse) &&
             (filters.facultad === 'Todas' || item.facultad === filters.facultad);
    });
  }, [data, filters]);

  // Análisis de datos
  const insights = useMemo(() => {
    const totalResponses = filteredData.length;
    const femaleCount = filteredData.filter(d => d.genero === 'F').length;
    const maleCount = filteredData.filter(d => d.genero === 'M').length;
    const avgAge = filteredData.reduce((sum, d) => sum + d.edad, 0) / totalResponses;
    const weeklyDrinkers = filteredData.filter(d => d.frecuencia === 'Semanal').length;
    const drunkennessRate = filteredData.filter(d => d.borracheras === 'Sí').length;

    return {
      totalResponses,
      femalePercentage: ((femaleCount / totalResponses) * 100).toFixed(1),
      malePercentage: ((maleCount / totalResponses) * 100).toFixed(1),
      avgAge: avgAge.toFixed(1),
      weeklyDrinkersPercentage: ((weeklyDrinkers / totalResponses) * 100).toFixed(1),
      drunkennessPercentage: ((drunkennessRate / totalResponses) * 100).toFixed(1)
    };
  }, [filteredData]);

  // Preparar datos para gráficos
  const frecuenciaData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.frecuencia] = (counts[d.frecuencia] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value / filteredData.length) * 100).toFixed(1)
    }));
  }, [filteredData]);

  const bebidaData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.bebida] = (counts[d.bebida] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }, [filteredData]);

  const universidadData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.universidad] = (counts[d.universidad] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }, [filteredData]);

  const motivacionData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.motivacion] = (counts[d.motivacion] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }, [filteredData]);

  const lugarData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.lugar] = (counts[d.lugar] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: key,
      value: value
    }));
  }, [filteredData]);

  const nseData = useMemo(() => {
    const counts = {};
    filteredData.forEach(d => {
      counts[d.nse] = (counts[d.nse] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: `NSE ${key}`,
      value: value
    }));
  }, [filteredData]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const uniqueValues = useMemo(() => {
    return {
      universidades: [...new Set(data.map(d => d.universidad))],
      nses: [...new Set(data.map(d => d.nse))],
      facultades: [...new Set(data.map(d => d.facultad))]
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Dashboard de Consumo de Alcohol
          </h1>
          <p className="text-slate-300 text-lg">Análisis de Patrones de Consumo en Universitarios Peruanos</p>
        </div>

        {/* Filtros */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-purple-400" size={20} />
            <h3 className="text-xl font-semibold">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Género</label>
              <select 
                value={filters.genero} 
                onChange={(e) => setFilters({...filters, genero: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Todos">Todos</option>
                <option value="F">Femenino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Universidad</label>
              <select 
                value={filters.universidad} 
                onChange={(e) => setFilters({...filters, universidad: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Todas">Todas</option>
                {uniqueValues.universidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">NSE</label>
              <select 
                value={filters.nse} 
                onChange={(e) => setFilters({...filters, nse: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Todos">Todos</option>
                {uniqueValues.nses.map(n => (
                  <option key={n} value={n}>NSE {n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Facultad</label>
              <select 
                value={filters.facultad} 
                onChange={(e) => setFilters({...filters, facultad: e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="Todas">Todas</option>
                {uniqueValues.facultades.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-400" size={20} />
              <span className="text-blue-300 text-sm">Total</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.totalResponses}</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-4 border border-pink-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-300 text-sm">Mujeres</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.femalePercentage}%</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-4 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cyan-300 text-sm">Hombres</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.malePercentage}%</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-300 text-sm">Edad Prom.</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.avgAge}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-orange-400" size={20} />
              <span className="text-orange-300 text-sm">Semanal</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.weeklyDrinkersPercentage}%</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-4 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-300 text-sm">Borracheras</span>
            </div>
            <p className="text-2xl font-bold text-white">{insights.drunkennessPercentage}%</p>
          </div>
        </div>

        {/* Gráficos principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Frecuencia de Consumo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Frecuencia de Consumo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={frecuenciaData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percentage}) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {frecuenciaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tipo de Bebida */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Tipo de Bebida Preferida</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bebidaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Segunda fila de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Universidad */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Distribución por Universidad</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={universidadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* NSE */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Nivel Socioeconómico</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tercera fila de gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Motivación */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Motivación para Beber</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={motivacionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Lugar de Consumo */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-300">Lugar de Consumo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lugarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }} 
                />
                <Bar dataKey="value" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights clave */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Insights Principales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-cyan-300 mb-2">Patrón de Género</h4>
              <p className="text-slate-300 text-sm">
                {insights.femalePercentage}% mujeres vs {insights.malePercentage}% hombres en la muestra
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-green-300 mb-2">Consumo Frecuente</h4>
              <p className="text-slate-300 text-sm">
                {insights.weeklyDrinkersPercentage}% consume alcohol semanalmente
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-red-300 mb-2">Comportamiento de Riesgo</h4>
              <p className="text-slate-300 text-sm">
                {insights.drunkennessPercentage}% reporta episodios de borrachera
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-300 mb-2">Edad Promedio</h4>
              <p className="text-slate-300 text-sm">
                {insights.avgAge} años es la edad promedio de los participantes
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-300 mb-2">Socialización</h4>
              <p className="text-slate-300 text-sm">
                La mayoría bebe por motivos sociales y de celebración
              </p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-300 mb-2">Contexto</h4>
              <p className="text-slate-300 text-sm">
                Predominan fiestas, discotecas y bares como lugares de consumo
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de datos filtrados */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <h3 className="text-xl font-semibold mb-4 text-purple-300">Datos Filtrados ({filteredData.length} registros)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left p-2 text-slate-300">Género</th>
                  <th className="text-left p-2 text-slate-300">Edad</th>
                  <th className="text-left p-2 text-slate-300">Universidad</th>
                  <th className="text-left p-2 text-slate-300">Facultad</th>
                  <th className="text-left p-2 text-slate-300">NSE</th>
                  <th className="text-left p-2 text-slate-300">Frecuencia</th>
                  <th className="text-left p-2 text-slate-300">Bebida</th>
                  <th className="text-left p-2 text-slate-300">Lugar</th>
                  <th className="text-left p-2 text-slate-300">Motivación</th>
                  <th className="text-left p-2 text-slate-300">Borracheras</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map((row, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-2 text-slate-200">{row.genero}</td>
                    <td className="p-2 text-slate-200">{row.edad}</td>
                    <td className="p-2 text-slate-200">{row.universidad}</td>
                    <td className="p-2 text-slate-200">{row.facultad}</td>
                    <td className="p-2 text-slate-200">{row.nse}</td>
                    <td className="p-2 text-slate-200">{row.frecuencia}</td>
                    <td className="p-2 text-slate-200">{row.bebida}</td>
                    <td className="p-2 text-slate-200">{row.lugar}</td>
                    <td className="p-2 text-slate-200">{row.motivacion}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row.borracheras === 'Sí' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                      }`}>
                        {row.borracheras}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredData.length > 10 && (
              <p className="text-slate-400 text-sm mt-2">
                Mostrando los primeros 10 de {filteredData.length} registros
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;