import {defineSchema, defineTable} from "convex/server";
import {authTables} from "@convex-dev/auth/server";
import {v} from "convex/values";

const schema = defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(),
        userId: v.id("users"),
        joinCode: v.string(),
    }),
    members: defineTable({
        userId: v.id("users"),
        workspaceId: v.id("workspaces"),
        role: v.union(v.literal("admin"), v.literal("member")),
    })
        .index("by_user_id", ["userId"])
        .index("by_workspace_id", ["workspaceId"])
        .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
    channels: defineTable({
        name: v.string(),
        workspaceId: v.id("workspaces"),
        type: v.union(v.literal("channel"), v.literal("chat")),
    }).index("by_workspace_id", ["workspaceId"]),
    conversations: defineTable({
        workspaceId: v.id("workspaces"),
        memberOneId: v.id("members"),
        memberTwoId: v.id("members"),
    }).index("by_workspace_id", ["workspaceId"]),
    messages: defineTable({
        body: v.string(),
        image: v.optional(v.id("_storage")),
        memberId: v.id("members"),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
        updatedAt: v.optional(v.number()),
    })
        .index("by_workspace_id", ["workspaceId"])
        .index("by_member_id", ["memberId"])
        .index("by_channel_id", ["channelId"])
        .index("by_conversation_id", ["conversationId"])
        .index("by_parent_message_id", ["parentMessageId"])
        .index("by_channel_id_parent_message_id_conversation_id", [
            "channelId",
            "conversationId",
            "parentMessageId",
        ]),
    reactions: defineTable({
        workspaceId: v.id("workspaces"),
        messageId: v.id("messages"),
        memberId: v.id("members"),
        value: v.string(),
    })
        .index("by_workspace_id", ["workspaceId"])
        .index("by_member_id", ["memberId"])
        .index("by_message_id", ["messageId"]),
    canvases: defineTable({
        workspaceId: v.id("workspaces"),
        name: v.string(),
        layout: v.optional(v.string()),
    }).index("by_workspace_id", ["workspaceId"]),
    document: defineTable({
        workspaceId: v.id("workspaces"),
        parentId: v.optional(v.id("document")),
        isPublished: v.boolean(),
        isArchived: v.boolean(),
        userId: v.id("users"),
        title: v.string(),
        content: v.optional(v.string()),
    }).index("by_workspace_id", ["workspaceId"])
        .index("by_parent_id", ["parentId"])
        .index("by_user_id", ["userId"])
        .index("by_workspace_id_user_id", ["workspaceId", "userId"])
        .index("by_parent_id_user_id", ["parentId", "userId"]),
    systemconfig: defineTable({
        aiApiToken: v.string(),
    }),
});

export default schema;
