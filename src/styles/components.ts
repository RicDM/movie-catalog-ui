import styled, { css } from 'styled-components';

// Glass Effect Mixin
export const glassEffect = css`
  background: ${props => props.theme.colors.glassBackground};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const glassEffectStrong = css`
  background: ${props => props.theme.colors.glassBackgroundStrong};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

// Styled Components Comuns
export const Container = styled.div`
  width: 100%;
  max-width: 1536px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

export const GlassCard = styled.div`
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.glassBorder};
  border-radius: ${props => props.theme.borderRadius.xl};
  transition: all ${props => props.theme.transitions.normal};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: ${props => props.theme.shadows.primary};
  }
`;

export const GlassCardStrong = styled.div`
  ${glassEffectStrong}
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.xl};
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'ghost' }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: ${props => props.theme.fontWeight.medium};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;

  ${props => props.variant === 'primary' && css`
    background: ${props.theme.gradients.primary};
    color: ${props.theme.colors.primaryForeground};
    
    &:hover {
      box-shadow: ${props.theme.shadows.primaryStrong};
      transform: scale(1.05);
    }
  `}

  ${props => props.variant === 'secondary' && css`
    ${glassEffect}
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.foreground};
    
    &:hover {
      border-color: ${props.theme.colors.primary};
      background: ${props.theme.colors.accentHover};
    }
  `}

  ${props => props.variant === 'ghost' && css`
    color: ${props.theme.colors.foregroundMuted};
    
    &:hover {
      color: ${props.theme.colors.primary};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  color: ${props => props.theme.colors.foreground};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.normal};

  &::placeholder {
    color: ${props => props.theme.colors.foregroundMuted};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  ${glassEffect}
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  font-size: ${props => props.theme.fontSize.sm};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

export const Badge = styled.span<{ variant?: 'default' | 'primary' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSize.xs};
  font-weight: ${props => props.theme.fontWeight.medium};

  ${props => props.variant === 'default' && css`
    ${glassEffect}
    border: 1px solid ${props.theme.colors.border};
    color: ${props.theme.colors.foreground};
  `}

  ${props => props.variant === 'primary' && css`
    background: ${props.theme.colors.primary};
    color: ${props.theme.colors.primaryForeground};
  `}

  ${props => props.variant === 'success' && css`
    background: ${props.theme.colors.success};
    color: white;
  `}

  ${props => props.variant === 'warning' && css`
    background: ${props.theme.colors.warning};
    color: black;
  `}
`;

export const GradientText = styled.span`
  background: ${props => props.theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;
