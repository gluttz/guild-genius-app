import { createServerClient } from "@/lib/supabase/clients/server-client";

export const insertGuild = async (guild: GuildInsert) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .insert(guild)
            .select()
            .limit(1)
            .single();

        return data;
    } catch {
        return null;
    }
};

export const updateGuild = async (guild: GuildUpdate, guildId: number) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .update(guild)
            .eq("id", guildId)
            .select()
            .single();

        return data;
    } catch {
        return null;
    }
};

export const getGuildById = async (id: number) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .select("*")
            .eq("id", id)
            .limit(1)
            .single();

        return data;
    } catch {
        return null;
    }
};

export const getGuildsByGuildIdArray = async (idArray: (number | null)[]) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .select("*")
            .in("id", idArray);

        return data;
    } catch {
        return null;
    }
};

export const getGuildByDiscordServerId = async (id: string) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .select("*")
            .eq("discord_server_id", id)
            .limit(1)
            .single();

        return data;
    } catch {
        return null;
    }
};

export const getGuildsByDiscordServerIdArray = async (idArray: string[]) => {
    try {
        const supabase = createServerClient();

        const { data } = await supabase
            .from("guilds")
            .select("*")
            .in("discord_server_id", idArray);

        return data;
    } catch {
        return null;
    }
};
