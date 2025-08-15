import { ImageResponse } from 'next/og'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          background: '#faebd7',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bdb76b',
          fontFamily: 'Cormorant, serif',
          borderRadius: '4px',
        }}
      >
        V
      </div>
    ),
    {
      ...size,
    }
  )
}
