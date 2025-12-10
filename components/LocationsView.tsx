import React from 'react';
import { LocationItem } from '../types';
import { MapPin, Plus, Trash2, Eye, Volume2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface LocationsViewProps {
  locations: LocationItem[];
  setLocations: (locs: LocationItem[]) => void;
}

const LocationsView: React.FC<LocationsViewProps> = ({ locations, setLocations }) => {
  const addLocation = () => {
    const newLoc: LocationItem = {
      id: uuidv4(),
      name: 'New Location',
      description: '',
      sights: '',
      sounds: ''
    };
    setLocations([...locations, newLoc]);
  };

  const updateLocation = (id: string, field: keyof LocationItem, value: string) => {
    setLocations(locations.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteLocation = (id: string) => {
    if(confirm('Delete this location?')) {
        setLocations(locations.filter(l => l.id !== id));
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-[#0f172a] text-white">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">Locations & Settings</h2>
          <p className="text-slate-400 text-sm">Build the world your story inhabits.</p>
        </div>
        <button 
          onClick={addLocation}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(loc => (
          <div key={loc.id} className="bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:border-slate-500 transition-all group">
            <div className="bg-[#2a3855] p-4 flex justify-between items-center border-b border-slate-700">
               <div className="flex items-center gap-3">
                   <MapPin size={18} className="text-blue-400" />
                   <input 
                      type="text" 
                      value={loc.name}
                      onChange={(e) => updateLocation(loc.id, 'name', e.target.value)}
                      className="bg-transparent font-bold text-white focus:outline-none focus:border-b border-blue-500"
                      placeholder="Location Name"
                   />
               </div>
               <button onClick={() => deleteLocation(loc.id)} className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
               </button>
            </div>
            
            <div className="p-6 space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label>
                   <textarea 
                      value={loc.description}
                      onChange={(e) => updateLocation(loc.id, 'description', e.target.value)}
                      className="w-full bg-[#0f172a] rounded p-3 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none resize-none h-24"
                      placeholder="General atmosphere and layout..."
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Eye size={12} /> Sights</label>
                        <input 
                           type="text"
                           value={loc.sights}
                           onChange={(e) => updateLocation(loc.id, 'sights', e.target.value)}
                           className="w-full bg-[#0f172a] rounded p-2 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none"
                           placeholder="Key visual details"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Volume2 size={12} /> Sounds</label>
                        <input 
                           type="text"
                           value={loc.sounds}
                           onChange={(e) => updateLocation(loc.id, 'sounds', e.target.value)}
                           className="w-full bg-[#0f172a] rounded p-2 text-sm text-slate-300 border border-slate-700 focus:border-blue-500 outline-none"
                           placeholder="Ambient noise, acoustics"
                        />
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsView;