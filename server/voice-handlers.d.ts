export declare function handleVoiceStatus(req: any, res: any): Promise<void>;
export declare function handleRealtimeSession(req: any, res: any, body?: any): Promise<void>;
export declare function handleTTS(req: any, res: any, body?: any): Promise<void>;
export declare function handleChat(req: any, res: any, body?: any): Promise<void>;
export declare function sanitizeForSpeech(rawText: string): string;
export declare const OPENAI_VOICES: Array<{ id: string; name: string; gender: string; description: string }>;
export declare const ELEVENLABS_VOICES: Array<{ id: string; name: string; gender: string; description: string }>;
