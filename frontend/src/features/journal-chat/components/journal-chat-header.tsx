import { ChevronDownIcon } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

type JournalChatHeaderProps = {
   dateLabel: string;
   isToolsSheetOpen: boolean;
   moodLabel: string;
   moodVariant: 'outline' | 'secondary' | 'ghost';
   onOpenTools: () => void;
};

export function JournalChatHeader({
   dateLabel,
   isToolsSheetOpen: _isToolsSheetOpen,
   moodLabel,
   moodVariant,
   onOpenTools: _onOpenTools,
}: JournalChatHeaderProps) {
   return (
      <header className="flex items-start justify-between gap-3 shadow-2xl shadow-card z-10">
         <div className="flex min-w-0 flex-wrap items-center gap-2 md:gap-3">
            <p className="display-md">Today's journal</p>
            <span className="ml-6 space-x-6">
               <Badge variant={'ghost'}>{dateLabel}</Badge>
               <Badge variant={moodVariant}>{moodLabel}</Badge>
            </span>
         </div>
         {/* <Button
           variant="outline"
           size="sm"
           onClick={onOpenTools}
           aria-haspopup="dialog"
           aria-expanded={isToolsSheetOpen}
           aria-controls="capture-tools-sheet"
        >
           Tools
           <ChevronDownIcon />
        </Button> */}
      </header>
   );
}
