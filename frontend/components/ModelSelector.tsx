import React from "react";
import { Button } from "@/components/ui/button";

const ModelSelector: React.FC = () => {
  return (
    <div className="w-64 border-l p-4">
      <h2 className="text-lg font-semibold mb-4">Model Selection</h2>
      <div className="space-y-2">
        <Button className="w-full" variant="outline">
          GPT-3.5
        </Button>
        <Button className="w-full" variant="outline">
          GPT-4
        </Button>
        <Button className="w-full" variant="outline">
          Claude
        </Button>
      </div>
    </div>
  );
};

export default ModelSelector;
