"use server";

import { getGuildById, updateGuild } from "@/data/guild";
import { insertPlayer } from "@/data/player";
import { getProfileByUserId } from "@/data/profile";
import { getDBServerByDiscordServerId } from "@/data/server";
import { createServerClient } from "@/lib/supabase/clients/server-client";
import { CreateGuildSchema, GuildConfigSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const updateGuildConfigAction = async (
    values: z.infer<typeof GuildConfigSchema>,
    guildId: number
) => {
    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const profile = await getProfileByUserId(user.id);

    if (!profile) {
        return { error: "Unauthorized" };
    }

    const validatedFields = GuildConfigSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { roles_that_may_join, roles_that_may_create_raids, guild_timezone } =
        validatedFields.data;

    const existingGuild = await getGuildById(guildId);

    if (!existingGuild) return { error: "Guild does not exist!" };

    if (user.id !== existingGuild.user_id) return { error: "Unauthorized" };

    try {
        const newGuild = await updateGuild(
            {
                roles_that_may_join,
                roles_that_may_create_raids,
                guild_timezone,
            },
            guildId
        );

        if (!newGuild) return { error: "Failed to update guild!" };

        revalidatePath(`/guild/${guildId}`);

        return { success: "Guild config saved!" };
    } catch {
        return { error: "Failed to update guild!" };
    }
};

export const updateGuildBasicInfoAction = async (
    values: z.infer<typeof CreateGuildSchema>,
    guildId: number
): Promise<{ error?: string; success?: string; guild?: Guild }> => {
    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    const profile = await getProfileByUserId(user.id);

    if (!profile) {
        return { error: "Unauthorized" };
    }

    const validatedFields = CreateGuildSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid Fields!" };
    }

    const { name, discord_server_id, faction, region, version, realm } =
        validatedFields.data;

    const existingGuild = await getGuildById(guildId);

    if (!existingGuild) return { error: "Guild does not exist!" };

    const dbServer = await getDBServerByDiscordServerId(discord_server_id);

    if (!dbServer) return { error: "Bot is not in your server anymore!" };

    try {
        const newGuild = await updateGuild(
            {
                name,
                discord_server_id,
                faction,
                region,
                wow_version: version,
                realm,
                icon: dbServer.icon,
            },
            guildId
        );

        if (!newGuild) return { error: "Failed to update guild!" };

        revalidatePath("/manage/my-guilds");
        revalidatePath(`/guild/${guildId}`);

        return { success: "Guild info saved!", guild: newGuild };
    } catch {
        return { error: "Failed to create guild!" };
    }
};
