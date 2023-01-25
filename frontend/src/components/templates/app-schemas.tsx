interface TemplateProps {
  title: React.ReactNode,
}

export const AppSchemasTemplate = ({title}: TemplateProps) => {
  return (
    <div>{title}</div>
  );
}
