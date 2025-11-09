
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export const allTeamMembers = [
    "ADAILTON SANTOS DE OLIVEIRA - GCM 1ª CL",
    "ADÃO APARECIDO DE MORAES - GCM CL ESP",
    "ADAUTO RODRIGUES DA SILVA - GCM CL ESP",
    "ADRIANA VALERIA DE MATTOS - GCM CL ESP",
    "ANDERSON MARCHESI ROCHA - GCM 2ª CL",
    "ANDREIA DE OLIVEIRA - GCM CL ESP",
    "ANTONIO ADALBERTO DE SOUSA - GCM 1ª CL",
    "ANTONIO RIBEIRO DA SILVA NETO - GCM CL ESP",
    "CÁSSIA DE MORAES - GCM CL ESP",
    "CELIA MARIA DE JESUS - GCM CL ESP",
    "CREUSA APARECIDA VITO - GCM CL ESP",
    "DALMO EDMILSON TOMAZELA - GCM CL ESP",
    "DANIEL DE FREITAS - GCM CL ESP",
    "DIEGO GENEZELLI - GCM 1ª CL",
    "EDSON DA CONSTA MANÇO - GCM 1ª CL",
    "ELIAS COSME DOS SANTOS - GCM 1ª CL",
    "FABIANO JOÃO SANTIAGO - GCM CL ESP",
    "FABIO GUILHERME ANICETO - GCM CL ESP",
    "FRANCIMEIRE LEAL MOREIRA - GCM CL ESP",
    "FRANCISCO VILSON PINTO - GCM 1ª CL",
    "IRINEU RIBEIRO - GCM CMT CL ESP",
    "JOSÉ ARMANDO PASCHUAL JUNIOR - GCM 1ª CL",
    "LEONARDO MAXIMILIANO ANSELMO DA SILVA - GCM 1ª CL",
    "LOURIVAL COSTA DA SILVA - GCM 1ª CL",
    "LUCAS LOUREIRO MARTINS - GCM CL ESP",
    "LUIZ CARLOS GREGO - GCM CL ESP",
    "MARCELO BAPTISTA DE SOUSA - GCM 1ª CL",
    "MARCELO FARIAS - GCM 2ª CL",
    "MARCOS AUGUSTO FERREIRA - GCM CL ESP",
    "MARIA MARLI PEREIRA - GCM CL ESP",
    "MARINALDO LUIS PHILOMENO - GCM CL ESP",
    "MORGANA APARECIDA MODOLO - GCM CL ESP",
    "SELMA ANICE DE OLIVEIRA - GCM CL ESP",
    "SILVIO RENATO BUENO DE OLIVEIRA - GCM 1ª CL",
    "TANIA FERREIRA DE FREITAS - GCM CL ESP",
    "VALDIR JOSÉ DA SILVA - GCM CL ESP",
    "VITOR MOREIRA DE SOUZA - GCM 1ª CL",
];

export const roles = ['Encarregado', 'Motorista', 'Auxiliar'];


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
  acceptsElectronicNotification?: 'Sim' | 'Não';
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

export type Vehicle = {
    id: string;
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | 'Extraviado' | 'Subtraído' | '';
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
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | 'Extraviado' | 'Subtraído' | '';
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

export type WeaponItem = {
    id: string;
    condition: 'Apreendido' | 'Envolvido' | 'Localizado' | 'Outros' | 'Extraviado' | 'Subtraído' | '';
    type: 'Pistola' | 'Revólver' | 'Fuzil' | 'Carabina' | 'Garrucha' | 'Espingarda' | 'Rifle' | 'Metralhadora' | 'Submetralhadora' | '';
    brand?: string;
    model?: string;
    serialNumber?: string;
    calibre?: string;
    ammoIntact?: number;
    ammoSpent?: number;
}


export type ItemsData = {
    vehicles: Vehicle[];
    objects: ObjectItem[];
    narcotics: NarcoticItem[];
    weapons: WeaponItem[];
}


export interface OccurrenceFormData {
  id: string;
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
  solutionType?: 'register' | 'police_station';
  solutionPoliceReport?: string;
}

interface OccurrenceFormContextType {
  formData: OccurrenceFormData | null;
  updateField: (newData: Partial<OccurrenceFormData>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (vehicleId: string, updatedData: Partial<Vehicle>) => void;
  removeVehicle: (vehicleId: string) => void;
  addObject: (object: Omit<ObjectItem, 'id'>) => void;
  updateObject: (objectId: string, updatedData: Partial<ObjectItem>) => void;
  removeObject: (objectId: string) => void;
  addNarcotic: (narcotic: Omit<NarcoticItem, 'id'>) => void;
  updateNarcotic: (narcoticId: string, updatedData: Partial<NarcoticItem>) => void;
  removeNarcotic: (narcoticId: string) => void;
  addWeapon: (weapon: Omit<WeaponItem, 'id'>) => void;
  updateWeapon: (weaponId: string, updatedData: Partial<WeaponItem>) => void;
  removeWeapon: (weaponId: string) => void;
  addTeamMember: (name: string) => void;
  removeTeamMember: (name: string) => void;
  updateTeamMember: (name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => void;
  addInvolved: (involved: InvolvedPerson | InvolvedCompany) => void;
  updateInvolved: (involvedId: string, updatedData: Partial<InvolvedPerson | InvolvedCompany>) => void;
  removeInvolved: (involvedId: string) => void;
  resetForm: () => void;
}

const OccurrenceFormContext = createContext<OccurrenceFormContextType | undefined>(undefined);

const generateNewId = () => {
    const year = new Date().getFullYear();
    const sequential = Date.now().toString().slice(-5);
    return `BO${year}${sequential}`;
}

const getInitialFormData = (): OccurrenceFormData => ({
  id: generateNewId(),
  team: [],
  involved: [],
  items: {
    vehicles: [],
    objects: [],
    narcotics: [],
    weapons: [],
  },
  requestOrigin: 'deparou',
  authorship: 'desconhecida',
  isFlagrant: false,
  isInfraction: false,
  isDomesticViolence: false,
  solutionType: 'register',
});

const LOCAL_STORAGE_KEY = 'occurrenceFormData';

export const OccurrenceFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<OccurrenceFormData | null>(null);

  useEffect(() => {
    let initialData: OccurrenceFormData;
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        
        if (!parsedData.id) {
            parsedData.id = generateNewId();
        }

        if (!Array.isArray(parsedData.involved)) {
          parsedData.involved = [];
        }
        if (typeof parsedData.items !== 'object' || parsedData.items === null) {
          parsedData.items = getInitialFormData().items;
        } else {
            parsedData.items = {
                ...getInitialFormData().items,
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
        if (!Array.isArray(parsedData.items.weapons)) {
            parsedData.items.weapons = [];
        }
        initialData = parsedData;
      } else {
        initialData = getInitialFormData();
      }
    } catch (error) {
      console.error("Failed to load form data from localStorage", error);
      initialData = getInitialFormData();
    }
    setFormData(initialData);
  }, []);

  useEffect(() => {
    if (formData) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error("Failed to save form data to localStorage", error);
      }
    }
  }, [formData]);

  const updateField = useCallback((newData: Partial<OccurrenceFormData>) => {
    setFormData(prev => (prev ? { ...prev, ...newData } : null));
  }, []);
  
  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id'>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                vehicles: [...prev.items.vehicles, { ...vehicle, id: new Date().toISOString() }],
            }
        };
    });
  }, []);

  const updateVehicle = useCallback((vehicleId: string, updatedData: Partial<Vehicle>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                vehicles: prev.items.vehicles.map(v => v.id === vehicleId ? { ...v, ...updatedData } : v),
            }
        };
    });
  }, []);

  const removeVehicle = useCallback((vehicleId: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                vehicles: prev.items.vehicles.filter(v => v.id !== vehicleId),
            }
        };
    });
  }, []);
  
  const addObject = useCallback((object: Omit<ObjectItem, 'id'>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                objects: [...prev.items.objects, { ...object, id: new Date().toISOString() }],
            }
        };
    });
  }, []);

  const updateObject = useCallback((objectId: string, updatedData: Partial<ObjectItem>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                objects: prev.items.objects.map(o => o.id === objectId ? { ...o, ...updatedData } : o),
            }
        };
    });
  }, []);

  const removeObject = useCallback((objectId: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                objects: prev.items.objects.filter(o => o.id !== objectId),
            }
        };
    });
  }, []);

  const addNarcotic = useCallback((narcotic: Omit<NarcoticItem, 'id'>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                narcotics: [...prev.items.narcotics, { ...narcotic, id: new Date().toISOString() }],
            }
        };
    });
  }, []);

  const updateNarcotic = useCallback((narcoticId: string, updatedData: Partial<NarcoticItem>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                narcotics: prev.items.narcotics.map(n => n.id === narcoticId ? { ...n, ...updatedData } : n),
            }
        };
    });
  }, []);

  const removeNarcotic = useCallback((narcoticId: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                narcotics: prev.items.narcotics.filter(n => n.id !== narcoticId),
            }
        };
    });
  }, []);
  
  const addWeapon = useCallback((weapon: Omit<WeaponItem, 'id'>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                weapons: [...prev.items.weapons, { ...weapon, id: new Date().toISOString() }],
            }
        };
    });
  }, []);

  const updateWeapon = useCallback((weaponId: string, updatedData: Partial<WeaponItem>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                weapons: prev.items.weapons.map(w => w.id === weaponId ? { ...w, ...updatedData } : w),
            }
        };
    });
  }, []);

  const removeWeapon = useCallback((weaponId: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            items: {
                ...prev.items,
                weapons: prev.items.weapons.filter(w => w.id !== weaponId),
            }
        };
    });
  }, []);


  const addTeamMember = useCallback((name: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            team: [...prev.team, { name, bodyCam: false, role: '' }]
        };
    });
  }, []);

  const removeTeamMember = useCallback((name: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            team: prev.team.filter(member => member.name !== name)
        };
    });
  }, []);

  const updateTeamMember = useCallback((name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            team: prev.team.map(member =>
                member.name === name ? { ...member, [field]: value } : member
            )
        };
    });
  }, []);

  const addInvolved = useCallback((involved: InvolvedPerson | InvolvedCompany) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            involved: [...prev.involved, involved]
        };
    });
  }, []);

  const updateInvolved = useCallback((involvedId: string, updatedData: Partial<InvolvedPerson | InvolvedCompany>) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            involved: prev.involved.map(i => i.id === involvedId ? { ...i, ...updatedData } : i)
        };
    });
  }, []);

  const removeInvolved = useCallback((involvedId: string) => {
    setFormData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            involved: prev.involved.filter(i => i.id !== involvedId)
        };
    });
  }, []);

  const resetForm = useCallback(() => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.location.reload();
    } catch (error) {
      console.error("Failed to clear form data from localStorage", error);
    }
  }, []);


  const contextValue = {
    formData,
    updateField,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addObject,
    updateObject,
    removeObject,
    addNarcotic,
    updateNarcotic,
    removeNarcotic,
    addWeapon,
    updateWeapon,
    removeWeapon,
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
  if (context.formData === null) {
      // You can return a loading state or default data here
      return { ...context, formData: { id: 'Loading...' } as OccurrenceFormData };
  }
  return context;
};

    

    

