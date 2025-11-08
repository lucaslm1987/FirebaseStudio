
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type TeamMember = {
    name: string;
    bodyCam: boolean;
    role: string;
};

export type InvolvedPerson = {
  id: string;
  type: 'person';
  condition: 'Adolescente' | 'Autor' | 'Capturado' | 'Condutor' | 'Declarante' | 'Investigado' | 'Parte' | 'Representante' | 'Testemunha' | 'Vítima' | '';
  name: string;
  socialName?: string;
  rg?: string;
  cpf?: string;
  fatherName?: string;
  motherName?: string;
  birthDate?: string;
  color?: 'Branca' | 'Preta' | 'Parda' | 'Amarela' | 'Indígena';
  gender?: 'Masculino' | 'Feminino';
  profession?: string;
  education?: 'Analfabeto' | 'Fundamental Incompleto' | 'Fundamental Completo' | 'Médio Incompleto' | 'Médio Completo' | 'Superior Incompleto' | 'Superior Completo' | 'Pós-graduação';
  hasChildren?: 'Sim' | 'Não';
  childrenCount?: number;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  phone?: string;
  email?: string;
  isConducted?: boolean;
  isArrested?: boolean;
  useHandcuffs?: boolean;
  handcuffReason?: 'Receio de fuga' | 'Perigo à integridade física de terceiros' | 'Resistência';
  version?: string;
};

export type InvolvedCompany = {
    id: string;
    type: 'company';
    condition: 'Autor' | 'Investigado' | 'Vítima' | '';
    corporateName: string;
    tradeName?: string;
    cnpj?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    complement?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    representative?: string;
};

export type ItemEntry = {
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | '';
    description: string;
};

export type Vehicle = {
    id: string;
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | '';
    type: 'automóvel' | 'bicicleta' | 'bonde' | 'caminhão' | 'caminhão trator' | 'caminhonete' | 'charrete' | 'ciclomotor' | 'microônibus' | 'motocicleta' | 'motoneta' | 'ônibus' | 'quadriciclo' | 'reboque ou semi-reboque' | 'triciclo' | '';
    plate?: string;
    brand?: string;
    model?: string;
    yearManufacture?: string;
    yearModel?: string;
    color?: string;
    chassis?: string;
};

export type ObjectItem = {
    id: string;
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | '';
    brand?: string;
    model?: string;
    color?: string;
    quantity?: number;
    unit?: 'unidade' | 'metro' | 'litro' | 'KG' | 'grama' | '';
    notes?: string;
};

export type NarcoticItem = {
    id: string;
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | '';
    type: string;
    quantity: number;
    unit: 'grama' | 'KG' | 'litro' | 'ml' | 'unidade' | '';
    packaging: 'Pedra' | 'Porção' | 'Tijolo' | 'Eppendorf' | '';
};


export type ItemsData = {
    vehicles: Vehicle[];
    objects: ObjectItem[];
    narcotics: NarcoticItem[];
    weapons: ItemEntry;
}


export interface OccurrenceFormData {
  factDate?: string;
  factTime?: string;
  communicationDate?: string;
  communicationTime?: string;
  requestOrigin?: 'deparou' | 'diretamente' | 'radio' | 'outros';
  authorship?: 'conhecida' | 'desconhecida';
  isFlagrant?: boolean;
  isInfraction?: boolean;
  isDomesticViolence?: boolean;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  city?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
  team: TeamMember[];
  vehicle?: string;
  nature?: string;
  involved: Array<InvolvedPerson | InvolvedCompany>;
  items: ItemsData;
  narrative?: string;
}

interface OccurrenceFormContextType {
  formData: OccurrenceFormData;
  updateField: (newData: Partial<OccurrenceFormData>) => void;
  updateItemEntry: (field: 'weapons', value: Partial<ItemEntry>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicleId: string, updatedData: Partial<Vehicle>) => void;
  removeVehicle: (vehicleId: string) => void;
  addObject: (object: Omit<ObjectItem, 'id'>) => void;
  updateObject: (objectId: string, updatedData: Partial<ObjectItem>) => void;
  removeObject: (objectId: string) => void;
  addNarcotic: (narcotic: Omit<NarcoticItem, 'id'>) => void;
  updateNarcotic: (narcoticId: string, updatedData: Partial<NarcoticItem>) => void;
  removeNarcotic: (narcoticId: string) => void;
  addTeamMember: (name: string) => void;
  removeTeamMember: (name: string) => void;
  updateTeamMember: (name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => void;
  addInvolved: (involved: InvolvedPerson | InvolvedCompany) => void;
  updateInvolved: (involvedId: string, updatedData: Partial<InvolvedPerson | InvolvedCompany>) => void;
  removeInvolved: (involvedId: string) => void;
  resetForm: () => void;
}

const OccurrenceFormContext = createContext<OccurrenceFormContextType | undefined>(undefined);

const initialFormData: OccurrenceFormData = {
  team: [],
  involved: [],
  items: {
    vehicles: [],
    objects: [],
    narcotics: [],
    weapons: { condition: '', description: '' },
  },
  requestOrigin: 'deparou',
  authorship: 'desconhecida',
  isFlagrant: false,
  isInfraction: false,
  isDomesticViolence: false,
};

const LOCAL_STORAGE_KEY = 'occurrenceFormData';

export const OccurrenceFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<OccurrenceFormData>(initialFormData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Data migration and validation
        if (!Array.isArray(parsedData.involved)) {
          parsedData.involved = [];
        }
        if (typeof parsedData.items !== 'object' || parsedData.items === null) {
          parsedData.items = initialFormData.items;
        } else {
            parsedData.items = {
                ...initialFormData.items,
                ...parsedData.items,
            };
        }
        if (!Array.isArray(parsedData.items.vehicles)) {
            parsedData.items.vehicles = [];
        }
        if (!Array.isArray(parsedData.items.objects)) {
            parsedData.items.objects = [];
        }
        if (!Array.isArray(parsedData.items.narcotics)) {
            parsedData.items.narcotics = [];
        }
        if (typeof parsedData.items.weapons !== 'object' || parsedData.items.weapons === null) {
            parsedData.items.weapons = initialFormData.items.weapons;
        }
        setFormData(parsedData);
      }
    } catch (error) {
      console.error("Failed to load form data from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Failed to save form data to localStorage", error);
      }
    }
  }, [formData, isLoaded]);

  const updateField = useCallback((newData: Partial<OccurrenceFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);
  
  const updateItemEntry = useCallback((field: 'weapons', value: Partial<ItemEntry>) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        [field]: {
          ...(prev.items[field] || { condition: '', description: '' }),
          ...value,
        }
      }
    }));
  }, []);

  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id'>) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        vehicles: [...prev.items.vehicles, { ...vehicle, id: new Date().toISOString() }],
      }
    }));
  }, []);

  const updateVehicle = useCallback((vehicleId: string, updatedData: Partial<Vehicle>) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        vehicles: prev.items.vehicles.map(v => v.id === vehicleId ? { ...v, ...updatedData } : v),
      }
    }));
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        vehicles: prev.items.vehicles.filter(v => v.id !== vehicleId),
      }
    }));
  }, []);
  
  const addObject = useCallback((object: Omit<ObjectItem, 'id'>) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        objects: [...prev.items.objects, { ...object, id: new Date().toISOString() }],
      }
    }));
  }, []);

  const updateObject = useCallback((objectId: string, updatedData: Partial<ObjectItem>) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        objects: prev.items.objects.map(o => o.id === objectId ? { ...o, ...updatedData } : o),
      }
    }));
  }, []);

  const removeObject = useCallback((objectId: string) => {
    setFormData(prev => ({
      ...prev,
      items: {
        ...prev.items,
        objects: prev.items.objects.filter(o => o.id !== objectId),
      }
    }));
  }, []);

  const addNarcotic = useCallback((narcotic: Omit<NarcoticItem, 'id'>) => {
    setFormData(prev => ({
        ...prev,
        items: {
            ...prev.items,
            narcotics: [...prev.items.narcotics, { ...narcotic, id: new Date().toISOString() }],
        }
    }));
  }, []);

  const updateNarcotic = useCallback((narcoticId: string, updatedData: Partial<NarcoticItem>) => {
      setFormData(prev => ({
          ...prev,
          items: {
              ...prev.items,
              narcotics: prev.items.narcotics.map(n => n.id === narcoticId ? { ...n, ...updatedData } : n),
          }
      }));
  }, []);

  const removeNarcotic = useCallback((narcoticId: string) => {
      setFormData(prev => ({
          ...prev,
          items: {
              ...prev.items,
              narcotics: prev.items.narcotics.filter(n => n.id !== narcoticId),
          }
      }));
  }, []);


  const addTeamMember = useCallback((name: string) => {
    setFormData(prev => ({
        ...prev,
        team: [...prev.team, { name, bodyCam: false, role: '' }]
    }));
  }, []);

  const removeTeamMember = useCallback((name: string) => {
    setFormData(prev => ({
        ...prev,
        team: prev.team.filter(member => member.name !== name)
    }));
  }, []);

  const updateTeamMember = useCallback((name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => {
    setFormData(prev => ({
        ...prev,
        team: prev.team.map(member =>
            member.name === name ? { ...member, [field]: value } : member
        )
    }));
  }, []);

  const addInvolved = useCallback((involved: InvolvedPerson | InvolvedCompany) => {
    setFormData(prev => ({
      ...prev,
      involved: [...prev.involved, involved]
    }));
  }, []);

  const updateInvolved = useCallback((involvedId: string, updatedData: Partial<InvolvedPerson | InvolvedCompany>) => {
    setFormData(prev => ({
      ...prev,
      involved: prev.involved.map(i => i.id === involvedId ? { ...i, ...updatedData } : i)
    }));
  }, []);

  const removeInvolved = useCallback((involvedId: string) => {
    setFormData(prev => ({
      ...prev,
      involved: prev.involved.filter(i => i.id !== involvedId)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
     try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (error) {
        console.error("Failed to clear form data from localStorage", error);
      }
  }, []);


  const contextValue = {
    formData,
    updateField,
    updateItemEntry,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addObject,
    updateObject,
    removeObject,
    addNarcotic,
    updateNarcotic,
    removeNarcotic,
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
    addInvolved,
    updateInvolved,
    removeInvolved,
    resetForm,
  };

  return (
    <OccurrenceFormContext.Provider value={contextValue}>
      {children}
    </OccurrenceFormContext.Provider>
  );
};

export const useOccurrenceForm = () => {
  const context = useContext(OccurrenceFormContext);
  if (context === undefined) {
    throw new Error('useOccurrenceForm must be used within an OccurrenceFormProvider');
  }
  return context;
};

    