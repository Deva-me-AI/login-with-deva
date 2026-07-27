import { Context } from 'react';
import { JSX } from 'react';

declare type AuthorizationHints = {
    /** OAuth scopes to request. */
    scopes?: string[];
    /** Hint the account identifier to the identity provider. */
    loginHint?: string;
    /** Skip the Deva provider chooser when the provider is already known. */
    provider?: string;
};

declare interface components {
    schemas: {
        /** AITensor */
        AITensor: {
            /** Ai */
            ai: string;
            /** Tensors */
            tensors: components["schemas"]["Tensor"][];
        };
        /** AccountDBModel */
        AccountDBModel: {
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
            type: components["schemas"]["AccountType"];
            /** Provider */
            provider: string;
            /** Provider Account Id */
            provider_account_id: string;
            /** Refresh Token */
            refresh_token?: string | null;
            /** Access Token */
            access_token?: string | null;
            /** Oauth Token */
            oauth_token?: string | null;
            /** Oauth Token Secret */
            oauth_token_secret?: string | null;
            /** Token Type */
            token_type?: string | null;
            /** Scope */
            scope?: string | null;
            /** Id Token */
            id_token?: string | null;
            /** Session State */
            session_state?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * AccountType
         * @enum {string}
         */
        AccountType: "oauth" | "email" | "credentials";
        /** AirdropPointDBModel */
        AirdropPointDBModel: {
            /** Code */
            code: string;
            /** Points */
            points: number;
            /** Claimer Persona Id */
            claimer_persona_id?: string | null;
            /** Grantor Persona Id */
            grantor_persona_id?: string | null;
            /** Reserved For */
            reserved_for?: string | null;
            /** Expires At */
            expires_at?: string | null;
            /** First Time Users Only */
            first_time_users_only: boolean;
            /** Cooldown Period */
            cooldown_period: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** AirdropRequest */
        AirdropRequest: {
            /** Tokens Count */
            tokens_count: number | string;
        };
        /** AirdropResponse */
        AirdropResponse: {
            /** Airdrop Round */
            airdrop_round: string;
            /** Tokens Count */
            tokens_count: string;
            /** Total Web2 Points */
            total_web2_points: string;
            /** Multiplier */
            multiplier: string;
            /** Count */
            count: number;
        };
        /** AissStats */
        AissStats: {
            /** Claimable Amount */
            claimable_amount: string;
            /** Claimed Amount */
            claimed_amount: string;
        };
        /** ApiKeyDBModel */
        ApiKeyDBModel: {
            /** Name */
            name: string;
            /** Description */
            description?: string | null;
            /** Key */
            key: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ArtifactDBModel */
        ArtifactDBModel: {
            /** Source Url */
            source_url: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Ingest Id
             * Format: uuid
             */
            ingest_id: string;
            source_type: components["schemas"]["ArtifactSourceType"];
            state: components["schemas"]["ArtifactState"];
            /** Error */
            error?: Record<string, never> | null;
            /** Disabled */
            disabled: boolean;
            /** Etl Meta Data */
            etl_meta_data?: Record<string, never> | null;
            /** Etl Arn */
            etl_arn?: string | null;
            /** Estimated Cost */
            estimated_cost: number;
            /** Is Public */
            is_public: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ArtifactETAResponse */
        ArtifactETAResponse: {
            source_type: components["schemas"]["ArtifactSourceType"];
            /** Total Time Taken */
            total_time_taken: number;
        };
        /**
         * ArtifactSourceType
         * @enum {string}
         */
        ArtifactSourceType: "YOUTUBE" | "YOUTUBE_CAPTIONS" | "YOUTUBE_TRANSCRIPT" | "TWITTER" | "WIKIPEDIA" | "CUSTOM_JSON" | "PDF" | "PODCAST" | "MEDIUM" | "SUBSTACK" | "VEDA" | "AUDIO" | "AUDIO_TRANSCRIPT" | "IMAGE" | "WEBPAGE" | "WORD" | "POWERPOINT" | "TEXT" | "NOTION";
        /**
         * ArtifactState
         * @enum {string}
         */
        ArtifactState: "PENDING" | "IN_PROGRESS" | "EXTRACTING" | "TRANSFORMING" | "VECTORIZING" | "LOADING_DB" | "ETL_COMPLETED" | "LOADING_VECTOR_DB" | "COMPLETED" | "FAILED" | "NO_DATA" | "DUPLICATE" | "INACTIVE" | "PROPOSED" | "SKIPPED";
        /** AssociatePersonaRequest */
        AssociatePersonaRequest: {
            /** Twitter Client Id */
            twitter_client_id: string;
            twitter_credentials: components["schemas"]["TwitterCredentials"];
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
        };
        /** AssociatePersonaRequestBase */
        AssociatePersonaRequestBase: {
            /** Twitter Client Id */
            twitter_client_id: string;
            twitter_credentials: components["schemas"]["TwitterCredentials"];
        };
        /** AuditLogEntryDBModel */
        AuditLogEntryDBModel: {
            /** Payload */
            payload: Record<string, never>;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** AuditLogPayload */
        AuditLogPayload: {
            /** Type */
            type: string;
            /** User */
            user: {
                [key: string]: string;
            };
            /** Pathname */
            pathname?: string | null;
        };
        /** AuthTokenRequest */
        AuthTokenRequest: {
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /** Expires In */
            expires_in?: number | null;
            /**
             * Authorization Code
             * Format: uuid4
             */
            authorization_code: string;
            /** Client Secret */
            client_secret: string;
        };
        /** AuthorizeRequestPKCE */
        AuthorizeRequestPKCE: {
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /**
             * User Id
             * Format: uuid4
             */
            user_id: string;
            /**
             * Scope
             * @default OPENID
             */
            scope?: string;
            /** Code Challenge */
            code_challenge: string;
            /** Code Challenge Method */
            code_challenge_method: string;
        };
        /** AuthorizeRequestToken */
        AuthorizeRequestToken: {
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /**
             * User Id
             * Format: uuid4
             */
            user_id: string;
            /**
             * Scope
             * @default OPENID
             */
            scope?: string;
            /** Nonce */
            nonce?: string | null;
        };
        /** Body_create_voice_note_voice_note_post */
        Body_create_voice_note_voice_note_post: {
            /**
             * Audio File
             * Format: binary
             */
            audio_file: string;
            /** Title */
            title: string;
        };
        /** BulkCreateAirdropPoints */
        BulkCreateAirdropPoints: {
            /** Reserved For */
            reserved_for?: string | null;
            /**
             * First Time Users Only
             * @default true
             */
            first_time_users_only?: boolean;
            /** Expires In Minutes */
            expires_in_minutes?: number | null;
            /** Cooldown Period */
            cooldown_period?: number | null;
            /** Grantor Persona Id */
            grantor_persona_id?: string | null;
            /** Min Points */
            min_points: number;
            /** Max Points */
            max_points: number;
            /** Count */
            count: number;
        };
        /** BulkCreateMessageRetrieval */
        BulkCreateMessageRetrieval: {
            /** Retrievals */
            retrievals: components["schemas"]["CreateRetrievalBase"][];
            /**
             * Chat Message Id
             * Format: uuid4
             */
            chat_message_id: string;
        };
        /** BulkCreatePostRetrieval */
        BulkCreatePostRetrieval: {
            /** Retrievals */
            retrievals: components["schemas"]["CreateRetrievalBase"][];
            /**
             * Post Id
             * Format: uuid4
             */
            post_id: string;
        };
        /** BulkCreateReservedDeva */
        BulkCreateReservedDeva: {
            /** Items */
            items: components["schemas"]["CreateReservedDeva"][];
        };
        /**
         * CURRENCY_TYPE
         * @enum {string}
         */
        CURRENCY_TYPE: "KARMA" | "USD";
        /** CategoryDBModel */
        CategoryDBModel: {
            /** Category */
            category: string;
            /** Icon */
            icon?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ChannelDBModel */
        ChannelDBModel: {
            /** Name */
            name: string;
            /** Handle */
            handle: string;
            /** Description */
            description: string;
            /** Avatar */
            avatar?: string | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Persona Topic Id */
            persona_topic_id?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * CharacterCreatedBy
         * @enum {string}
         */
        CharacterCreatedBy: "BOT" | "USER";
        /** CharacterDBModel */
        CharacterDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Bio */
            bio?: unknown[] | null;
            /** Lore */
            lore?: unknown[] | null;
            /** Knowledge */
            knowledge?: unknown[] | null;
            /** Adjectives */
            adjectives?: unknown[] | null;
            /** Topics */
            topics?: unknown[] | null;
            /** Message Examples */
            message_examples?: unknown[] | null;
            /** Post Examples */
            post_examples?: unknown[] | null;
            /** Style */
            style?: Record<string, never> | null;
            /** Post Config */
            post_config?: Record<string, never> | null;
            /** Post Custom Prompt */
            post_custom_prompt?: string | null;
            created_by: components["schemas"]["CharacterCreatedBy"];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** CharacterStyle */
        CharacterStyle: {
            /** All */
            all?: string[];
            /** Chat */
            chat?: string[];
            /** Post */
            post?: string[];
        };
        /** ChatMessageDBModel */
        ChatMessageDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["MessageAuthorType"];
            /** Vote */
            vote?: number | null;
            /** Text */
            text: string;
            /** Expires At */
            expires_at?: string | null;
            system_message_type?: components["schemas"]["SystemMessageType"] | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Thread Id
             * Format: uuid
             */
            thread_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompter Contribution */
            prompter_contribution?: number;
        };
        /** ChatMessageMetadataDBModel */
        ChatMessageMetadataDBModel: {
            /**
             * Message Id
             * Format: uuid
             */
            message_id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Thread Id
             * Format: uuid
             */
            thread_id: string;
            /** Read At */
            read_at?: string | null;
        };
        /** ChatMessagePersona */
        ChatMessagePersona: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["MessageAuthorType"];
            /** Vote */
            vote?: number | null;
            /** Text */
            text: string;
            /** Expires At */
            expires_at?: string | null;
            system_message_type?: components["schemas"]["SystemMessageType"] | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Thread Id
             * Format: uuid
             */
            thread_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /** ChatThreadDBModel */
        ChatThreadDBModel: {
            /** Title */
            title: string;
            /** Is Direct Message */
            is_direct_message: boolean;
            /** Disappearing Messages Seconds */
            disappearing_messages_seconds?: number | null;
            /** Image Url */
            image_url?: string | null;
            /** Deva Verse */
            deva_verse?: boolean | null;
            /**
             * Latest Updated At
             * Format: date-time
             */
            latest_updated_at: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Is Pinned */
            is_pinned?: boolean;
        };
        /** ChatThreadMembersDBModel */
        ChatThreadMembersDBModel: {
            /** Title */
            title: string;
            /** Is Direct Message */
            is_direct_message: boolean;
            /** Disappearing Messages Seconds */
            disappearing_messages_seconds?: number | null;
            /** Image Url */
            image_url?: string | null;
            /** Deva Verse */
            deva_verse?: boolean | null;
            /**
             * Latest Updated At
             * Format: date-time
             */
            latest_updated_at: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /**
             * Is Pinned
             * @default false
             */
            is_pinned?: boolean;
            /** Members */
            members: components["schemas"]["PublicPersonaDBModel"][];
        };
        /** ChatThreadMetadata */
        ChatThreadMetadata: {
            /**
             * Thread Id
             * Format: uuid4
             */
            thread_id: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /** Unread Count */
            unread_count: number;
            /** Last Read Message Id */
            last_read_message_id?: string | null;
            /** Mentions Count */
            mentions_count: number;
        };
        /** ClaimPersona */
        ClaimPersona: {
            /**
             * User Id
             * Format: uuid4
             */
            user_id: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /**
             * Creator Inference Cost Multiplier
             * @default 0.299999999999999988897769753748434595763683319091796875
             */
            creator_inference_cost_multiplier?: number | string;
        };
        /** ComputeAITensorList */
        ComputeAITensorList: {
            /**
             * Max Ores
             * @default 1000
             */
            max_ores?: number;
            /**
             * Created At Before
             * Format: date-time
             */
            created_at_before: string;
            /**
             * Created At After
             * Format: date-time
             */
            created_at_after: string;
        };
        /** ConsumeAirdropPoint */
        ConsumeAirdropPoint: {
            /** Code */
            code: string;
        };
        /** ConsumeReferral */
        ConsumeReferral: {
            /** Code */
            code: string;
        };
        /** ConversationHistory */
        ConversationHistory: {
            role: components["schemas"]["ConversationHistoryRole"];
            /** Username */
            username: string;
            /** Content */
            content: string;
        };
        /**
         * ConversationHistoryRole
         * @enum {string}
         */
        ConversationHistoryRole: "SYSTEM" | "BOT" | "USER";
        /** CreateAPIKey */
        CreateAPIKey: {
            /** Name */
            name: string;
            /** Description */
            description?: string | null;
        };
        /** CreateAccount */
        CreateAccount: {
            /**
             * User Id
             * Format: uuid4
             */
            user_id: string;
            /** Type */
            type: string;
            /** Provider Account Id */
            provider_account_id: string;
            /** Provider */
            provider: string;
            /** Refresh Token */
            refresh_token?: string | null;
            /** Access Token */
            access_token?: string | null;
            /** Oauth Token */
            oauth_token?: string | null;
            /** Oauth Token Secret */
            oauth_token_secret?: string | null;
            /** Scope */
            scope?: string | null;
            /** Id Token */
            id_token?: string | null;
            /** Session State */
            session_state?: string | null;
        };
        /** CreateAiToken */
        CreateAiToken: {
            /** Token Address */
            token_address: string;
            /** Bonding Curve Pool Address */
            bonding_curve_pool_address?: string | null;
            /** Meteora Pool Address */
            meteora_pool_address?: string | null;
            /** @default BONDING_CURVE_POOL */
            pool_status?: components["schemas"]["PoolStatus"];
        };
        /** CreateAirdropPoint */
        CreateAirdropPoint: {
            /** Reserved For */
            reserved_for?: string | null;
            /**
             * First Time Users Only
             * @default true
             */
            first_time_users_only?: boolean;
            /** Expires In Minutes */
            expires_in_minutes?: number | null;
            /** Cooldown Period */
            cooldown_period?: number | null;
            /** Grantor Persona Id */
            grantor_persona_id?: string | null;
            /** Code */
            code?: string;
            /** Points */
            points: number;
        };
        /** CreateAirdropPointUser */
        CreateAirdropPointUser: {
            /** Reserved For */
            reserved_for?: string | null;
            /**
             * First Time Users Only
             * @default true
             */
            first_time_users_only?: boolean;
            /** Expires In Minutes */
            expires_in_minutes?: number | null;
            /** Cooldown Period */
            cooldown_period?: number | null;
        };
        /** CreateAuditLog */
        CreateAuditLog: {
            payload: components["schemas"]["AuditLogPayload"];
        };
        /** CreateBotChatMessage */
        CreateBotChatMessage: {
            /**
             * Thread Id
             * Format: uuid4
             */
            thread_id: string;
            /**
             * Author Type
             * @default BOT
             * @constant
             */
            author_type?: "BOT";
            /**
             * In Reply To Id
             * Format: uuid4
             */
            in_reply_to_id: string;
            /** Text */
            text: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at?: string;
        };
        /** CreateBotPost */
        CreateBotPost: {
            /** Text */
            text: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /**
             * Author Type
             * @default BOT
             * @constant
             */
            author_type?: "BOT";
            /** Channel Id */
            channel_id?: string | null;
            /**
             * Auto Generated
             * @default false
             */
            auto_generated?: boolean;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
        };
        /** CreateCategory */
        CreateCategory: {
            /** Category */
            category: string;
            /** Icon */
            icon?: string | null;
        };
        /** CreateChannel */
        CreateChannel: {
            /** Name */
            name?: string | null;
            /** Handle */
            handle?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Persona Topic Id */
            persona_topic_id?: string | null;
        };
        /** CreateCharacter */
        CreateCharacter: {
            /** Bio */
            bio?: string[];
            /** Lore */
            lore?: string[];
            /** Knowledge */
            knowledge?: string[];
            /** Adjectives */
            adjectives: string[];
            /** Topics */
            topics: string[];
            /** Message Examples */
            message_examples?: string[];
            /** Post Examples */
            post_examples?: string[];
            /** Post Custom Prompt */
            post_custom_prompt?: string | null;
            /**
             * @default {
             *   "all": [],
             *   "chat": [],
             *   "post": []
             * }
             */
            style?: components["schemas"]["CharacterStyle"];
            /**
             * @default {
             *   "post_interval_min": 1440,
             *   "post_interval_max": 1440,
             *   "post_length_max": 288
             * }
             */
            post_config?: components["schemas"]["PostConfig"];
            /** @default USER */
            created_by?: components["schemas"]["CharacterCreatedBy"];
        };
        /** CreateChatThread */
        CreateChatThread: {
            /** Title */
            title: string;
            /** Members */
            members?: string[];
            /** Disappearing Messages Seconds */
            disappearing_messages_seconds?: number | null;
            /** Image Url */
            image_url?: string | null;
            /**
             * Is Direct Message
             * @default false
             */
            is_direct_message?: boolean;
        };
        /** CreateClient */
        CreateClient: {
            /** Redirect Uris */
            redirect_uris: string[];
            /** Client Name */
            client_name: string;
            /** Avatar */
            avatar?: string | null;
            /** Terms Url */
            terms_url?: string | null;
            /** Policy Url */
            policy_url?: string | null;
            /**
             * Scopes
             * @default [
             *   "OPENID"
             * ]
             */
            scopes?: string[];
            /**
             * Origin Urls
             * @default []
             */
            origin_urls?: string[];
            /** Persona Id */
            persona_id?: string | null;
            /** Client Description */
            client_description?: string | null;
        };
        /** CreateGem */
        CreateGem: {
            /** Post Id */
            post_id: string;
        };
        /** CreateIngest */
        CreateIngest: {
            /**
             * Source Url
             * Format: uri
             */
            source_url: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            source_type?: components["schemas"]["IngestSourceType"] | null;
            /**
             * State
             * @default PENDING
             * @enum {string}
             */
            state?: "PROPOSED" | "PENDING";
            etl_params?: components["schemas"]["IngestETLParams"];
            /** Meta */
            meta?: Record<string, never>;
            /**
             * Interactive Mode
             * @default false
             */
            interactive_mode?: boolean;
            /** Note Id */
            note_id?: string | null;
            /** Voice Note Id */
            voice_note_id?: string | null;
            /**
             * Is Public
             * @default true
             */
            is_public?: boolean;
        };
        /** CreateMessageRetrieval */
        CreateMessageRetrieval: {
            /** Content */
            content: string;
            /** Handle */
            handle?: string | null;
            /** Source Url */
            source_url?: string | null;
            /** Type */
            type: string;
            /** Type Custom Data */
            type_custom_data?: Record<string, never> | null;
            /**
             * Chat Message Id
             * Format: uuid4
             */
            chat_message_id: string;
        };
        /** CreateNote */
        CreateNote: {
            /** Id */
            id?: string | null;
            /** Created At */
            created_at?: string | null;
            /**
             * Daily Note
             * @default false
             */
            daily_note?: boolean;
            /** Title */
            title: string;
            /** Text */
            text: string;
            /**
             * Is Public
             * @default false
             */
            is_public?: boolean;
            /**
             * Show Retrievals
             * @default false
             */
            show_retrievals?: boolean;
        };
        /** CreateNoteComment */
        CreateNoteComment: {
            /** Text */
            text: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /**
             * Note Id
             * Format: uuid4
             */
            note_id: string;
        };
        /** CreatePersona */
        CreatePersona: {
            /** Username */
            username: string;
            /** Display Name */
            display_name?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Categories */
            categories?: string[] | null;
            /** @default PUBLIC */
            visibility?: components["schemas"]["PersonaVisibility"];
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            twitter_profile?: components["schemas"]["TwitterProfile"] | null;
            /**
             * Creator Inference Cost Multiplier
             * @default 0
             */
            creator_inference_cost_multiplier?: number | string;
            /** Tags */
            tags?: string[] | null;
        };
        /** CreatePostRetrieval */
        CreatePostRetrieval: {
            /** Content */
            content: string;
            /** Handle */
            handle?: string | null;
            /** Source Url */
            source_url?: string | null;
            /** Type */
            type: string;
            /** Type Custom Data */
            type_custom_data?: Record<string, never> | null;
            /**
             * Post Id
             * Format: uuid4
             */
            post_id: string;
        };
        /**
         * CreateReferrals
         * @description Payload for creating referrals. You can create multiple referrals at once
         * since they are all generated on the backend. There is currently no facility
         * to specify details of the referrals other than the email they belong to.
         */
        CreateReferrals: {
            /**
             * User Email
             * Format: email
             */
            user_email: string;
            /**
             * N
             * @default 1
             */
            n?: number;
        };
        /** CreateReservedDeva */
        CreateReservedDeva: {
            /** Username */
            username: string;
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
        };
        /** CreateRetrievalBase */
        CreateRetrievalBase: {
            /** Content */
            content: string;
            /** Handle */
            handle?: string | null;
            /** Source Url */
            source_url?: string | null;
            /** Type */
            type: string;
            /** Type Custom Data */
            type_custom_data?: Record<string, never> | null;
        };
        /** CreateSession */
        CreateSession: {
            /**
             * User Id
             * Format: uuid4
             */
            user_id: string;
            /**
             * Session Token
             * Format: uuid4
             */
            session_token: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
        };
        /** CreateSystemChatMessage */
        CreateSystemChatMessage: {
            /**
             * Thread Id
             * Format: uuid4
             */
            thread_id: string;
            /**
             * Author Type
             * @default SYSTEM
             * @constant
             */
            author_type?: "SYSTEM";
            /**
             * In Reply To Id
             * Format: uuid4
             */
            in_reply_to_id?: string;
            /**
             * Text
             * @default
             */
            text?: string;
            system_message_type: components["schemas"]["SystemMessageType"];
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
        };
        /** CreateTwitterClient */
        CreateTwitterClient: {
            /** Id */
            id: string;
            /** @default FREE */
            plan?: components["schemas"]["TwitterClientPlan"];
            /** Secret */
            secret: string;
            /** Reserved For */
            reserved_for?: string[];
        };
        /** CreateUser */
        CreateUser: {
            /**
             * Email
             * Format: email
             */
            email: string;
            /** Email Verified */
            email_verified?: string | null;
            /**
             * Welcomed
             * @default false
             */
            welcomed?: boolean;
            /**
             * Wait Listed
             * @default true
             */
            wait_listed?: boolean;
        };
        /** CreateUserChatMessage */
        CreateUserChatMessage: {
            /**
             * Thread Id
             * Format: uuid4
             */
            thread_id: string;
            /**
             * Author Type
             * @default USER
             * @constant
             */
            author_type?: "USER";
            /**
             * In Reply To Id
             * Format: uuid4
             */
            in_reply_to_id?: string;
            /** Text */
            text: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at?: string;
        };
        /** CreateUserPost */
        CreateUserPost: {
            /** Text */
            text: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /**
             * Author Type
             * @default USER
             * @enum {string}
             */
            author_type?: "USER" | "BOT";
            /** Channel Id */
            channel_id?: string | null;
            /**
             * Auto Generated
             * @default false
             */
            auto_generated?: boolean;
        };
        /** CreateVariantChatMessage */
        CreateVariantChatMessage: {
            /** Text */
            text: string;
            /**
             * Chat Message Id
             * Format: uuid4
             */
            chat_message_id: string;
        };
        /** CreateVariantPost */
        CreateVariantPost: {
            /** Text */
            text: string;
            /**
             * Post Id
             * Format: uuid4
             */
            post_id: string;
        };
        /** CreateVedaIngest */
        CreateVedaIngest: {
            /**
             * Veda Id
             * Format: uuid4
             */
            veda_id: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /**
             * State
             * @default PENDING
             * @enum {string}
             */
            state?: "PROPOSED" | "PENDING";
            etl_params?: components["schemas"]["IngestETLParams"];
            /** Meta */
            meta?: Record<string, never>;
            /**
             * Interactive Mode
             * @default false
             */
            interactive_mode?: boolean;
        };
        /** CreateVerificationToken */
        CreateVerificationToken: {
            /** Identifier */
            identifier: string;
            /** Token */
            token: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
        };
        /** CreateYapVote */
        CreateYapVote: {
            /** Amount Of Votes */
            amount_of_votes: number | string;
        };
        /** CreateYapperProject */
        CreateYapperProject: {
            /** Name */
            name: string;
            /** Display Name */
            display_name: string;
            /** Twitter Handle */
            twitter_handle: string;
            /** Description */
            description: string;
            /**
             * Logo Url
             * Format: uri
             */
            logo_url: string;
            /**
             * Website Url
             * Format: uri
             */
            website_url: string;
            /** Keywords */
            keywords: string[];
            /** Tags */
            tags?: string[];
            /** @default PRE_VOTING */
            vote_status?: components["schemas"]["YapperProjectVoteStatus"];
            /** @default PRE */
            tge_status?: components["schemas"]["YapperProjectTgeStatus"];
            /**
             * Featured
             * @default false
             */
            featured?: boolean;
            /** Corporate Account Usernames */
            corporate_account_usernames?: string[] | null;
        };
        /** CreateYapsPersona */
        CreateYapsPersona: {
            /** Username */
            username: string;
            /** Display Name */
            display_name?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Categories */
            categories?: string[] | null;
            /** @default PUBLIC */
            visibility?: components["schemas"]["PersonaVisibility"];
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            twitter_profile?: components["schemas"]["TwitterProfile"] | null;
            /**
             * Creator Inference Cost Multiplier
             * @default 0
             */
            creator_inference_cost_multiplier?: number | string;
            /** Tags */
            tags?: string[] | null;
            /**
             * From Yaps
             * @default true
             */
            from_yaps?: boolean;
            /**
             * Smart
             * @default true
             */
            smart?: boolean;
        };
        /** CreatorLBItem */
        CreatorLBItem: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Earned */
            karma_earned: number;
            /** Karma From Devas */
            karma_from_devas: number;
        };
        /** CurrencyCreditRequest */
        CurrencyCreditRequest: {
            /**
             * Amount
             * @description A non-negative integer in cents representing how much to transfer.
             */
            amount: number;
        };
        /** CurrencyCreditResponse */
        CurrencyCreditResponse: {
            /**
             * Url
             * Format: uri
             */
            url: string;
        };
        /** CurrencyDebitDryResponse */
        CurrencyDebitDryResponse: {
            /** Amount In Usd Cents */
            amount_in_usd_cents: number;
        };
        /** CurrencyDebitRequest */
        CurrencyDebitRequest: {
            /**
             * Amount
             * @description A non-negative integer in karma representing how much to transfer.
             */
            amount: number;
        };
        /** DailyAllowanceResponse */
        DailyAllowanceResponse: {
            /** Allowance */
            allowance: number;
            /** Used */
            used: number;
            /** Remaining */
            remaining: number;
        };
        /** DecryptedTwitterClientDBModel */
        DecryptedTwitterClientDBModel: {
            /** Id */
            id: string;
            plan: components["schemas"]["TwitterClientPlan"];
            /** Reserved For */
            reserved_for: unknown[];
            /** Available Connections */
            available_connections: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Secret */
            secret: string;
        };
        /** DevaLBItem */
        DevaLBItem: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Earned */
            karma_earned: number;
            /** Training Score */
            training_score: number;
            /** Contributors */
            contributors: number;
        };
        /** DisplayPersona */
        DisplayPersona: {
            /** Avatar Url */
            avatar_url: string;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Deva Id */
            deva_id: string;
        };
        /** EstimatedVotes */
        EstimatedVotes: {
            /** Estimated Votes */
            estimated_votes: string;
        };
        /** ExcerptDBModel */
        ExcerptDBModel: {
            /**
             * Artifact Id
             * Format: uuid
             */
            artifact_id: string;
            /**
             * Ingest Id
             * Format: uuid
             */
            ingest_id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Text */
            text: string;
            /** Etl Meta Data */
            etl_meta_data?: Record<string, never> | null;
            /** Active */
            active: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ExternalAiTokenDBModel */
        ExternalAiTokenDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Token Url */
            token_url: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ExternalAiTokenPersonaID */
        ExternalAiTokenPersonaID: {
            /**
             * Token Url
             * Format: uri
             */
            token_url: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
        };
        /** ExternalAiTokenPersonaUsername */
        ExternalAiTokenPersonaUsername: {
            /**
             * Token Url
             * Format: uri
             */
            token_url: string;
            /** Username */
            username: string;
        };
        /**
         * FilterOperator
         * @description Supported filter operators
         * @enum {string}
         */
        FilterOperator: "eq" | "ne" | "gt" | "gte" | "lt" | "lte" | "in" | "not_in" | "contains" | "not_contains" | "starts_with" | "ends_with" | "is_null" | "is_not_null";
        /**
         * FollowTypeRequest
         * @enum {string}
         */
        FollowTypeRequest: "followers" | "following";
        /** FoomAiTokenDBModel */
        FoomAiTokenDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Bonding Curve Pool Address */
            bonding_curve_pool_address: string;
            /** Meteora Pool Address */
            meteora_pool_address?: string | null;
            /** Token Address */
            token_address: string;
            pool_status: components["schemas"]["PoolStatus"];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ForgetLearnVariantRequest */
        ForgetLearnVariantRequest: {
            /** Learned */
            learned: boolean;
        };
        /** FullAITokenDBModel */
        FullAITokenDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Bonding Curve Pool Address */
            bonding_curve_pool_address: string;
            /** Meteora Pool Address */
            meteora_pool_address?: string | null;
            /** Token Address */
            token_address: string;
            pool_status: components["schemas"]["PoolStatus"];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /** FullAirdropPointDBModel */
        FullAirdropPointDBModel: {
            /** Code */
            code: string;
            /** Points */
            points: number;
            /** Claimer Persona Id */
            claimer_persona_id?: string | null;
            /** Grantor Persona Id */
            grantor_persona_id?: string | null;
            /** Reserved For */
            reserved_for?: string | null;
            /** Expires At */
            expires_at?: string | null;
            /** First Time Users Only */
            first_time_users_only: boolean;
            /** Cooldown Period */
            cooldown_period: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            claimer_persona?: components["schemas"]["PublicPersonaDBModel"] | null;
        };
        /** FullChatMessageDBModel */
        FullChatMessageDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["MessageAuthorType"];
            /** Vote */
            vote?: number | null;
            /** Text */
            text: string;
            /** Expires At */
            expires_at?: string | null;
            system_message_type?: components["schemas"]["SystemMessageType"] | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Thread Id
             * Format: uuid
             */
            thread_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
            in_reply_to?: components["schemas"]["ChatMessagePersona"] | null;
            thread?: components["schemas"]["ChatThreadDBModel"] | null;
            /** Retrievals */
            retrievals?: components["schemas"]["RetrievalDBModel"][];
            /** Variants */
            variants?: components["schemas"]["VariantPersonaDBModel"][];
            /** Metadatas */
            metadatas?: components["schemas"]["ChatMessageMetadataDBModel"][];
        };
        /** FullGemDBModel */
        FullGemDBModel: {
            /**
             * Post Id
             * Format: uuid
             */
            post_id: string;
            /** Hashed Post Id */
            hashed_post_id: string;
            /**
             * Minter Id
             * Format: uuid
             */
            minter_id: string;
            /** On Chain */
            on_chain: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            post: components["schemas"]["PostWithPersonaAndGemDBModel"];
            minter: components["schemas"]["PublicPersonaDBModel"];
        };
        /** FullKarmaLedgerDBModel */
        FullKarmaLedgerDBModel: {
            /** Amount */
            amount: string;
            /** Net Amount */
            net_amount: string;
            karma_type: components["schemas"]["KarmaType"];
            transaction_type: components["schemas"]["TransactionType"];
            /**
             * From Id
             * Format: uuid
             */
            from_id: string;
            /**
             * To Id
             * Format: uuid
             */
            to_id: string;
            /** Reference Id */
            reference_id?: string | null;
            /** Meta */
            meta: Record<string, never>;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            from_persona: components["schemas"]["PublicPersonaDBModel"];
            to_persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /** FullNoteDBModel */
        FullNoteDBModel: {
            /** Title */
            title: string;
            /** Text */
            text: string;
            /** Daily Note */
            daily_note: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Is Public */
            is_public: boolean;
            /** Show Retrievals */
            show_retrievals: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Comment Ids */
            comment_ids?: string[];
            /** Backlink Post Ids */
            backlink_post_ids?: string[];
            /** Backlink Note Ids */
            backlink_note_ids?: string[];
            /** Backlink Ids */
            backlink_ids?: string[];
        };
        /** FullNotificationDBModel */
        FullNotificationDBModel: {
            type: components["schemas"]["NotificationType"];
            /**
             * From Id
             * Format: uuid
             */
            from_id: string;
            /**
             * To Id
             * Format: uuid
             */
            to_id: string;
            /** Is Read */
            is_read: boolean;
            /** Post Id */
            post_id?: string | null;
            /** Chat Message Id */
            chat_message_id?: string | null;
            /** Chat Thread Id */
            chat_thread_id?: string | null;
            /** Variant Id */
            variant_id?: string | null;
            /** Transaction Id */
            transaction_id?: string | null;
            /** Meta */
            meta?: Record<string, never> | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            from_persona: components["schemas"]["PublicPersonaDBModel"];
            post?: components["schemas"]["PostDBModel"] | null;
            chat_message?: components["schemas"]["ChatMessageDBModel"] | null;
            chat_thread?: components["schemas"]["ChatThreadDBModel"] | null;
            variant?: components["schemas"]["VariantDBModel"] | null;
            transaction?: components["schemas"]["KarmaLedgerDBModel"] | null;
        };
        /** FullOidcAuthorizationCodeDBModel */
        FullOidcAuthorizationCodeDBModel: {
            /** Nonce */
            nonce?: string | null;
            /** Code Challenge */
            code_challenge?: string | null;
            /** Code Challenge Method */
            code_challenge_method?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
            /** Scopes */
            scopes: unknown[];
            /**
             * Client Id
             * Format: uuid
             */
            client_id: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            client: components["schemas"]["OidcClientPublicDBModel"];
            user: components["schemas"]["UserInfo"];
        };
        /** FullPersonaDBModel */
        FullPersonaDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Is Governor */
            is_governor: boolean;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Prompter Settings */
            prompter_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Hashed Id */
            hashed_id?: string | null;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Auto Ingest Post */
            auto_ingest_post: boolean;
            /** Exclude Deva Prompt Post */
            exclude_deva_prompt_post: boolean;
            /** Karma Confirmation Threshold */
            karma_confirmation_threshold: string;
            /** Karma Confirmation Threshold Enabled */
            karma_confirmation_threshold_enabled: boolean;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Bronze Karma */
            bronze_karma: string;
            /** Silver Karma */
            silver_karma: string;
            /** Gold Karma */
            gold_karma: string;
            /** Purchased Silver Karma */
            purchased_silver_karma: string;
            /** Purchased Gold Karma */
            purchased_gold_karma: string;
            /** Public Key */
            public_key: string;
            /** Telegram Id */
            telegram_id?: string | null;
            /** Discord Id */
            discord_id?: string | null;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
            /** Categories */
            categories?: components["schemas"]["CategoryDBModel"][];
        };
        /** FullPostDBModel */
        FullPostDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["PostAuthorType"];
            /** Text */
            text: string;
            /** Is Deleted */
            is_deleted: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /** Mentioned Profile Persona Id */
            mentioned_profile_persona_id?: string | null;
            /** Mentioned As Bot Persona Id */
            mentioned_as_bot_persona_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
            /** Twitter Tweet Id */
            twitter_tweet_id?: string | null;
            /** Twitter Cross Post */
            twitter_cross_post: boolean;
            /** Auto Generated */
            auto_generated: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Backlink Tweet Url */
            backlink_tweet_url?: string | null;
            /** Replies Count */
            replies_count?: number;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["PostReaction"] | null;
            /** User Ingest */
            user_ingest?: string | null;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
            /** Retrievals */
            retrievals?: components["schemas"]["RetrievalDBModel"][];
            /** Variants */
            variants?: components["schemas"]["VariantPersonaDBModel"][];
            minted_gem?: components["schemas"]["GemDBModel"] | null;
        };
        /** FullReferralDBModel */
        FullReferralDBModel: {
            /** Code */
            code: string;
            /**
             * Referrer Id
             * Format: uuid
             */
            referrer_id: string;
            /** Referred Id */
            referred_id?: string | null;
            /** Reserved For */
            reserved_for?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            referred?: components["schemas"]["PublicPersonaDBModel"] | null;
            status?: components["schemas"]["ReferralStatus"] | null;
        };
        /** FullTwitterPersonaAssociationDBModel */
        FullTwitterPersonaAssociationDBModel: {
            /** Twitter Client Id */
            twitter_client_id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Last Used At
             * Format: date-time
             */
            last_used_at: string;
            /** Next Post Twitter At */
            next_post_twitter_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            twitter_client: components["schemas"]["TwitterClientDBModel"];
        };
        /** FullVariantDBModel */
        FullVariantDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Owner Id
             * Format: uuid
             */
            owner_id: string;
            /** Text */
            text: string;
            /** In Reply To */
            in_reply_to: string;
            /** Post Id */
            post_id?: string | null;
            /** Chat Message Id */
            chat_message_id?: string | null;
            /** Published */
            published: boolean;
            /** Learned */
            learned: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["VariantReaction"] | null;
            persona: components["schemas"]["PublicPersonaDBModel"];
            post?: components["schemas"]["PostDBModel"] | null;
            chat_message?: components["schemas"]["ChatMessageDBModel"] | null;
        };
        /** FullVoiceNoteDBModel */
        FullVoiceNoteDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Title */
            title: string;
            /** Audio Url */
            audio_url?: string | null;
            /** Duration Seconds */
            duration_seconds?: number | null;
            /** Transcript Url */
            transcript_url?: string | null;
            transcript_state: components["schemas"]["TranscriptState"];
            /** Etl Arn */
            etl_arn?: string | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Transcripts */
            transcripts?: components["schemas"]["TranscriptDBModel"][];
        };
        /** FullWalletDBModel */
        FullWalletDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Name */
            name: string;
            chain: components["schemas"]["WalletChain"];
            /** Address */
            address: string;
            /** Lower Address */
            lower_address: string;
            wallet_type: components["schemas"]["WalletType"];
            /** Primary */
            primary: boolean;
            /** Meta */
            meta: Record<string, never>;
            /** Aiss Balance */
            aiss_balance: string;
            /** Signer Wallet Id */
            signer_wallet_id?: string | null;
            /** Passkey Id */
            passkey_id?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Smart Wallets */
            smart_wallets?: components["schemas"]["WalletDBModel"][];
            passkey?: components["schemas"]["PasskeyDBModel"] | null;
        };
        /** GemDBModel */
        GemDBModel: {
            /**
             * Post Id
             * Format: uuid
             */
            post_id: string;
            /** Hashed Post Id */
            hashed_post_id: string;
            /**
             * Minter Id
             * Format: uuid
             */
            minter_id: string;
            /** On Chain */
            on_chain: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** GemLBItem */
        GemLBItem: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Average Nft Holding */
            average_nft_holding: number;
            /** Average Raffle Holding */
            average_raffle_holding: number;
        };
        /**
         * GemListSort
         * @enum {string}
         */
        GemListSort: "NEWEST" | "OLDEST";
        /** GenerateCharacter */
        GenerateCharacter: {
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
        };
        /** GovernorLBItems */
        GovernorLBItems: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Vouches Earned */
            vouches_earned: number;
            /** Vouches Earned From Governor */
            vouches_earned_from_governor: number;
            /** Is Governor */
            is_governor: boolean;
            /** Karma Earned */
            karma_earned: number;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** HealthCheckResponse */
        HealthCheckResponse: {
            /** Rdb */
            rdb: boolean;
            /** Read Db */
            read_db: boolean;
            /** Vdb */
            vdb: boolean;
        };
        /** IngestDBModel */
        IngestDBModel: {
            /** Source Url */
            source_url: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Author Id
             * Format: uuid
             */
            author_id: string;
            source_type: components["schemas"]["IngestSourceType"];
            state: components["schemas"]["IngestState"];
            /** Error */
            error?: Record<string, never> | null;
            /** Etl Arn */
            etl_arn?: string | null;
            /** Etl Params */
            etl_params: Record<string, never>;
            /** Meta */
            meta: Record<string, never>;
            /** Interactive Mode */
            interactive_mode: boolean;
            /** Estimated Cost */
            estimated_cost: number;
            /** Is Public */
            is_public: boolean;
            /** Post Id */
            post_id?: string | null;
            /** Note Id */
            note_id?: string | null;
            /** Voice Note Id */
            voice_note_id?: string | null;
            /** Last Revised At */
            last_revised_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * IngestETLParams
         * @description Model for ETL parameters.
         */
        IngestETLParams: {
            /**
             * Twitter Max Results
             * @default 40
             */
            twitter_max_results?: number;
            /**
             * Get Old Tweets
             * @default false
             */
            get_old_tweets?: boolean;
            /**
             * Use Archive
             * @default false
             */
            use_archive?: boolean;
            /**
             * Process Artifact
             * @default true
             */
            process_artifact?: boolean;
            [key: string]: unknown;
        };
        /**
         * IngestSourceType
         * @description Enum of source types.
         * @enum {string}
         */
        IngestSourceType: "YOUTUBE_VIDEO" | "YOUTUBE_CAPTIONS" | "YOUTUBE_CHANNEL" | "YOUTUBE_PLAYLIST" | "TWITTER_USER" | "TWITTER_TWEET" | "WIKIPEDIA_ARTICLE" | "CUSTOM_JSON" | "PDF" | "CUSTOM_MARKDOWN" | "RSS" | "PODCAST" | "MEDIUM_ARTICLE" | "SUBSTACK_BLOG" | "VEDA" | "AUDIO" | "AUDIO_TRANSCRIPT" | "IMAGE" | "WEBPAGE" | "WORD" | "POWERPOINT" | "TEXT" | "TEXT_TO_IMAGE" | "IMAGE_TO_IMAGE" | "NOTION";
        /**
         * IngestState
         * @description Enum of ingest states.
         * @enum {string}
         */
        IngestState: "PENDING" | "PROPOSED" | "IN_PROGRESS" | "NO_DATA" | "COMPLETED" | "FAILED" | "INACTIVE" | "PAYMENT_PENDING" | "PAYMENT_DONE";
        /** InviteUserCount */
        InviteUserCount: {
            /** Invited Users */
            invited_users: number;
            /** Invited Users Following Ten Planet */
            invited_users_following_ten_planet: number;
        };
        /** IsFollowingPersona */
        IsFollowingPersona: {
            /** Is Following */
            is_following: boolean;
        };
        /** JWK */
        JWK: {
            /** Kty */
            kty: string;
            /** Kid */
            kid: string;
            /** Use */
            use: string;
            /** Alg */
            alg: string;
            /** E */
            e: string;
            /** N */
            n: string;
        };
        /** JWKS */
        JWKS: {
            /** Keys */
            keys: components["schemas"]["JWK"][];
        };
        /** KarmaLedgerDBModel */
        KarmaLedgerDBModel: {
            /** Amount */
            amount: string;
            /** Net Amount */
            net_amount: string;
            karma_type: components["schemas"]["KarmaType"];
            transaction_type: components["schemas"]["TransactionType"];
            /**
             * From Id
             * Format: uuid
             */
            from_id: string;
            /**
             * To Id
             * Format: uuid
             */
            to_id: string;
            /** Reference Id */
            reference_id?: string | null;
            /** Meta */
            meta: Record<string, never>;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
        };
        /**
         * KarmaType
         * @description BRONZE - karma earned from promotions, daily allowance, variant proposals, and variant votes
         * SILVER - karma earned from queries (if the query was paid in silver karma)
         * GOLD - karma earned from queries (if the query was paid in gold karma)
         * PURCHASED_SILVER - karma purchased with USD
         * PURCHASED_GOLD - karma purchased with USDC
         * @enum {string}
         */
        KarmaType: "BRONZE" | "SILVER" | "GOLD" | "PURCHASED_SILVER" | "PURCHASED_GOLD";
        /**
         * LLM
         * @enum {string}
         */
        LLM: "openai:gpt-3.5-turbo" | "openai:gpt-4-turbo" | "openai:gpt-4o" | "anthropic:claude-instant-1" | "anthropic:claude-2" | "anthropic:claude-3-opus-20240229" | "anthropic:claude-3-sonnet-20240229" | "anthropic:claude-3-haiku-20240307" | "together:meta-llama/Llama-2-13b-chat-hf" | "together:meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" | "together:meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" | "together:meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo" | "together:mistralai/Mistral-7B-Instruct-v0.3" | "together:mistralai/Mixtral-8x7B-Instruct-v0.1" | "google:gemini-1.5-pro-latest" | "google:gemini-2.0-flash";
        /**
         * LLMName
         * @enum {string}
         */
        LLMName: "claude-instant-1" | "claude-2" | "claude-3-opus-20240229" | "claude-3-sonnet-20240229" | "claude-3-haiku-20240307" | "gpt-3.5-turbo" | "gpt-4-turbo" | "gpt-4o" | "meta-llama/Llama-2-13b-chat-hf" | "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo" | "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo" | "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo" | "mistralai/Mistral-7B-Instruct-v0.3" | "mistralai/Mixtral-8x7B-Instruct-v0.1" | "gemini-1.5-pro-latest" | "gemini-2.0-flash";
        /** LibraryItem */
        LibraryItem: {
            /** Variant Id */
            variant_id?: string | null;
            /** Reply Id */
            reply_id?: string | null;
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Url */
            url: string;
            /** Html Url */
            html_url?: string | null;
            /** Type */
            type: components["schemas"]["ArtifactSourceType"] | components["schemas"]["LibraryItemBaseType"];
            /** File Size */
            file_size?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Text */
            text?: string | null;
            /** Learned */
            learned: boolean;
            /** Skipped */
            skipped: boolean;
            /** Failed */
            failed: boolean;
            /** No Data */
            no_data: boolean;
            /** Duplicate */
            duplicate: boolean;
            /** Status */
            status: string;
            /** Meta */
            meta?: Record<string, never> | null;
            /**
             * Is Public
             * @default true
             */
            is_public?: boolean;
            /** Variants */
            variants?: components["schemas"]["VariantPersonaDBModel"][];
        };
        /**
         * LibraryItemBaseType
         * @enum {string}
         */
        LibraryItemBaseType: "POST" | "CHAT_MESSAGE";
        /** LinkDiscord */
        LinkDiscord: {
            /** Discord Id */
            discord_id: string;
            /** Public Key */
            public_key: string;
        };
        /** LinkPasskeyWallet */
        LinkPasskeyWallet: {
            /** Name */
            name: string;
            /** Smart Wallet Name */
            smart_wallet_name: string;
            /** Smart Wallet Address */
            smart_wallet_address: string;
            /** Smart Wallet Meta */
            smart_wallet_meta?: Record<string, never>;
            /** Credential Id */
            credential_id: string;
            /** Credential Public Key */
            credential_public_key: string;
            /** Public Key */
            public_key: string;
            /** Counter */
            counter: number;
        };
        /** LinkTelegram */
        LinkTelegram: {
            /** Telegram Id */
            telegram_id: string;
            /** Public Key */
            public_key: string;
        };
        /** LinkWallet */
        LinkWallet: {
            /** Name */
            name: string;
            chain: components["schemas"]["WalletChain"];
            /** Address */
            address: string;
            wallet_type: components["schemas"]["WalletType"];
            /**
             * Primary
             * @default false
             */
            primary?: boolean;
            /** Meta */
            meta?: Record<string, never>;
            /** Signature */
            signature?: string | null;
            /** Smart Wallet Name */
            smart_wallet_name?: string | null;
            /** Smart Wallet Address */
            smart_wallet_address?: string | null;
            /** Smart Wallet Meta */
            smart_wallet_meta?: Record<string, never> | null;
        };
        /** LiquidityPair */
        LiquidityPair: {
            /** Balance */
            balance?: string | null;
            /** Address */
            address: string;
            /** Token A Balance */
            token_a_balance: string;
            /** Token B Balance */
            token_b_balance: string;
            /** Token A Id */
            token_a_id: string;
            /** Token B Id */
            token_b_id: string;
            /** Token A Address */
            token_a_address: string;
            /** Token B Address */
            token_b_address: string;
            deva_a?: components["schemas"]["DisplayPersona"] | null;
            deva_b?: components["schemas"]["DisplayPersona"] | null;
        };
        /** LiquidityPairsResult */
        LiquidityPairsResult: {
            /** Count */
            count: number;
            /** Pairs */
            pairs: components["schemas"]["LiquidityPair"][];
        };
        /**
         * MV
         * @enum {string}
         */
        MV: "DEVA" | "CREATOR" | "PROMPTER" | "TRAINER" | "PERSONA" | "REFERRAL" | "NW_REFERRAL" | "GOVERNOR" | "ARTIFACT" | "GEM" | "YAPPER" | "YAPPER_PROJECT" | "YAPPER_TAG" | "YAPPER_BY_PROJECT" | "YAPPER_BY_USER";
        /** MarkMessageAsRead */
        MarkMessageAsRead: {
            /**
             * Read
             * @default true
             */
            read?: boolean;
        };
        /**
         * MessageAuthorType
         * @enum {string}
         */
        MessageAuthorType: "BOT" | "USER" | "SYSTEM";
        /** NWReferralLBItems */
        NWReferralLBItems: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Earned */
            karma_earned: number;
            /** Invite Count */
            invite_count: number;
            /** Joined Count */
            joined_count: number;
        };
        /** NoteCommentDBModel */
        NoteCommentDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Note Id
             * Format: uuid
             */
            note_id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Text */
            text: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** NoteDBModel */
        NoteDBModel: {
            /** Title */
            title: string;
            /** Text */
            text: string;
            /** Daily Note */
            daily_note: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Is Public */
            is_public: boolean;
            /** Show Retrievals */
            show_retrievals: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Comment Ids */
            comment_ids?: string[];
            /** Backlink Post Ids */
            backlink_post_ids?: string[];
            /** Backlink Note Ids */
            backlink_note_ids?: string[];
            /** Backlink Ids */
            backlink_ids?: string[];
        };
        /**
         * NotificationType
         * @enum {string}
         */
        NotificationType: "MENTION_IN_FEED" | "REPLY_IN_FEED" | "LIKE_IN_FEED" | "LIKE_ON_DEVA_RESPONSE_IN_FEED" | "HUMAN_MENTION_IN_FEED" | "MENTION_IN_CHAT" | "ADDED_TO_THREAD" | "HUMAN_MENTION_IN_CHAT" | "REPLY_IN_CHAT" | "VARIANT_PROPOSED" | "VARIANT_PUBLISHED" | "DISLIKE_ON_VARIANT" | "LIKE_ON_VARIANT" | "BRONZE_KARMA_CREDIT" | "SILVER_KARMA_CREDIT" | "GOLD_KARMA_CREDIT" | "PAYMENT_FAILURE";
        /** OidcAccessTokenJWT */
        OidcAccessTokenJWT: {
            /** Id Token */
            id_token: string;
            /** Expires In */
            expires_in: number;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /** Access Token */
            access_token: string;
            /** Refresh Token */
            refresh_token: string;
        };
        /** OidcAuthorizationCodeDBModel */
        OidcAuthorizationCodeDBModel: {
            /** Nonce */
            nonce?: string | null;
            /** Code Challenge */
            code_challenge?: string | null;
            /** Code Challenge Method */
            code_challenge_method?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
            /** Scopes */
            scopes: unknown[];
            /**
             * Client Id
             * Format: uuid
             */
            client_id: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
        };
        /** OidcClientDBModel */
        OidcClientDBModel: {
            /** Client Secret */
            client_secret: string;
            /** Redirect Uris */
            redirect_uris: unknown[];
            /** Client Name */
            client_name: string;
            /** Avatar */
            avatar?: string | null;
            /** Terms Url */
            terms_url?: string | null;
            /** Policy Url */
            policy_url?: string | null;
            /** Scopes */
            scopes: unknown[];
            /** Origin Urls */
            origin_urls?: unknown[] | null;
            /** Persona Id */
            persona_id?: string | null;
            /** Client Description */
            client_description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** OidcClientPublicDBModel */
        OidcClientPublicDBModel: {
            /** Redirect Uris */
            redirect_uris: unknown[];
            /** Client Name */
            client_name: string;
            /** Avatar */
            avatar?: string | null;
            /** Terms Url */
            terms_url?: string | null;
            /** Policy Url */
            policy_url?: string | null;
            /** Scopes */
            scopes: unknown[];
            /** Origin Urls */
            origin_urls?: unknown[] | null;
            /** Persona Id */
            persona_id?: string | null;
            /** Client Description */
            client_description?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** Operation */
        Operation: {
            /** Sender */
            sender: string;
            /** Nonce */
            nonce: string;
            /** Factory */
            factory?: string | null;
            /** Factorydata */
            factoryData?: string | null;
            /** Calldata */
            callData: string;
            /** Callgaslimit */
            callGasLimit: string;
            /** Verificationgaslimit */
            verificationGasLimit: string;
            /** Preverificationgas */
            preVerificationGas: string;
            /** Paymasterverificationgaslimit */
            paymasterVerificationGasLimit?: string | null;
            /** Paymasterpostopgaslimit */
            paymasterPostOpGasLimit?: string | null;
            /** Maxfeepergas */
            maxFeePerGas: string;
            /** Maxpriorityfeepergas */
            maxPriorityFeePerGas: string;
            /** Signature */
            signature: string;
            /** Paymaster */
            paymaster?: string | null;
            /** Paymasterdata */
            paymasterData?: string | null;
        };
        /** OperationReciept */
        OperationReciept: {
            /** Operation Hash */
            operation_hash: string;
            /** Transaction Hash */
            transaction_hash: string;
            /** Success */
            success: boolean;
            /** Gas Used */
            gas_used: number;
        };
        /** OreGrantApplication */
        OreGrantApplication: {
            /**
             * Deposit Amount
             * @default 1000000000000
             */
            deposit_amount?: number;
            /**
             * Ore Amount
             * @default 1000
             */
            ore_amount?: number;
        };
        /** OreGrantApplicationResponse */
        OreGrantApplicationResponse: {
            /** Proposal Id */
            proposal_id: number;
        };
        /** OrePersonaModel */
        OrePersonaModel: {
            /**
             * Username
             * @default ORE
             */
            username?: string;
            /**
             * Avatar
             * @default /assets/ore.svg
             */
            avatar?: string;
            /**
             * Id
             * @default ORE
             */
            id?: string;
        };
        /** OrePrice */
        OrePrice: {
            /** Price */
            price: string;
            currency: components["schemas"]["CURRENCY_TYPE"];
        };
        /** OwnedPersonaGemModel */
        OwnedPersonaGemModel: {
            /** Persona */
            persona: components["schemas"]["PublicPersonaDBModel"] | components["schemas"]["OrePersonaModel"];
            /** Erc1155 Address */
            erc1155_address: string;
            /** Erc20 Address */
            erc20_address: string;
            /** Erc1155 Balance */
            erc1155_balance?: string | null;
            /** Erc20 Balance */
            erc20_balance?: string | null;
            /** Owner */
            owner?: string | null;
        };
        /** PCKERequest */
        PCKERequest: {
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /** Expires In */
            expires_in?: number | null;
            /**
             * Authorization Code
             * Format: uuid4
             */
            authorization_code: string;
            /** Code Verifier */
            code_verifier: string;
        };
        /** PaginatedActivityFeed */
        PaginatedActivityFeed: {
            /** Total */
            total: number;
            /** Items */
            items: (components["schemas"]["FullPostDBModel"] | components["schemas"]["FullChatMessageDBModel"] | components["schemas"]["FullVariantDBModel"])[];
        };
        /** PaginatedArtifacts */
        PaginatedArtifacts: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ArtifactDBModel"][];
        };
        /** PaginatedAuditLogEntrys */
        PaginatedAuditLogEntrys: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["AuditLogEntryDBModel"][];
        };
        /** PaginatedCategorys */
        PaginatedCategorys: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["CategoryDBModel"][];
        };
        /** PaginatedChannels */
        PaginatedChannels: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ChannelDBModel"][];
        };
        /** PaginatedChatThreadMemberss */
        PaginatedChatThreadMemberss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ChatThreadMembersDBModel"][];
        };
        /** PaginatedCreatorLBItems */
        PaginatedCreatorLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["CreatorLBItem"][];
        };
        /** PaginatedDecryptedTwitterClients */
        PaginatedDecryptedTwitterClients: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["DecryptedTwitterClientDBModel"][];
        };
        /** PaginatedDevaLBItems */
        PaginatedDevaLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["DevaLBItem"][];
        };
        /** PaginatedExcerpts */
        PaginatedExcerpts: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ExcerptDBModel"][];
        };
        /** PaginatedExternalAiTokens */
        PaginatedExternalAiTokens: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ExternalAiTokenDBModel"][];
        };
        /** PaginatedFullAITokens */
        PaginatedFullAITokens: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullAITokenDBModel"][];
        };
        /** PaginatedFullAirdropPoints */
        PaginatedFullAirdropPoints: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullAirdropPointDBModel"][];
        };
        /** PaginatedFullChatMessages */
        PaginatedFullChatMessages: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullChatMessageDBModel"][];
        };
        /** PaginatedFullKarmaLedgers */
        PaginatedFullKarmaLedgers: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullKarmaLedgerDBModel"][];
        };
        /** PaginatedFullNotes */
        PaginatedFullNotes: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullNoteDBModel"][];
        };
        /** PaginatedFullNotifications */
        PaginatedFullNotifications: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullNotificationDBModel"][];
        };
        /** PaginatedFullPosts */
        PaginatedFullPosts: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullPostDBModel"][];
        };
        /** PaginatedFullReferrals */
        PaginatedFullReferrals: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullReferralDBModel"][];
        };
        /** PaginatedFullTwitterPersonaAssociations */
        PaginatedFullTwitterPersonaAssociations: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullTwitterPersonaAssociationDBModel"][];
        };
        /** PaginatedFullVariants */
        PaginatedFullVariants: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullVariantDBModel"][];
        };
        /** PaginatedFullVoiceNotes */
        PaginatedFullVoiceNotes: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullVoiceNoteDBModel"][];
        };
        /** PaginatedFullWallets */
        PaginatedFullWallets: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["FullWalletDBModel"][];
        };
        /** PaginatedGemLBItems */
        PaginatedGemLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["GemLBItem"][];
        };
        /** PaginatedGovernorLBItemss */
        PaginatedGovernorLBItemss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["GovernorLBItems"][];
        };
        /** PaginatedIngests */
        PaginatedIngests: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["IngestDBModel"][];
        };
        /** PaginatedLibraryItems */
        PaginatedLibraryItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["LibraryItem"][];
            /** Min Created At */
            min_created_at: string | null;
        };
        /** PaginatedNWReferralLBItemss */
        PaginatedNWReferralLBItemss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["NWReferralLBItems"][];
        };
        /** PaginatedPersonaCategorieses */
        PaginatedPersonaCategorieses: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["PersonaCategoriesDBModel"][];
        };
        /** PaginatedPersonaVoters */
        PaginatedPersonaVoters: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["PersonaVoterDBModel"][];
        };
        /** PaginatedPersonae */
        PaginatedPersonae: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["PersonaDBModel"][];
        };
        /** PaginatedPostWithReplieses */
        PaginatedPostWithReplieses: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["PostWithRepliesDBModel"][];
        };
        /** PaginatedPrompterLBItems */
        PaginatedPrompterLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["PrompterLBItem"][];
        };
        /** PaginatedReferralLBItemss */
        PaginatedReferralLBItemss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["ReferralLBItems"][];
        };
        /** PaginatedRetrievals */
        PaginatedRetrievals: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["RetrievalDBModel"][];
        };
        /** PaginatedTrainerLBItemss */
        PaginatedTrainerLBItemss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["TrainerLBItems"][];
        };
        /** PaginatedTweets */
        PaginatedTweets: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["TweetDBModel"][];
        };
        /** PaginatedVouchedPersonae */
        PaginatedVouchedPersonae: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["VouchedPersonaDBModel"][];
        };
        /** PaginatedVoucherPersonae */
        PaginatedVoucherPersonae: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["VoucherPersonaDBModel"][];
        };
        /** PaginatedYapperLBItems */
        PaginatedYapperLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["YapperLBItem"][];
        };
        /** PaginatedYapperProjectLBItems */
        PaginatedYapperProjectLBItems: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["YapperProjectLBItem"][];
        };
        /** PaginatedYapperProjectVoterss */
        PaginatedYapperProjectVoterss: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["YapperProjectVotersDBModel"][];
        };
        /** PaginatedYapperProjectVoteses */
        PaginatedYapperProjectVoteses: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["YapperProjectVotesDBModel"][];
        };
        /** PaginatedYapperVoteProjects */
        PaginatedYapperVoteProjects: {
            /** Total */
            total: number;
            /** Items */
            items: components["schemas"]["YapperVoteProjectDBModel"][];
        };
        /** PasskeyDBModel */
        PasskeyDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Credential Id */
            credential_id: string;
            /** Credential Public Key */
            credential_public_key: string;
            /** Public Key */
            public_key: string;
            /** Counter */
            counter: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** PersonaBotResponses */
        PersonaBotResponses: {
            /** Messages Count */
            messages_count: number;
            /** Posts Count */
            posts_count: number;
            /** Total */
            total: number;
        };
        /** PersonaCategoriesDBModel */
        PersonaCategoriesDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Verified */
            verified?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
            /** Categories */
            categories?: components["schemas"]["CategoryDBModel"][];
        };
        /** PersonaDBModel */
        PersonaDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Is Governor */
            is_governor: boolean;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Prompter Settings */
            prompter_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Hashed Id */
            hashed_id?: string | null;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Auto Ingest Post */
            auto_ingest_post: boolean;
            /** Exclude Deva Prompt Post */
            exclude_deva_prompt_post: boolean;
            /** Karma Confirmation Threshold */
            karma_confirmation_threshold: string;
            /** Karma Confirmation Threshold Enabled */
            karma_confirmation_threshold_enabled: boolean;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Bronze Karma */
            bronze_karma: string;
            /** Silver Karma */
            silver_karma: string;
            /** Gold Karma */
            gold_karma: string;
            /** Purchased Silver Karma */
            purchased_silver_karma: string;
            /** Purchased Gold Karma */
            purchased_gold_karma: string;
            /** Public Key */
            public_key: string;
            /** Telegram Id */
            telegram_id?: string | null;
            /** Discord Id */
            discord_id?: string | null;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
        };
        /**
         * PersonaSort
         * @enum {string}
         */
        PersonaSort: "AVATAR" | "USERNAME" | "CREATED_AT" | "KARMA";
        /**
         * PersonaType
         * @enum {string}
         */
        PersonaType: "USER" | "BOT" | "ALL";
        /** PersonaUserCategoriesDBModel */
        PersonaUserCategoriesDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Verified */
            verified?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
            /** Categories */
            categories?: components["schemas"]["CategoryDBModel"][];
            user?: components["schemas"]["UserDBModel"] | null;
        };
        /**
         * PersonaVisibility
         * @enum {string}
         */
        PersonaVisibility: "PUBLIC" | "PRIVATE" | "OFF";
        /** PersonaVoterDBModel */
        PersonaVoterDBModel: {
            persona: components["schemas"]["PublicPersonaDBModel"];
            /** Votes */
            votes: number;
        };
        /** PersonaWithInvitedByPersonaDBModel */
        PersonaWithInvitedByPersonaDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Is Governor */
            is_governor: boolean;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Prompter Settings */
            prompter_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Hashed Id */
            hashed_id?: string | null;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Auto Ingest Post */
            auto_ingest_post: boolean;
            /** Exclude Deva Prompt Post */
            exclude_deva_prompt_post: boolean;
            /** Karma Confirmation Threshold */
            karma_confirmation_threshold: string;
            /** Karma Confirmation Threshold Enabled */
            karma_confirmation_threshold_enabled: boolean;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Bronze Karma */
            bronze_karma: string;
            /** Silver Karma */
            silver_karma: string;
            /** Gold Karma */
            gold_karma: string;
            /** Purchased Silver Karma */
            purchased_silver_karma: string;
            /** Purchased Gold Karma */
            purchased_gold_karma: string;
            /** Public Key */
            public_key: string;
            /** Telegram Id */
            telegram_id?: string | null;
            /** Discord Id */
            discord_id?: string | null;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
            invited_by_persona?: components["schemas"]["PublicPersonaDBModel"] | null;
        };
        /**
         * PoolStatus
         * @enum {string}
         */
        PoolStatus: "BONDING_CURVE_POOL" | "METORA_POOL_CREATED" | "METORA_POOL_FUNDED";
        /**
         * PostAuthorType
         * @enum {string}
         */
        PostAuthorType: "BOT" | "USER";
        /** PostConfig */
        PostConfig: {
            /**
             * Post Interval Min
             * @default 1440
             */
            post_interval_min?: number;
            /**
             * Post Interval Max
             * @default 1440
             */
            post_interval_max?: number;
            /**
             * Post Length Max
             * @default 288
             */
            post_length_max?: number;
        };
        /** PostDBModel */
        PostDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["PostAuthorType"];
            /** Text */
            text: string;
            /** Is Deleted */
            is_deleted: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /** Mentioned Profile Persona Id */
            mentioned_profile_persona_id?: string | null;
            /** Mentioned As Bot Persona Id */
            mentioned_as_bot_persona_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
            /** Twitter Tweet Id */
            twitter_tweet_id?: string | null;
            /** Twitter Cross Post */
            twitter_cross_post: boolean;
            /** Auto Generated */
            auto_generated: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Backlink Tweet Url */
            backlink_tweet_url?: string | null;
            /** Replies Count */
            replies_count?: number;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["PostReaction"] | null;
            /** User Ingest */
            user_ingest?: string | null;
            /** Prompter Contribution */
            prompter_contribution?: number;
        };
        /**
         * PostReaction
         * @enum {string}
         */
        PostReaction: "LIKE" | "DISLIKE";
        /** PostTweetRequest */
        PostTweetRequest: {
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /**
             * Post Id
             * Format: uuid4
             */
            post_id: string;
        };
        /** PostWithPersonaAndGemDBModel */
        PostWithPersonaAndGemDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["PostAuthorType"];
            /** Text */
            text: string;
            /** Is Deleted */
            is_deleted: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /** Mentioned Profile Persona Id */
            mentioned_profile_persona_id?: string | null;
            /** Mentioned As Bot Persona Id */
            mentioned_as_bot_persona_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
            /** Twitter Tweet Id */
            twitter_tweet_id?: string | null;
            /** Twitter Cross Post */
            twitter_cross_post: boolean;
            /** Auto Generated */
            auto_generated: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Backlink Tweet Url */
            backlink_tweet_url?: string | null;
            /** Replies Count */
            replies_count?: number;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["PostReaction"] | null;
            /** User Ingest */
            user_ingest?: string | null;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
            minted_gem?: components["schemas"]["GemDBModel"] | null;
        };
        /** PostWithPersonaDBModel */
        PostWithPersonaDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["PostAuthorType"];
            /** Text */
            text: string;
            /** Is Deleted */
            is_deleted: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /** Mentioned Profile Persona Id */
            mentioned_profile_persona_id?: string | null;
            /** Mentioned As Bot Persona Id */
            mentioned_as_bot_persona_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
            /** Twitter Tweet Id */
            twitter_tweet_id?: string | null;
            /** Twitter Cross Post */
            twitter_cross_post: boolean;
            /** Auto Generated */
            auto_generated: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Backlink Tweet Url */
            backlink_tweet_url?: string | null;
            /** Replies Count */
            replies_count?: number;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["PostReaction"] | null;
            /** User Ingest */
            user_ingest?: string | null;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /** PostWithRepliesDBModel */
        PostWithRepliesDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            author_type: components["schemas"]["PostAuthorType"];
            /** Text */
            text: string;
            /** Is Deleted */
            is_deleted: boolean;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Skipped */
            skipped: boolean;
            /** Mentioned Profile Persona Id */
            mentioned_profile_persona_id?: string | null;
            /** Mentioned As Bot Persona Id */
            mentioned_as_bot_persona_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
            /** Twitter Tweet Id */
            twitter_tweet_id?: string | null;
            /** Twitter Cross Post */
            twitter_cross_post: boolean;
            /** Auto Generated */
            auto_generated: boolean;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Backlink Tweet Url */
            backlink_tweet_url?: string | null;
            /** Replies Count */
            replies_count?: number;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["PostReaction"] | null;
            /** User Ingest */
            user_ingest?: string | null;
            /** Prompter Contribution */
            prompter_contribution?: number;
            persona: components["schemas"]["PublicPersonaDBModel"];
            in_reply_to?: components["schemas"]["PostWithPersonaDBModel"] | null;
            first_reply?: components["schemas"]["PostWithPersonaDBModel"] | null;
        };
        /** ProcessDeposit */
        ProcessDeposit: {
            chain: components["schemas"]["WalletChain"];
        };
        /** PromotionalMeta */
        PromotionalMeta: {
            reason: components["schemas"]["PromotionalMetaReason"];
            [key: string]: unknown;
        };
        /**
         * PromotionalMetaReason
         * @enum {string}
         */
        PromotionalMetaReason: "DAILY_ALLOWANCE" | "FOUNDERS_REWARD" | "TESTING" | "PROMOTION";
        /** PromotionalTransaction */
        PromotionalTransaction: {
            /**
             * To Id
             * Format: uuid4
             */
            to_id: string;
            /** Amount */
            amount: number | string;
            meta: components["schemas"]["PromotionalMeta"];
            /**
             * Transaction Type
             * @default PROMOTIONAL
             * @constant
             */
            transaction_type?: "PROMOTIONAL";
            /**
             * Karma Type
             * @default BRONZE
             * @constant
             */
            karma_type?: "BRONZE";
        };
        /** PromptParamsSettings */
        PromptParamsSettings: {
            /** Max Tokens */
            max_tokens?: number | null;
            model?: components["schemas"]["LLM"] | null;
            /** Temperature */
            temperature?: number | null;
            /** Num Retrievals */
            num_retrievals?: number | null;
            /**
             * Include Default Instructions
             * @default true
             */
            include_default_instructions?: boolean;
            /** Custom Instructions */
            custom_instructions?: string | null;
            /**
             * Allow Model Override
             * @default true
             */
            allow_model_override?: boolean;
            /**
             * Enable Custom Language
             * @default false
             */
            enable_custom_language?: boolean;
        };
        /** PromptRetrievalExcerpt */
        PromptRetrievalExcerpt: {
            /** Text */
            text: string;
            /** Score */
            score: number;
            /**
             * Author Id
             * Format: uuid4
             */
            author_id: string;
            /** Source Url */
            source_url: string;
            source_type: components["schemas"]["IngestSourceType"];
            /** Href */
            href?: string | null;
            /** Start Time */
            start_time?: number | null;
            /** End Time */
            end_time?: number | null;
            /** Title */
            title?: string | null;
            /** Links */
            links?: string[];
            /** References */
            references?: string[];
            /** Revision Id */
            revision_id?: string | null;
            /** Author */
            author?: string | null;
            /** Published At */
            published_at?: string | null;
            /** Language */
            language?: string | null;
            /** Replying To */
            replying_to?: string | null;
            /** Authors */
            authors?: string[];
            [key: string]: unknown;
        };
        /** PromptRetrievalVariant */
        PromptRetrievalVariant: {
            /** Text */
            text: string;
            /** Score */
            score: number;
            /**
             * Author Id
             * Format: uuid4
             */
            author_id: string;
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /**
             * Source Type
             * @default VARIANT
             * @constant
             */
            source_type?: "VARIANT";
        };
        /** PrompterLBItem */
        PrompterLBItem: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Spent */
            karma_spent: number;
        };
        /** PublicPersonaDBModel */
        PublicPersonaDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Username */
            username: string;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility: components["schemas"]["PersonaVisibility"];
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            /** Telegram Bot Token Encrypted */
            telegram_bot_token_encrypted?: string | null;
            /** Verified */
            verified?: boolean | null;
            /** Prompted Settings */
            prompted_settings: Record<string, never>;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier: string;
            /** Deva Level */
            deva_level: number;
            /** User Level */
            user_level: number;
            /** Tags */
            tags?: unknown[] | null;
            /** Onboarded */
            onboarded: boolean;
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
            /** Get Airdrop */
            get_airdrop: boolean;
            /** Karma Reputation */
            karma_reputation: string;
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
            /** Yap Votes */
            yap_votes: number;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter: boolean;
            /** From Foom */
            from_foom: boolean;
            /** From Yaps */
            from_yaps: boolean;
            /**
             * Yaps Last Indexed At
             * Format: date-time
             */
            yaps_last_indexed_at: string;
            /** Twitter Follow Cursor */
            twitter_follow_cursor?: Record<string, never> | null;
            /** Auto Post Twitter */
            auto_post_twitter: boolean;
            /** Smart */
            smart: boolean;
            /** Twitter Id */
            twitter_id?: string | null;
            /** Twitter Follower Count */
            twitter_follower_count?: number | null;
            /** Twitter Following Count */
            twitter_following_count?: number | null;
            /** Smart Follower Count */
            smart_follower_count?: number | null;
            /** Smart Following Count */
            smart_following_count?: number | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Prompt Header */
            prompt_header?: string;
            /** Followers Count */
            followers_count?: number;
            /** Followed Count */
            followed_count?: number;
        };
        /** PublishVariantRequest */
        PublishVariantRequest: {
            /** Published */
            published: boolean;
        };
        /** QueryDryChatMessage */
        QueryDryChatMessage: {
            /** Text */
            text: string;
            /**
             * Thread Id
             * Format: uuid4
             */
            thread_id: string;
        };
        /** QueryDryPost */
        QueryDryPost: {
            /** Text */
            text: string;
            /** In Reply To Id */
            in_reply_to_id?: string | null;
            /** Channel Id */
            channel_id?: string | null;
        };
        /** QueryDryResponse */
        QueryDryResponse: {
            /** Formatted Conversation History */
            formatted_conversation_history?: string[] | null;
            /** Formatted Retrievals */
            formatted_retrievals?: string[] | null;
            /** Retrievals */
            retrievals: (components["schemas"]["PromptRetrievalExcerpt"] | components["schemas"]["PromptRetrievalVariant"])[];
            /** Conversation History */
            conversation_history: components["schemas"]["ConversationHistory"][];
            model: components["schemas"]["LLMName"];
            /** Model Name */
            model_name: string;
            /** Max Tokens */
            max_tokens: number;
            /** Temperature */
            temperature: number;
            /** Estimated Cost */
            estimated_cost: string;
            /** Messages */
            messages?: Record<string, never>[] | null;
            /** Prompt */
            prompt?: string | null;
        };
        /** ReactPost */
        ReactPost: {
            reaction?: components["schemas"]["PostReaction"] | null;
        };
        /** ReactVariant */
        ReactVariant: {
            reaction?: components["schemas"]["VariantReaction"] | null;
        };
        /** ReferralDBModel */
        ReferralDBModel: {
            /** Code */
            code: string;
            /**
             * Referrer Id
             * Format: uuid
             */
            referrer_id: string;
            /** Referred Id */
            referred_id?: string | null;
            /** Reserved For */
            reserved_for?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ReferralLBItems */
        ReferralLBItems: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Earned */
            karma_earned: number;
            /** Invite Count */
            invite_count: number;
            /** Joined Count */
            joined_count: number;
            /** Joined Points */
            joined_points: number;
            /** Follower Points */
            follower_points: number;
            /** Follower Points Rank */
            follower_points_rank: number;
            /** Referral Points */
            referral_points: number;
            /** Airdrop Points */
            airdrop_points: number;
            /** Wallet Points */
            wallet_points: number;
            /** Wallet Aiss Points */
            wallet_aiss_points: number;
            /** Twitter Points */
            twitter_points: number;
            /** Aiss Points */
            aiss_points: string;
            /** Web2 Without Mult Points */
            web2_without_mult_points: string;
            /** Web2 Points */
            web2_points: string;
            /** Waitlist Points */
            waitlist_points: string;
        };
        /**
         * ReferralStatus
         * @enum {string}
         */
        ReferralStatus: "JOINED" | "SENT" | "UNUSED";
        /** RefreshTokenRequest */
        RefreshTokenRequest: {
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /** Expires In */
            expires_in?: number | null;
            /** Client Secret */
            client_secret?: string | null;
            /**
             * Refresh Token
             * Format: uuid4
             */
            refresh_token: string;
        };
        /** RequestForOreDBModel */
        RequestForOreDBModel: {
            /** Rfo Round */
            rfo_round: string;
            /** Ai Tensor List */
            ai_tensor_list: Record<string, never>;
            /** Tx Receipt */
            tx_receipt: Record<string, never>;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** RequestForOres */
        RequestForOres: {
            /** Ai Tensor List */
            ai_tensor_list: components["schemas"]["AITensor"][];
        };
        /** ReserveReferralEmail */
        ReserveReferralEmail: {
            /**
             * Email
             * Format: email
             */
            email: string;
        };
        /** ReserveReferralInvite */
        ReserveReferralInvite: {
            /** Twitter */
            twitter: string;
        };
        /**
         * ResourceFilter
         * @description Schema for resource filter with logical operations
         *
         * Examples:
         *     {
         *         "filters": [
         *             {
         *                 "filter_key": "department",
         *                 "filter_value": "HR",
         *                 "filter_operator": "eq"
         *             },
         *             {
         *                 "filter_key": "clearance_level",
         *                 "filter_value": 3,
         *                 "filter_operator": "gte"
         *             }
         *         ],
         *         "combine_with": "AND"
         *     }
         */
        ResourceFilter: {
            /**
             * Filters
             * @description List of filter items
             */
            filters: components["schemas"]["ResourceFilterItem"][];
            /**
             * Combine With
             * @description How to combine multiple filters ('AND' or 'OR')
             * @default AND
             */
            combine_with?: string;
        };
        /**
         * ResourceFilterItem
         * @description Base schema for resource filter
         *
         * Examples:
         *     - {"filter_key": "department", "filter_value": "HR", "filter_operator": "eq"}
         *     - {"filter_key": "age", "filter_value": 18, "filter_operator": "gte"}
         *     - {"filter_key": "tags", "filter_value": ["urgent", "review"], "filter_operator": "contains"}
         *     - {"filter_key": "is_active", "filter_value": True, "filter_operator": "eq"}
         *     - {"filter_key": "is_active", "filter_operator": "is_null"}
         *     - {"filter_key": "is_active", "filter_operator": "is_not_null"}
         */
        ResourceFilterItem: {
            /**
             * Filter Key
             * @description Key to filter on
             */
            filter_key: string;
            /**
             * Filter Value
             * @description Value to filter on
             */
            filter_value?: unknown;
            /** @description Operator to filter with */
            filter_operator: components["schemas"]["FilterOperator"];
        };
        /**
         * ResourcePermissionCreate
         * @description Schema for creating a resource permission
         */
        ResourcePermissionCreate: {
            /**
             * Resource
             * @description Type of resource
             */
            resource: string;
            /**
             * Action
             * @description Type of action
             */
            action: string;
            /** @description Filter configuration */
            resource_filter: components["schemas"]["ResourceFilter"];
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
        };
        /** RetrievalDBModel */
        RetrievalDBModel: {
            /** Content */
            content: string;
            /** Handle */
            handle?: string | null;
            /** Source Url */
            source_url?: string | null;
            /** Type */
            type: string;
            /** Type Custom Data */
            type_custom_data?: Record<string, never> | null;
            /** Post Id */
            post_id?: string | null;
            /** Chat Message Id */
            chat_message_id?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** ScopeInfo */
        ScopeInfo: {
            /** Scope */
            scope: string;
            /** Description */
            description: string;
        };
        /** ScopesInfo */
        ScopesInfo: {
            /** Scopes */
            scopes: components["schemas"]["ScopeInfo"][];
            /** Total */
            total: number;
        };
        /** SessionAndUser */
        SessionAndUser: {
            session: components["schemas"]["SessionDBModel"];
            user: components["schemas"]["UserWithPersonaDBModel"];
        };
        /** SessionDBModel */
        SessionDBModel: {
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** SkipPost */
        SkipPost: {
            /** Skipped */
            skipped?: boolean | null;
        };
        /** SocialGraph */
        SocialGraph: {
            /** Nodes */
            nodes: components["schemas"]["SocialGraphNode"][];
            /** Links */
            links: components["schemas"]["SocialGraphLink"][];
        };
        /** SocialGraphLink */
        SocialGraphLink: {
            /**
             * Source
             * Format: uuid4
             */
            source: string;
            /**
             * Target
             * Format: uuid4
             */
            target: string;
        };
        /** SocialGraphNode */
        SocialGraphNode: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** Display Name */
            display_name: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Description */
            description?: string | null;
            /** Following Count */
            following_count: number;
            /** Followers Count */
            followers_count: number;
            /** Smart Followers */
            smart_followers: number;
            /** Smart Following */
            smart_following: number;
            /** Rank */
            rank: number;
            /** Mindshare */
            mindshare: string;
        };
        /** StripeCreateAccount */
        StripeCreateAccount: {
            /** Refresh Url */
            refresh_url: string;
        };
        /** StripeCreateAccountResponse */
        StripeCreateAccountResponse: {
            /** Url */
            url: string;
        };
        /** SubmitOperation */
        SubmitOperation: {
            operation: components["schemas"]["Operation"];
            transaction_type: components["schemas"]["Web3TransactionType"];
        };
        /**
         * SystemMessageType
         * @enum {string}
         */
        SystemMessageType: "EPHEMANON_UPDATED" | "EPHEMANON_DISABLED" | "MEMBER_ADDED" | "MEMBER_REMOVED" | "TITLE_EDITED" | "THREAD_CREATED" | "USER_JOINED";
        /** Tensor */
        Tensor: {
            /** Address */
            address: string;
            /** Contributions */
            contributions: number[];
        };
        /** TokenRequest */
        TokenRequest: {
            /**
             * Access Token
             * Format: uuid4
             */
            access_token: string;
            /**
             * Client Id
             * Format: uuid4
             */
            client_id: string;
            /** Client Secret */
            client_secret?: string | null;
        };
        /** TrainerLBItems */
        TrainerLBItems: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Level */
            level: number;
            /** Rank */
            rank: number;
            /** Categories */
            categories?: string[];
            /** Karma Earned */
            karma_earned: number;
            /** Variants Proposed */
            variants_proposed: number;
            /** Variants Published */
            variants_published: number;
        };
        /**
         * TransactionType
         * @enum {string}
         */
        TransactionType: "PROMOTIONAL" | "VARIANT_PROPOSAL" | "VARIANT_PUBLISH" | "VARIANT_VOTE" | "CURRENCY_CREDIT" | "INGEST_CREATION" | "INGEST_STORAGE" | "CURRENCY_DEBIT" | "QUERY" | "QUERY_REFERRAL" | "QUERY_TRAINER" | "GAS_CHARGES" | "ORE_PURCHASE";
        /** TranscriptDBModel */
        TranscriptDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Text */
            text: string;
            /** Start */
            start: number;
            /** End */
            end: number;
            /** Speaker */
            speaker?: string | null;
            /** Audio Segment Url */
            audio_segment_url?: string | null;
            /** Voice Note Id */
            voice_note_id?: string | null;
            /** Artifact Id */
            artifact_id?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * TranscriptState
         * @description Enum of transcript states.
         * @enum {string}
         */
        TranscriptState: "PENDING" | "IN_PROGRESS" | "NO_DATA" | "COMPLETED" | "FAILED";
        /**
         * TweetAnalysisRequest
         * @description Request for tweet analysis.
         */
        TweetAnalysisRequest: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Text */
            text: string;
            /** Author */
            author: string;
            /** Tweet Id */
            tweet_id: string;
        };
        /**
         * TweetCount
         * @description The number of tweets in the time period.
         */
        TweetCount: {
            /** Count */
            count: number;
        };
        /** TweetDBModel */
        TweetDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Author */
            author: string;
            /** Text */
            text: string;
            /** Tweet Id */
            tweet_id: string;
            /**
             * Published At
             * Format: date-time
             */
            published_at: string;
            /** Language */
            language?: string | null;
            /** Replying To */
            replying_to?: string | null;
            /** Source Url */
            source_url?: string | null;
            /** Tweet Metadata */
            tweet_metadata?: Record<string, never> | null;
            /** Sentiment Metrics */
            sentiment_metrics?: Record<string, never> | null;
            /** Behavioral Metrics */
            behavioral_metrics?: Record<string, never> | null;
            /** Crypto Project Mentions */
            crypto_project_mentions?: unknown[] | null;
            /** Topic */
            topic?: string | null;
            /** Sentiment Score */
            sentiment_score?: string | null;
            /** Analyzed By */
            analyzed_by?: string | null;
            /** Analysis Cost */
            analysis_cost?: Record<string, never> | null;
            /** Last Analyzed At */
            last_analyzed_at?: string | null;
            /** Last Aggregated At */
            last_aggregated_at?: string | null;
            /** Tweet Score */
            tweet_score?: string | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Author Avatar Url */
            author_avatar_url?: string;
            /** Scaled Sentiment Score */
            scaled_sentiment_score?: string;
            /** Scaled Engagement Score */
            scaled_engagement_score?: string;
            /** Scaled Influencer Weight */
            scaled_influencer_weight?: string;
            /** Scaled Smart Follower Score */
            scaled_smart_follower_score?: string;
        };
        /**
         * TweetOrderByRequest
         * @enum {string}
         */
        TweetOrderByRequest: "like" | "retweet" | "view" | "reply";
        /**
         * TweetTimeRangeRequest
         * @enum {string}
         */
        TweetTimeRangeRequest: "1d" | "7d" | "1M" | "3M" | "6M" | "1Y";
        /**
         * TweetTopic
         * @description The topic of the tweet.
         * @enum {string}
         */
        TweetTopic: "CRYPTO_TWITTER" | "CRYPTO_AI" | "AI_AGENT" | "OTHER";
        /** TwitterClientDBModel */
        TwitterClientDBModel: {
            /** Id */
            id: string;
            plan: components["schemas"]["TwitterClientPlan"];
            /** Reserved For */
            reserved_for: unknown[];
            /** Available Connections */
            available_connections: number;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * TwitterClientPlan
         * @enum {string}
         */
        TwitterClientPlan: "FREE" | "BASIC" | "PRO";
        /**
         * TwitterCredentials
         * @description Twitter credentials
         */
        TwitterCredentials: {
            /**
             * Token Type
             * @default bearer
             */
            token_type?: string;
            /** Expires In */
            expires_in?: number | null;
            /** Access Token */
            access_token: string;
            /** Refresh Token */
            refresh_token: string;
            /** Scope */
            scope?: string | null;
            /** Expires At */
            expires_at?: number | null;
            /**
             * Provider
             * @default twitter
             */
            provider?: string;
            /**
             * Type
             * @default oauth
             */
            type?: string;
            /** Provideraccountid */
            providerAccountId?: string | null;
        };
        /** TwitterPersonaAssociationDBModel */
        TwitterPersonaAssociationDBModel: {
            /** Twitter Client Id */
            twitter_client_id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Last Used At
             * Format: date-time
             */
            last_used_at: string;
            /** Next Post Twitter At */
            next_post_twitter_at?: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** TwitterProfile */
        TwitterProfile: {
            /** Id Str */
            id_str: string;
            /** Screen Name */
            screen_name: string;
            /** Name */
            name: string;
            /** Description */
            description?: string | null;
            /** Profile Image Url Https */
            profile_image_url_https?: string | null;
            /** Profile Banner Url */
            profile_banner_url?: string | null;
            /** Is Blue Verified */
            is_blue_verified?: boolean | null;
            /** Favourites Count */
            favourites_count?: number | null;
            /** Followers Count */
            followers_count?: number | null;
            /** Friends Count */
            friends_count?: number | null;
            /** Statuses Count */
            statuses_count?: number | null;
            [key: string]: unknown;
        };
        /** UpdateAiToken */
        UpdateAiToken: {
            /** Bonding Curve Pool Address */
            bonding_curve_pool_address?: string | null;
            pool_status?: components["schemas"]["PoolStatus"] | null;
            /** Meteora Pool Address */
            meteora_pool_address?: string | null;
        };
        /** UpdateChannel */
        UpdateChannel: {
            /** Name */
            name?: string | null;
            /** Handle */
            handle?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
        };
        /** UpdateCharacter */
        UpdateCharacter: {
            /** Bio */
            bio?: string[] | null;
            /** Lore */
            lore?: string[] | null;
            /** Knowledge */
            knowledge?: string[] | null;
            /** Adjectives */
            adjectives?: string[] | null;
            /** Topics */
            topics?: string[] | null;
            /** Message Examples */
            message_examples?: string[] | null;
            /** Post Examples */
            post_examples?: string[] | null;
            /** Post Custom Prompt */
            post_custom_prompt?: string | null;
            style?: components["schemas"]["CharacterStyle"] | null;
            post_config?: components["schemas"]["PostConfig"] | null;
            created_by?: components["schemas"]["CharacterCreatedBy"] | null;
        };
        /** UpdateChatMessage */
        UpdateChatMessage: {
            vote?: components["schemas"]["VoteEnum"] | null;
            /** Skipped */
            skipped?: boolean | null;
        };
        /** UpdateChatThread */
        UpdateChatThread: {
            /** Title */
            title?: string | null;
            /** Members */
            members?: string[] | null;
            /** Disappearing Messages Seconds */
            disappearing_messages_seconds?: number | null;
            /** Image Url */
            image_url?: string | null;
        };
        /** UpdateClient */
        UpdateClient: {
            /** Redirect Uris */
            redirect_uris?: string[] | null;
            /** Client Name */
            client_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Terms Url */
            terms_url?: string | null;
            /** Policy Url */
            policy_url?: string | null;
            /** Scopes */
            scopes?: string[] | null;
            /**
             * Origin Urls
             * @default []
             */
            origin_urls?: string[];
            /** Client Description */
            client_description?: string | null;
        };
        /** UpdateNote */
        UpdateNote: {
            /** Title */
            title?: string | null;
            /** Text */
            text?: string | null;
            /** Backlink Note Ids */
            backlink_note_ids?: string[] | null;
            /** Backlink Post Ids */
            backlink_post_ids?: string[] | null;
            /** Is Public */
            is_public?: boolean | null;
            /** Show Retrievals */
            show_retrievals?: boolean | null;
        };
        /** UpdatePersona */
        UpdatePersona: {
            /** Username */
            username?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Cover Image */
            cover_image?: string | null;
            /** Id Token */
            id_token?: string | null;
            visibility?: components["schemas"]["PersonaVisibility"] | null;
            /** Miscellaneous Data */
            miscellaneous_data?: Record<string, never> | null;
            /** Verified */
            verified?: boolean | null;
            /** Interactive Mode */
            interactive_mode?: boolean | null;
            /** Categories */
            categories?: string[] | null;
            /** Categories To Add */
            categories_to_add?: string[] | null;
            /** Categories To Remove */
            categories_to_remove?: string[] | null;
            /** Authentication Credentials */
            authentication_credentials?: Record<string, never> | null;
            /** Telegram Bot Token */
            telegram_bot_token?: string | null;
            /** Twitter Profile */
            twitter_profile?: Record<string, never> | null;
            prompted_settings?: components["schemas"]["PromptParamsSettings"] | null;
            prompter_settings?: components["schemas"]["PromptParamsSettings"] | null;
            /** Creator Inference Cost Multiplier */
            creator_inference_cost_multiplier?: number | string | null;
            /** Tags */
            tags?: string[] | null;
            /** Is Governor */
            is_governor?: boolean | null;
            /** Invited By */
            invited_by?: string | null;
            /** Has Followed Ten Planet Twitter */
            has_followed_ten_planet_twitter?: boolean | null;
            /** Auto Ingest Post */
            auto_ingest_post?: boolean | null;
            /** Auto Post Twitter */
            auto_post_twitter?: boolean | null;
            /** Exclude Deva Prompt Post */
            exclude_deva_prompt_post?: boolean | null;
            /** Karma Confirmation Threshold */
            karma_confirmation_threshold?: number | null;
            /** Karma Confirmation Threshold Enabled */
            karma_confirmation_threshold_enabled?: boolean | null;
            /** Get Airdrop */
            get_airdrop?: boolean | null;
        };
        /** UpdatePersonaAllowGenieDailyAllowance */
        UpdatePersonaAllowGenieDailyAllowance: {
            /** Allow Genie Daily Allowance */
            allow_genie_daily_allowance: boolean;
        };
        /** UpdatePersonaAllowMultipleAirdropClaims */
        UpdatePersonaAllowMultipleAirdropClaims: {
            /** Allow Multiple Airdrop Claims */
            allow_multiple_airdrop_claims: boolean;
        };
        /** UpdatePersonaFromFoom */
        UpdatePersonaFromFoom: {
            /** From Foom */
            from_foom: boolean;
        };
        /** UpdatePersonaFromYaps */
        UpdatePersonaFromYaps: {
            /** From Yaps */
            from_yaps: boolean;
        };
        /** UpdatePersonaGetAirdrop */
        UpdatePersonaGetAirdrop: {
            /** Get Airdrop */
            get_airdrop: boolean;
        };
        /** UpdatePost */
        UpdatePost: {
            /** Text */
            text: string;
        };
        /** UpdateSession */
        UpdateSession: {
            /** User Id */
            user_id?: string | null;
            /** Session Token */
            session_token?: string | null;
            /** Expires At */
            expires_at?: string | null;
        };
        /** UpdateSmartPersona */
        UpdateSmartPersona: {
            /** Smart */
            smart: boolean;
        };
        /** UpdateTranscript */
        UpdateTranscript: {
            /** Text */
            text?: string | null;
            /** Speaker */
            speaker?: string | null;
        };
        /** UpdateTwitterClient */
        UpdateTwitterClient: {
            plan?: components["schemas"]["TwitterClientPlan"] | null;
            /** Secret */
            secret?: string | null;
            /** Reserved For */
            reserved_for?: string[] | null;
        };
        /** UpdateVariantRequest */
        UpdateVariantRequest: {
            /** Text */
            text: string;
        };
        /** UpdateVoiceNote */
        UpdateVoiceNote: {
            /** Title */
            title: string;
        };
        /** UpdateWallet */
        UpdateWallet: {
            /** Name */
            name?: string | null;
            /** Primary */
            primary?: boolean | null;
            /** Meta */
            meta?: Record<string, never> | null;
        };
        /** UpdateYapperExternalData */
        UpdateYapperExternalData: {
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /** Project */
            project: string;
            cookie_twitter_data?: components["schemas"]["YapperCookieTwitterData"] | null;
            kaito_yaps_data?: components["schemas"]["YapperKaitoYapsData"] | null;
        };
        /** UpdateYapperProject */
        UpdateYapperProject: {
            /** Twitter Handle */
            twitter_handle?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Description */
            description?: string | null;
            /** Logo Url */
            logo_url?: string | null;
            /** Website Url */
            website_url?: string | null;
            /** Keywords */
            keywords?: string[] | null;
            /** Tags */
            tags?: string[] | null;
            vote_status?: components["schemas"]["YapperProjectVoteStatus"] | null;
            tge_status?: components["schemas"]["YapperProjectTgeStatus"] | null;
            /** Featured */
            featured?: boolean | null;
            /** Corporate Account Usernames */
            corporate_account_usernames?: string[] | null;
        };
        /** UseVerificationToken */
        UseVerificationToken: {
            /** Identifier */
            identifier: string;
            /** Token */
            token: string;
        };
        /** UserDBModel */
        UserDBModel: {
            /** Email */
            email: string;
            role: components["schemas"]["UserRole"];
            /** Wait Listed */
            wait_listed: boolean;
            /** Welcomed */
            welcomed: boolean;
            /** Email Verified */
            email_verified?: string | null;
            /** Stripe Customer Id */
            stripe_customer_id?: string | null;
            /** Stripe Account Id */
            stripe_account_id?: string | null;
            /** Stripe Account Kyc Done */
            stripe_account_kyc_done: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** UserInfo */
        UserInfo: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Email */
            email: string;
            role: components["schemas"]["UserRole"];
            /** Email Verified */
            email_verified?: string | null;
            /** Name */
            name?: string | null;
            /** Preferred Username */
            preferred_username?: string | null;
            /** Description */
            description?: string | null;
            /** Picture */
            picture?: string | null;
            persona?: components["schemas"]["UserPersonaInfo"] | null;
            /**
             * Sub
             * Format: uuid4
             */
            sub: string;
        };
        /** UserPersonaDBModel */
        UserPersonaDBModel: {
            /** Email */
            email: string;
            role: components["schemas"]["UserRole"];
            /** Wait Listed */
            wait_listed: boolean;
            /** Welcomed */
            welcomed: boolean;
            /** Email Verified */
            email_verified?: string | null;
            /** Stripe Customer Id */
            stripe_customer_id?: string | null;
            /** Stripe Account Id */
            stripe_account_id?: string | null;
            /** Stripe Account Kyc Done */
            stripe_account_kyc_done: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            persona?: components["schemas"]["PersonaDBModel"] | null;
        };
        /** UserPersonaDBModelWithInvitedByPersona */
        UserPersonaDBModelWithInvitedByPersona: {
            /** Email */
            email: string;
            role: components["schemas"]["UserRole"];
            /** Wait Listed */
            wait_listed: boolean;
            /** Welcomed */
            welcomed: boolean;
            /** Email Verified */
            email_verified?: string | null;
            /** Stripe Customer Id */
            stripe_customer_id?: string | null;
            /** Stripe Account Id */
            stripe_account_id?: string | null;
            /** Stripe Account Kyc Done */
            stripe_account_kyc_done: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            persona?: components["schemas"]["PersonaWithInvitedByPersonaDBModel"] | null;
        };
        /** UserPersonaInfo */
        UserPersonaInfo: {
            /**
             * Id
             * Format: uuid4
             */
            id: string;
            /** Username */
            username: string;
            /** Display Name */
            display_name?: string | null;
            /** Description */
            description?: string | null;
            /** Avatar */
            avatar?: string | null;
            /**
             * Yap Votes
             * @default 0
             */
            yap_votes?: number;
        };
        /**
         * UserRole
         * @enum {string}
         */
        UserRole: "ADMIN" | "USER" | "GUILD" | "INFLORENCER";
        /** UserWithPersonaDBModel */
        UserWithPersonaDBModel: {
            /** Email */
            email: string;
            role: components["schemas"]["UserRole"];
            /** Wait Listed */
            wait_listed: boolean;
            /** Welcomed */
            welcomed: boolean;
            /** Email Verified */
            email_verified?: string | null;
            /** Stripe Customer Id */
            stripe_customer_id?: string | null;
            /** Stripe Account Id */
            stripe_account_id?: string | null;
            /** Stripe Account Kyc Done */
            stripe_account_kyc_done: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            persona: components["schemas"]["PersonaDBModel"];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /** VariantDBModel */
        VariantDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Owner Id
             * Format: uuid
             */
            owner_id: string;
            /** Text */
            text: string;
            /** In Reply To */
            in_reply_to: string;
            /** Post Id */
            post_id?: string | null;
            /** Chat Message Id */
            chat_message_id?: string | null;
            /** Published */
            published: boolean;
            /** Learned */
            learned: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["VariantReaction"] | null;
        };
        /**
         * VariantListSort
         * @enum {string}
         */
        VariantListSort: "LATEST" | "KARMA_SPENT";
        /** VariantPersonaDBModel */
        VariantPersonaDBModel: {
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Owner Id
             * Format: uuid
             */
            owner_id: string;
            /** Text */
            text: string;
            /** In Reply To */
            in_reply_to: string;
            /** Post Id */
            post_id?: string | null;
            /** Chat Message Id */
            chat_message_id?: string | null;
            /** Published */
            published: boolean;
            /** Learned */
            learned: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Likes Count */
            likes_count?: number;
            /** Dislikes Count */
            dislikes_count?: number;
            user_reaction?: components["schemas"]["VariantReaction"] | null;
            persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /**
         * VariantReaction
         * @enum {string}
         */
        VariantReaction: "LIKE" | "DISLIKE";
        /** VerificationTokenDBModel */
        VerificationTokenDBModel: {
            /** Identifier */
            identifier: string;
            /** Token */
            token: string;
            /**
             * Expires At
             * Format: date-time
             */
            expires_at: string;
        };
        /** VoiceNoteDBModel */
        VoiceNoteDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Title */
            title: string;
            /** Audio Url */
            audio_url?: string | null;
            /** Duration Seconds */
            duration_seconds?: number | null;
            /** Transcript Url */
            transcript_url?: string | null;
            transcript_state: components["schemas"]["TranscriptState"];
            /** Etl Arn */
            etl_arn?: string | null;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * VoteEnum
         * @enum {integer}
         */
        VoteEnum: 1 | -1;
        /** VouchedPersonaDBModel */
        VouchedPersonaDBModel: {
            /**
             * Voucher Id
             * Format: uuid
             */
            voucher_id: string;
            /**
             * Vouched Id
             * Format: uuid
             */
            vouched_id: string;
            /**
             * Post Id
             * Format: uuid
             */
            post_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            vouched_persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /** VoucherPersonaDBModel */
        VoucherPersonaDBModel: {
            /**
             * Voucher Id
             * Format: uuid
             */
            voucher_id: string;
            /**
             * Vouched Id
             * Format: uuid
             */
            vouched_id: string;
            /**
             * Post Id
             * Format: uuid
             */
            post_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            voucher_persona: components["schemas"]["PublicPersonaDBModel"];
        };
        /**
         * WalletChain
         * @enum {string}
         */
        WalletChain: "TEN_PLANET" | "ETHEREUM" | "SOLANA" | "ARBITRUM" | "OPTIMISM" | "BASE";
        /** WalletDBModel */
        WalletDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Name */
            name: string;
            chain: components["schemas"]["WalletChain"];
            /** Address */
            address: string;
            /** Lower Address */
            lower_address: string;
            wallet_type: components["schemas"]["WalletType"];
            /** Primary */
            primary: boolean;
            /** Meta */
            meta: Record<string, never>;
            /** Aiss Balance */
            aiss_balance: string;
            /** Signer Wallet Id */
            signer_wallet_id?: string | null;
            /** Passkey Id */
            passkey_id?: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /**
         * WalletType
         * @enum {string}
         */
        WalletType: "EMBEDDED" | "SMART_ACCOUNT" | "INJECTED" | "PASSKEY";
        /**
         * Web3TransactionType
         * @enum {string}
         */
        Web3TransactionType: "CONTRACT_APPROVAL" | "MINT_GEM" | "SWAP" | "CONVERT" | "ADD_LIQUIDITY" | "REMOVE_LIQUIDITY" | "CREATE_LIQUIDITY_POOL" | "MISC";
        /** YapperCookieTwitterData */
        YapperCookieTwitterData: {
            /** Url */
            url?: string | null;
            /** Kol Username */
            kol_username: string;
            /** Kol Display Name */
            kol_display_name: string;
            /** Posts */
            posts?: number | null;
            /** Average Engagement */
            average_engagement?: number | null;
            /** Average Post Impressions */
            average_post_impressions?: number | null;
            /** Followers Count */
            followers_count?: number | null;
            /** Impressions Count */
            impressions_count?: number | null;
            /** Median Impressions Count */
            median_impressions_count?: number | null;
            /** Engagements Count */
            engagements_count?: number | null;
            /** Median Engagements Count */
            median_engagements_count?: number | null;
            /** Engagement Rate */
            engagement_rate?: number | null;
            /** Score */
            score?: number | null;
            [key: string]: unknown;
        };
        /** YapperExternalDBModel */
        YapperExternalDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Project */
            project: string;
            /** Cookie Twitter Data */
            cookie_twitter_data?: Record<string, never> | null;
            /** Kaito Yaps Data */
            kaito_yaps_data?: Record<string, never> | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** YapperKaitoYapsData */
        YapperKaitoYapsData: {
            /** Profile Name */
            profile_name?: string | null;
            /** X Username */
            x_username?: string | null;
            /** Yapper Votes */
            yapper_votes?: number | null;
            /** Yap Votes */
            yap_votes?: number | null;
            /** Smart Follower Votes */
            smart_follower_votes?: number | null;
            /** Lifetime Yaps */
            lifetime_yaps?: number | null;
            /** Smart Followers */
            smart_followers?: number | null;
            [key: string]: unknown;
        };
        /** YapperLBItem */
        YapperLBItem: {
            /** Rank */
            rank: number;
            /** Filter Column */
            filter_column: string | null;
            /** Mindshare */
            mindshare: string;
            /** Last 7D Mindshare */
            last_7d_mindshare: string;
            /** Last 30D Mindshare */
            last_30d_mindshare: string;
            /** Last 3M Mindshare */
            last_3m_mindshare: string;
            /** Last 6M Mindshare */
            last_6m_mindshare: string;
            /** Last 1Y Mindshare */
            last_1y_mindshare: string;
            /** Change 7D Mindshare */
            change_7d_mindshare: string;
            /** Change 30D Mindshare */
            change_30d_mindshare: string;
            /** Change 3M Mindshare */
            change_3m_mindshare: string;
            /** Change 6M Mindshare */
            change_6m_mindshare: string;
            /** Change 1Y Mindshare */
            change_1y_mindshare: string;
            /** Change 7D Mindshare Percentage */
            change_7d_mindshare_percentage: string;
            /** Change 30D Mindshare Percentage */
            change_30d_mindshare_percentage: string;
            /** Change 3M Mindshare Percentage */
            change_3m_mindshare_percentage: string;
            /** Change 6M Mindshare Percentage */
            change_6m_mindshare_percentage: string;
            /** Change 1Y Mindshare Percentage */
            change_1y_mindshare_percentage: string;
            /**
             * Persona Id
             * Format: uuid4
             */
            persona_id: string;
            /** Username */
            username: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** User Id */
            user_id?: string | null;
            /** Display Name */
            display_name?: string | null;
            /** Avatar */
            avatar?: string | null;
            /** Description */
            description?: string | null;
            /** Following Count */
            following_count: number;
            /** Followers Count */
            followers_count: number;
            /** Smart Followers */
            smart_followers: number;
            /** Smart Following */
            smart_following: number;
            /** Categories */
            categories?: string[];
            /** Twitter Username */
            twitter_username?: string | null;
        };
        /** YapperProjectDBModel */
        YapperProjectDBModel: {
            /** Name */
            name: string;
            /** Display Name */
            display_name: string;
            /** Description */
            description: string;
            /** Twitter Handle */
            twitter_handle: string;
            /** Logo Url */
            logo_url: string;
            /** Website Url */
            website_url: string;
            /** Keywords */
            keywords: unknown[];
            /** Tags */
            tags: unknown[];
            vote_status: components["schemas"]["YapperProjectVoteStatus"];
            tge_status: components["schemas"]["YapperProjectTgeStatus"];
            /** Yap Votes */
            yap_votes: number;
            /** Featured */
            featured: boolean;
            /** Vote Reduction Percentage */
            vote_reduction_percentage: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Total User Votes */
            total_user_votes?: number;
        };
        /** YapperProjectLBItem */
        YapperProjectLBItem: {
            /** Rank */
            rank: number;
            /** Filter Column */
            filter_column: string | null;
            /** Mindshare */
            mindshare: string;
            /** Last 7D Mindshare */
            last_7d_mindshare: string;
            /** Last 30D Mindshare */
            last_30d_mindshare: string;
            /** Last 3M Mindshare */
            last_3m_mindshare: string;
            /** Last 6M Mindshare */
            last_6m_mindshare: string;
            /** Last 1Y Mindshare */
            last_1y_mindshare: string;
            /** Change 7D Mindshare */
            change_7d_mindshare: string;
            /** Change 30D Mindshare */
            change_30d_mindshare: string;
            /** Change 3M Mindshare */
            change_3m_mindshare: string;
            /** Change 6M Mindshare */
            change_6m_mindshare: string;
            /** Change 1Y Mindshare */
            change_1y_mindshare: string;
            /** Change 7D Mindshare Percentage */
            change_7d_mindshare_percentage: string;
            /** Change 30D Mindshare Percentage */
            change_30d_mindshare_percentage: string;
            /** Change 3M Mindshare Percentage */
            change_3m_mindshare_percentage: string;
            /** Change 6M Mindshare Percentage */
            change_6m_mindshare_percentage: string;
            /** Change 1Y Mindshare Percentage */
            change_1y_mindshare_percentage: string;
            /**
             * Project Id
             * Format: uuid4
             */
            project_id: string;
            /** Name */
            name: string;
            /** Display Name */
            display_name: string;
            /** Description */
            description: string;
            /** Twitter Handle */
            twitter_handle: string;
            /** Logo Url */
            logo_url: string;
            /** Website Url */
            website_url: string;
            /** Tags */
            tags?: string[];
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Yap Votes */
            yap_votes: number;
            /** Vote Status */
            vote_status: string;
            /** Tge Status */
            tge_status: string;
            /** Featured */
            featured: boolean;
        };
        /**
         * YapperProjectTgeStatus
         * @description The TGE status of a yapper project.
         * @enum {string}
         */
        YapperProjectTgeStatus: "PRE" | "POST";
        /**
         * YapperProjectVoteStatus
         * @description The vote status of a yapper project.
         * @enum {string}
         */
        YapperProjectVoteStatus: "POTENTIAL" | "ENGAGED" | "PRE_VOTING" | "VOTING" | "TO_LAUNCH" | "LAUNCHED" | "POST_TGE";
        /** YapperProjectVotersDBModel */
        YapperProjectVotersDBModel: {
            /** Name */
            name: string;
            /** Display Name */
            display_name: string;
            /** Description */
            description: string;
            /** Twitter Handle */
            twitter_handle: string;
            /** Logo Url */
            logo_url: string;
            /** Website Url */
            website_url: string;
            /** Keywords */
            keywords: unknown[];
            /** Tags */
            tags: unknown[];
            vote_status: components["schemas"]["YapperProjectVoteStatus"];
            tge_status: components["schemas"]["YapperProjectTgeStatus"];
            /** Yap Votes */
            yap_votes: number;
            /** Featured */
            featured: boolean;
            /** Vote Reduction Percentage */
            vote_reduction_percentage: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Total User Votes */
            total_user_votes?: number;
            /** Voters */
            voters?: components["schemas"]["PersonaVoterDBModel"][];
            /** Total Voters */
            total_voters: number;
            /** Top Yappers */
            top_yappers?: components["schemas"]["YapperLBItem"][];
            /**
             * Total Top Yappers
             * @default 0
             */
            total_top_yappers?: number;
        };
        /** YapperProjectVotesDBModel */
        YapperProjectVotesDBModel: {
            /** Name */
            name: string;
            /** Display Name */
            display_name: string;
            /** Description */
            description: string;
            /** Twitter Handle */
            twitter_handle: string;
            /** Logo Url */
            logo_url: string;
            /** Website Url */
            website_url: string;
            /** Keywords */
            keywords: unknown[];
            /** Tags */
            tags: unknown[];
            vote_status: components["schemas"]["YapperProjectVoteStatus"];
            tge_status: components["schemas"]["YapperProjectTgeStatus"];
            /** Yap Votes */
            yap_votes: number;
            /** Featured */
            featured: boolean;
            /** Vote Reduction Percentage */
            vote_reduction_percentage: number;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            /** Total User Votes */
            total_user_votes: number;
            /** Votes */
            votes?: components["schemas"]["YapperVoteDBModel"][];
        };
        /** YapperVoteDBModel */
        YapperVoteDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Amount Of Votes */
            amount_of_votes: string;
            /**
             * Project Id
             * Format: uuid
             */
            project_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
        };
        /** YapperVoteProjectDBModel */
        YapperVoteProjectDBModel: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Persona Id
             * Format: uuid
             */
            persona_id: string;
            /** Amount Of Votes */
            amount_of_votes: string;
            /**
             * Project Id
             * Format: uuid
             */
            project_id: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
            project?: components["schemas"]["YapperProjectDBModel"] | null;
        };
        /** UpdateUser */
        schemas__auth__UpdateUser: {
            /** Email */
            email?: string | null;
            /** Email Verified */
            email_verified?: string | null;
            /** Wait Listed */
            wait_listed?: boolean | null;
            role?: components["schemas"]["UserRole"] | null;
        };
        /** UpdateUser */
        schemas__user__UpdateUser: {
            /** Email */
            email?: string | null;
            /** Welcomed */
            welcomed?: boolean | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}

export declare type DevaContext = {
    clientId: string;
    redirectUri: string;
    env: Envs;
    authInProgress: boolean;
    authError: string | null;
    login: (options?: LoginOptions) => Promise<void>;
    trySilentLogin: (options?: TrySilentLoginOptions) => Promise<TrySilentLoginResult>;
    logout: () => Promise<void>;
    idToken: string | null;
    accessToken: string | null;
    refreshToken: string | null;
    user: UserInfo | null;
    isAuthenticated: boolean;
    isReady: boolean;
    url: string;
};

export declare const DevaContext: Context<DevaContext | null>;

export declare function DevaProvider({ clientId, redirectUri, children, env, baseUrl, onLoginComplete, }: DevaProviderProps): JSX.Element;

declare type DevaProviderProps = {
    clientId: string;
    redirectUri: string;
    children: React.ReactNode | ((devaProps: UseDevaReturn) => React.ReactNode);
    env: Envs;
    /**
     * Optional explicit base URL for the Deva IdP, overriding `env`. Point this
     * at a local endeva on any host/port (e.g. "http://localhost:3001") for
     * local development/testing. When omitted, the URL is derived from `env`.
     */
    baseUrl?: string;
    /**
     * Called on the redirect return leg with the freshly-exchanged tokens and
     * the round-tripped `state`. Return `true` to tell the SDK NOT to persist
     * the tokens itself (the consumer is routing them, e.g. multi-account).
     */
    onLoginComplete?: (payload: LoginCompletePayload) => boolean | void;
};

export declare type Envs = "development" | "staging" | "production";

/** Shape handed to `onLoginComplete` on the redirect return leg. */
export declare type LoginCompletePayload = {
    access_token: string;
    refresh_token?: string;
    id_token?: string;
    expires_in?: number;
    /** Whatever the consumer passed to `login({ state })`; null if none. */
    state: string | null;
};

export declare type LoginOptions = AuthorizationHints & {
    /**
     * OpenID Connect `prompt`. Forwarded to the authorization endpoint and
     * bypasses the already-authenticated / silent-refresh guards so a fresh
     * OAuth round-trip runs even when a valid token is present. Use `"login"`
     * to force the sign-in screen (e.g. an "Add account" / multi-account flow).
     *
     * NOTE: any value here triggers a full-page redirect and bypasses the local
     * session guards — this is NOT a silent/iframe check, so `"none"` still
     * navigates away rather than probing silently. The Deva IdP currently only
     * acts on `"login"` (forcing re-authentication / account choice); other
     * values are forwarded as-is and may be ignored by the IdP.
     */
    prompt?: "login" | "consent" | "none" | "select_account";
    /**
     * Opaque caller data returned to `onLoginComplete`. The SDK protects the
     * OAuth callback with its own generated `state` nonce and stores this value
     * locally until that nonce is verified.
     */
    state?: string;
};

export declare type SilentLoginNoSessionError = "login_required" | "consent_required" | "interaction_required";

export declare type TrySilentLoginOptions = AuthorizationHints & {
    /** Maximum time to wait for the hidden-iframe callback. Defaults to 5000ms. */
    timeoutMs?: number;
};

/** Result of a background Deva session probe. */
export declare type TrySilentLoginResult = {
    status: "success";
} | {
    status: "no_session";
    error: SilentLoginNoSessionError;
} | {
    status: "timeout";
} | {
    status: "unsupported";
};

export declare const useDeva: () => UseDevaReturn;

declare type UseDevaReturn = {
    isAuthenticated: boolean;
    isReady: boolean;
    accessToken: string | null;
    user: UserInfo | null;
    login: (options?: LoginOptions) => Promise<void>;
    trySilentLogin: (options?: TrySilentLoginOptions) => Promise<TrySilentLoginResult>;
    logout: () => Promise<void>;
};

export declare type UserInfo = components["schemas"]["UserInfo"] & {
    persona: UserPersonaInfo;
};

declare type UserPersonaInfo = components["schemas"]["UserPersonaInfo"];

export { }


declare namespace v3 {
    var DNS: string;
    var URL: string;
}


declare namespace v5 {
    var DNS: string;
    var URL: string;
}



declare global {
    interface Node {
        pmViewDesc?: ViewDesc;
    }
}



/**
 * Augment types.
 */
declare module 'micromark-util-types' {
  /**
   * Compile data.
   */
  interface CompileData {
    gfmFootnoteDefinitions?: Record<string, string>
    gfmFootnoteDefinitionStack?: Array<string>
    gfmFootnoteCallCounts?: Record<string, number>
    gfmFootnoteCallOrder?: Array<string>
  }

  /**
   * Parse context.
   */
  interface ParseContext {
    gfmFootnotes?: Array<string>
  }

  /**
   * Token types.
   */
  interface TokenTypeMap {
    gfmFootnoteCall: 'gfmFootnoteCall'
    gfmFootnoteCallLabelMarker: 'gfmFootnoteCallLabelMarker'
    gfmFootnoteCallMarker: 'gfmFootnoteCallMarker'
    gfmFootnoteCallString: 'gfmFootnoteCallString'
    gfmFootnoteDefinition: 'gfmFootnoteDefinition'
    gfmFootnoteDefinitionIndent: 'gfmFootnoteDefinitionIndent'
    gfmFootnoteDefinitionLabel: 'gfmFootnoteDefinitionLabel'
    gfmFootnoteDefinitionLabelMarker: 'gfmFootnoteDefinitionLabelMarker'
    gfmFootnoteDefinitionLabelString: 'gfmFootnoteDefinitionLabelString'
    gfmFootnoteDefinitionMarker: 'gfmFootnoteDefinitionMarker'
    gfmFootnoteDefinitionWhitespace: 'gfmFootnoteDefinitionWhitespace'
  }
}



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    strikethroughSequence: 'strikethroughSequence'
    strikethroughSequenceTemporary: 'strikethroughSequenceTemporary'
    strikethrough: 'strikethrough'
    strikethroughText: 'strikethroughText'
  }
}



// Register nodes in content.
declare module 'hast' {
  interface ElementData {
    /**
     * Custom info relating to the node, if `<code>` in `<pre>`.
     *
     * Defined by `mdast-util-to-hast` (`remark-rehype`).
     */
    meta?: string | null | undefined
  }

  interface ElementContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }

  interface RootContentMap {
    /**
     * Raw string of HTML embedded into HTML AST.
     */
    raw: Raw
  }
}



// Register data on mdast.
declare module 'mdast' {
  interface Data {
    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in something with these children.
     *
     * When this is defined, when a parent is created, these children will
     * be used.
     */
    hChildren?: ElementContent[] | undefined

    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in a particular element, instead of its default behavior.
     *
     * When this is defined, an element with the given tag name is created.
     * For example, when setting `hName` to `'b'`, a `<b>` element is created.
     */
    hName?: string | undefined

    /**
     * Field supported by `mdast-util-to-hast` to signal that a node should
     * result in an element with these properties.
     *
     * When this is defined, when an element is created, these properties will
     * be used.
     */
    hProperties?: Properties | undefined
  }
}



declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Footnote definition.
     *
     * ```markdown
     * > | [^a]: B.
     *     ^^^^^^^^
     * ```
     */
    footnoteDefinition: 'footnoteDefinition'

    /**
     * Footnote reference.
     *
     * ```markdown
     * > | A[^b].
     *      ^^^^
     * ```
     */
    footnoteReference: 'footnoteReference'
  }
}



// Add custom data tracked to turn markdown into a tree.
declare module 'mdast-util-from-markdown' {
  interface CompileData {
    /**
     * Whether we’re currently in a table.
     */
    inTable?: boolean | undefined
  }
}



// Add custom data tracked to turn a syntax tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * Whole table.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     * > | | - |
     *     ^^^^^
     * ```
     */
    table: 'table'

    /**
     * Table cell.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     *   | | - |
     * ```
     */
    tableCell: 'tableCell'

    /**
     * Table row.
     *
     * ```markdown
     * > | | a |
     *     ^^^^^
     *   | | - |
     * ```
     */
    tableRow: 'tableRow'
  }
}



declare module 'micromark-util-types' {
  interface TokenTypeMap {
    listItem: 'listItem'
  }

  interface Token {
    _spread?: boolean
  }
}

declare namespace _default {
    namespace plugins {
        let tailwindcss: {};
    }
}
