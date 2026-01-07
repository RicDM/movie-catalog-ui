import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const ErrorContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom right, #1f2937, #111827);
  text-align: center;
  vertical-align: middle;
  min-height: 200px;
  min-width: 150px;
`;

const ErrorContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ErrorImage = styled.img`
  width: 4rem;
  height: 4rem;
  opacity: 0.3;

  @media (min-width: ${props => props.theme.breakpoints.md}) {
    width: 5rem;
    height: 5rem;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom right, #1f2937, #111827);
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  min-height: 200px;
  min-width: 150px;
`;

const StyledImage = styled.img<{ $isLoading: boolean }>`
  opacity: ${props => props.$isLoading ? 0 : 1};
  transition: opacity 300ms;
`;

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const { src, alt, style, className, ...rest } = props;

  if (didError) {
    return (
      <ErrorContainer className={className} style={style}>
        <ErrorContent>
          <ErrorImage
            src={ERROR_IMG_SRC}
            alt="Imagem não disponível"
            {...rest}
            data-original-url={src}
          />
        </ErrorContent>
      </ErrorContainer>
    );
  }

  return (
    <>
      {isLoading && <LoadingOverlay className={className} />}
      <StyledImage
        src={src}
        alt={alt}
        className={className}
        style={style}
        $isLoading={isLoading}
        {...rest}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
