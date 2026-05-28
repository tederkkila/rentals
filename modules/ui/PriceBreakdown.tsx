import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface PriceBreakdownProps {
    prices: Record<string, Record<string, any>>;
    taxes: Record<string, number>;
}

export default function PriceBreakdown() {

    const totalNights = 3;

    return (
        <Collapsible className="text-sm text-gray-600 mb-2 mt-0 bg-gray-100 p-2">
            {/* Added 'group' to the trigger to share its open state with the chevron */}
            <CollapsibleTrigger className="font-bold flex justify-between items-center w-full text-left group">
                <span>Price Details (USD)</span>

                {/* Chevron Arrow Icon */}
                <svg
                    xmlns="http://w3.org"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
                <div className="flex nowrap justify-between">
                    <span>{totalNights} nights x $300.00</span>
                    <span>$3000.00</span>
                </div>
                <div className="flex nowrap justify-between border-b-2 pb-1">
                    <span>Taxes</span>
                    <span>$300.00</span>
                </div>
            </CollapsibleContent>

            <div className="flex nowrap justify-between font-bold mt-1">
                <span>Total</span>
                <span>$300.00</span>
            </div>
        </Collapsible>
    );
}