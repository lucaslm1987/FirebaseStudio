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
    vehicles?: Vehicle[];
    objects?: ObjectItem[];
    narcotics?: NarcoticItem[];
    weapons?: WeaponItem[];
}


export interface FormData {
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
  locationSubtype?: string;
  latitude?: string;
  longitude?: string;
  team?: TeamMember[];
  vehicle?: string;
  nature?: string;
  involved?: Array<InvolvedPerson | InvolvedCompany>;
  items?: ItemsData;
  narrative?: string;
  solutionType?: 'register' | 'police_station';
  solutionPoliceReport?: string;
}

const generateNewId = () => {
    const year = new Date().getFullYear();
    const sequential = Date.now().toString().slice(-5);
    return `BO${year}${sequential}`;
}

export const defaultFormData: FormData = {
  id: generateNewId(),
  items: {
    vehicles: [],
    objects: [],
    narcotics: [],
    weapons: [],
  },
  involved: [],
  team: [],
  requestOrigin: 'deparou',
  authorship: 'desconhecida',
  isFlagrant: false,
  isInfraction: false,
  isDomesticViolence: false,
  solutionType: 'register',
  locationSubtype: '',
  narrative: '',
};
