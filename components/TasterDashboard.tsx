import React, { useState } from 'react';
import { User, TastingRecord, WineType, Clarity, Body, Aroma } from '../types';
import { WINE_TYPES_OPTIONS, CLARITY_OPTIONS, BODY_OPTIONS, AROMA_OPTIONS } from '../constants';

interface TasterDashboardProps {
  user: User;
  onLogout: () => void;
  onAddRecord: (record: TastingRecord) => void;
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${
                        star <= rating ? 'text-wine-gold' : 'text-stone-300 hover:text-wine-gold'
                    }`}
                    aria-label={`Calificar ${star} de 5 estrellas`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const Slider: React.FC<{ label: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">{label}: <span className="font-bold text-wine-burgundy">{value}</span></label>
        <div className="flex items-center gap-4">
            <span className="text-xs text-stone-500">Bajo</span>
            <input type="range" min="1" max="5" value={value} onChange={onChange} className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-wine-burgundy" />
            <span className="text-xs text-stone-500">Alto</span>
        </div>
    </div>
);


const TasterDashboard: React.FC<TasterDashboardProps> = ({ user, onLogout, onAddRecord }) => {
  const initialFormState = {
    wineName: '',
    winery: '',
    year: new Date().getFullYear(),
    wineType: WineType.RED,
    region: '',
    appearanceColor: '',
    appearanceClarity: Clarity.CLEAR,
    aromaIntensity: 3,
    aromaNotes: [] as Aroma[],
    flavorAcidity: 3,
    flavorTannins: 3,
    flavorBody: Body.MEDIUM,
    finish: 3,
    overallRating: 3,
    notes: '',
  };

  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumeric = ['year', 'aromaIntensity', 'flavorAcidity', 'flavorTannins'].includes(name);
    setFormState(prev => ({ ...prev, [name]: isNumeric ? parseInt(value) : value }));
  };
  
  const handleAromaNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const note = value as Aroma;
    setFormState(prev => {
        const currentNotes = prev.aromaNotes;
        if (checked) {
            return { ...prev, aromaNotes: [...currentNotes, note] };
        } else {
            return { ...prev, aromaNotes: currentNotes.filter(n => n !== note) };
        }
    });
  };

  const setRating = (name: keyof typeof initialFormState, rating: number) => {
    setFormState(prev => ({...prev, [name]: rating}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TastingRecord = {
      id: new Date().toISOString(),
      tasterName: user.name,
      date: new Date().toISOString(),
      ...formState,
    };
    onAddRecord(newRecord);
    setFormState(initialFormState);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };
  
  const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <fieldset className="border-t-2 border-wine-gold pt-4">
        <legend className="text-xl font-serif text-stone-800 font-semibold mb-4">{title}</legend>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </fieldset>
  );

  return (
    <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
            <h1 className="text-2xl font-serif text-wine-burgundy">Bienvenido, {user.name}</h1>
            <button onClick={onLogout} className="px-4 py-2 text-sm font-medium text-wine-burgundy border border-wine-burgundy rounded-md hover:bg-stone-50 transition">Cerrar sesión</button>
        </header>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-serif text-stone-800 mb-2 border-b-2 border-stone-200 pb-2">Registro de Cata</h2>
            <p className="text-stone-600 mb-8">Complete los detalles del vino que está catando.</p>
            
            {isSubmitted && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
                    <p className="font-bold">¡Éxito!</p>
                    <p>Su registro de cata ha sido guardado.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-10">
                <FormSection title="Información General">
                    <input type="text" name="wineName" placeholder="Nombre del Vino" value={formState.wineName} onChange={handleChange} required className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
                    <input type="text" name="winery" placeholder="Bodega" value={formState.winery} onChange={handleChange} required className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
                    <input type="number" name="year" placeholder="Año" value={formState.year} onChange={handleChange} required className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
                    <select name="wineType" value={formState.wineType} onChange={handleChange} className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy">
                        {WINE_TYPES_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                     <div className="md:col-span-2">
                        <input type="text" name="region" placeholder="Región" value={formState.region} onChange={handleChange} required className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
                    </div>
                </FormSection>

                <FormSection title="Apariencia (Visual)">
                    <input type="text" name="appearanceColor" placeholder="Color (ej. rojo rubí, amarillo pálido)" value={formState.appearanceColor} onChange={handleChange} required className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy" />
                    <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">Claridad</label>
                        <div className="flex gap-4">
                            {CLARITY_OPTIONS.map(opt => (
                                <label key={opt} className="flex items-center gap-2">
                                    <input type="radio" name="appearanceClarity" value={opt} checked={formState.appearanceClarity === opt} onChange={handleChange} className="focus:ring-wine-burgundy h-4 w-4 text-wine-burgundy border-stone-300" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Aroma (Olfativo)">
                    <div className="md:col-span-2">
                         <Slider label="Intensidad del Aroma" value={formState.aromaIntensity} onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Notas de Aroma</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {AROMA_OPTIONS.map(note => (
                                <label key={note} className="flex items-center gap-2 p-2 rounded-md hover:bg-stone-50">
                                    <input type="checkbox" value={note} checked={formState.aromaNotes.includes(note)} onChange={handleAromaNotesChange} className="focus:ring-wine-burgundy h-4 w-4 text-wine-burgundy border-stone-300 rounded" />
                                    {note}
                                </label>
                            ))}
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Sabor (Gustativo)">
                    <Slider label="Acidez" value={formState.flavorAcidity} onChange={e => setFormState(p => ({...p, flavorAcidity: +e.target.value}))}/>
                    <Slider label="Taninos" value={formState.flavorTannins} onChange={e => setFormState(p => ({...p, flavorTannins: +e.target.value}))}/>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Cuerpo</label>
                        <div className="flex gap-4">
                            {BODY_OPTIONS.map(opt => (
                                <label key={opt} className="flex items-center gap-2">
                                    <input type="radio" name="flavorBody" value={opt} checked={formState.flavorBody === opt} onChange={handleChange} className="focus:ring-wine-burgundy h-4 w-4 text-wine-burgundy border-stone-300" />
                                    {opt}
                                </label>
                            ))}
                        </div>
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Final</label>
                        <StarRating rating={formState.finish} setRating={(r) => setRating('finish', r)} />
                    </div>
                </FormSection>
                
                <FormSection title="Impresión General">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-stone-700 mb-2">Calificación General</label>
                        <StarRating rating={formState.overallRating} setRating={(r) => setRating('overallRating', r)} />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-stone-700 mb-2">Comentarios Abiertos</label>
                        <textarea id="notes" name="notes" value={formState.notes} onChange={handleChange} rows={4} className="w-full p-2 border border-stone-300 rounded-md shadow-sm focus:ring-wine-burgundy focus:border-wine-burgundy"></textarea>
                    </div>
                </FormSection>
                
                <div className="text-right pt-4 border-t">
                    <button type="submit" className="px-8 py-3 bg-wine-burgundy text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wine-burgundy transition-transform transform hover:scale-105">
                        Guardar Cata
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default TasterDashboard;