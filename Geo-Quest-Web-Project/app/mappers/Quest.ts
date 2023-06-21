import { Quest } from "../types/Quest";

export function QuestMapperDTO(questDTO: any) {
    const quest: Quest = {
        id: questDTO.id,
        creatorId: questDTO.creatorId,
        name: questDTO.name,
        description: questDTO.description,
        locations: [],
        active: questDTO.active,
        code: questDTO.code,
        endDate: questDTO.endDate,
        img: questDTO.img
    };
    return quest;
}