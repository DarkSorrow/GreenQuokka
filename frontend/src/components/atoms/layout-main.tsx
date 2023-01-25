import Box, { BoxProps } from '@mui/joy/Box';

export const LayoutMain = (props: BoxProps) => {
  return (
    <Box
      component="main"
      className="Main"
      {...props}
      sx={[{ p: 2 }, ...(Array.isArray(props.sx) ? props.sx : [props.sx])]}
    />
  );
}
