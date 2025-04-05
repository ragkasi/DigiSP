
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Toaster = ({ ...props }: ToasterProps) => {
  // We're not using useTheme since it's causing issues
  const theme = "light";

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      {...props}
    />
  );
};

export { Toaster };
