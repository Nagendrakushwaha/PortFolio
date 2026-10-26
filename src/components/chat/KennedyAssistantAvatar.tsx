import React from 'react';
import {
  KennedyTalkingAvatar,
  type AssistantState,
  type VisemeType,
} from './KennedyTalkingAvatar';

export interface KennedyAssistantAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: AssistantState;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  isThinking?: boolean;
  isMuted?: boolean;
  audioLevel?: number;
  mouthOpen?: number;
  viseme?: VisemeType;
  className?: string;
  showAura?: boolean;
  badge?: boolean;
}

export const KennedyAssistantAvatar: React.FC<KennedyAssistantAvatarProps> = (props) => {
  return <KennedyTalkingAvatar {...props} />;
};

// Backward compatibility alias
export const NovaAssistantAvatar = KennedyAssistantAvatar;
