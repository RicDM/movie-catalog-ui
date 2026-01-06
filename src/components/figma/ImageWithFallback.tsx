import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setDidError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const { src, alt, style, className, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gradient-to-br from-gray-800 to-gray-900 text-center align-middle flex items-center justify-center ${className ?? ''}`}
      style={{ minHeight: '200px', minWidth: '150px', ...style }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img
          src={ERROR_IMG_SRC}
          alt="Imagem não disponível"
          className="w-16 h-16 md:w-20 md:h-20 opacity-30"
          {...rest}
          data-original-url={src}
        />
      </div>
    </div>
  ) : (
    <>
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse ${className ?? ''}`}
          style={{ minHeight: '200px', minWidth: '150px' }}
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ minHeight: '200px', minWidth: '150px', ...style }}
        {...rest}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  )
}
