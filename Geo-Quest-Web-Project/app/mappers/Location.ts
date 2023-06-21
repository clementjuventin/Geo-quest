import { Location } from "../types/Location";

export function LocationMapperDTO(locationDTO: any) {
    const location: Location = {
        key: locationDTO.id,
        xCoordinate: locationDTO.latitude,
        yCoordinate: locationDTO.longitude,
        title: locationDTO.name,
        description: locationDTO.description,
        img: locationDTO.img,
        code: locationDTO.code,
    };
    return location;
}