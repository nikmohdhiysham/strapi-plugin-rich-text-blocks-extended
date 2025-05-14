import { useTheme } from "styled-components";

type FontModifierIconProps = {  
  fill: string;
}

export const Uppercase = ({ fill }: FontModifierIconProps) => {
  const { colors } = useTheme()

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="2.7" y="17" fontFamily="Arial" fontSize="14" fill={colors[fill as keyof typeof colors]}>AA</text>
    </svg>
  )
}