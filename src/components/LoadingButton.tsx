import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./ui/button";
import { useState } from "react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  onClick: () => Promise<void>; // ✅ API call handle karne ke liye async function
}

export default function LoadingButton({
  loading,
  disabled,
  className,
  onClick,
  ...props
}: LoadingButtonProps) {
  const [isLoading, setIsLoading] = useState(loading);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading || disabled}
      className={cn("flex items-center gap-2", className)}
      onClick={handleClick} // ✅ Click pe API call karega
      {...props}
    >
      {isLoading && <Loader2 className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
}


// ---------------------------------- OG CODE :

// import { cn } from "@/lib/utils";
// import { Loader2 } from "lucide-react";
// import { Button, ButtonProps } from "./ui/button";

// interface LoadingButtonProps extends ButtonProps {
//   loading: boolean;
// }

// export default function LoadingButton({
//   loading,
//   disabled,
//   className,
//   ...props
// }: LoadingButtonProps) {
//   return (
//     <Button
//       disabled={loading || disabled}
//       className={cn("flex items-center gap-2", className)}
//       {...props}
//     >
//       {loading && <Loader2 className="size-5 animate-spin" />}
//       {props.children}
//     </Button>
//   );
// }