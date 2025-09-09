import React, { useState, useMemo } from 'react';
import { User, TastingRecord } from '../types';
import { WINE_TYPES_OPTIONS } from '../constants';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  records: TastingRecord[];
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className = '' }) => (
    <div className={`text-center ${className}`}>
        <span className="text-xs text-stone-500 uppercase font-semibold">{label}</span>
        <p className="text-sm text-stone-800 font-medium">{value}</p>
    </div>
);

const TastingDetailModal: React.FC<{ record: TastingRecord; onClose: () => void }> = ({ record, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-6 border-l-4 border-wine-burgundy w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold font-serif text-stone-800">{record.wineName} ({record.year})</h3>
                        <p className="text-sm text-stone-500">{record.winery} - {record.region}</p>
                    </div>
                    <button onClick={onClose} className="text-3xl text-stone-400 hover:text-stone-700">&times;</button>
                </div>
                 <div className="flex justify-between items-center mb-4">
                     <span className="px-3 py-1 text-xs font-semibold text-wine-burgundy bg-red-100 rounded-full">{record.wineType}</span>
                     <div className="flex items-baseline gap-1">
                         <span className="font-bold text-2xl text-wine-burgundy">{record.overallRating.toFixed(1)}</span>
                         <span className="text-sm text-stone-500">/ 5</span>
                     </div>
                 </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-2 my-4 py-4 border-t border-b border-stone-200">
                    <DetailItem label="Color" value={record.appearanceColor} />
                    <DetailItem label="Claridad" value={record.appearanceClarity} />
                    <DetailItem label="Cuerpo" value={record.flavorBody} />
                    <DetailItem label="Final" value={'★'.repeat(record.finish) + '☆'.repeat(5 - record.finish)} />
                    <DetailItem label="Intens. Aroma" value={`${record.aromaIntensity}/5`} />
                    <DetailItem label="Acidez" value={`${record.flavorAcidity}/5`} />
                    <DetailItem label="Taninos" value={`${record.flavorTannins}/5`} />
                    <DetailItem label="Aromas" value={record.aromaNotes.join(', ')} className="sm:col-span-1" />
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-stone-700 mb-2">Notas del Catador:</h4>
                    <p className="text-stone-700 bg-stone-50 p-3 rounded-md">{record.notes || "Sin comentarios adicionales."}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-stone-200 text-right text-xs text-stone-500">
                    <span>Catado por <strong>{record.tasterName}</strong> en {new Date(record.date).toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, records }) => {
    const [searchTaster, setSearchTaster] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [wineTypeFilter, setWineTypeFilter] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<TastingRecord | null>(null);

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const recordDate = new Date(record.date);
            
            const tasterMatch = !searchTaster || record.tasterName.toLowerCase().includes(searchTaster.toLowerCase());
            const wineTypeMatch = !wineTypeFilter || record.wineType === wineTypeFilter;
            
            const startDateMatch = !startDate || recordDate >= new Date(startDate + 'T00:00:00Z');
            // Add 1 day to end date to include the whole day
            const endDateObj = endDate ? new Date(endDate) : null;
            if (endDateObj) endDateObj.setDate(endDateObj.getDate() + 1);
            const endDateMatch = !endDateObj || recordDate < endDateObj;

            return tasterMatch && wineTypeMatch && startDateMatch && endDateMatch;
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [records, searchTaster, startDate, endDate, wineTypeFilter]);

    const handleExportCSV = () => {
        const headers = ['ID', 'Catador', 'Fecha', 'Vino', 'Bodega', 'Año', 'Tipo de Vino', 'Región', 'Color', 'Claridad', 'Intensidad Aroma', 'Notas de Aroma', 'Acidez', 'Taninos', 'Cuerpo', 'Final', 'Calificación General', 'Notas'];
        const rows = filteredRecords.map(r => [
            r.id,
            r.tasterName,
            new Date(r.date).toLocaleString(),
            r.wineName,
            r.winery,
            r.year,
            r.wineType,
            r.region,
            r.appearanceColor,
            r.appearanceClarity,
            r.aromaIntensity,
            `"${r.aromaNotes.join(', ')}"`, // Enclose in quotes to handle commas
            r.flavorAcidity,
            r.flavorTannins,
            r.flavorBody,
            r.finish,
            r.overallRating,
            `"${r.notes.replace(/"/g, '""')}"` // Enclose in quotes and escape existing quotes
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "export_catas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


  return (
    <div className="max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-serif text-wine-burgundy">Panel de Administrador</h1>
        <div className="flex items-center gap-4">
            <span className="text-stone-600">Bienvenido, {user.name}</span>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-wine-burgundy border border-wine-burgundy rounded-md hover:bg-stone-50 transition">Cerrar sesión</button>
        </div>
      </header>
      
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-stone-700">Buscar por Catador</label>
                <input 
                    type="text"
                    placeholder="Nombre del catador..."
                    value={searchTaster}
                    onChange={e => setSearchTaster(e.target.value)}
                    className="mt-1 w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">Fecha de Inicio</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">Fecha de Fin</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
            </div>
            <div>
                <label className="block text-sm font-medium text-stone-700">Tipo de Vino</label>
                <select value={wineTypeFilter} onChange={e => setWineTypeFilter(e.target.value)} className="mt-1 w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy">
                    <option value="">Todos</option>
                    {WINE_TYPES_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
            </div>
        </div>
         <div className="mt-4 pt-4 border-t border-stone-200 flex justify-end">
              <button onClick={handleExportCSV} className="px-4 py-2 bg-wine-burgundy text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-burgundy transition-transform transform hover:scale-105">
                  Exportar a CSV
              </button>
          </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
        <table className="w-full text-sm text-left text-stone-700">
            <thead className="text-xs text-stone-800 uppercase bg-stone-50 border-b-2 border-wine-burgundy">
                <tr>
                    <th scope="col" className="px-6 py-3">Catador</th>
                    <th scope="col" className="px-6 py-3">Vino</th>
                    <th scope="col" className="px-6 py-3">Tipo</th>
                    <th scope="col" className="px-6 py-3">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-center">Calificación</th>
                    <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {filteredRecords.length > 0 ? (
                    filteredRecords.map(record => (
                        <tr key={record.id} className="bg-white border-b hover:bg-stone-50 cursor-pointer" onClick={() => setSelectedRecord(record)}>
                            <td className="px-6 py-4 font-medium whitespace-nowrap">{record.tasterName}</td>
                            <td className="px-6 py-4">{record.wineName} ({record.year})</td>
                            <td className="px-6 py-4">{record.wineType}</td>
                            <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-center font-bold text-wine-burgundy">{record.overallRating.toFixed(1)} / 5</td>
                            <td className="px-6 py-4 text-center">
                                <button onClick={() => setSelectedRecord(record)} className="font-medium text-wine-burgundy hover:underline">Ver Detalles</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-500">
                            No se encontraron registros que coincidan con los filtros.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
      {selectedRecord && <TastingDetailModal record={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  );
};

export default AdminDashboard;
