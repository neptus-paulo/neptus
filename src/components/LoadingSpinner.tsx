import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4 w-full h-full">
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );
};
export default LoadingSpinner;
