import { Database as DB } from "@/lib/database.types";

type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
type Profile = DB["public"]["Tables"]["profiles"]["Row"];

declare global {
    type Database = DB;

    type Profile = Database["public"]["Tables"]["profiles"]["Row"];

    type Player = Database["public"]["Tables"]["players"]["Row"];
    type PlayerInsert = Database["public"]["Tables"]["players"]["Insert"];
    type PlayerUpdate = Database["public"]["Tables"]["players"]["Update"];

    type Character = Database["public"]["Tables"]["characters"]["Row"];
    type CharacterUpdate = Database["public"]["Tables"]["characters"]["Update"];

    type Guild = Database["public"]["Tables"]["guilds"]["Row"];
    type GuildInsert = Database["public"]["Tables"]["guilds"]["Insert"];
    type GuildUpdate = Database["public"]["Tables"]["guilds"]["Update"];

    type CompleteUser = Profile & {
        players: Player[];
        characters: Character[];
        guilds: Guild[];
        guildIds: number[];
    };

    type PartialDiscordServer = {
        id: string;
        name: string;
        icon: string;
        owner: boolean;
        permissions: string;
        features: string[];
    };
}
