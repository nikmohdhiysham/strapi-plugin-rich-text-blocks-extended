export const FontSizeIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="2" y="18" fontSize="18" fontFamily="Arial" fill="currentColor">A</text>
      <text x="14" y="14" fontSize="10" fontFamily="Arial" fill="currentColor">A</text>
    </svg>
  )
}

export const FontLeadingIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="4" y="16" fontSize="14" fontFamily="Arial" fill="currentColor">A</text>
      <path d="M16 6 L16 18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 8 L16 6 L18 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 16 L16 18 L18 16" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export const FontTrackingIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="7" y="13" fontSize="14" fontFamily="Arial" fill="currentColor">A</text>

      <defs>
        <marker id="arrowhead-right" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" fill="currentColor"/>
        </marker>

        <marker id="arrowhead-left" markerWidth="4" markerHeight="4" refX="1" refY="2" orient="auto">
          <path d="M4,0 L0,2 L4,4 Z" fill="currentColor"/>
        </marker>
      </defs>

      <line x1="4" y1="18" x2="20" y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        markerStart="url(#arrowhead-left)"
        markerEnd="url(#arrowhead-right)" 
      />
    </svg>
  )
}

export const FontAlignmentIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="1.5" fill="currentColor" />
      <rect x="4" y="9" width="12" height="1.5" fill="currentColor" />
      <rect x="4" y="13" width="16" height="1.5" fill="currentColor" />
      <rect x="4" y="17" width="10" height="1.5" fill="currentColor" />
    </svg>
  )
}

export const FontViewportIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="5" height="18" rx="1.5" fill="currentColor" />
      <rect x="10" y="3" width="11" height="18" rx="1.5" fill="currentColor" />
    </svg>
  )
}