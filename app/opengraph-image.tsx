import { ImageResponse } from 'next/og'
 
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#faebd7',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Elementos decorativos */}
        <div
          style={{
            position: 'absolute',
            top: '12%',
            left: '17%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: '#bdb76b',
            opacity: 0.1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '24%',
            right: '17%',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#bdb76b',
            opacity: 0.1,
          }}
        />
        
        {/* Letra V grande */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 600,
            color: '#bdb76b',
            fontFamily: 'Cormorant, serif',
            marginBottom: '20px',
          }}
        >
          V
        </div>
        
        {/* Texto principal */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: '#bdb76b',
            fontFamily: 'Cormorant, serif',
            marginBottom: '10px',
          }}
        >
          VILASANCTI
        </div>
        
        {/* Subtítulo */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: '#bdb76b',
            fontFamily: 'Cormorant, serif',
            opacity: 0.8,
            marginBottom: '20px',
          }}
        >
          Elegancia que se vive en casa
        </div>
        
        {/* Descripción */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: '#bdb76b',
            fontFamily: 'Cormorant, serif',
            opacity: 0.7,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Tienda Online de Pijamas que realzan tu belleza
          <br />
          y transmiten distinción
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
