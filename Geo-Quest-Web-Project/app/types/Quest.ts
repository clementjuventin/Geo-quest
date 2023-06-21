import { Location } from './Location';

export type Quest = {
    id: number;
    creatorId: number;
    name: string;
    description: string;
    locations: Location[];
    active: boolean;
    code: string;
    endDate?: string;
    img?: string;
}