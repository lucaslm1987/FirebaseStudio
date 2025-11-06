
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type TeamMember = {
    name: string;
    bodyCam: boolean;
    role: string;
};

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
  involved?: string;
  items?: string;
  narrative?: string;
}

interface OccurrenceFormContextType {
  formData: OccurrenceFormData;
  updateField: (newData: Partial<OccurrenceFormData>) => void;
  addTeamMember: (name: string) => void;
  removeTeamMember: (name: string) => void;
  updateTeamMember: (name: string, field: keyof Omit<TeamMember, 'name'>, value: any) => void;
  resetForm: () => void;
}

const OccurrenceFormContext = createContext<OccurrenceFormContextType | undefined>(undefined);

const initialFormData: OccurrenceFormData = {
  team: [],
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
        setFormData(JSON.parse(savedData));
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
    addTeamMember,
    removeTeamMember,
    updateTeamMember,
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
