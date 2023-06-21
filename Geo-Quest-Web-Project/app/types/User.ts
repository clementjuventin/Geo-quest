import {Quest} from "./Quest"
import {Claim} from "./Claim"

export type User = {
    id: number;
	username: string;
	password: string; // Hashed
	creationDate: number;
	// avatar: string; // URL to the avatar pic
	claims: Claim[];
	quests: Quest[];
    token?: string;
}