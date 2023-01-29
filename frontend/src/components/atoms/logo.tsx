import { SvgIcon, SvgIconProps } from "@mui/material";

export const LogoIcon = ({viewBox, transform, ...props}: SvgIconProps) => {
  return (
    <SvgIcon viewBox="0 0 512 512" transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" {...props}>
      <path d="m125.714 808.667-10.077 90.33 10.077-40.63 10.08 40.636zM21.808 868.658l73.188 53.892-30.147-29.042 40.23 11.59zm207.813 0-83.27 36.438 40.228-11.588-30.15 29.044zm-73.191 66.087 30.15 29.044-40.223-11.586 83.264 36.436zm-61.434.002-73.188 53.892 83.265-36.437-40.224 11.587zm40.797 23.547-10.079 40.635-10.077-40.628 10.077 90.328z" transform="translate(0 -802.362)"/>
    </SvgIcon>
  );
}
