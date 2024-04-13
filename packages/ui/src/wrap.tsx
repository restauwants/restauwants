interface ConditionalWrapProps {
  condition?: boolean;
  wrap: (children: React.ReactNode) => React.ReactNode;
  children: React.ReactNode;
}

export const ConditionalWrap = ({
  condition,
  wrap,
  children,
}: ConditionalWrapProps) => {
  return condition ? wrap(children) : children;
};
