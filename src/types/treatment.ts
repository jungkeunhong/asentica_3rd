export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface KeyArea {
  area: string;
  image: string;
}

export interface TreatmentProps {
  onBackToMain: () => void;
}
