import Sheet from '@mui/joy/Sheet';

interface TemplateProps {
  header: React.ReactNode,
  forms: React.ReactNode,
  footer: React.ReactNode,
}


export const AnonymousSignTemplate = ({ header, forms, footer }: TemplateProps) => {
  return (
    <Sheet
      sx={{
        width: 300,
        mx: 'auto', // margin left & right
        my: 4, // margin top & botom
        py: 3, // padding top & bottom
        px: 2, // padding left & right
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRadius: 'sm',
        boxShadow: 'md',
      }}
      variant="outlined"
    >
      {header}
      {forms}
      {footer}
    </Sheet>
  );
};
